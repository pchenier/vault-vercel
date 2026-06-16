'use client'
import { useState } from 'react'

export default function OnboardingPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      skip()
      return
    }
    setLoading(true)
    try {
      await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })
    } catch {}
    window.location.href = 'https://app.fiscit.com/'
  }

  function skip() {
    window.location.href = 'https://app.fiscit.com/'
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fiscit. Welcome</title>
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
          h1 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .desc {
            color: #71717a;
            font-size: 0.9rem;
            margin-bottom: 2rem;
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
            text-align: center;
            margin-bottom: 1.5rem;
          }
          input:focus { border-color: #4ade80; }
          .btn {
            width: 100%;
            padding: 0.875rem;
            background: #4ade80;
            color: #080808;
            font-weight: 700;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: opacity 0.15s;
            margin-bottom: 1rem;
          }
          .btn:hover { opacity: 0.9; }
          .btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .skip {
            color: #52525b;
            font-size: 0.85rem;
            text-decoration: none;
            cursor: pointer;
            background: none;
            border: none;
            display: inline-block;
          }
          .skip:hover { color: #a1a1aa; }
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
          <h1>What should we call you?</h1>
          <p className="desc">Pick a name for your account</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>

          <button className="skip" onClick={skip}>Skip for now</button>
        </div>
      </body>
    </html>
  )
}