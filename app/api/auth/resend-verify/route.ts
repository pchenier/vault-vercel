import { NextResponse } from 'next/server'
import { rateLimited, clientIp } from '@/lib/rate-limit'
import crypto from 'crypto'
import { queryOne, run } from '@/lib/postgres'
import { sendVerificationEmail } from '@/lib/email'
import { langFromRequest } from '@/lib/i18n/server'
import { serverMessages } from '@/lib/i18n/server-messages'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const lang = langFromRequest(request)
  const m = serverMessages(lang).api
  try {
    const { email: rawEmail } = await request.json()
    const email = rawEmail?.toLowerCase().trim()
    if (!email) {
      return NextResponse.json({ error: m.emailRequired }, { status: 400 })
    }
    if (await rateLimited(`resend:${email}`, 3, 3600) || await rateLimited(`resend-ip:${clientIp(request)}`, 10, 3600)) {
      return NextResponse.json({ error: m.tooManyResend }, { status: 429 })
    }

    const user = await queryOne<{ id: number; email: string; email_confirmed: boolean }>(
      'SELECT id, email, email_confirmed FROM users WHERE email = $1',
      [email]
    )

    if (!user) {
      return NextResponse.json({ ok: true })
    }

    if (user.email_confirmed) {
      return NextResponse.json({ ok: true, message: m.alreadyConfirmed })
    }

    const verifyToken = crypto.randomBytes(32).toString('hex')

    await run(
      'UPDATE users SET verify_token = $1 WHERE id = $2',
      [verifyToken, user.id]
    )

    await run('DELETE FROM email_verifications WHERE user_id = $1', [user.id])
    await run(
      'INSERT INTO email_verifications (user_id, token) VALUES ($1, $2)',
      [user.id, verifyToken]
    )

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'}/verify?token=${verifyToken}`
    await sendVerificationEmail(email, verifyUrl, lang)

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: err }, { status: 500 })
  }
}