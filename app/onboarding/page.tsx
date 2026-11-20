'use client'
import { useState, useEffect } from 'react'
import { Landmark, Plus, X } from 'lucide-react'
import { AuthShell, AuthTitle } from '@/components/auth-shell'
import { useI18n } from '@/lib/i18n/client'
import type { Dictionary } from '@/lib/i18n/dictionaries'

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

type PlaidMessages = Dictionary['onboarding']['plaid']
type KnownPlaidCode = Exclude<keyof PlaidMessages, 'yourBank' | 'display' | 'fallback'>
const KNOWN_PLAID_CODES: KnownPlaidCode[] = [
  'INVALID_CREDENTIALS', 'INVALID_MFA', 'INSTITUTION_DOWN', 'INSTITUTION_NOT_RESPONDING',
  'INSTITUTION_NOT_AVAILABLE', 'INSTITUTION_NOT_SUPPORTED', 'UNAUTHORIZED_INSTITUTION',
  'INSTITUTION_REGISTRATION_REQUIRED', 'ITEM_LOCKED', 'USER_SETUP_REQUIRED',
]

function plaidErrorMessage(err: any, meta: any, m: PlaidMessages): string {
  const bank = meta?.institution?.name || m.yourBank
  const code = err?.error_code || ''
  const known = KNOWN_PLAID_CODES.find(k => k === code)
  return known ? m[known](bank) : (err?.display_message ? m.display(bank, err.display_message) : m.fallback(bank, code))
}

export default function OnboardingPage() {
  const { t } = useI18n()
  const o = t.onboarding
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
      setError(o.nameError)
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
        setError(o.bankTokenError)
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
              setError(o.bankSaveFailed)
              setStep('crypto')
            }
          } catch {
            setError(o.bankSaveError)
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
          if (err) setError(plaidErrorMessage(err, meta, o.plaid))
        },
      })
      handler.open()
    } catch (e) {
      console.error('Plaid Link failed:', e)
      setError(o.plaidLoadError)
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
      setError(o.cryptoError)
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
          setError(o.investError)
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
      setError(o.generic)
      setLoading(false)
    }
  }

  async function skipAll() {
    setLoading(true)
    await fetch('/api/auth/onboard', { method: 'POST', credentials: 'include' }).catch(() => {})
    await goToDashboard()
  }

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'name', label: o.steps.name, num: 1 },
    { key: 'bank', label: o.steps.bank, num: 2 },
    { key: 'crypto', label: o.steps.crypto, num: 3 },
    { key: 'invest', label: o.steps.invest, num: 4 },
  ]
  const currentIdx = steps.findIndex(s => s.key === step)

  return (
    <AuthShell stepKey={step}>
      <title>{o.title}</title>
      <div className="auth-progress" aria-label={o.stepOf(currentIdx + 1, steps.length)}>
        {steps.map((s, i) => (
          <span key={s.key}><i style={{ transform: `scaleX(${i <= currentIdx ? 1 : 0})` }} /></span>
        ))}
      </div>
      <div className="auth-steplabel">{o.stepOf(currentIdx + 1, steps.length)} · {steps[currentIdx]?.label}</div>

      {step === 'name' && (
        <>
          <AuthTitle sub={o.nameSub}>{o.nameHeading((s) => <em>{s}</em>)}</AuthTitle>
          <form onSubmit={e => { e.preventDefault(); saveName() }}>
            <input type="text" placeholder={o.namePlaceholder} value={name} onChange={e => setName(e.target.value)} autoFocus />
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? o.saving : o.continue}
            </button>
          </form>
          <button className="auth-skip" onClick={() => { setStep('bank') }}>{o.skipForNow}</button>
        </>
      )}

      {step === 'bank' && (
        <>
          <AuthTitle sub={o.bankSub}>
            {o.bankHeading((s) => <em>{s}</em>)}
          </AuthTitle>
          <button className="auth-btn white" onClick={openPlaid} disabled={plaidLoading}>
            <Landmark size={17} />
            {plaidLoading ? o.connecting : o.connectPlaid}
          </button>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-btn ghost" onClick={skipBank} style={{ marginTop: 10 }}>
            {o.skipAddLater}
          </button>
        </>
      )}

      {step === 'crypto' && (
        <>
          <AuthTitle sub={o.cryptoSub}>
            {o.cryptoHeading((s) => <em>{s}</em>)}
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
            {loading ? o.saving : o.continue}
          </button>
          <button className="auth-skip" onClick={() => { setStep('invest') }}>{o.skipCrypto}</button>
        </>
      )}

      {step === 'invest' && (
        <>
          <AuthTitle sub={o.investSub}>
            {o.investHeading((s) => <em>{s}</em>)}
          </AuthTitle>
          <div className="auth-invlist">
            {invRows.map((row, i) => (
              <div key={i} className="auth-invrow">
                <div className="auth-invrow-top">
                  <select
                    aria-label={o.platform}
                    value={row.platform}
                    onChange={e => setInvRows(rows => rows.map((r, j) => j === i ? { ...r, platform: e.target.value } : r))}
                  >
                    <option value="">{o.choosePlatform}</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{o.platforms[p] ?? p}</option>)}
                  </select>
                  {invRows.length > 1 && (
                    <button type="button" className="auth-invrm" aria-label={o.removeAccount}
                      onClick={() => setInvRows(rows => rows.filter((_, j) => j !== i))}>
                      <X size={15} />
                    </button>
                  )}
                </div>
                <div className="auth-chips" role="radiogroup" aria-label={o.accountType}>
                  {ACCOUNT_TYPES.map(type => (
                    <button type="button" key={type} role="radio" aria-checked={row.type === type}
                      className={row.type === type ? 'on' : ''}
                      onClick={() => setInvRows(rows => rows.map((r, j) => j === i ? { ...r, type } : r))}>
                      {o.accountTypes[type] ?? type}
                    </button>
                  ))}
                </div>
                <div className="auth-money">
                  <span>$</span>
                  <input type="text" inputMode="decimal" placeholder={o.currentBalance} aria-label={o.currentBalance}
                    value={row.balance}
                    onChange={e => setInvRows(rows => rows.map((r, j) => j === i ? { ...r, balance: e.target.value } : r))} />
                </div>
              </div>
            ))}
          </div>
          {invRows.length < 10 && (
            <button type="button" className="auth-add" onClick={() => setInvRows(rows => [...rows, emptyRow()])}>
              <Plus size={15} /> {o.addAccount}
            </button>
          )}
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-btn" onClick={finish} disabled={loading}>
            {loading ? o.settingUp : o.goDashboard}
          </button>
          <button className="auth-skip" onClick={skipAll}>{o.skipAddLater}</button>
        </>
      )}
    </AuthShell>
  )
}
