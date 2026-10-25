// lib/auth-jwt.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
const COOKIE = 'vault_session'

// The Flask dashboard. (NEXT_PUBLIC_APP_URL is this site itself — fiscit.com.)
export const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://app.fiscit.com'

export function signToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, SECRET, { expiresIn: '365d' })
}

// Short-lived token for the one-time hop to the Flask dashboard. It travels in
// a URL, so it must not be the 365-day session token. Flask's /sso verifies it
// with the same JWT_SECRET (set identically in Vercel and Railway).
export function signHandoffToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, SECRET, { expiresIn: '5m' })
}

export function appSsoUrl(userId: string, email: string): string {
  return `${DASHBOARD_URL}/sso?token=${encodeURIComponent(signHandoffToken(userId, email))}`
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    return jwt.verify(token, SECRET) as { sub: string; email: string }
  } catch {
    return null
  }
}

export const COOKIE_NAME = COOKIE
