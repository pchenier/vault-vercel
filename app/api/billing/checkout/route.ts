import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'
import { langFromRequest } from '@/lib/i18n/server'
import { billingUser, ensureCustomer, isPaying, priceId, stripe, type Plan } from '@/lib/billing'

export const dynamic = 'force-dynamic'

// Starts a Stripe Checkout for the chosen plan and returns its URL. The free trial
// is given by Fiscit itself (no card needed), so the subscription starts paid.
export async function POST(request: Request) {
  const session = await verifySession((await cookies()).get(COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { plan } = await request.json().catch(() => ({}))
  if (plan !== 'monthly' && plan !== 'yearly') return NextResponse.json({ error: 'Unknown plan' }, { status: 400 })
  const price = priceId(plan as Plan)
  if (!price || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Billing is not configured yet.' }, { status: 503 })

  const user = await billingUser(Number(session.sub))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // One subscription per person: plan changes go through the customer portal
  if (isPaying(user)) return NextResponse.json({ error: 'already_subscribed' }, { status: 409 })

  try {
    const site = process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'
    const checkout = await stripe().checkout.sessions.create({
      mode: 'subscription',
      customer: await ensureCustomer(user),
      client_reference_id: String(user.id),
      line_items: [{ price, quantity: 1 }],
      subscription_data: { metadata: { user_id: String(user.id) } },
      allow_promotion_codes: true,
      locale: langFromRequest(request) === 'fr' ? 'fr-CA' : 'en',
      success_url: `${site}/billing?success=1`,
      cancel_url: `${site}/billing`,
    })
    return NextResponse.json({ url: checkout.url })
  } catch (e) {
    console.error('Stripe checkout failed:', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 })
  }
}
