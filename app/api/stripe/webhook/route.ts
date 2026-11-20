import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, syncSubscription } from '@/lib/billing'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Stripe → Fiscit. Only signed events are accepted; each one just triggers a fresh
// read of the subscription (syncSubscription), so retries and reordering are harmless.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')
  if (!secret || !signature) return NextResponse.json({ error: 'Not configured' }, { status: 400 })

  const payload = await request.text() // raw body: the signature covers the exact bytes
  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(payload, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object
        if (s.mode === 'subscription' && s.subscription) {
          await syncSubscription(typeof s.subscription === 'string' ? s.subscription : s.subscription.id)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed':
        await syncSubscription(event.data.object.id)
        break
      default:
        break
    }
  } catch (e) {
    // 500 makes Stripe retry later
    console.error(`Stripe webhook ${event.type} failed:`, e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
  console.log(`Stripe webhook ${event.type} handled`)
  return NextResponse.json({ received: true })
}
