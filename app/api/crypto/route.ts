import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { queryOne, run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  LINK: 'chainlink',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  XRP: 'ripple',
  USDC: 'usd-coin',
  USDT: 'tether',
  SHIB: 'shiba-inu',
  UNI: 'uniswap',
  ATOM: 'cosmos',
}

const COIN_COLORS: Record<string, string> = {
  BTC: '#F7931A', ETH: '#627EEA', SOL: '#9945FF', ADA: '#0033AD',
  DOGE: '#C2A633', DOT: '#E6007A', LINK: '#2A5ADA', AVAX: '#E84142',
  MATIC: '#8247E5', XRP: '#23292F', USDC: '#2775CA', USDT: '#26A17B',
  SHIB: '#FFA409', UNI: '#FF007A', ATOM: '#2E3148',
}

const COIN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', ADA: 'Cardano',
  DOGE: 'Dogecoin', DOT: 'Polkadot', LINK: 'Chainlink', AVAX: 'Avalanche',
  MATIC: 'Polygon', XRP: 'XRP', USDC: 'USD Coin', USDT: 'Tether',
  SHIB: 'Shiba Inu', UNI: 'Uniswap', ATOM: 'Cosmos',
}

export async function GET() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get user's crypto holdings from Postgres
  const holdings = await queryOne<{ crypto_holdings: Record<string, number> | null }>(
    'SELECT crypto_holdings FROM vault_credentials WHERE user_id = $1',
    [Number(payload.sub)]
  )

  const userHoldings: Record<string, number> = (holdings?.crypto_holdings as Record<string, number>) || {}

  // If no holdings, return top coins with live prices (discoverable)
  const allCoins = Object.keys(COINGECKO_IDS)
  const hasHoldings = Object.keys(userHoldings).length > 0
  const coins = hasHoldings
    ? Object.keys(userHoldings)
    : ['BTC', 'ETH', 'SOL'] // default display for users without holdings

  const cgIds = coins.map(c => COINGECKO_IDS[c] || c.toLowerCase()).join(',')

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=cad&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('CoinGecko fetch failed')
    const prices = await res.json()

    const crypto = coins.map(symbol => {
      const cgId = COINGECKO_IDS[symbol] || symbol.toLowerCase()
      const p = prices[cgId]
      const price = p?.cad || 0
      const pct = p?.cad_24h_change || 0
      const amt = userHoldings[symbol] || (hasHoldings ? 0 : (symbol === 'BTC' ? 0.05 : symbol === 'ETH' ? 0.8 : 5))
      const val = amt * price
      return {
        coin: symbol,
        name: COIN_NAMES[symbol] || symbol,
        color: COIN_COLORS[symbol] || '#888',
        price: Math.round(price * 100) / 100,
        amt: Math.round(amt * 100000) / 100000,
        val: Math.round(val * 100) / 100,
        pct: Math.round(pct * 100) / 100,
      }
    })

    return NextResponse.json({ connected: true, crypto })
  } catch {
    return NextResponse.json({ connected: false, crypto: [] })
  }
}

// POST: save user's crypto holdings
export async function POST(req: Request) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { holdings } = body as { holdings: Record<string, number> }

  // Validate
  const valid = Object.entries(holdings).filter(([k, v]) =>
    COINGECKO_IDS[k] && typeof v === 'number' && v >= 0
  )
  const cleaned = Object.fromEntries(valid)

  await run(
    'UPDATE vault_credentials SET crypto_holdings = $1 WHERE user_id = $2',
    [JSON.stringify(cleaned), Number(payload.sub)]
  )

  return NextResponse.json({ ok: true, holdings: cleaned })
}