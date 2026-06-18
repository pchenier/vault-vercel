import { NextRequest, NextResponse } from 'next/server'
import { queryOne, run } from '@/lib/postgres'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    console.error('Google auth callback: error or no code', { error, code: !!code })
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`)
  }

  const redirectUri = `${baseUrl}/api/auth/google-signin/callback`

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const errBody = await tokenRes.text()
    console.error('Token exchange failed:', tokenRes.status, errBody)
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`)
  }

  const tokens = await tokenRes.json()

  // Get user info from Google
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  if (!userRes.ok) {
    const errBody = await userRes.text()
    console.error('User info fetch failed:', userRes.status, errBody)
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`)
  }

  const googleUser = await userRes.json()
  const email = googleUser.email?.toLowerCase().trim()
  const name = googleUser.name || googleUser.given_name || ''

  if (!email) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_no_email`)
  }

  // Check if user exists
  const existingUser = await queryOne<{ id: number; email: string; email_confirmed: boolean; name: string | null }>(
    'SELECT id, email, email_confirmed, name FROM users WHERE email = $1',
    [email]
  )

  let userId: number

  if (existingUser) {
    // Existing user — log them in
    userId = existingUser.id

    // If they weren't email-confirmed yet, confirm them now (Google verified the email)
    if (!existingUser.email_confirmed) {
      await run('UPDATE users SET email_confirmed = true WHERE id = $1', [userId])
    }

    // Update name if they don't have one
    if (name && !existingUser.name) {
      await run('UPDATE users SET name = $1 WHERE id = $2', [name, userId])
    }
  } else {
    // New user — create account with email_confirmed=true (Google verified)
    const newUser = await queryOne<{ id: number; email: string }>(
      `INSERT INTO users (email, password_hash, name, email_confirmed, newsletter, verify_token, google_id)
       VALUES ($1, NULL, $2, true, false, NULL, $3)
       RETURNING id, email`,
      [email, name, googleUser.sub || null]
    )

    if (!newUser) {
      console.error('Failed to create user')
      return NextResponse.redirect(`${baseUrl}/login?error=account_creation_failed`)
    }

    userId = newUser.id

    // Create vault_credentials row
    await run('INSERT INTO vault_credentials (user_id) VALUES ($1)', [userId])
  }

  // Check if user has plaid_token to determine redirect
  const creds = await queryOne<{ plaid_token: string | null }>(
    'SELECT plaid_token FROM vault_credentials WHERE user_id = $1',
    [userId]
  )

  const redirectTo = creds?.plaid_token ? 'https://app.fiscit.com/' : `${baseUrl}/onboarding`

  // Sign JWT and set cookie
  const token = signToken(String(userId), email)
  const response = NextResponse.redirect(redirectTo)
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
  return response
}