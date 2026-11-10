'use client'
import { useState, useEffect } from 'react'
import { Landmark, Plus, X } from 'lucide-react'
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

type Step = 'name' | 'bank' | 'crypto' | 'invest'

const PLATFORMS = ['Questrade', 'Wealthsimple', 'Interactive Brokers', 'Disnat', 'National Bank Direct Brokerage', 'TD Direct Investing', 'RBC Direct Investing', 'BMO InvestorLine', 'Other']
const ACCOUNT_TYPES = ['TFSA', 'RRSP', 'FHSA', 'RESP', 'Non-registered']
type InvestRow = { platform: string; type: string; balance: string }
const emptyRow = (): InvestRow => ({ platform: '', type: 'TFSA', balance: '' })

// Accepts "12,345.67", "12 345,67" (French) or "$12345" → 12345.67 / 12345
function parseMoney(input: string): number {
  let s = input.replace(/[\s$ ]/g, '')
  if (/,\d{1,2}$/.test(s) && !s.includes('.')) s = s.replace(/\./g, '').replace(',', '.')
  else s = s.replace(/,/g, '')
  const n = parseFloat(s)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function reportPlaidLink(event: string, err: any, meta: any, lastSearch: string) {
  err = err || {}
  meta = meta || {}
  const inst = meta.institution || {}
  fetch('/api/plaid/link_event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      event, status: meta.status || '', exit_status: meta.exit_status || '',
      error_type: err.error_type || '', error_code: err.error_code || '',
      institution_id: inst.institution_id || meta.institution_id || '',
      institution_name: inst.name || meta.institution_name || '',
      link_session_id: meta.link_session_id || '', request_id: meta.request_id || err.request_id || '',
      last_search: lastSearch || '',
    }),
  }).catch(() => {})
}

function plaidErrorMessage(err: any, meta: any): string {
  const bank = meta?.institution?.name || 'your bank'
  const known: Record<string, string> = {
    INVALID_CREDENTIALS: `The username or password for ${bank} was not accepted. Check them on ${bank}'s own site, then try again.`,
    INVALID_MFA: `The security code for ${bank} was not accepted. Try again with a new code.`,
    INSTITUTION_DOWN: `${bank} isn't responding right now. Try again in a little while, or skip and add it later.`,
    INSTITUTION_NOT_RESPONDING: `${bank} isn't responding right now. Try again in a little while, or skip and add it later.`,
    INSTITUTION_NOT_AVAILABLE: `${bank} isn't available right now. Try again later, or skip and add it later.`,
    INSTITUTION_NOT_SUPPORTED: `${bank} can't be connected yet. We've been notified.`,
    UNAUTHORIZED_INSTITUTION: `${bank} isn't enabled on Fiscit yet. We've been notified.`,
    INSTITUTION_REGISTRATION_REQUIRED: `${bank} isn't enabled on Fiscit yet. We've been notified.`,
    ITEM_LOCKED: `${bank} locked the account after too many attempts. Unlock it on ${bank}'s site, then try again.`,
    USER_SETUP_REQUIRED: `${bank} needs you to finish a step on its own site or app first.`,
  }
  const code = err?.error_code || ''
  return known[code] || (err?.display_message ? `${bank}: ${err.display_message}` : `Could not connect ${bank}${code ? ` (${code})` : ''}. You can try again or skip and add it later.`)
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [invRows, setInvRows] = useState<InvestRow[]>([emptyRow()])
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
      let lastSearch = ''
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
        onEvent: (name: string, meta: any) => {
          if (name === 'SEARCH_INSTITUTION' && meta?.institution_search_query) lastSearch = meta.institution_search_query
          if (name === 'ERROR') reportPlaidLink('error', meta, meta, lastSearch)
        },
        onExit: (err: any, meta: any) => {
          setPlaidLoading(false)
          // Closing without connecting is reported too: "my bank isn't listed" shows up
          // as an exit whose last search found nothing
          reportPlaidLink('exit', err, meta, lastSearch)
          if (err) setError(plaidErrorMessage(err, meta))
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
      setStep('invest')
    } catch {
      setError('Could not save crypto. Skip and add later.')
      setStep('invest')
    } finally {
      setLoading(false)
    }
  }

  async function finish() {
    setLoading(true)
    setError('')
    try {
      // Save the investment accounts that have a platform picked
      const accounts = invRows
        .filter(r => r.platform)
        .map(r => ({ platform: r.platform, label: r.type, balance: parseMoney(r.balance) }))
      if (accounts.length) {
        const res = await fetch('/api/investments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accounts }),
          credentials: 'include'
        })
        if (!res.ok) {
          setError('Could not save your investment accounts. Try again, or skip and add them later.')
          setLoading(false)
          return
        }
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
    { key: 'invest', label: 'Investments', num: 4 },
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
          <button className="auth-skip" onClick={() => { setStep('invest') }}>Skip crypto</button>
        </>
      )}

      {step === 'invest' && (
        <>
          <AuthTitle sub="TFSA, RRSP, brokerage… Pick the platform and enter today's balance — you can update it anytime from your dashboard.">
            Add investment <em>accounts.</em>
          </AuthTitle>
          <div className="auth-invlist">
            {invRows.map((row, i) => (
              <div key={i} className="auth-invrow">
                <div className="auth-invrow-top">
                  <select
                    aria-label="Platform"
                    value={row.platform}
                    onChange={e => setInvRows(rows => rows.map((r, j) => j === i ? { ...r, platform: e.target.value } : r))}
                  >
                    <option value="">Choose a platform…</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {invRows.length > 1 && (
                    <button type="button" className="auth-invrm" aria-label="Remove account"
                      onClick={() => setInvRows(rows => rows.filter((_, j) => j !== i))}>
                      <X size={15} />
                    </button>
                  )}
                </div>
                <div className="auth-chips" role="radiogroup" aria-label="Account type">
                  {ACCOUNT_TYPES.map(t => (
                    <button type="button" key={t} role="radio" aria-checked={row.type === t}
                      className={row.type === t ? 'on' : ''}
                      onClick={() => setInvRows(rows => rows.map((r, j) => j === i ? { ...r, type: t } : r))}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="auth-money">
                  <span>$</span>
                  <input type="text" inputMode="decimal" placeholder="Current balance" aria-label="Current balance"
                    value={row.balance}
                    onChange={e => setInvRows(rows => rows.map((r, j) => j === i ? { ...r, balance: e.target.value } : r))} />
                </div>
              </div>
            ))}
          </div>
          {invRows.length < 10 && (
            <button type="button" className="auth-add" onClick={() => setInvRows(rows => [...rows, emptyRow()])}>
              <Plus size={15} /> Add another account
            </button>
          )}
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-btn" onClick={finish} disabled={loading}>
            {loading ? 'Setting up…' : 'Go to my dashboard'}
          </button>
          <button className="auth-skip" onClick={skipAll}>Skip, add later</button>
        </>
      )}
    </AuthShell>
  )
}
