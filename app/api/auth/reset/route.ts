import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/postgres'
import { rateLimited, clientIp } from '@/lib/rate-limit'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()
    if (typeof token !== 'string' || !token || token.length > 100 || typeof password !== 'string') {
      return NextResponse.json({ error: 'This reset link is invalid. Request a new one.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    if (Buffer.byteLength(password) > 72) {
      return NextResponse.json({ error: 'Password is too long (72 bytes max).' }, { status: 400 })
    }
    if (await rateLimited(`reset-ip:${clientIp(request)}`, 10, 900)) {
      return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes.' }, { status: 429 })
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const hash = await bcrypt.hash(password, 12)

    // One transaction: the link is used up, the password changes and every existing
    // session is revoked (token_version + 1) together, or not at all.
    const client = await pool.connect()
    let user: { id: number; email: string; token_version: number } | undefined
    try {
      await client.query('BEGIN')
      const reset = await client.query<{ user_id: number }>(
        'DELETE FROM password_resets WHERE token_hash = $1 AND expires_at > NOW() RETURNING user_id',
        [tokenHash]
      )
      if (reset.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'This reset link has expired or was already used. Request a new one.' }, { status: 400 })
      }
      const userId = reset.rows[0].user_id
      // Opening the emailed link also proves the address, so it counts as verified
      const updated = await client.query<{ id: number; email: string; token_version: number }>(
        `UPDATE users SET password_hash = $1, email_confirmed = true, token_version = token_version + 1, updated_at = NOW()
         WHERE id = $2 RETURNING id, email, token_version`,
        [hash, userId]
      )
      user = updated.rows[0]
      await client.query('DELETE FROM password_resets WHERE user_id = $1', [userId])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
    if (!user) return NextResponse.json({ error: 'This reset link is invalid. Request a new one.' }, { status: 400 })

    console.log(`Password reset completed for user ${user.id}; other sessions revoked`)
    const response = NextResponse.json({ ok: true })
    response.cookies.set(COOKIE_NAME, signToken(String(user.id), user.email, user.token_version), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
    return response
  } catch (e) {
    console.error('Reset password error:', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
