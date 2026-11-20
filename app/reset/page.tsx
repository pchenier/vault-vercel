'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AuthShell, AuthTitle } from '@/components/auth-shell'
import { useI18n } from '@/lib/i18n/client'

export default function ResetPage() {
  const { t } = useI18n()
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
      setError(t.reset.mismatch)
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
      else setError(data.error || t.reset.generic)
    } catch {
      setError(t.auth.networkError)
    } finally {
      setLoading(false)
    }
  }

  if (token === null) return null

  if (done) {
    return (
      <AuthShell>
        <title>{t.reset.doneTitle}</title>
        <AuthTitle sub={t.reset.doneSub}>
          {t.reset.doneHeading((s) => <em>{s}</em>)}
        </AuthTitle>
        {/* /login sends a signed-in user straight on to the dashboard */}
        <a className="auth-btn" href="/login" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          {t.reset.continue}
        </a>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <title>{t.reset.title}</title>
      <AuthTitle sub={t.reset.sub}>
        {t.reset.heading((s) => <em>{s}</em>)}
      </AuthTitle>
      {error && <div className="auth-error" role="alert">{error}</div>}
      {!token ? (
        <div className="auth-error" role="alert">
          {t.reset.missingToken((s) => <Link href="/forgot" className="auth-link">{s}</Link>)}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: error ? 18 : 0 }}>
          <label className="auth-field">
            <span>{t.reset.newPassword}</span>
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
            <span>{t.reset.confirmPassword}</span>
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
            {loading ? t.reset.submitting : t.reset.submit}
          </button>
        </form>
      )}
      <div className="auth-foot">
        {t.reset.expired} <Link href="/forgot">{t.reset.sendNew}</Link>
      </div>
    </AuthShell>
  )
}
