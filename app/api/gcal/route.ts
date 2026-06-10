import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth-jwt'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error('Failed to refresh token')
  return res.json()
}

export async function GET() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get(COOKIE_NAME)?.value
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(jwt)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: creds } = await supabaseAdmin
    .from('vault_credentials')
    .select('google_access_token, google_refresh_token, google_token_expiry')
    .eq('user_id', payload.sub)
    .single()

  if (!creds?.google_access_token && !creds?.google_refresh_token) {
    return NextResponse.json({ connected: false, events: [] })
  }

  let accessToken = creds.google_access_token

  // Refresh if expired
  const expiry = creds.google_token_expiry ? new Date(creds.google_token_expiry) : null
  if (expiry && Date.now() > expiry.getTime() - 60000 && creds.google_refresh_token) {
    try {
      const refreshed = await refreshAccessToken(creds.google_refresh_token)
      accessToken = refreshed.access_token
      await supabaseAdmin
        .from('vault_credentials')
        .update({
          google_access_token: accessToken,
          google_token_expiry: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        })
        .eq('user_id', payload.sub)
    } catch {
      return NextResponse.json({ connected: false, events: [] })
    }
  }

  // Fetch events — next 60 days + past 30 days
  const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const timeMax = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=250`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!res.ok) throw new Error('Calendar fetch failed')
    const data = await res.json()

    const events = (data.items || []).map((e: any) => ({
      id: e.id,
      title: e.summary || '(no title)',
      start: e.start?.dateTime || e.start?.date || '',
      end: e.end?.dateTime || e.end?.date || '',
      allDay: !e.start?.dateTime,
      color: e.colorId ? `var(--gcal-${e.colorId})` : '#4285f4',
      location: e.location || '',
      description: e.description || '',
    }))

    return NextResponse.json({ connected: true, events })
  } catch {
    return NextResponse.json({ connected: false, events: [] })
  }
}
