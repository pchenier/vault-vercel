'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  useEffect(() => {
    // Auto-redirect if already logged in
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.user) window.location.href = 'https://app.fiscit.com/'
        else setChecking(false)
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
        window.location.href = data.redirectTo === '/onboarding' 
          ? '/onboarding' 
          : 'https://app.fiscit.com/'
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

  if (checking) return (
    <html lang="en"><head><style>{`body{background:#080808;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}`}</style></head>
    <body><div style={{width:'28px',height:'28px',border:'2px solid rgba(255,255,255,0.1)',borderTopColor:'#4ade80',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}></div>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></body></html>
  )

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fiscit. Sign In</title>
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
          .google-btn {
            width: 100%;
            padding: 0.75rem 1rem;
            background: #fff;
            color: #3c4043;
            font-weight: 600;
            font-size: 0.9375rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.625rem;
            transition: background 0.15s;
            font-family: 'Inter', -apple-system, sans-serif;
          }
          .google-btn:hover { background: #f5f5f5; }
          .google-btn svg { flex-shrink: 0; }
          .divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0;
            gap: 0.75rem;
          }
          .divider::before, .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #2a2a2a;
          }
          .divider span {
            color: #71717a;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
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
          .register-link {
            margin-top: 1.5rem;
            text-align: center;
            color: #71717a;
            font-size: 0.875rem;
          }
          .register-link a {
            color: #4ade80;
            text-decoration: none;
            font-weight: 500;
          }
          .register-link a:hover { text-decoration: underline; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo"><svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{display:'block'}}><rect width="32" height="32" rx="8" fill="#0A0F1A"/><rect x="7" y="6" width="5" height="20" rx="2" fill="#F0F4F8"/><rect x="7" y="6" width="16" height="5" rx="2" fill="#F0F4F8"/><rect x="7" y="14" width="12" height="4" rx="2" fill="#F0F4F8"/><circle cx="26" cy="8.5" r="3.5" fill="#b8f566"/></svg> <span style={{verticalAlign:'middle',marginLeft:'0.3rem'}}>Fiscit</span></div>
          <div className="subtitle">Sign in to your account</div>

          <a href="/api/auth/google-signin" style={{textDecoration:'none'}}>
            <button type="button" className="google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.909c1.702-1.567 2.683-3.875 2.683-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </a>

          <div className="divider"><span>or</span></div>

          {error && <div className="error">{error}</div>}

          {needsVerification && !resendSent && (
            <button type="button" onClick={async () => {
              const res = await fetch('/api/auth/resend-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              })
              if (res.ok) setResendSent(true)
            }} style={{width:'100%',marginTop:'0.75rem',padding:'0.625rem',background:'transparent',border:'1px solid #4ade80',borderRadius:'8px',color:'#4ade80',fontWeight:600,cursor:'pointer',fontSize:'0.875rem'}}>
              Resend Verification Email
            </button>
          )}
          {resendSent && <div style={{marginTop:'0.75rem',textAlign:'center',color:'#4ade80',fontSize:'0.875rem'}}>Verification email sent! Check your inbox.</div>}

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
            <label htmlFor="password">Password</label>
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
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="register-link">
            No account? <Link href="/register">Create one</Link>
          </div>
        </div>
      </body>
    </html>
  )
}