import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/postgres'
import { signToken, appSsoUrl, COOKIE_NAME } from '@/lib/auth-jwt'
import { rateLimited, clientIp } from '@/lib/rate-limit'

// Compared against when the email is unknown, so timing doesn't reveal which accounts exist
const DUMMY_HASH = bcrypt.hashSync('fiscit-timing-dummy', 12)

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const ip = clientIp(request)
    if (await rateLimited(`login:${ip}:${email.toLowerCase().trim()}`, 8, 900) || await rateLimited(`login-ip:${ip}`, 40, 900)) {
      return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes and try again.' }, { status: 429 })
    }

    const user = await queryOne<{ id: number; email: string; password_hash: string | null; email_confirmed: boolean; token_version: number }>(
      'SELECT id, email, password_hash, email_confirmed, token_version FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    if (!user || !user.password_hash) {
      await bcrypt.compare(password, DUMMY_HASH)
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

    const redirectTo = creds?.plaid_token ? appSsoUrl(String(user.id), user.email, user.token_version) : '/onboarding'

    const token = signToken(String(user.id), user.email, user.token_version)
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
    console.error('Login error:', e)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}