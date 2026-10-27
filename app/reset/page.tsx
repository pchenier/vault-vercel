'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AuthShell, AuthTitle } from '@/components/auth-shell'

export default function ResetPage() {
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Take the token out of the address bar right away, so it isn't left in history
    // (only when present: React re-runs effects in development, after the URL is clean)
    const t = new URLSearchParams(window.location.search).get('token')
    if (t) {
      setToken(t)
      window.history.replaceState({}, '', '/reset')
    } else {
      setToken(prev => prev ?? '')
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError("The two passwords don't match.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.ok) setDone(true)
      else setError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (token === null) return null

  if (done) {
    return (
      <AuthShell>
        <title>Fiscit — Password updated</title>
        <AuthTitle sub="Your new password is set, and every other device has been signed out.">
          All <em>set.</em>
        </AuthTitle>
        {/* /login sends a signed-in user straight on to the dashboard */}
        <a className="auth-btn" href="/login" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Continue to Fiscit
        </a>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <title>Fiscit — Choose a new password</title>
      <AuthTitle sub="At least 8 characters. Signing in with the new password will work everywhere; old sessions are signed out.">
        Choose a new <em>password.</em>
      </AuthTitle>
      {error && <div className="auth-error" role="alert">{error}</div>}
      {!token ? (
        <div className="auth-error" role="alert">
          This link is missing its code. Open the link from your email again, or <Link href="/forgot" className="auth-link">request a new one</Link>.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: error ? 18 : 0 }}>
          <label className="auth-field">
            <span>New password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
          <label className="auth-field">
            <span>Confirm password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </label>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      )}
      <div className="auth-foot">
        Link expired? <Link href="/forgot">Send a new one</Link>
      </div>
    </AuthShell>
  )
}
