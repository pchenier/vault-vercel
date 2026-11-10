import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// Plaid Link runs in the browser, so its errors (wrong password, bank down, bank not
// found in search...) never reach the server unless the page reports them. Only codes,
// the bank and the person's last search are logged, never credentials.
const FIELDS = ['event', 'status', 'exit_status', 'error_type', 'error_code', 'institution_id',
  'institution_name', 'link_session_id', 'request_id', 'last_search'] as const

export async function POST(request: Request) {
  const payload = await verifySession((await cookies()).get(COOKIE_NAME)?.value)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const info = FIELDS
    .filter(k => k !== 'event' && body?.[k])
    .map(k => `${k}=${String(body[k]).slice(0, 120)}`)
    .join(' ')
  console.warn(`Plaid Link ${String(body?.event || 'event').slice(0, 20)} for user ${payload.sub}: ${info}`)
  return NextResponse.json({ ok: true })
}
