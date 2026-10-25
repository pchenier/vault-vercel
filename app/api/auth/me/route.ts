import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, signHandoffToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { queryOne } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ user: null })

  const userId = Number(payload.sub)
  if (!Number.isFinite(userId) || userId <= 0) return NextResponse.json({ user: null })

  const user = await queryOne<{ id: number; email: string; name: string | null; onboarded: boolean; created_at: Date }>(
    'SELECT id, email, name, onboarded, created_at FROM users WHERE id = $1',
    [userId]
  )

  if (!user) return NextResponse.json({ user: null })

  // Hand out a short-lived token for the /sso hop, never the httpOnly session cookie itself.
  return NextResponse.json({ user, token: signHandoffToken(String(user.id), user.email) })
}