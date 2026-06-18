import { NextResponse } from 'next/server'
import { queryOne, run } from '@/lib/postgres'
import { signToken, COOKIE_NAME } from '@/lib/auth-jwt'

export async function GET() {
  // Just redirect to logout page — this clears the cookie client-side
  return NextResponse.json({ ok: true })
}

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}