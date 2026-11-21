import Stripe from 'stripe'
import { queryOne, run } from '@/lib/postgres'

// Subscriptions with Stripe. fiscit.com runs checkout, the customer portal and the
// webhook, and writes the result onto the users row; app.fiscit.com reads it to
// decide access (fiscit/billing.py — keep the trial rule below in step with it).

export const TRIAL_DAYS = 14
export const PRICES_CAD = { monthly: 10, yearly: 96 } as const
export type Plan = keyof typeof PRICES_CAD

// past_due: Stripe is still retrying the card, so access continues meanwhile
const PAYING = new Set(['active', 'trialing', 'past_due'])

let client: Stripe | null = null
export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  client ??= new Stripe(key)
  return client
}

export function priceId(plan: Plan): string | undefined {
  return plan === 'yearly' ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY
}

export function planForPrice(id: string | undefined): Plan | null {
  if (!id) return null
  if (id === process.env.STRIPE_PRICE_YEARLY) return 'yearly'
  if (id === process.env.STRIPE_PRICE_MONTHLY) return 'monthly'
  return null
}

export type BillingUser = {
  id: number
  email: string
  created_at: Date
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string | null
  subscription_plan: string | null
  subscription_period_end: Date | null
  subscription_cancel_at_period_end: boolean
}

export async function billingUser(userId: number): Promise<BillingUser | null> {
  return queryOne<BillingUser>(
    `SELECT id, email, created_at, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan,
            subscription_period_end, subscription_cancel_at_period_end
     FROM users WHERE id = $1`,
    [userId]
  )
}

function billingStart(): Date | null {
  const raw = (process.env.BILLING_START || '').trim()
  const d = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00`) : null
  return d && !isNaN(d.getTime()) ? d : null
}

export function billingEnabled(): boolean {
  const start = billingStart()
  return !!start && Date.now() >= start.getTime()
}

export function isPaying(u: Pick<BillingUser, 'subscription_status'>): boolean {
  return PAYING.has((u.subscription_status || '').toLowerCase())
}

export type Access = {
  state: 'comped' | 'subscribed' | 'past_due' | 'trial' | 'expired'
  plan: string
  periodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnds: string
  daysLeft: number
  billingEnabled: boolean
}

// Same rule as billing.py: 14 days from sign-up, or from BILLING_START for older accounts
export function access(u: BillingUser): Access {
  const comped = (process.env.FISCIT_COMPED_EMAILS || '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  const base = {
    plan: u.subscription_plan || '',
    periodEnd: u.subscription_period_end ? new Date(u.subscription_period_end).toISOString().slice(0, 10) : '',
    cancelAtPeriodEnd: !!u.subscription_cancel_at_period_end,
    billingEnabled: billingEnabled(),
  }
  const start = billingStart()
  const created = new Date(u.created_at)
  const from = start && start > created ? start : created
  const trialEnd = new Date(from.getTime() + TRIAL_DAYS * 86400_000)
  const left = (trialEnd.getTime() - Date.now()) / 86400_000
  const trial = { trialEnds: trialEnd.toISOString().slice(0, 10), daysLeft: Math.max(0, Math.ceil(left)) }
  if (comped.includes(u.email.toLowerCase())) return { ...base, ...trial, state: 'comped' }
  if (isPaying(u)) return { ...base, ...trial, state: u.subscription_status === 'past_due' ? 'past_due' : 'subscribed' }
  if (!base.billingEnabled || left > 0) return { ...base, ...trial, state: 'trial' }
  return { ...base, ...trial, state: 'expired' }
}

/** Drop Stripe ids that don't exist under the current key (e.g. sandbox ids left on a
 *  row after switching to live mode), so the person isn't stuck "subscribed" to a test
 *  subscription and gets a fresh customer at checkout. Returns the row as it now is. */
export async function reconcile(u: BillingUser): Promise<BillingUser> {
  if (!u.stripe_customer_id || !process.env.STRIPE_SECRET_KEY) return u
  try {
    const c = await stripe().customers.retrieve(u.stripe_customer_id)
    if (!('deleted' in c && c.deleted)) return u
  } catch (e) {
    if (!(e instanceof Stripe.errors.StripeError) || e.code !== 'resource_missing') return u
  }
  await run(
    `UPDATE users SET stripe_customer_id = NULL, stripe_subscription_id = NULL, subscription_status = NULL,
            subscription_plan = NULL, subscription_period_end = NULL, subscription_cancel_at_period_end = false
     WHERE id = $1 AND stripe_customer_id = $2`,
    [u.id, u.stripe_customer_id]
  )
  console.log(`Billing: cleared unknown Stripe customer for user ${u.id}`)
  return (await billingUser(u.id)) ?? u
}

/** A Stripe customer for this person, created once and kept on the users row. */
export async function ensureCustomer(u: BillingUser): Promise<string> {
  if (u.stripe_customer_id) return u.stripe_customer_id
  const customer = await stripe().customers.create(
    { email: u.email, metadata: { user_id: String(u.id) } },
    { idempotencyKey: `fiscit-customer-${u.id}` }
  )
  await run('UPDATE users SET stripe_customer_id = $1 WHERE id = $2 AND stripe_customer_id IS NULL', [customer.id, u.id])
  return customer.id
}

/** Copy a subscription's current state onto its owner's row. Always reads it fresh from
 *  Stripe, so webhook events arriving out of order can't leave a stale status behind. */
export async function syncSubscription(subscriptionId: string): Promise<void> {
  const sub = await stripe().subscriptions.retrieve(subscriptionId)
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const item = sub.items.data[0]
  // In this API version the billing period lives on the subscription item
  const periodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000) : null
  const userId = Number(sub.metadata?.user_id) || null
  await run(
    `UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2, subscription_status = $3,
            subscription_plan = $4, subscription_period_end = $5, subscription_cancel_at_period_end = $6
     WHERE stripe_customer_id = $1 OR id = $7`,
    [customerId, sub.id, sub.status, planForPrice(item?.price?.id), periodEnd, !!sub.cancel_at_period_end || !!sub.cancel_at, userId]
  )
}
