import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth-jwt'
import { verifySession } from '@/lib/session'
import { run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

// Saves investment accounts entered during onboarding into the same
// investment_accounts table the Flask dashboard reads (Investments page).
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    const payload = token ? await verifySession(token) : null
    const userId = Number(payload?.sub)
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const accounts: unknown[] = Array.isArray(body?.accounts) ? body.accounts.slice(0, 10) : []

    let saved = 0
    for (const raw of accounts) {
      const a = (raw ?? {}) as { platform?: unknown; label?: unknown; balance?: unknown }
      const platform = String(a.platform ?? '').trim().slice(0, 100)
      if (!platform) continue
      const label = String(a.label ?? '').trim().slice(0, 100) || platform
      const balance = Number(a.balance)
      await run(
        'INSERT INTO investment_accounts (user_id, platform, label, balance, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [userId, platform, label, Number.isFinite(balance) && balance >= 0 && balance < 1e12 ? balance : 0]
      )
      saved++
    }
    return NextResponse.json({ ok: true, saved })
  } catch (e) {
    console.error('Save investments error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
