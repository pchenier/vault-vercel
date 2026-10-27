import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { queryOne, run } from '@/lib/postgres'
import { rateLimited, clientIp } from '@/lib/rate-limit'
import { emailCard, sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const RESET_MINUTES = 30

// Answers the same way whether or not the email has an account, so this can't be
// used to find out who uses Fiscit.
export async function POST(request: Request) {
  try {
    const { email: rawEmail } = await request.json()
    const email = typeof rawEmail === 'string' ? rawEmail.toLowerCase().trim() : ''
    if (!email || email.length > 255) {
      return NextResponse.json({ error: 'Enter your email address.' }, { status: 400 })
    }
    if (await rateLimited(`forgot:${email}`, 3, 3600) || await rateLimited(`forgot-ip:${clientIp(request)}`, 10, 3600)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in an hour.' }, { status: 429 })
    }

    const user = await queryOne<{ id: number; email: string }>('SELECT id, email FROM users WHERE email = $1', [email])
    if (!user) return NextResponse.json({ ok: true })

    // Only the hash is stored: the link in the email is the only copy of the token
    const token = crypto.randomBytes(32).toString('base64url')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    await run('DELETE FROM password_resets WHERE user_id = $1 OR expires_at < NOW()', [user.id])
    await run(
      `INSERT INTO password_resets (user_id, token_hash, expires_at, created_at)
       VALUES ($1, $2, NOW() + make_interval(mins => $3), NOW())`,
      [user.id, tokenHash, RESET_MINUTES]
    )

    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'}/reset?token=${token}`
    await sendEmail(user.email, 'Reset your Fiscit password', emailCard(
      'Reset your password',
      'Someone (hopefully you) asked to reset the password for this Fiscit account. Click below to choose a new one.',
      { label: 'Choose a new password', url },
      `This link works once and expires in ${RESET_MINUTES} minutes. If you did not ask for it, ignore this email: your password stays the same.`,
    ))
    console.log(`Password reset requested for user ${user.id}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Forgot password error:', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
