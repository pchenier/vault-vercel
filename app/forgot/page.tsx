'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AuthShell, AuthTitle } from '@/components/auth-shell'
import { useI18n } from '@/lib/i18n/client'

export default function ForgotPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.ok) setSent(true)
      else setError(data.error || t.forgot.generic)
    } catch {
      setError(t.auth.networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <title>{t.forgot.title}</title>
      {sent ? (
        <>
          <AuthTitle sub={t.forgot.sentSub(<strong>{email}</strong>)}>
            {t.forgot.sentHeading((s) => <em>{s}</em>)}
          </AuthTitle>
          <p className="auth-legal" style={{ marginTop: 0 }}>{t.forgot.spam}</p>
          <button type="button" className="auth-btn ghost" style={{ marginTop: 18 }} onClick={() => setSent(false)}>
            {t.forgot.another}
          </button>
        </>
      ) : (
        <>
          <AuthTitle sub={t.forgot.sub}>
            {t.forgot.heading((s) => <em>{s}</em>)}
          </AuthTitle>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} style={{ marginTop: error ? 18 : 0 }}>
            <label className="auth-field">
              <span>{t.auth.email}</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? t.forgot.submitting : t.forgot.submit}
            </button>
          </form>
        </>
      )}
      <div className="auth-foot">
        {t.forgot.remembered} <Link href="/login">{t.forgot.signIn}</Link>
      </div>
    </AuthShell>
  )
}
