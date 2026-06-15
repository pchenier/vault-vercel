'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (email.toLowerCase().trim() !== confirmEmail.toLowerCase().trim()) {
      setError('Email addresses do not match')
      return
    }
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
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Fiscit. Check Your Email</title>
          <style>{`
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
            body {
              font-family: 'Inter', -apple-system, sans-serif;
              background: #080808;
              color: #f4f4f5;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .card {
              width: 100%;
              max-width: 400px;
              padding: 2.5rem;
              background: #111;
              border: 1px solid #222;
              border-radius: 16px;
              margin: 1rem;
              text-align: center;
            }
            .icon { font-size: 3rem; margin-bottom: 1rem; }
            h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
            .email { color: #4ade80; font-weight: 600; }
            .msg { color: #71717a; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
            a { color: #4ade80; text-decoration: none; font-weight: 500; }
            a:hover { text-decoration: underline; }
          `}</style>
        </head>
        <body>
          <div className="card">
            <div className="icon">📧</div>
            <h1>Check your email</h1>
            <p className="msg">
              We sent a confirmation link to <span className="email">{email}</span>. Click it to verify your account and get started.
            </p>
            <p className="msg">
              Didn't get the email? <a href="/register">Try again</a>
            </p>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fiscit. Create Account</title>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #080808;
            color: #f4f4f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            width: 100%;
            max-width: 400px;
            padding: 2.5rem;
            background: #111;
            border: 1px solid #222;
            border-radius: 16px;
            margin: 1rem;
          }
          .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #4ade80;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
          }
          .subtitle {
            color: #71717a;
            font-size: 0.9rem;
            margin-bottom: 2rem;
          }
          label {
            display: block;
            font-size: 0.8rem;
            font-weight: 500;
            color: #a1a1aa;
            margin-bottom: 0.4rem;
            margin-top: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          input {
            width: 100%;
            padding: 0.75rem 1rem;
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            color: #f4f4f5;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.15s;
          }
          input:focus { border-color: #4ade80; }
          .btn {
            width: 100%;
            margin-top: 1.5rem;
            padding: 0.875rem;
            background: #4ade80;
            color: #080808;
            font-weight: 700;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: opacity 0.15s;
          }
          .btn:hover { opacity: 0.9; }
          .btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .error {
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            background: rgba(239,68,68,0.12);
            border: 1px solid rgba(239,68,68,0.3);
            border-radius: 8px;
            color: #f87171;
            font-size: 0.875rem;
          }
          .checkbox-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            color: #71717a;
            font-size: 0.85rem;
          }
          .checkbox-row input[type="checkbox"] {
            width: auto;
            accent-color: #4ade80;
          }
          .login-link {
            margin-top: 1.5rem;
            text-align: center;
            color: #71717a;
            font-size: 0.875rem;
          }
          .login-link a {
            color: #4ade80;
            text-decoration: none;
            font-weight: 500;
          }
          .login-link a:hover { text-decoration: underline; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{display:'block'}}>
              <rect width="32" height="32" rx="8" fill="#0A0F1A"/>
              <rect x="7" y="6" width="5" height="20" rx="2" fill="#F0F4F8"/>
              <rect x="7" y="6" width="16" height="5" rx="2" fill="#F0F4F8"/>
              <rect x="7" y="14" width="12" height="4" rx="2" fill="#F0F4F8"/>
              <circle cx="26" cy="8.5" r="3.5" fill="#b8f566"/>
            </svg>
            <span style={{verticalAlign:'middle',marginLeft:'0.3rem'}}>Fiscit</span>
          </div>
          <div className="subtitle">Create your account</div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
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
            <label htmlFor="confirmEmail">Confirm Email</label>
            <input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={confirmEmail}
              onChange={e => setConfirmEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
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
            <label htmlFor="confirm">Confirm Password</label>
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
            <div className="checkbox-row">
              <input
                id="newsletter"
                type="checkbox"
                checked={newsletter}
                onChange={e => setNewsletter(e.target.checked)}
              />
              <label htmlFor="newsletter" style={{margin:0,textTransform:'none',letterSpacing:0,fontWeight:400,color:'#71717a'}}>
                Get product updates and tips
              </label>
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </body>
    </html>
  )
}