import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'
import { langFromRequest } from '@/lib/i18n/server'
import { billingUser, reconcile, stripe } from '@/lib/billing'

export const dynamic = 'force-dynamic'

// Stripe's customer portal: change plan or card, cancel, download invoices
export async function POST(request: Request) {
  const session = await verifySession((await cookies()).get(COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await billingUser(Number(session.sub)).then(u => u && reconcile(u))
  if (!user?.stripe_customer_id) return NextResponse.json({ error: 'no_subscription' }, { status: 400 })
  try {
    const site = process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'
    const portal = await stripe().billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${site}/billing`,
      locale: langFromRequest(request) === 'fr' ? 'fr-CA' : 'en',
    })
    return NextResponse.json({ url: portal.url })
  } catch (e) {
    console.error('Stripe portal failed:', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'portal_failed' }, { status: 502 })
  }
}
