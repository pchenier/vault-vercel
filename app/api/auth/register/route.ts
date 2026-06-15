import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password, newsletter } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('vault_users')
      .select('id, email_confirmed')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.email_confirmed) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
      }
      // Unconfirmed user — resend verification
      const verifyToken = crypto.randomBytes(32).toString('hex')
      await supabaseAdmin
        .from('vault_users')
        .update({ verify_token: verifyToken, password_hash: await bcrypt.hash(password, 12), newsletter: !!newsletter })
        .eq('id', existing.id)
      await supabaseAdmin
        .from('email_verifications')
        .delete()
        .eq('user_id', existing.id)
      await supabaseAdmin
        .from('email_verifications')
        .insert({ user_id: existing.id, token: verifyToken })

      // Send verification email
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'}/verify?token=${verifyToken}`
      if (resend) {
        try {
          await resend.emails.send({
            from: 'Fiscit <no-reply@fiscit.com>',
            to: email.toLowerCase().trim(),
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

    const { data: user, error } = await supabaseAdmin
      .from('vault_users')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: hash,
        email_confirmed: false,
        newsletter: !!newsletter,
        verify_token: verifyToken,
      })
      .select('id, email')
      .single()

    if (error || !user) {
      console.error('Failed to create user:', error)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    await supabaseAdmin.from('vault_credentials').insert({ user_id: user.id })
    await supabaseAdmin.from('email_verifications').insert({ user_id: user.id, token: verifyToken })

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'}/verify?token=${verifyToken}`
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Fiscit <no-reply@fiscit.com>',
          to: email.toLowerCase().trim(),
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