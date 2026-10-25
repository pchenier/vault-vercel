'use client'
import { useState, useEffect } from 'react'
import { Landmark } from 'lucide-react'
import { AuthShell, AuthTitle } from '@/components/auth-shell'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://app.fiscit.com'

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
    // If user already completed onboarding, go straight to the dashboard
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data?.user?.name && data?.user?.onboarded) {
          window.location.href = dashboardUrl(data?.token)
        }
      })
      .catch(() => {})
  }, [])

  // The dashboard lives on app.fiscit.com (Flask), which only trusts a session
  // created through /sso. Without a handoff token, send the user to our own
  // /login, which re-establishes the session and then hands off.
  function dashboardUrl(token?: string) {
    return token ? `${DASHBOARD_URL}/sso?token=${encodeURIComponent(token)}` : '/login'
  }

  async function goToDashboard() {
    const meData = await fetch('/api/auth/me', { credentials: 'include' }).then(r => r.json()).catch(() => null)
    if (!meData?.token) console.error('No session on fiscit.com — sending to /login')
    window.location.href = dashboardUrl(meData?.token)
  }

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

      await goToDashboard()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function skipAll() {
    setLoading(true)
    await fetch('/api/auth/onboard', { method: 'POST', credentials: 'include' }).catch(() => {})
    await goToDashboard()
  }

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'name', label: 'Name', num: 1 },
    { key: 'bank', label: 'Bank', num: 2 },
    { key: 'crypto', label: 'Crypto', num: 3 },
    { key: 'wise', label: 'Wise', num: 4 },
  ]
  const currentIdx = steps.findIndex(s => s.key === step)

  return (
    <AuthShell stepKey={step}>
      <title>Fiscit — Setup</title>
      <div className="auth-progress" aria-label={`Step ${currentIdx + 1} of ${steps.length}`}>
        {steps.map((s, i) => (
          <span key={s.key}><i style={{ transform: `scaleX(${i <= currentIdx ? 1 : 0})` }} /></span>
        ))}
      </div>
      <div className="auth-steplabel">Step {currentIdx + 1} of {steps.length} · {steps[currentIdx]?.label}</div>

      {step === 'name' && (
        <>
          <AuthTitle sub="Pick a name for your account.">What should we <em>call you?</em></AuthTitle>
          <form onSubmit={e => { e.preventDefault(); saveName() }}>
            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Saving…' : 'Continue'}
            </button>
          </form>
          <button className="auth-skip" onClick={() => { setStep('bank') }}>Skip for now</button>
        </>
      )}

      {step === 'bank' && (
        <>
          <AuthTitle sub="Link your accounts to see balances and transactions in one place. Read-only — Fiscit can never move money.">
            Connect your <em>bank.</em>
          </AuthTitle>
          <button className="auth-btn white" onClick={openPlaid} disabled={plaidLoading}>
            <Landmark size={17} />
            {plaidLoading ? 'Connecting…' : 'Connect with Plaid'}
          </button>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-btn ghost" onClick={skipBank} style={{ marginTop: 10 }}>
            Skip, add later
          </button>
        </>
      )}

      {step === 'crypto' && (
        <>
          <AuthTitle sub="Select the coins you hold and enter amounts. You can always add more later.">
            Track your <em>crypto.</em>
          </AuthTitle>
          <div className="auth-coins">
            {COINS.map(coin => {
              const selected = coin.sym in cryptoHoldings
              return (
                <div key={coin.sym} className={`auth-coin ${selected ? 'selected' : ''}`}
                  role="button" tabIndex={0} aria-pressed={selected}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (e.currentTarget as HTMLElement).click() } }}
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
                    <b>{coin.sym}</b>
                    <small>{coin.name}</small>
                  </div>
                  {selected && (
                    <input type="number" step="any" min="0" placeholder="0.00"
                      value={cryptoHoldings[coin.sym]}
                      onClick={e => e.stopPropagation()}
                      onKeyDown={e => e.stopPropagation()}
                      onChange={e => setCryptoHoldings(prev => ({ ...prev, [coin.sym]: e.target.value }))} />
                  )}
                </div>
              )
            })}
          </div>
          <button className="auth-btn" onClick={saveCryptoAndContinue} disabled={loading}>
            {loading ? 'Saving…' : 'Continue'}
          </button>
          <button className="auth-skip" onClick={() => { setStep('wise') }}>Skip crypto</button>
        </>
      )}

      {step === 'wise' && (
        <>
          <AuthTitle sub="Connect your Wise account to see multi-currency balances. Optional.">
            Add <em>Wise.</em>
          </AuthTitle>
          <label className="auth-field">
            <span>Wise API token</span>
            <input type="text" placeholder="Your Wise API token" value={wiseToken} onChange={e => setWiseToken(e.target.value)} />
          </label>
          <label className="auth-field">
            <span>Wise profile ID</span>
            <input type="text" placeholder="Your Wise profile ID" value={wiseProfile} onChange={e => setWiseProfile(e.target.value)} />
          </label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-btn" onClick={finish} disabled={loading}>
            {loading ? 'Setting up…' : 'Go to my dashboard'}
          </button>
          <button className="auth-skip" onClick={skipAll}>Skip, set up later</button>
        </>
      )}
    </AuthShell>
  )
}
