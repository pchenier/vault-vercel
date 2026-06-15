'use client'
import { useState, useEffect } from 'react'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    // Load Plaid Link script
    const script = document.createElement('script')
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  async function openPlaidLink() {
    setLoading(true)
    setStatus('Connecting to your bank...')
    try {
      const res = await fetch('/api/plaid/link_token', { method: 'POST' })
      const data = await res.json()
      if (!data.link_token) {
        setStatus('Failed to start bank connection. Please try again.')
        setLoading(false)
        return
      }

      const handler = (window as any).Plaid.create({
        token: data.link_token,
        onSuccess: async (publicToken: string) => {
          setStatus('Saving your connection...')
          const exRes = await fetch('/api/plaid/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_token: publicToken })
          })
          const exData = await exRes.json()
          if (exData.ok) {
            setStatus('Bank connected! Loading your dashboard...')
            window.location.href = 'https://app.fiscit.com/'
          } else {
            setStatus(exData.error || 'Failed to connect bank. Please try again.')
            setLoading(false)
          }
        },
        onExit: () => {
          setLoading(false)
          setStatus('')
        },
        onEvent: () => {},
      })
      handler.open()
    } catch {
      setStatus('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fiscit. Connect Your Bank</title>
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
            max-width: 480px;
            padding: 3rem 2.5rem;
            background: #111;
            border: 1px solid #222;
            border-radius: 20px;
            margin: 1rem;
            text-align: center;
          }
          .icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
          }
          h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            letter-spacing: -0.03em;
          }
          .desc {
            color: #71717a;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          .btn {
            display: inline-block;
            width: 100%;
            padding: 1rem;
            background: #4ade80;
            color: #080808;
            font-weight: 700;
            font-size: 1.1rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: opacity 0.15s, transform 0.1s;
            margin-bottom: 1rem;
          }
          .btn:hover { opacity: 0.9; transform: translateY(-1px); }
          .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
          .skip {
            color: #52525b;
            font-size: 0.875rem;
            text-decoration: none;
            display: inline-block;
            margin-top: 0.5rem;
          }
          .skip:hover { color: #a1a1aa; }
          .status {
            margin-top: 1rem;
            color: #4ade80;
            font-size: 0.9rem;
            min-height: 1.2em;
          }
          .features {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          .feature {
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
            color: #a1a1aa;
          }
          .logo {
            font-size: 1rem;
            font-weight: 700;
            color: #4ade80;
            margin-bottom: 2rem;
            letter-spacing: -0.02em;
          }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo">F Fiscit</div>
          <div className="icon">🏦</div>
          <h1>Connect your bank</h1>
          <p className="desc">
            Fiscit needs access to your transactions to work. Your data is encrypted and never shared.
          </p>

          <button className="btn" onClick={openPlaidLink} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect Bank Account'}
          </button>

          <div className="status">{status}</div>

          <div className="features">
            <div className="feature">🔒 Bank level encryption</div>
            <div className="feature">12,000+ banks supported</div>
            <div className="feature">Read only access</div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <a href="https://app.fiscit.com/" className="skip">Skip for now</a>
          </div>
        </div>
      </body>
    </html>
  )
}
