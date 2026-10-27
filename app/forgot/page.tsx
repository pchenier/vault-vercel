'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AuthShell, AuthTitle } from '@/components/auth-shell'

export default function ForgotPage() {
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
      else setError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <title>Fiscit — Reset your password</title>
      {sent ? (
        <>
          <AuthTitle sub={<>If an account exists for <strong>{email}</strong>, a reset link is on its way. It expires in 30 minutes.</>}>
            Check your <em>inbox.</em>
          </AuthTitle>
          <p className="auth-legal" style={{ marginTop: 0 }}>Nothing after a few minutes? Check your spam folder, or try again.</p>
          <button type="button" className="auth-btn ghost" style={{ marginTop: 18 }} onClick={() => setSent(false)}>
            Use another email
          </button>
        </>
      ) : (
        <>
          <AuthTitle sub="Enter the email you signed up with and we'll send you a link to choose a new password.">
            Forgot your <em>password?</em>
          </AuthTitle>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} style={{ marginTop: error ? 18 : 0 }}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </>
      )}
      <div className="auth-foot">
        Remembered it? <Link href="/login">Sign in</Link>
      </div>
    </AuthShell>
  )
}
