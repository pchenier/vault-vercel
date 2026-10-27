// lib/auth-jwt.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
const COOKIE = 'vault_session'
const SSO_AUDIENCE = 'fiscit-sso'

// The Flask dashboard. (NEXT_PUBLIC_APP_URL is this site itself — fiscit.com.)
export const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://app.fiscit.com'

// tv = users.token_version when issued; bumping it revokes every session (lib/session.ts)
export function signToken(userId: string, email: string, tv: number): string {
  return jwt.sign({ sub: userId, email, tv }, SECRET, { algorithm: 'HS256', expiresIn: '365d' })
}

// Short-lived, single-use token for the hop to the Flask dashboard. It travels in
// a URL, so it is never the session token: it carries aud=fiscit-sso (Flask's /sso
// requires it and its Bearer auth rejects it) and a jti Flask records once used.
export function signHandoffToken(userId: string, email: string, tv: number): string {
  return jwt.sign({ sub: userId, email, tv }, SECRET, {
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: SSO_AUDIENCE,
    jwtid: globalThis.crypto.randomUUID(),
  })
}

export function appSsoUrl(userId: string, email: string, tv: number): string {
  return `${DASHBOARD_URL}/sso?token=${encodeURIComponent(signHandoffToken(userId, email, tv))}`
}

// Session tokens only: a handoff token (which has an audience) is not a session.
// Signature and expiry only; API routes use verifySession, which also checks revocation.
export function verifyToken(token: string): { sub: string; email: string; tv: number } | null {
  try {
    const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] }) as jwt.JwtPayload
    if (payload.aud !== undefined || typeof payload.sub !== 'string') return null
    return { sub: payload.sub, email: String(payload.email ?? ''), tv: Number(payload.tv ?? 0) }
  } catch {
    return null
  }
}

export const COOKIE_NAME = COOKIE
