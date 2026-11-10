import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = await verifySession(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const res = await fetch('https://production.plaid.com/link/token/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
        'PLAID-SECRET': process.env.PLAID_SECRET!,
      },
      body: JSON.stringify({
        user: { client_user_id: payload.sub },
        client_name: 'Fiscit',
        products: ['transactions'],
        // Holdings too, once Plaid enables investments on the account (PLAID_INVESTMENTS=1);
        // asking for it before that makes every link token fail with INVALID_PRODUCT
        ...(['1', 'true', 'yes'].includes((process.env.PLAID_INVESTMENTS || '').toLowerCase())
          ? { optional_products: ['investments'] } : {}),
        country_codes: ['CA'],
        language: 'en',
      }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: err }, { status: 500 })
  }
}