import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
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
    console.error('Token exchange failed:', await tokenRes.text())
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`)
  }

  const tokens = await tokenRes.json()

  // Get user info from Google
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  if (!userRes.ok) {
    console.error('User info fetch failed:', await userRes.text())
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`)
  }

  const googleUser = await userRes.json()
  const email = googleUser.email?.toLowerCase().trim()
  const name = googleUser.name || googleUser.given_name || ''

  if (!email) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_no_email`)
  }

  // Check if user exists
  const { data: existingUser } = await supabaseAdmin
    .from('vault_users')
    .select('id, email, email_confirmed')
    .eq('email', email)
    .single()

  let userId: string

  if (existingUser) {
    // Existing user — log them in
    userId = existingUser.id

    // If they weren't email-confirmed yet, confirm them now (Google verified the email)
    if (!existingUser.email_confirmed) {
      await supabaseAdmin
        .from('vault_users')
        .update({ email_confirmed: true })
        .eq('id', userId)
    }

    // Update name if they don't have one
    if (name && !existingUser.email) {
      await supabaseAdmin
        .from('vault_users')
        .update({ name })
        .eq('id', userId)
    }
  } else {
    // New user — create account with email_confirmed=true (Google verified)
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('vault_users')
      .insert({
        email,
        password_hash: null,
        name,
        email_confirmed: true,
        newsletter: false,
        verify_token: null,
      })
      .select('id, email')
      .single()

    if (createError || !newUser) {
      console.error('Failed to create user:', createError)
      return NextResponse.redirect(`${baseUrl}/login?error=account_creation_failed`)
    }

    userId = newUser.id

    // Create vault_credentials row
    await supabaseAdmin
      .from('vault_credentials')
      .insert({ user_id: userId })
  }

  // Check if user has plaid_token to determine redirect
  const { data: creds } = await supabaseAdmin
    .from('vault_credentials')
    .select('plaid_token')
    .eq('user_id', userId)
    .single()

  const redirectTo = creds?.plaid_token ? 'https://app.fiscit.com/' : `${baseUrl}/onboarding`

  // Sign JWT and set cookie
  const token = signToken(userId, email)
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