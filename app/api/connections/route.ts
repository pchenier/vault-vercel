import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: creds } = await supabaseAdmin
    .from('vault_credentials')
    .select('plaid_token, wise_token, wise_profile')
    .eq('user_id', payload.sub)
    .single()

  const plaidConfigured = !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET && creds?.plaid_token)
  const wiseConfigured = !!(creds?.wise_token && creds?.wise_profile)

  let wiseOk = false
  let wiseError = ''
  if (wiseConfigured) {
    try {
      const res = await fetch(`https://api.transferwise.com/v4/profiles/${creds.wise_profile}/multi-currency-account`, {
        headers: { Authorization: `Bearer ${creds.wise_token}` }
      })
      wiseOk = res.ok
      if (!res.ok) wiseError = `HTTP ${res.status}`
    } catch (e: unknown) {
      wiseError = e instanceof Error ? e.message : 'Unknown error'
    }
  }

  return NextResponse.json({
    plaid: { configured: plaidConfigured, env: 'production' },
    wise: { configured: wiseConfigured, ok: wiseOk, error: wiseError },
  })
}
