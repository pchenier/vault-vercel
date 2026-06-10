import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PLAID_BASE = 'https://production.plaid.com'

async function plaidPost(endpoint: string, body: object, clientId: string, secret: string) {
  const res = await fetch(`${PLAID_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'PLAID-CLIENT-ID': clientId, 'PLAID-SECRET': secret },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Plaid ${endpoint} failed: ${await res.text()}`)
  return res.json()
}

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID!
const PLAID_SECRET = process.env.PLAID_SECRET!

async function getPlaidAccounts(token: string) {
  try {
    const data = await plaidPost('/accounts/get', { access_token: token }, PLAID_CLIENT_ID, PLAID_SECRET)
    return data.accounts || []
  } catch (e) { console.error('Plaid accounts error:', e); return [] }
}

async function getPlaidTransactions(token: string, startDate: string) {
  try {
    const endDate = new Date().toISOString().split('T')[0]
    let allTxns: any[] = [], offset = 0
    while (true) {
      const data = await plaidPost('/transactions/get', {
        access_token: token,
        start_date: startDate,
        end_date: endDate,
        options: { count: 500, offset, include_personal_finance_category: true },
      }, PLAID_CLIENT_ID, PLAID_SECRET)
      const batch = data.transactions || []
      allTxns = allTxns.concat(batch)
      if (allTxns.length >= (data.total_transactions || 0) || batch.length === 0) break
      offset += batch.length
    }
    return allTxns
  } catch (e) { console.error('Plaid transactions error:', e); return [] }
}

async function getWiseBalances(wiseToken: string, wiseProfile: string) {
  try {
    const res = await fetch(`https://api.transferwise.com/v1/borderless-accounts?profileId=${wiseProfile}`, {
      headers: { Authorization: `Bearer ${wiseToken}` }
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    const balances: Record<string, { amount: number; balanceId: number }> = {}
    const account = Array.isArray(data) ? data[0] : data
    for (const b of (account?.balances || [])) {
      const currency = b.currency || b.amount?.currency
      if (currency) balances[currency] = { amount: b.amount?.value ?? 0, balanceId: b.id }
    }
    return balances
  } catch (e) { console.error('Wise balances error:', e); return {} }
}

async function getWiseTransactions(wiseToken: string, wiseProfile: string, balanceIds: number[], startDate: string) {
  const txns: any[] = []
  const startISO = `${startDate}T00:00:00.000Z`
  const endISO = new Date().toISOString()
  for (const balanceId of balanceIds) {
    try {
      const res = await fetch(
        `https://api.transferwise.com/v1/profiles/${wiseProfile}/balance-statements/${balanceId}/statement.json?currency=USD&intervalStart=${startISO}&intervalEnd=${endISO}&type=COMPACT`,
        { headers: { Authorization: `Bearer ${wiseToken}` } }
      )
      if (!res.ok) continue
      const data = await res.json()
      for (const t of (data.transactions || [])) {
        const amt = t.amount?.value || 0
        txns.push({
          name: t.details?.description || 'Wise Transfer',
          amount: amt > 0 ? -amt : Math.abs(amt),
          date: (t.date || '').split('T')[0],
          account_id: `wise_${balanceId}`,
          category: ['Transfer'],
        })
      }
    } catch {}
  }
  return txns
}

const CAT_MAP: Record<string, [string, string]> = {
  'Food and Drink': ['Bouffe/Resto', '🍽️'], 'Restaurants': ['Bouffe/Resto', '🍽️'],
  'Groceries': ['Épicerie', '🛒'], 'Travel': ['Transport', '🚇'],
  'Transportation': ['Transport', '🚇'], 'Gas Stations': ['Gaz', '⛽'],
  'Shops': ['Shopping', '🛍️'], 'Recreation': ['Divertissement', '🎬'],
  'Healthcare': ['Santé', '💊'], 'Gyms and Fitness Centers': ['Gym', '💪'],
  'Subscription': ['Abonnements', '📺'], 'Service': ['Télécom', '📱'],
  'Telecommunication Services': ['Télécom', '📱'], 'Rent': ['Logement', '🏠'],
  'Utilities': ['Hydro/Services', '⚡'], 'Transfer': ['Cash/Virements', '💸'],
  'Payment': ['Cash/Virements', '💸'], 'Payroll': ['Revenu', '💼'], 'Deposit': ['Revenu', '💼'],
}

function categorize(cats: string[]): [string, string] {
  if (!cats?.length) return ['Autre', '📂']
  for (const c of cats) { const m = CAT_MAP[c]; if (m) return m }
  const s = cats.join(' ')
  if (s.includes('Food') || s.includes('Restaurant')) return ['Bouffe/Resto', '🍽️']
  if (s.includes('Grocer')) return ['Épicerie', '🛒']
  if (s.includes('Gas') || s.includes('Fuel')) return ['Gaz', '⛽']
  if (s.includes('Shop') || s.includes('Retail')) return ['Shopping', '🛍️']
  if (s.includes('Transfer') || s.includes('Payment')) return ['Cash/Virements', '💸']
  if (s.includes('Payroll') || s.includes('Deposit') || s.includes('Income')) return ['Revenu', '💼']
  if (s.includes('Subscription') || s.includes('Netflix') || s.includes('Spotify')) return ['Abonnements', '📺']
  if (s.includes('Transport') || s.includes('Travel') || s.includes('Uber')) return ['Transport', '🚇']
  if (s.includes('Gym') || s.includes('Fitness')) return ['Gym', '💪']
  if (s.includes('Health') || s.includes('Medical')) return ['Santé', '💊']
  if (s.includes('Rent') || s.includes('Mortgage')) return ['Logement', '🏠']
  if (s.includes('Util') || s.includes('Hydro') || s.includes('Electric')) return ['Hydro/Services', '⚡']
  return ['Autre', '📂']
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  depository: 'Chequing / Savings', credit: 'Credit Card',
  loan: 'Loan', investment: 'Investment', other: 'Other',
}
const TYPE_COLORS: Record<string, string> = {
  'Chequing / Savings': '#22c55e', 'Credit Card': '#ef4444',
  'Investment': '#3b82f6', 'International': '#8b5cf6', 'Other': '#71717a',
}
const EXCLUDED_CATS = new Set(['P2P/Virement perso'])

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: creds } = await supabaseAdmin
    .from('vault_credentials')
    .select('plaid_token, wise_token, wise_profile, usd_to_cad, start_date')
    .eq('user_id', payload.sub)
    .single()

  if (!creds?.plaid_token) {
    return NextResponse.json({ error: 'No Plaid token. Complete onboarding first.' }, { status: 400 })
  }

  const USD_TO_CAD = parseFloat(String(creds.usd_to_cad || 1.38))
  const startDate = creds.start_date || '2025-01-01'

  try {
    const [rawAccounts, rawTxns, wiseBalances] = await Promise.all([
      getPlaidAccounts(creds.plaid_token),
      getPlaidTransactions(creds.plaid_token, startDate),
      creds.wise_token && creds.wise_profile
        ? getWiseBalances(creds.wise_token, creds.wise_profile)
        : Promise.resolve({}),
    ])

    const accNameMap: Record<string, string> = {}
    for (const a of rawAccounts) accNameMap[a.account_id] = a.name

    const accounts: any[] = rawAccounts.map((a: any) => {
      const typeLabel = ACCOUNT_TYPE_LABELS[a.type] || a.type
      let bal = a.balances?.current ?? 0
      if (a.type === 'credit' || a.type === 'loan') bal = -Math.abs(bal)
      return {
        id: a.account_id, name: a.name, inst: a.institution_name || a.name,
        bal: Math.round(bal * 100) / 100, balance: Math.round(bal * 100) / 100,
        type: typeLabel, subtype: a.subtype || '', delta: 0, sync: 'just now',
        color: TYPE_COLORS[typeLabel] || '#71717a', init: (a.name || '?')[0].toUpperCase(),
      }
    })

    const wiseBalanceIds: number[] = []
    for (const [currency, info] of Object.entries(wiseBalances) as [string, any][]) {
      let amt = info.amount || 0
      if (currency === 'USD') amt = amt * USD_TO_CAD
      wiseBalanceIds.push(info.balanceId)
      accounts.push({
        id: `wise_${currency}`, name: `Wise ${currency}`, inst: 'Wise',
        bal: Math.round(amt * 100) / 100, balance: Math.round(amt * 100) / 100,
        type: 'International', subtype: currency, delta: 0, sync: 'just now',
        color: '#8b5cf6', init: 'W',
      })
    }

    const wiseTxns = (creds.wise_token && creds.wise_profile && wiseBalanceIds.length)
      ? await getWiseTransactions(creds.wise_token, creds.wise_profile, wiseBalanceIds, startDate)
      : []

    const txns: any[] = []
    const now = new Date()
    for (const t of rawTxns) {
      const plaidCats = t.personal_finance_category
        ? [t.personal_finance_category.primary, t.personal_finance_category.detailed]
        : (t.category || [])
      const [cat, ico] = categorize(plaidCats)
      const displayAmt = t.amount > 0 ? -Math.abs(t.amount) : Math.abs(t.amount)
      const dateIso = t.date || ''
      const [y, m, d] = dateIso.split('-').map(Number)
      const dateLabel = new Date(y, m - 1, d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
      txns.push({ id: t.transaction_id, name: t.merchant_name || t.name, merchant: t.merchant_name || t.name,
        amt: Math.round(displayAmt * 100) / 100, date: dateLabel, date_iso: dateIso,
        cat, acc: accNameMap[t.account_id] || t.account_id, ico })
    }
    for (const t of wiseTxns) {
      const displayAmt = t.amount > 0 ? -Math.abs(t.amount) : Math.abs(t.amount)
      const [y, m, d] = (t.date || '').split('-').map(Number)
      const dateLabel = new Date(y, m - 1, d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
      txns.push({ name: t.name, merchant: t.name, amt: Math.round(displayAmt * 100) / 100,
        date: dateLabel, date_iso: t.date, cat: 'Cash/Virements', acc: 'Wise', ico: '💸' })
    }
    txns.sort((a, b) => (b.date_iso || '').localeCompare(a.date_iso || ''))

    const curM = now.getMonth(), curY = now.getFullYear()
    const curMonthTxns = txns.filter(t => {
      const [y, m] = (t.date_iso || '').split('-').map(Number)
      return m - 1 === curM && y === curY && !EXCLUDED_CATS.has(t.cat)
    })
    const income = curMonthTxns.filter(t => t.amt > 0).reduce((s, t) => s + t.amt, 0)
    const spending = curMonthTxns.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0)
    const cashFlow = income - spending
    const netWorth = accounts.reduce((s, a) => s + (a.bal || 0), 0)
    const totalAssets = accounts.filter(a => (a.bal || 0) > 0).reduce((s, a) => s + a.bal, 0)
    const totalDebt = accounts.filter(a => (a.bal || 0) < 0).reduce((s, a) => s + Math.abs(a.bal), 0)
    const catSpend: Record<string, number> = {}
    curMonthTxns.filter(t => t.amt < 0 && !EXCLUDED_CATS.has(t.cat)).forEach(t => {
      catSpend[t.cat] = (catSpend[t.cat] || 0) + Math.abs(t.amt)
    })
    const categorySpending = Object.entries(catSpend)
      .map(([cat, amt]) => ({ cat, amt: Math.round(amt * 100) / 100 }))
      .sort((a, b) => b.amt - a.amt)
    const generated = new Date().toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

    // Build net worth history from transactions (last 12 months)
    // Strategy: start from current netWorth and subtract monthly net cash flow to go backwards
    const nwHistory: number[] = [];
    const nwLabels: string[] = [];
    const nowDate = new Date();

    // Compute monthly net flow for each of the last 12 months
    const monthlyFlows: number[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(nowDate.getFullYear(), nowDate.getMonth() - i, 1);
      const startOfMonth = d.toISOString().split('T')[0];
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
      const monthTxns = rawTxns.filter((t: any) => (t.date || '') >= startOfMonth && (t.date || '') <= endOfMonth);
      const monthNet = monthTxns.reduce((s: number, t: any) => {
        // Plaid: positive = money out (debit), negative = money in (credit)
        const displayAmt = t.amount > 0 ? -Math.abs(t.amount) : Math.abs(t.amount);
        return s + displayAmt;
      }, 0);
      monthlyFlows.push(monthNet);
      nwLabels.push(d.toLocaleString('fr-CA', { month: 'short', year: '2-digit' }));
    }

    // Reconstruct history: walk backwards from current netWorth
    // nwHistory[11] = current, nwHistory[10] = current - last month flow, etc.
    const tempHistory: number[] = new Array(12);
    tempHistory[11] = netWorth;
    for (let i = 10; i >= 0; i--) {
      tempHistory[i] = tempHistory[i + 1] - monthlyFlows[i + 1];
    }
    nwHistory.push(...tempHistory);

    return NextResponse.json({
      netWorth: Math.round(netWorth * 100) / 100,
      totalAssets: Math.round(totalAssets * 100) / 100,
      totalDebt: Math.round(totalDebt * 100) / 100,
      income: Math.round(income * 100) / 100,
      spending: Math.round(spending * 100) / 100,
      cashFlow: Math.round(cashFlow * 100) / 100,
      generated, netWorthHistory: nwHistory, monthLabels: nwLabels,
      accounts, txns: txns.slice(0, 500), budget: [],
      catLabels: categorySpending.map(c => c.cat),
      catAmounts: categorySpending.map(c => c.amt),
      investments: [], investHistory: [], crypto: [], habits: [], gym: [], gymDays: [], meals: [], bills: [],
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e: any) {
    console.error('API data error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
