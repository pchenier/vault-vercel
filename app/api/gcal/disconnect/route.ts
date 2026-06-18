import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function POST() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await run(
    `UPDATE vault_credentials SET
      google_access_token = NULL,
      google_refresh_token = NULL,
      google_token_expiry = NULL
    WHERE user_id = $1`,
    [Number(payload.sub)]
  )

  return NextResponse.json({ ok: true })
}