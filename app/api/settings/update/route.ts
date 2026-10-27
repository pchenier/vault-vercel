import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'
import { encryptToken } from '@/lib/token-crypto'
import { queryOne, run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = await verifySession(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { newPassword, wiseToken, wiseProfile, usdToCad, startDate } = body

    const updates: string[] = []

    // Changing a password with only a session cookie would let a stolen cookie take the
    // account over. Passwords change through the emailed link (/forgot → /reset) instead.
    if (newPassword) {
      return NextResponse.json({ error: 'Use "Forgot password" to set a new password.' }, { status: 400 })
    }

    const credUpdates: Record<string, unknown> = {}
    if (wiseToken !== undefined) { credUpdates.wise_token = encryptToken(wiseToken); updates.push('wiseToken') }
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