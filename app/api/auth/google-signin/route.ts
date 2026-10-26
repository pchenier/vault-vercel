import { NextResponse } from 'next/server'
import { newOAuthState } from '@/lib/oauth-state'

const SCOPES = [
  'openid',
  'email',
  'profile',
].join(' ')

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fiscit.com'
  const redirectUri = `${baseUrl}/api/auth/google-signin/callback`

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'online',
    prompt: 'select_account',
  })
  const response = NextResponse.redirect('https://accounts.google.com/o/oauth2/v2/auth')
  params.set('state', newOAuthState(response))
  response.headers.set('Location', `https://accounts.google.com/o/oauth2/v2/auth?${params}`)
  return response
}