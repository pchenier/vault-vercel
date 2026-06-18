import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { queryOne, run } from '@/lib/postgres'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email: rawEmail, password, name, newsletter } = await request.json()
    const email = rawEmail?.toLowerCase().trim()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await queryOne<{ id: number; email_confirmed: boolean }>(
      'SELECT id, email_confirmed FROM users WHERE email = $1',
      [email]
    )

    if (existing) {
      if (existing.email_confirmed) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
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
      if (resend) {
        try {
          await resend.emails.send({
            from: 'Fiscit <no-reply@fiscit.com>',
            to: email,
            subject: 'Confirm your Fiscit account',
            html: `<div style="max-width:480px;margin:0 auto;font-family:Inter,-apple-system,sans-serif;background:#111;border-radius:16px;padding:2.5rem;text-align:center;color:#f4f4f5">
<div style="font-size:1.5rem;font-weight:700;color:#4ade80;margin-bottom:0.5rem">Fiscit</div>
<h1 style="font-size:1.25rem;font-weight:600;margin-bottom:1rem;color:#f4f4f5">Confirm your email</h1>
<p style="color:#a1a1aa;margin-bottom:2rem">Click the button below to verify your email address and start using Fiscit.</p>
<a href="${verifyUrl}" style="display:inline-block;padding:0.875rem 2rem;background:#4ade80;color:#080808;font-weight:700;font-size:1rem;border-radius:8px;text-decoration:none">Confirm Email</a>
<p style="color:#52525b;font-size:0.8rem;margin-top:2rem">This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>
</div>`,
          })
        } catch (e) {
          console.error('Failed to send verification email:', e)
        }
      } else {
        console.log('RESEND: Verification URL for', email, ':', verifyUrl)
      }

      return NextResponse.json({ ok: true, message: 'Verification email sent. Please check your inbox.' })
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
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
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
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Fiscit <no-reply@fiscit.com>',
          to: email,
          subject: 'Confirm your Fiscit account',
          html: `<div style="max-width:480px;margin:0 auto;font-family:Inter,-apple-system,sans-serif;background:#111;border-radius:16px;padding:2.5rem;text-align:center;color:#f4f4f5">
<div style="font-size:1.5rem;font-weight:700;color:#4ade80;margin-bottom:0.5rem">Fiscit</div>
<h1 style="font-size:1.25rem;font-weight:600;margin-bottom:1rem;color:#f4f4f5">Confirm your email</h1>
<p style="color:#a1a1aa;margin-bottom:2rem">Click the button below to verify your email address and start using Fiscit.</p>
<a href="${verifyUrl}" style="display:inline-block;padding:0.875rem 2rem;background:#4ade80;color:#080808;font-weight:700;font-size:1rem;border-radius:8px;text-decoration:none">Confirm Email</a>
<p style="color:#52525b;font-size:0.8rem;margin-top:2rem">This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>
</div>`,
        })
      } catch (e) {
        console.error('Failed to send verification email:', e)
      }
    } else {
      console.log('RESEND: Verification URL for', email, ':', verifyUrl)
    }

    return NextResponse.json({ ok: true, message: 'Verification email sent. Please check your inbox.' })
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: err }, { status: 500 })
  }
}