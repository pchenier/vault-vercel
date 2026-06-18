// lib/postgres.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('rlwy.net') ? { rejectUnauthorized: false } : undefined,
})

export { pool }

// Helper: run a query and return rows
export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const { rows } = await pool.query<T>(text, params)
  return rows
}

// Helper: run a query and return first row (or null)
export async function queryOne<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}

// Helper: run an INSERT/UPDATE/DELETE and return metadata
export async function run(text: string, params?: unknown[]): Promise<void> {
  await pool.query(text, params)
}