import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'
import { access, billingUser, PRICES_CAD, reconcile, TRIAL_DAYS } from '@/lib/billing'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await verifySession((await cookies()).get(COOKIE_NAME)?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await billingUser(Number(session.sub)).then(u => u && reconcile(u))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({
    ...access(user),
    hasCustomer: !!user.stripe_customer_id,
    prices: PRICES_CAD,
    trialDays: TRIAL_DAYS,
    configured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_MONTHLY && process.env.STRIPE_PRICE_YEARLY),
  })
}
