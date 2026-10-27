import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

// For Better Stack uptime checks: 200 when the site can reach the database.
export async function GET() {
  try {
    await queryOne('SELECT 1 AS ok')
    return new NextResponse('OK', { status: 200, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return new NextResponse('DB error', { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
