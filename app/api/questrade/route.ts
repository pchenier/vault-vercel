import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const QT_API = 'https://api06.questrade.com'

async function getQtApiBase(token: string): Promise<string> {
  // Questrade requires getting the API server from the token introspection
  const res = await fetch(`${QT_API}/v1/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.ok) return QT_API
  // Try practice API
  const res2 = await fetch('https://practice-api.questtrade.com/v1/accounts', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res2.ok ? 'https://practice-api.questtrade.com' : QT_API
}

export async function GET() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: creds } = await supabaseAdmin
    .from('vault_credentials')
    .select('questrade_token, questrade_token_expiry')
    .eq('user_id', payload.sub)
    .single()

  if (!creds?.questrade_token) {
    return NextResponse.json({ connected: false, accounts: [], positions: [] })
  }

  // Check token expiry
  const expiry = creds.questrade_token_expiry ? new Date(creds.questrade_token_expiry) : null
  if (expiry && Date.now() > expiry.getTime()) {
    // Token expired, user needs to re-enter
    return NextResponse.json({ connected: false, expired: true, accounts: [], positions: [] })
  }

  try {
    // Fetch accounts
    const acctsRes = await fetch(`${QT_API}/v1/accounts`, {
      headers: { Authorization: `Bearer ${creds.questrade_token}` },
    })
    if (!acctsRes.ok) {
      const errText = await acctsRes.text()
      return NextResponse.json({ connected: false, error: errText, accounts: [], positions: [] })
    }
    const acctsData = await acctsRes.json()

    const accounts = (acctsData.accounts || []).map((a: any) => ({
      id: a.number,
      name: a.type === 'Margin' ? 'Questrade Margin' : `Questrade ${a.type}`,
      type: a.type,
      status: a.status,
      currency: a.currency,
    }))

    // Fetch positions for each account
    const allPositions: any[] = []
    for (const acct of acctsData.accounts || []) {
      try {
        const posRes = await fetch(`${QT_API}/v1/accounts/${acct.number}/positions`, {
          headers: { Authorization: `Bearer ${creds.questrade_token}` },
        })
        if (posRes.ok) {
          const posData = await posRes.json()
          allPositions.push(...(posData.positions || []).map((p: any) => ({
            accountId: acct.number,
            symbol: p.symbol,
            name: p.symbol, // Questrade doesn't always give name
            quantity: p.openQuantity,
            avgPrice: p.averageEntryPrice,
            currentPrice: p.currentPrice,
            marketValue: p.currentMarketValue,
            pnl: p.unrealizedProfitLoss || 0,
            pnlPct: p.averageEntryPrice > 0
              ? Math.round(((p.currentPrice - p.averageEntryPrice) / p.averageEntryPrice) * 10000) / 100
              : 0,
            currency: p.currency || acct.currency,
          })))
        }
      } catch { /* skip account on error */ }
    }

    return NextResponse.json({ connected: true, accounts, positions: allPositions })
  } catch (e: any) {
    return NextResponse.json({ connected: false, error: e.message, accounts: [], positions: [] })
  }
}

// POST: save Questrade personal access token
export async function POST(req: Request) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { token } = body as { token: string }

  if (!token || token.length < 10) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  // Validate token by calling the API
  try {
    const testRes = await fetch(`${QT_API}/v1/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!testRes.ok) {
      // Try practice API
      const testRes2 = await fetch('https://practice-api.questtrade.com/v1/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!testRes2.ok) {
        return NextResponse.json({ error: 'Invalid Questrade token. Check your token at my.questrade.com/api-management' }, { status: 400 })
      }
    }
  } catch {
    return NextResponse.json({ error: 'Cannot reach Questrade API' }, { status: 400 })
  }

  // Token valid — save it (expires in 30 days for manual tokens)
  const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const { error } = await supabaseAdmin
    .from('vault_credentials')
    .update({
      questrade_token: token,
      questrade_token_expiry: expiry,
    })
    .eq('user_id', payload.sub)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE: remove Questrade token
export async function DELETE() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabaseAdmin
    .from('vault_credentials')
    .update({ questrade_token: null, questrade_token_expiry: null })
    .eq('user_id', payload.sub)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}