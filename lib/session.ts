import { verifyToken } from '@/lib/auth-jwt'
import { queryOne } from '@/lib/postgres'

// verifyToken only proves the cookie was signed by us. This also checks it was issued
// after the user's last "sign out everywhere" or password reset (users.token_version),
// so a stolen or old cookie stops working the moment they do either.
export async function verifySession(token: string | undefined | null): Promise<{ sub: string; email: string } | null> {
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null
  const userId = Number(payload.sub)
  if (!Number.isInteger(userId) || userId <= 0) return null
  const row = await queryOne<{ token_version: number }>('SELECT token_version FROM users WHERE id = $1', [userId])
  if (!row || (row.token_version ?? 0) !== payload.tv) return null
  return { sub: payload.sub, email: payload.email }
}
