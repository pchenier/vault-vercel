'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { AuthShell, AuthTitle, GoogleButton } from '@/components/auth-shell'
import { useI18n } from '@/lib/i18n/client'

export default function RegisterPage() {
  const { t } = useI18n()
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
      setError(t.register.mismatch)
      return
    }
    if (password.length < 8) {
      setError(t.register.tooShort)
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
        setError(data.error || t.register.failed)
      }
    } catch {
      setError(t.auth.networkError)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthShell stepKey="sent">
        <title>{t.register.sentTitle}</title>
        <div className="auth-icon"><Mail size={24} /></div>
        <AuthTitle sub={t.register.sentSub(<b style={{ color: 'var(--text)' }}>{email}</b>)}>
          {t.register.sentHeading((s) => <em>{s}</em>)}
        </AuthTitle>
        <div className="auth-foot" style={{ marginTop: 0 }}>
          {t.register.didntGet} <a href="/register">{t.register.tryAgain}</a>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell stepKey="form">
      <title>{t.register.title}</title>
      <AuthTitle sub={t.register.sub}>
        {t.register.heading((s) => <em>{s}</em>)}
      </AuthTitle>

      <GoogleButton label={t.register.google} />
      <div className="auth-divider">{t.auth.or}</div>

      {error && <div className="auth-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
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
            autoComplete="new-password"
            placeholder={t.register.passwordPlaceholder}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <label className="auth-field">
          <span>{t.auth.confirmPassword}</span>
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
          {t.register.newsletter}
        </label>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? t.register.submitting : t.register.submit}
        </button>
        <p className="auth-legal">
          {t.register.legal(
            (s) => <Link href="/terms">{s}</Link>,
            (s) => <Link href="/privacy">{s}</Link>,
          )}
        </p>
      </form>

      <div className="auth-foot">
        {t.register.haveAccount} <Link href="/login">{t.register.signIn}</Link>
      </div>
    </AuthShell>
  )
}
