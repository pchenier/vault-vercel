import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { public_token } = await request.json()
    const res = await fetch('https://production.plaid.com/item/public_token/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
        'PLAID-SECRET': process.env.PLAID_SECRET!,
      },
      body: JSON.stringify({ public_token }),
    })
    const data = await res.json()
    if (!res.ok || !data.access_token) {
      return NextResponse.json({ error: data.error_message || 'Exchange failed' }, { status: 400 })
    }

    await run(
      'UPDATE vault_credentials SET plaid_token = $1, updated_at = NOW() WHERE user_id = $2',
      [data.access_token, Number(payload.sub)]
    )

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: err }, { status: 500 })
  }
}