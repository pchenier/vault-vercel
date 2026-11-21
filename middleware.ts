import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'

// Pages that need a session. Everything else is public, so a mistyped URL gets the
// 404 page instead of a sign-in redirect. (Data is protected by the API routes, which
// all check the session themselves.)
const PROTECTED_PATHS = ['/import']

const TRUSTED_ORIGINS = new Set(['https://fiscit.com', 'https://www.fiscit.com'])

const STATIC_RE = /\.(ico|png|svg|jpg|jpeg|webp|gif|txt|xml|html|css|js|woff|woff2|ttf)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // All API routes handle their own auth. Mutating calls must come from our own
  // pages: browsers always send Origin on cross-site POST/PUT/DELETE, so this
  // blocks CSRF even where SameSite=Lax would not (e.g. other *.fiscit.com hosts).
  if (pathname.startsWith('/api/')) {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.headers.get('origin')
      if (origin && origin !== request.nextUrl.origin && !TRUSTED_ORIGINS.has(origin)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    return NextResponse.next()
  }

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

  if (!PROTECTED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
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
