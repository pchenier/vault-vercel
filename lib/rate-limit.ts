// Small Postgres-backed rate limiter (serverless instances share no memory).
// Each call records one hit for `key` and says whether it is over `limit`
// hits in the last `windowSeconds`.
import { query, run } from '@/lib/postgres'

let ready: Promise<void> | null = null

function ensureTable() {
  ready ??= run(`CREATE TABLE IF NOT EXISTS rate_limit_hits (
      key TEXT NOT NULL,
      at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS rate_limit_hits_key_at ON rate_limit_hits (key, at)`).catch((e) => {
    ready = null
    throw e
  })
  return ready
}

export async function rateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    await ensureTable()
    await run('INSERT INTO rate_limit_hits (key) VALUES ($1)', [key])
    const rows = await query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM rate_limit_hits WHERE key = $1 AND at > NOW() - make_interval(secs => $2)`,
      [key, windowSeconds]
    )
    // Opportunistic cleanup of old rows
    if (Math.random() < 0.02) await run(`DELETE FROM rate_limit_hits WHERE at < NOW() - INTERVAL '1 day'`)
    return Number(rows[0]?.n ?? 0) > limit
  } catch (e) {
    // Never lock everyone out because the limiter itself failed
    console.error('rate limiter error', e)
    return false
  }
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for') ?? ''
  return fwd.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
}
