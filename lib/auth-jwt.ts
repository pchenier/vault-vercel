// lib/auth-jwt.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
const COOKIE = 'vault_session'

export function signToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, SECRET, { expiresIn: '365d' })
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    return jwt.verify(token, SECRET) as { sub: string; email: string }
  } catch {
    return null
  }
}

export const COOKIE_NAME = COOKIE