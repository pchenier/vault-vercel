import { NextResponse } from 'next/server'
import { run } from '@/lib/postgres'
import { rateLimited, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    if (await rateLimited(`waitlist-ip:${clientIp(request)}`, 5, 3600)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    await run(
      'INSERT INTO vault_waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email.toLowerCase().trim()]
    )
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error('Waitlist error:', e)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}