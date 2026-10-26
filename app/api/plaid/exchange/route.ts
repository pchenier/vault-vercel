import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { queryOne, run } from '@/lib/postgres'
import { encryptToken } from '@/lib/token-crypto'

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

    const userId = Number(payload.sub)
    const encrypted = encryptToken(data.access_token)
    await run(
      'UPDATE vault_credentials SET plaid_token = $1, updated_at = NOW() WHERE user_id = $2',
      [encrypted, userId]
    )
    // The dashboard (app.fiscit.com) syncs banks from plaid_connections: without this
    // row, a bank linked during onboarding never showed up there.
    const existing = await queryOne<{ n: string }>('SELECT COUNT(*)::text AS n FROM plaid_connections WHERE user_id = $1 AND item_id = $2', [userId, data.item_id || ''])
    if (!existing || existing.n === '0') {
      await run(
        'INSERT INTO plaid_connections (user_id, access_token, item_id, institution, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [userId, encrypted, data.item_id || '', '']
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error('Plaid exchange error:', e)
    return NextResponse.json({ error: 'Could not connect the bank. Please try again.' }, { status: 500 })
  }
}