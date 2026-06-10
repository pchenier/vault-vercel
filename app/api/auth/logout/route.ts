import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth-jwt'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'https://vault-vercel.vercel.app')
  )
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}
