import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST() {
  // Stateless — just signal ready, client will re-fetch /api/data
  return NextResponse.json({ status: 'ok' })
}
