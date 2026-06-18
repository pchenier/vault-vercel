import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { queryOne, run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

// Questrade OAuth: exchange refresh_token for access_token + api_server
async function redeemToken(refreshToken: string, practice: boolean = false) {
  const baseUrl = practice
    ? 'https://practicelogin.questrade.com'
    : 'https://login.questrade.com'

  const res = await fetch(
    `${baseUrl}/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
    { method: 'GET' }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Token redemption failed (${res.status}): ${err}`)
  }

  return res.json() // { access_token, token_type, expires_in, refresh_token, api_server }
}

// Make an authenticated call to Questrade API
async function qtFetch(apiServer: string, accessToken: string, path: string) {
  const res = await fetch(`${apiServer}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Questrade API error (${res.status}): ${err}`)
  }
  return res.json()
}

export async function GET() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creds = await queryOne<{ questrade_token: string | null; questrade_token_expiry: Date | null; questrade_access_token: string | null; questrade_api_server: string | null; questrade_refresh_token: string | null }>(
    'SELECT questrade_token, questrade_token_expiry, questrade_access_token, questrade_api_server, questrade_refresh_token FROM vault_credentials WHERE user_id = $1',
    [Number(payload.sub)]
  )

  if (!creds?.questrade_refresh_token && !creds?.questrade_token) {
    return NextResponse.json({ connected: false, accounts: [], positions: [] })
  }

  try {
    let accessToken = creds!.questrade_access_token
    let apiServer = creds!.questrade_api_server
    let refreshToken = creds!.questrade_refresh_token || creds!.questrade_token

    // Check if access token is still valid (5 min buffer)
    const expiry = creds!.questrade_token_expiry ? new Date(creds!.questrade_token_expiry) : null
    if (!accessToken || !apiServer || (expiry && Date.now() > expiry.getTime() - 300000)) {
      // Need to refresh — redeem the refresh token
      let tokenData
      try {
        tokenData = await redeemToken(refreshToken!, false)
      } catch {
        // Try practice API
        try {
          tokenData = await redeemToken(refreshToken!, true)
        } catch (e: any) {
          return NextResponse.json({ connected: false, error: e.message, accounts: [], positions: [] })
        }
      }

      accessToken = tokenData.access_token
      apiServer = tokenData.api_server
      const newRefresh = tokenData.refresh_token
      const newExpiry = new Date(Date.now() + (tokenData.expires_in || 300) * 1000).toISOString()

      // Save new tokens
      await run(
        `UPDATE vault_credentials SET
          questrade_access_token = $1,
          questrade_api_server = $2,
          questrade_refresh_token = $3,
          questrade_token_expiry = $4
        WHERE user_id = $5`,
        [accessToken, apiServer, newRefresh, newExpiry, Number(payload.sub)]
      )
    }

    // Fetch accounts
    const acctsData = await qtFetch(apiServer!, accessToken!, '/v1/accounts')
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
        const posData = await qtFetch(apiServer!, accessToken!, `/v1/accounts/${acct.number}/positions`)
        allPositions.push(...(posData.positions || []).map((p: any) => ({
          accountId: acct.number,
          symbol: p.symbol,
          name: p.symbol,
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
      } catch { /* skip account on error */ }
    }

    // Fetch balances
    let balances: any[] = []
    try {
      for (const acct of acctsData.accounts || []) {
        const balData = await qtFetch(apiServer!, accessToken!, `/v1/accounts/${acct.number}/balances`)
        balances.push(...(balData.balances || []).map((b: any) => ({
          accountId: acct.number,
          type: b.currency,
          cash: b.cash,
          marketValue: b.marketValue,
          totalEquity: b.totalEquity,
        })))
      }
    } catch { /* skip balances on error */ }

    return NextResponse.json({ connected: true, accounts, positions: allPositions, balances })
  } catch (e: any) {
    return NextResponse.json({ connected: false, error: e.message, accounts: [], positions: [] })
  }
}

// POST: save Questrade refresh token and validate it
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

  // Validate: try to redeem the token to get access_token + api_server
  let tokenData
  let isPractice = false
  try {
    tokenData = await redeemToken(token, false)
  } catch {
    // Try practice API
    try {
      tokenData = await redeemToken(token, true)
      isPractice = true
    } catch (e: any) {
      return NextResponse.json({
        error: 'Cannot reach Questrade API. Make sure your token is valid and API access is enabled at my.questrade.com/api-management'
      }, { status: 400 })
    }
  }

  const accessToken = tokenData.access_token
  const apiServer = tokenData.api_server
  const newRefresh = tokenData.refresh_token
  const expiry = new Date(Date.now() + (tokenData.expires_in || 300) * 1000).toISOString()

  // Save tokens
  await run(
    `UPDATE vault_credentials SET
      questrade_token = $1,
      questrade_refresh_token = $2,
      questrade_access_token = $3,
      questrade_api_server = $4,
      questrade_token_expiry = $5
    WHERE user_id = $6`,
    [token, newRefresh, accessToken, apiServer, expiry, Number(payload.sub)]
  )

  return NextResponse.json({ ok: true, practice: isPractice })
}

// DELETE: remove Questrade connection
export async function DELETE() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await run(
    `UPDATE vault_credentials SET
      questrade_token = NULL,
      questrade_token_expiry = NULL,
      questrade_access_token = NULL,
      questrade_api_server = NULL,
      questrade_refresh_token = NULL
    WHERE user_id = $1`,
    [Number(payload.sub)]
  )

  return NextResponse.json({ ok: true })
}