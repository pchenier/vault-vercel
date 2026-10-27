import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'
import { run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = await verifySession(token)
    if (!payload?.sub) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const userId = Number(payload.sub)
    if (!Number.isFinite(userId) || userId <= 0) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await run('UPDATE users SET onboarded = true WHERE id = $1', [userId])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}