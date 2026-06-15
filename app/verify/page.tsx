'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')
  const [token, setToken] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (!t) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }
    setToken(t)

    fetch(`/api/auth/verify?token=${t}`)
      .then(res => {
        if (res.redirected) {
          window.location.href = res.url
          return
        }
        if (res.ok) {
          setStatus('success')
          setMessage('Email verified! Redirecting...')
          setTimeout(() => { window.location.href = 'https://app.fiscit.com/' }, 2000)
        } else {
          setStatus('error')
          setMessage('Verification failed. The link may have expired.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error. Please try again.')
      })
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fiscit. Verify Email</title>
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
          .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #4ade80;
            margin-bottom: 2rem;
            letter-spacing: -0.02em;
          }
          .spinner {
            width: 28px; height: 28px;
            border: 2px solid rgba(255,255,255,0.1);
            border-top-color: #4ade80;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 1.5rem;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .icon { font-size: 2.5rem; margin-bottom: 1rem; }
          .msg { color: #a1a1aa; font-size: 0.95rem; line-height: 1.6; }
          .msg.success { color: #4ade80; }
          .msg.error { color: #f87171; }
          a { color: #4ade80; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{display:'block',margin:'0 auto 0.3rem'}}>
              <rect width="32" height="32" rx="8" fill="#0A0F1A"/>
              <rect x="7" y="6" width="5" height="20" rx="2" fill="#F0F4F8"/>
              <rect x="7" y="6" width="16" height="5" rx="2" fill="#F0F4F8"/>
              <rect x="7" y="14" width="12" height="4" rx="2" fill="#F0F4F8"/>
              <circle cx="26" cy="8.5" r="3.5" fill="#b8f566"/>
            </svg>
            Fiscit
          </div>
          {status === 'loading' && (
            <>
              <div className="spinner"></div>
              <p className="msg">{message}</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="icon">✅</div>
              <p className="msg success">{message}</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="icon">❌</div>
              <p className="msg error">{message}</p>
              <div style={{marginTop:'1.5rem'}}>
                <Link href="/login">Back to Sign In</Link>
              </div>
            </>
          )}
        </div>
      </body>
    </html>
  )
}