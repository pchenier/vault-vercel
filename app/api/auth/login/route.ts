import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/postgres'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await queryOne<{ id: number; email: string; password_hash: string | null; email_confirmed: boolean }>(
      'SELECT id, email, password_hash, email_confirmed FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.email_confirmed) {
      return NextResponse.json({ error: 'Please confirm your email address before signing in. Check your inbox for the verification link.', needsVerification: true }, { status: 403 })
    }

    const creds = await queryOne<{ plaid_token: string | null }>(
      'SELECT plaid_token FROM vault_credentials WHERE user_id = $1',
      [user.id]
    )

    const redirectTo = creds?.plaid_token ? 'https://app.fiscit.com/' : '/onboarding'

    const token = signToken(String(user.id), user.email)
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