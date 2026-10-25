'use client'
import { useState, useEffect } from 'react'

const COINS = [
  { sym: 'BTC', name: 'Bitcoin' },
  { sym: 'ETH', name: 'Ethereum' },
  { sym: 'SOL', name: 'Solana' },
  { sym: 'ADA', name: 'Cardano' },
  { sym: 'DOGE', name: 'Dogecoin' },
  { sym: 'DOT', name: 'Polkadot' },
  { sym: 'LINK', name: 'Chainlink' },
  { sym: 'AVAX', name: 'Avalanche' },
  { sym: 'XRP', name: 'XRP' },
  { sym: 'USDC', name: 'USD Coin' },
  { sym: 'USDT', name: 'Tether' },
  { sym: 'SHIB', name: 'Shiba Inu' },
] as const

type Step = 'name' | 'bank' | 'crypto' | 'wise'

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [wiseToken, setWiseToken] = useState('')
  const [wiseProfile, setWiseProfile] = useState('')
  const [cryptoHoldings, setCryptoHoldings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [plaidLoading, setPlaidLoading] = useState(false)

  useEffect(() => {
    // If user already completed onboarding, redirect to app
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data?.user?.name && data?.user?.onboarded) {
          window.location.href = 'https://app.fiscit.com/login'
        }
      })
      .catch(() => {})
  }, [])

  async function saveName() {
    setLoading(true)
    setError('')
    try {
      if (name.trim()) {
        await fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() })
        })
      }
      setStep('bank')
    } catch {
      setError('Failed to save name. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function skipBank() {
    setStep('crypto')
  }

  // Load Plaid Link on demand and wait for window.Plaid (a <script> in this
  // page's own <head> isn't reliably executed by React).
  function loadPlaidScript(): Promise<void> {
    if ((window as any).Plaid) return Promise.resolve()
    return new Promise((resolve, reject) => {
      const existing = document.getElementById('plaid-link-script') as HTMLScriptElement | null
      const s = existing ?? document.createElement('script')
      s.addEventListener('load', () => resolve())
      s.addEventListener('error', () => reject(new Error('Plaid script failed to load')))
      if (!existing) {
        s.id = 'plaid-link-script'
        s.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
        s.async = true
        document.body.appendChild(s)
      }
    })
  }

  async function openPlaid() {
    setPlaidLoading(true)
    setError('')
    try {
      const [res] = await Promise.all([
        fetch('/api/plaid/link_token', { method: 'POST', credentials: 'include' }),
        loadPlaidScript(),
      ])
      const data = await res.json()
      if (!data.link_token) {
        console.error('Plaid link_token error:', data)
        setError('Could not connect to bank. You can skip and add later.')
        setPlaidLoading(false)
        return
      }
      // Load Plaid Link dynamically
      const handler = (window as any).Plaid.create({
        token: data.link_token,
        onSuccess: async (publicToken: string) => {
          try {
            const exchangeRes = await fetch('/api/plaid/exchange', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_token: publicToken }),
              credentials: 'include'
            })
            const exchangeData = await exchangeRes.json()
            if (exchangeData.ok) {
              setStep('crypto')
            } else {
              setError('Bank connected but token save failed. You can continue.')
              setStep('crypto')
            }
          } catch {
            setError('Bank connected but could not save. You can continue.')
            setStep('crypto')
          }
        },
        onExit: () => {
          setPlaidLoading(false)
        },
      })
      handler.open()
    } catch (e) {
      console.error('Plaid Link failed:', e)
      setError('Could not load bank connection. Skip and add later.')
      setPlaidLoading(false)
    }
  }

  async function saveCryptoAndContinue() {
    setLoading(true)
    setError('')
    try {
      const holdings: Record<string, number> = {}
      for (const [sym, amt] of Object.entries(cryptoHoldings)) {
        const num = parseFloat(amt)
        if (num > 0) holdings[sym] = num
      }
      if (Object.keys(holdings).length > 0) {
        await fetch('/api/crypto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ holdings }),
          credentials: 'include'
        })
      }
      setStep('wise')
    } catch {
      setError('Could not save crypto. Skip and add later.')
      setStep('wise')
    } finally {
      setLoading(false)
    }
  }

  async function finish() {
    setLoading(true)
    setError('')
    try {
      // Save Wise credentials if provided
      if (wiseToken.trim() && wiseProfile.trim()) {
        await fetch('/api/settings/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wiseToken: wiseToken.trim(), wiseProfile: wiseProfile.trim() }),
          credentials: 'include'
        })
      }

      // Mark onboarding complete
      await fetch('/api/auth/onboard', {
        method: 'POST',
        credentials: 'include'
      })

      // Get SSO token and redirect to app
      const meRes = await fetch('/api/auth/me', { credentials: 'include' })
      const meData = await meRes.json()
      if (meData?.token) {
        window.location.href = `https://app.fiscit.com/sso?token=${encodeURIComponent(meData.token)}`
      } else {
        window.location.href = 'https://app.fiscit.com/login'
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  function skipAll() {
    window.location.href = 'https://app.fiscit.com/login'
  }

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'name', label: 'Name', num: 1 },
    { key: 'bank', label: 'Bank', num: 2 },
    { key: 'crypto', label: 'Crypto', num: 3 },
    { key: 'wise', label: 'Wise', num: 4 },
  ]
  const currentIdx = steps.findIndex(s => s.key === step)

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fiscit — Setup</title>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
          body { font-family: 'Inter', -apple-system, sans-serif; background: #080808; color: #f4f4f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .card { width: 100%; max-width: 440px; padding: 2.5rem; background: #111; border: 1px solid #222; border-radius: 16px; margin: 1rem; }
          .logo { font-size: 1.5rem; font-weight: 700; color: #4ade80; margin-bottom: 1.5rem; letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.4rem; }
          .progress { display: flex; gap: 8px; margin-bottom: 2rem; }
          .dot { flex: 1; height: 4px; border-radius: 2px; background: #2a2a2a; transition: background 0.3s; }
          .dot.active { background: #4ade80; }
          .dot.done { background: #4ade80; }
          h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
          .sub { color: #71717a; font-size: 0.875rem; margin-bottom: 1.5rem; }
          input[type="text"], input[type="number"] {
            width: 100%; padding: 0.75rem 1rem; background: #1a1a1a; border: 1px solid #2a2a2a;
            border-radius: 8px; color: #f4f4f5; font-size: 1rem; outline: none; transition: border-color 0.15s;
          }
          input:focus { border-color: #4ade80; }
          .btn { width: 100%; padding: 0.875rem; background: #4ade80; color: #080808; font-weight: 700; font-size: 1rem; border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.15s; margin-top: 1rem; }
          .btn:hover { opacity: 0.9; }
          .btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .btn-outline { background: transparent; border: 1px solid #2a2a2a; color: #a1a1aa; }
          .btn-outline:hover { border-color: #4ade80; color: #4ade80; }
          .btn-white { background: #fff; color: #3c4043; }
          .btn-white:hover { background: #f5f5f5; }
          .error { margin-top: 0.75rem; padding: 0.75rem 1rem; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; color: #f87171; font-size: 0.875rem; }
          .skip { display: block; text-align: center; color: #52525b; font-size: 0.8rem; margin-top: 1rem; cursor: pointer; background: none; border: none; width: 100%; }
          .skip:hover { color: #a1a1aa; }
          .coin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 320px; overflow-y: auto; margin-bottom: 1rem; }
          .coin-row { display: flex; align-items: center; justify-content: space-between; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 8px 12px; cursor: pointer; transition: border-color 0.15s; }
          .coin-row:hover { border-color: #4ade80; }
          .coin-row.selected { border-color: #4ade80; background: #1a2a1a; }
          .coin-row input { width: 80px; padding: 4px 8px; font-size: 0.85rem; text-align: right; background: #111; border: 1px solid #2a2a2a; border-radius: 4px; color: #f4f4f5; }
          .coin-row input:focus { border-color: #4ade80; outline: none; }
          .coin-symbol { font-weight: 600; font-size: 0.875rem; }
          .coin-name { color: #71717a; font-size: 0.75rem; }
          .label { display: block; font-size: 0.8rem; font-weight: 500; color: #a1a1aa; margin-bottom: 0.4rem; margin-top: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <rect width="32" height="32" rx="8" fill="#0A0F1A"/>
              <rect x="7" y="6" width="5" height="20" rx="2" fill="#F0F4F8"/>
              <rect x="7" y="6" width="16" height="5" rx="2" fill="#F0F4F8"/>
              <rect x="7" y="14" width="12" height="4" rx="2" fill="#F0F4F8"/>
              <circle cx="26" cy="8.5" r="3.5" fill="#b8f566"/>
            </svg>
            Fiscit
          </div>

          <div className="progress">
            {steps.map((s, i) => (
              <div key={s.key} className={`dot ${i < currentIdx ? 'done' : i === currentIdx ? 'active' : ''}`} />
            ))}
          </div>

          {step === 'name' && (
            <>
              <h1>What should we call you?</h1>
              <p className="sub">Pick a name for your account</p>
              <form onSubmit={e => { e.preventDefault(); saveName() }}>
                <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              </form>
              <button className="skip" onClick={() => { setStep('bank') }}>Skip for now</button>
            </>
          )}

          {step === 'bank' && (
            <>
              <h1>Connect your bank</h1>
              <p className="sub">Link your accounts to see balances and transactions in one place.</p>
              <button className="btn btn-white" onClick={openPlaid} disabled={plaidLoading}>
                <svg width="18" height="18" viewBox="0 0 18 18" style={{display:'inline-block',verticalAlign:'middle',marginRight:'8px'}}>
                  <path d="M2 4h14v2H2zm0 4h14v2H2zm0 4h10v2H2z" fill="#666"/>
                </svg>
                {plaidLoading ? 'Connecting...' : 'Connect with Plaid'}
              </button>
              {error && <div className="error">{error}</div>}
              <button className="btn btn-outline" onClick={skipBank} style={{marginTop: '0.75rem'}}>
                Skip, add later
              </button>
            </>
          )}

          {step === 'crypto' && (
            <>
              <h1>Track your crypto</h1>
              <p className="sub">Select coins you hold and enter amounts. You can always add more later.</p>
              <div className="coin-grid">
                {COINS.map(coin => {
                  const selected = coin.sym in cryptoHoldings
                  return (
                    <div key={coin.sym} className={`coin-row ${selected ? 'selected' : ''}`}
                      onClick={() => {
                        if (!selected) {
                          setCryptoHoldings(prev => ({ ...prev, [coin.sym]: '' }))
                        } else {
                          setCryptoHoldings(prev => {
                            const next = { ...prev }
                            delete next[coin.sym]
                            return next
                          })
                        }
                      }}>
                      <div>
                        <div className="coin-symbol">{coin.sym}</div>
                        <div className="coin-name">{coin.name}</div>
                      </div>
                      {selected && (
                        <input type="number" step="any" min="0" placeholder="0.00"
                          value={cryptoHoldings[coin.sym]}
                          onClick={e => e.stopPropagation()}
                          onChange={e => setCryptoHoldings(prev => ({ ...prev, [coin.sym]: e.target.value }))} />
                      )}
                    </div>
                  )
                })}
              </div>
              <button className="btn" onClick={saveCryptoAndContinue} disabled={loading}>
                {loading ? 'Saving...' : 'Continue'}
              </button>
              <button className="skip" onClick={() => { setStep('wise') }}>Skip crypto</button>
            </>
          )}

          {step === 'wise' && (
            <>
              <h1>Wise account</h1>
              <p className="sub">Connect your Wise (TransferWise) account to see multi-currency balances. Optional.</p>
              <label className="label">Wise API Token</label>
              <input type="text" placeholder="Your Wise API token" value={wiseToken} onChange={e => setWiseToken(e.target.value)} />
              <label className="label">Wise Profile ID</label>
              <input type="text" placeholder="Your Wise profile ID" value={wiseProfile} onChange={e => setWiseProfile(e.target.value)} />
              {error && <div className="error">{error}</div>}
              <button className="btn" onClick={finish} disabled={loading}>
                {loading ? 'Setting up...' : 'Go to Dashboard'}
              </button>
              <button className="skip" onClick={skipAll}>Skip, set up later</button>
            </>
          )}
        </div>
      </body>
    </html>
  )
}