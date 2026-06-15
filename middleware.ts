import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/verify',
  '/onboarding',
]

const STATIC_RE = /\.(ico|png|svg|jpg|jpeg|webp|gif|txt|xml|html|css|js|woff|woff2|ttf)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // All API routes handle their own auth
  if (pathname.startsWith('/api/')) return NextResponse.next()

  // Static files + Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon' ||
    pathname.startsWith('/icon.') ||
    STATIC_RE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Public pages
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Protected pages — check JWT
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !verifyToken(token)) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
