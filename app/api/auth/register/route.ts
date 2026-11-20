import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { queryOne, run } from '@/lib/postgres'
import { sendVerificationEmail } from '@/lib/email'
import { rateLimited, clientIp } from '@/lib/rate-limit'
import { langFromRequest } from '@/lib/i18n/server'
import { serverMessages } from '@/lib/i18n/server-messages'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const lang = langFromRequest(request)
  const m = serverMessages(lang).api
  try {
    const { email: rawEmail, password, name, newsletter } = await request.json()
    const email = rawEmail?.toLowerCase().trim()
    if (!email || !password || typeof password !== 'string') {
      return NextResponse.json({ error: m.emailPasswordRequired }, { status: 400 })
    }
    if (Buffer.byteLength(password) > 72) {
      return NextResponse.json({ error: m.passwordMax72 }, { status: 400 })
    }
    const ip = clientIp(request)
    if (await rateLimited(`register-ip:${ip}`, 5, 3600) || await rateLimited(`register-email:${email}`, 3, 3600)) {
      return NextResponse.json({ error: m.tooManyRegister }, { status: 429 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: m.passwordMin8 }, { status: 400 })
    }

    const existing = await queryOne<{ id: number; email_confirmed: boolean }>(
      'SELECT id, email_confirmed FROM users WHERE email = $1',
      [email]
    )

    if (existing) {
      if (existing.email_confirmed) {
        return NextResponse.json({ error: m.accountExists }, { status: 409 })
      }
      // Unconfirmed user — resend verification
      const verifyToken = crypto.randomBytes(32).toString('hex')
      await run(
        'UPDATE users SET verify_token = $1, password_hash = $2, name = COALESCE($3, name), newsletter = $4 WHERE id = $5',
        [verifyToken, await bcrypt.hash(password, 12), name?.trim() || null, !!newsletter, existing.id]
      )
      await run('DELETE FROM email_verifications WHERE user_id = $1', [existing.id])
      await run(
        'INSERT INTO email_verifications (user_id, token) VALUES ($1, $2)',
        [existing.id, verifyToken]
      )

      // Send verification email
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'}/verify?token=${verifyToken}`
      await sendVerificationEmail(email, verifyUrl, lang)

      return NextResponse.json({ ok: true, message: m.verificationSent })
    }

    const hash = await bcrypt.hash(password, 12)
    const verifyToken = crypto.randomBytes(32).toString('hex')

    const user = await queryOne<{ id: number; email: string }>(
      `INSERT INTO users (email, password_hash, name, email_confirmed, newsletter, verify_token)
       VALUES ($1, $2, $3, false, $4, $5)
       RETURNING id, email`,
      [email, hash, name?.trim() || null, !!newsletter, verifyToken]
    )

    if (!user) {
      return NextResponse.json({ error: m.createFailed }, { status: 500 })
    }

    // Create vault_credentials row
    await run('INSERT INTO vault_credentials (user_id) VALUES ($1)', [user.id])

    // Create email verification entry
    await run(
      'INSERT INTO email_verifications (user_id, token) VALUES ($1, $2)',
      [user.id, verifyToken]
    )

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'}/verify?token=${verifyToken}`
    await sendVerificationEmail(email, verifyUrl, lang)

    return NextResponse.json({ ok: true, message: m.verificationSent })
  } catch (e: unknown) {
    console.error('Register error:', e)
    return NextResponse.json({ error: m.generic }, { status: 500 })
  }
}