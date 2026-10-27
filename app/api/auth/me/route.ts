import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signHandoffToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'
import { queryOne } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null })

  const payload = await verifySession(token)
  if (!payload) return NextResponse.json({ user: null })

  const userId = Number(payload.sub)
  if (!Number.isFinite(userId) || userId <= 0) return NextResponse.json({ user: null })

  const user = await queryOne<{ id: number; email: string; name: string | null; onboarded: boolean; created_at: Date; token_version: number }>(
    'SELECT id, email, name, onboarded, created_at, token_version FROM users WHERE id = $1',
    [userId]
  )

  if (!user) return NextResponse.json({ user: null })

  // Hand out a short-lived token for the /sso hop, never the httpOnly session cookie itself.
  const { token_version, ...publicUser } = user
  return NextResponse.json({ user: publicUser, token: signHandoffToken(String(user.id), user.email, token_version) })
}