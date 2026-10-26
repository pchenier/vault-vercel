'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { AuthShell, AuthTitle, GoogleButton } from '@/components/auth-shell'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [newsletter, setNewsletter] = useState(false) // opt-in must start unchecked (CASL)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, newsletter })
      })
      const data = await res.json()
      if (data.ok) {
        setSent(true)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthShell stepKey="sent">
        <title>Fiscit — Check your email</title>
        <div className="auth-icon"><Mail size={24} /></div>
        <AuthTitle sub={<>We sent a confirmation link to <b style={{ color: 'var(--text)' }}>{email}</b>. Click it to verify your account and get started.</>}>
          Check your <em>inbox.</em>
        </AuthTitle>
        <div className="auth-foot" style={{ marginTop: 0 }}>
          Didn&apos;t get it? <a href="/register">Try again</a>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell stepKey="form">
      <title>Fiscit — Create your account</title>
      <AuthTitle sub="Free for 14 days. No credit card required.">
        Start <em>knowing.</em>
      </AuthTitle>

      <GoogleButton label="Sign up with Google" />
      <div className="auth-divider">or</div>

      {error && <div className="auth-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
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
            autoComplete="new-password"
            placeholder="Min 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <label className="auth-field">
          <span>Confirm password</span>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </label>
        <label className="auth-check">
          <input
            id="newsletter"
            type="checkbox"
            checked={newsletter}
            onChange={e => setNewsletter(e.target.checked)}
          />
          Get product updates and tips
        </label>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className="auth-legal">
          By creating an account you agree to the <Link href="/terms">Terms of Service</Link> and{' '}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </form>

      <div className="auth-foot">
        Already have an account? <Link href="/login">Sign in</Link>
      </div>
    </AuthShell>
  )
}
