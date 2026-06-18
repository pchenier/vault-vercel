import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { queryOne } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ user: null })

  const user = await queryOne<{ id: number; email: string; created_at: Date }>(
    'SELECT id, email, created_at FROM users WHERE id = $1',
    [Number(payload.sub)]
  )

  return NextResponse.json({ user })
}