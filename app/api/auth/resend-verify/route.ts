import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const { data: user } = await supabaseAdmin
      .from('vault_users')
      .select('id, email, email_confirmed')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (!user) {
      // Don't reveal whether the user exists
      return NextResponse.json({ ok: true })
    }

    if (user.email_confirmed) {
      return NextResponse.json({ ok: true, message: 'Email already confirmed' })
    }

    // Generate new verification token
    const verifyToken = crypto.randomBytes(32).toString('hex')

    await supabaseAdmin
      .from('vault_users')
      .update({ verify_token: verifyToken })
      .eq('id', user.id)

    // Delete old verification tokens and create new one
    await supabaseAdmin.from('email_verifications').delete().eq('user_id', user.id)
    await supabaseAdmin.from('email_verifications').insert({ user_id: user.id, token: verifyToken })

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'}/verify?token=${verifyToken}`
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

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: err }, { status: 500 })
  }
}