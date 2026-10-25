import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth-jwt'

function clearSession(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}

// Browser navigation (e.g. from app.fiscit.com after deleting an account):
// clear the fiscit.com session and land on the home page.
export async function GET(request: Request) {
  return clearSession(NextResponse.redirect(new URL('/', request.url)))
}

export async function POST() {
  return clearSession(NextResponse.json({ ok: true }))
}
