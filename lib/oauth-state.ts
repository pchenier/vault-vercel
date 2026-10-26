// OAuth `state`: ties the Google callback to the browser that started the
// flow, so nobody can make a victim's browser complete *their* login or attach
// *their* calendar (login CSRF).
import { randomBytes, timingSafeEqual } from 'crypto'
import type { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'oauth_state'

export function newOAuthState(response: NextResponse): string {
  const state = randomBytes(24).toString('base64url')
  response.cookies.set(COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax', // must survive the top-level redirect back from Google
    maxAge: 600,
    path: '/api/auth',
  })
  return state
}

export function checkOAuthState(request: NextRequest, response: NextResponse): boolean {
  const expected = request.cookies.get(COOKIE)?.value ?? ''
  const got = request.nextUrl.searchParams.get('state') ?? ''
  response.cookies.set(COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/api/auth' })
  if (!expected || expected.length !== got.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(got))
}
