import { NextResponse } from 'next/server'
import { queryOne, run } from '@/lib/postgres'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split(COOKIE_NAME + '=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload?.sub) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 })
    }

    await run(
      'UPDATE users SET name = $1 WHERE id = $2',
      [name, Number(payload.sub)]
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}