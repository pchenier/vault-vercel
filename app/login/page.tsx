'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthShell, AuthTitle, AuthSpinner, GoogleButton } from '@/components/auth-shell'
import { useI18n } from '@/lib/i18n/client'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://app.fiscit.com'

export default function LoginPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  useEffect(() => {
    // Show error from URL params (e.g. google_auth_failed)
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err) {
      setError(t.login.urlErrors[err] || t.login.unknownError)
      // Clean URL
      window.history.replaceState({}, '', '/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once, on arrival
  }, [])

  useEffect(() => {
    // Auto-redirect if already logged in
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.user && data.token) {
          window.location.href = data.user.onboarded
            ? `${DASHBOARD_URL}/sso?token=${encodeURIComponent(data.token)}`
            : '/onboarding'
        } else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.ok) {
        // redirectTo is either /onboarding or the app's /sso URL with a handoff token
        window.location.href = data.redirectTo || '/onboarding'
      } else {
        setError(data.error || t.login.failed)
        if (data.needsVerification) setNeedsVerification(true)
      }
    } catch {
      setError(t.auth.networkError)
    } finally {
      setLoading(false)
    }
  }

  if (checking) return <AuthSpinner />

  return (
    <AuthShell>
      <title>{t.login.title}</title>
      <AuthTitle sub={t.login.sub}>
        {t.login.heading((s) => <em>{s}</em>)}
      </AuthTitle>

      <GoogleButton label={t.login.google} />
      <div className="auth-divider">{t.auth.or}</div>

      {error && <div className="auth-error" role="alert">{error}</div>}

      {needsVerification && !resendSent && (
        <button type="button" className="auth-btn ghost" onClick={async () => {
          const res = await fetch('/api/auth/resend-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          })
          if (res.ok) setResendSent(true)
        }}>
          {t.login.resend}
        </button>
      )}
      {resendSent && <div className="auth-ok">{t.login.resendSent}</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: error || needsVerification ? 18 : 0 }}>
        <label className="auth-field">
          <span>{t.auth.email}</span>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label className="auth-field">
          <span>{t.auth.password}</span>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <div className="auth-forgot"><Link href="/forgot" className="auth-link">{t.login.forgot}</Link></div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? t.login.submitting : t.login.submit}
        </button>
      </form>

      <div className="auth-foot">
        {t.login.noAccount} <Link href="/register">{t.login.createOne}</Link>
      </div>
      <p className="auth-legal"><Link href="/privacy">{t.common.privacy}</Link> · <Link href="/terms">{t.common.terms}</Link></p>
    </AuthShell>
  )
}
