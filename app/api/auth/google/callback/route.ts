import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { run } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/vault.html?gcal=error`)
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`

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
    return NextResponse.redirect(`${baseUrl}/vault.html?gcal=error`)
  }

  const tokens = await tokenRes.json()

  // Get JWT user
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.redirect(`${baseUrl}/login`)
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.redirect(`${baseUrl}/login`)

  // Store tokens in vault_credentials
  await run(
    `UPDATE vault_credentials SET
      google_access_token = $1,
      google_refresh_token = $2,
      google_token_expiry = $3
    WHERE user_id = $4`,
    [
      tokens.access_token,
      tokens.refresh_token || null,
      tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        : null,
      Number(payload.sub),
    ]
  )

  return NextResponse.redirect(`${baseUrl}/vault.html?gcal=connected`)
}