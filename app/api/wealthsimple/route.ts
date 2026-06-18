import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { queryOne, run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

interface InvestmentRow {
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  pnl: number
  currency: string
  source: string
}

function parseWealthsimpleCSV(csv: string): InvestmentRow[] {
  const lines = csv.split('\n').filter(l => l.trim())
  const rows: InvestmentRow[] = []

  // Wealthsimple CSV has headers like: Symbol,Name,Quantity,Average Cost,Current Price,Market Value,Unrealized P&L,Currency
  // or French: Symbole,Nom,Quantité,Prix moyen,Prix actuel,Valeur au marché,PNL non réalisé,Devise
  let headerLine = lines.findIndex(l =>
    l.toLowerCase().includes('symbol') || l.toLowerCase().includes('symbole') ||
    l.toLowerCase().includes('quantity') || l.toLowerCase().includes('quantité')
  )
  if (headerLine === -1) headerLine = 0

  const headers = lines[headerLine].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))

  for (let i = headerLine + 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''))
    if (cols.length < 4) continue

    const get = (names: string[]) => {
      for (const name of names) {
        const idx = headers.indexOf(name)
        if (idx >= 0 && cols[idx]) return cols[idx]
      }
      return ''
    }

    const symbol = get(['symbol', 'symbole', 'ticker']) || cols[0]
    const name = get(['name', 'nom']) || symbol
    const quantity = parseFloat(get(['quantity', 'quantité', 'qty', 'shares']) || '0')
    const avgPrice = parseFloat(get(['average cost', 'prix moyen', 'avg price', 'average purchase price']) || '0')
    const currentPrice = parseFloat(get(['current price', 'prix actuel', 'market price']) || '0')
    const marketValue = parseFloat(get(['market value', 'valeur au marché', 'value']) || '0')
    const pnl = parseFloat(get(['unrealized p&l', 'pnl non réalisé', 'unrealized gain/loss', 'gain/perte']) || '0')
    const currency = get(['currency', 'devise']) || 'CAD'

    if (symbol && (quantity > 0 || marketValue > 0)) {
      rows.push({ symbol, name, quantity, avgPrice, currentPrice, marketValue, pnl, currency, source: 'wealthsimple' })
    }
  }
  return rows
}

function parseGenericCSV(csv: string): InvestmentRow[] {
  const lines = csv.split('\n').filter(l => l.trim())
  const rows: InvestmentRow[] = []
  let startIdx = lines[0].toLowerCase().includes('symbol') || lines[0].toLowerCase().includes('ticker') ? 1 : 0

  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''))
    if (cols.length < 2) continue
    const symbol = cols[0]
    const quantity = parseFloat(cols[1]) || 0
    const avgPrice = parseFloat(cols[2]) || 0
    const currentPrice = parseFloat(cols[3]) || 0
    const marketValue = parseFloat(cols[4]) || 0
    const pnl = parseFloat(cols[5]) || 0
    const currency = cols[6] || 'CAD'
    if (symbol && quantity > 0) {
      rows.push({ symbol, name: symbol, quantity, avgPrice, currentPrice, marketValue, pnl, currency, source: 'csv' })
    }
  }
  return rows
}

export async function GET() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creds = await queryOne<{ wealthsimple_data: unknown }>(
    'SELECT wealthsimple_data FROM vault_credentials WHERE user_id = $1',
    [Number(payload.sub)]
  )

  const investments = (creds?.wealthsimple_data as InvestmentRow[]) || []
  return NextResponse.json({
    connected: investments.length > 0,
    investments,
  })
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contentType = req.headers.get('content-type') || ''

  let csv: string
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    csv = await file.text()
  } else {
    const body = await req.json()
    csv = body.csv || ''
  }

  if (!csv.trim()) return NextResponse.json({ error: 'Empty CSV' }, { status: 400 })

  // Parse CSV — try Wealthsimple format first, then generic
  let investments = parseWealthsimpleCSV(csv)
  if (investments.length === 0) {
    investments = parseGenericCSV(csv)
  }

  if (investments.length === 0) {
    return NextResponse.json({ error: 'Could not parse CSV. Expected columns: Symbol, Quantity, Price...' }, { status: 400 })
  }

  // Save to Postgres
  await run(
    'UPDATE vault_credentials SET wealthsimple_data = $1 WHERE user_id = $2',
    [JSON.stringify(investments), Number(payload.sub)]
  )

  return NextResponse.json({ ok: true, count: investments.length, investments })
}

export async function DELETE() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await run(
    'UPDATE vault_credentials SET wealthsimple_data = NULL WHERE user_id = $1',
    [Number(payload.sub)]
  )

  return NextResponse.json({ ok: true })
}