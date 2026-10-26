'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthShell, AuthTitle, AuthSpinner, GoogleButton } from '@/components/auth-shell'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://app.fiscit.com'

export default function LoginPage() {
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
      const messages: Record<string, string> = {
        google_auth_failed: 'Google sign in failed. Please try again.',
        google_no_email: 'No email found in your Google account.',
        account_creation_failed: 'Failed to create account. Please try again.',
      }
      setError(messages[err] || 'An error occurred. Please try again.')
      // Clean URL
      window.history.replaceState({}, '', '/login')
    }
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
        setError(data.error || 'Login failed')
        if (data.needsVerification) setNeedsVerification(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return <AuthSpinner />

  return (
    <AuthShell>
      <title>Fiscit — Sign in</title>
      <AuthTitle sub="Sign in to see where your money stands.">
        Welcome <em>back.</em>
      </AuthTitle>

      <GoogleButton label="Continue with Google" />
      <div className="auth-divider">or</div>

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
          Resend verification email
        </button>
      )}
      {resendSent && <div className="auth-ok">Verification email sent! Check your inbox.</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: error || needsVerification ? 18 : 0 }}>
        <label className="auth-field">
          <span>Email</span>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label className="auth-field">
          <span>Password</span>
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
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="auth-foot">
        No account? <Link href="/register">Create one</Link>
      </div>
      <p className="auth-legal"><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></p>
    </AuthShell>
  )
}
