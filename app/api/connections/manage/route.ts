import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

type ConnKey = 'coinbase_api_key' | 'coinbase_api_secret' | 'binance_api_key' | 'binance_api_secret' | 'paypal_client_id' | 'stripe_api_key' | 'shopify_access_token' | 'shopify_store_url'

const CONNECTIONS: Record<string, ConnKey[]> = {
  coinbase: ['coinbase_api_key', 'coinbase_api_secret'],
  binance: ['binance_api_key', 'binance_api_secret'],
  paypal: ['paypal_client_id'],
  stripe: ['stripe_api_key'],
  shopify: ['shopify_access_token', 'shopify_store_url'],
}

// GET: check all connection statuses
export async function GET() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allKeys = Object.values(CONNECTIONS).flat()
  const { data: creds } = await supabaseAdmin
    .from('vault_credentials')
    .select(allKeys.join(','))
    .eq('user_id', payload.sub)
    .single()

  const status: Record<string, boolean> = {}
  for (const [name, keys] of Object.entries(CONNECTIONS)) {
    status[name] = keys.every(k => !!(creds as any)?.[k])
  }
  return NextResponse.json(status)
}

// POST: save API keys — body: { name, ...keyValuePairs }
export async function POST(req: Request) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, ...keys } = body as Record<string, string>

  if (!name || !CONNECTIONS[name]) {
    return NextResponse.json({ error: 'Unknown connection: ' + name }, { status: 400 })
  }

  const allowedKeys = CONNECTIONS[name]
  const update: Record<string, string> = {}
  for (const key of allowedKeys) {
    if (keys[key]) update[key] = keys[key]
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No keys provided' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('vault_credentials')
    .update(update)
    .eq('user_id', payload.sub)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE: remove connection — body: { name }
export async function DELETE(req: Request) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name } = body as { name: string }

  if (!name || !CONNECTIONS[name]) {
    return NextResponse.json({ error: 'Unknown connection' }, { status: 400 })
  }

  const nulls: Record<string, null> = {}
  for (const key of CONNECTIONS[name]) nulls[key] = null

  const { error } = await supabaseAdmin
    .from('vault_credentials')
    .update(nulls)
    .eq('user_id', payload.sub)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}