import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect('https://vault-vercel.vercel.app/vault.html?gcal=error')
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: 'https://vault-vercel.vercel.app/api/auth/google/callback',
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect('https://vault-vercel.vercel.app/vault.html?gcal=error')
  }

  const tokens = await tokenRes.json()

  // Get JWT user
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.redirect('https://vault-vercel.vercel.app/login')
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.redirect('https://vault-vercel.vercel.app/login')

  // Store tokens in vault_credentials
  await supabaseAdmin
    .from('vault_credentials')
    .update({
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token || null,
      google_token_expiry: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        : null,
    })
    .eq('user_id', payload.sub)

  return NextResponse.redirect('https://vault-vercel.vercel.app/vault.html?gcal=connected')
}
