import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { queryOne, run } from '@/lib/postgres'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { newPassword, wiseToken, wiseProfile, usdToCad, startDate } = body

    const updates: string[] = []

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      }
      const hash = await bcrypt.hash(newPassword, 12)
      await run(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [hash, Number(payload.sub)]
      )
      updates.push('password')
    }

    const credUpdates: Record<string, unknown> = {}
    if (wiseToken !== undefined) { credUpdates.wise_token = wiseToken; updates.push('wiseToken') }
    if (wiseProfile !== undefined) { credUpdates.wise_profile = wiseProfile; updates.push('wiseProfile') }
    if (usdToCad !== undefined) { credUpdates.usd_to_cad = String(usdToCad); updates.push('usdToCad') }
    if (startDate !== undefined) { credUpdates.start_date = String(startDate); updates.push('startDate') }

    if (Object.keys(credUpdates).length > 0) {
      const setClauses = Object.keys(credUpdates).map((key, i) => `${key} = $${i + 1}`).join(', ')
      const values = [...Object.values(credUpdates), Number(payload.sub)]
      await run(
        `UPDATE vault_credentials SET ${setClauses}, updated_at = NOW() WHERE user_id = $${values.length}`,
        values
      )
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, message: `Updated: ${updates.join(', ')}`, updates })
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    console.error('Settings update error:', err)
    return NextResponse.json({ error: err }, { status: 500 })
  }
}