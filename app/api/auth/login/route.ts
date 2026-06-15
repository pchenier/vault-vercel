import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const { data: user } = await supabaseAdmin
      .from('vault_users')
      .select('id, email, password_hash, email_confirmed')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.email_confirmed) {
      return NextResponse.json({ error: 'Please confirm your email address before signing in. Check your inbox for the verification link.', needsVerification: true }, { status: 403 })
    }

    const { data: creds } = await supabaseAdmin
      .from('vault_credentials')
      .select('plaid_token')
      .eq('user_id', user.id)
      .single()

    const redirectTo = creds?.plaid_token ? 'https://app.fiscit.com/' : '/onboarding'

    const token = signToken(user.id, user.email)
    const response = NextResponse.json({ ok: true, redirectTo })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
    return response
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: err }, { status: 500 })
  }
}