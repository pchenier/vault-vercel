import { NextResponse } from 'next/server'
import { run } from '@/lib/postgres'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    await run(
      'INSERT INTO vault_waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email.toLowerCase().trim()]
    )
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: err }, { status: 500 })
  }
}