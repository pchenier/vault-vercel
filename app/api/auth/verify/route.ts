import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
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
    const { data: verification } = await supabaseAdmin
      .from('email_verifications')
      .select('id, user_id, token, expires_at')
      .eq('token', token)
      .single()

    if (!verification) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    // Check if expired
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/login?error=expired_token', request.url))
    }

    // Mark user as confirmed
    const { data: user } = await supabaseAdmin
      .from('vault_users')
      .update({ email_confirmed: true, verify_token: null, updated_at: new Date().toISOString() })
      .eq('id', verification.user_id)
      .select('id, email')
      .single()

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user_not_found', request.url))
    }

    // Delete the verification token
    await supabaseAdmin.from('email_verifications').delete().eq('id', verification.id)

    // Check if user has Plaid credentials (onboarding needed?)
    const { data: creds } = await supabaseAdmin
      .from('vault_credentials')
      .select('plaid_token')
      .eq('user_id', user.id)
      .single()

    // Sign in the user automatically
    const jwt = signToken(user.id, user.email)
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