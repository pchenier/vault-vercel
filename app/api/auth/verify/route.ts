import { NextResponse } from 'next/server'
import { queryOne, run } from '@/lib/postgres'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=missing_token', request.url))
    }

    // Find the verification token
    const verification = await queryOne<{ id: number; user_id: number; token: string; expires_at: Date }>(
      'SELECT id, user_id, token, expires_at FROM email_verifications WHERE token = $1',
      [token]
    )

    if (!verification) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    // Check if expired
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/login?error=expired_token', request.url))
    }

    // Mark user as confirmed
    const user = await queryOne<{ id: number; email: string }>(
      `UPDATE users SET email_confirmed = true, verify_token = NULL, updated_at = NOW() 
       WHERE id = $1 
       RETURNING id, email`,
      [verification.user_id]
    )

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user_not_found', request.url))
    }

    // Delete the verification token
    await run('DELETE FROM email_verifications WHERE id = $1', [verification.id])

    // Check if user has Plaid credentials (onboarding needed?)
    const creds = await queryOne<{ plaid_token: string | null }>(
      'SELECT plaid_token FROM vault_credentials WHERE user_id = $1',
      [user.id]
    )

    // Sign in the user automatically
    const jwt = signToken(String(user.id), user.email)
    const redirectTo = creds?.plaid_token ? 'https://app.fiscit.com/' : '/onboarding'

    const response = NextResponse.redirect(new URL(redirectTo, request.url))
    response.cookies.set(COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
    return response
  } catch (e) {
    console.error('Verify error:', e)
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}