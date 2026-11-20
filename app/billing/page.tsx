'use client'
import { useEffect, useRef, useState } from 'react'
import { AuthShell, AuthSpinner, AuthTitle } from '@/components/auth-shell'
import { useI18n } from '@/lib/i18n/client'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://app.fiscit.com'

type Status = {
  state: 'comped' | 'subscribed' | 'past_due' | 'trial' | 'expired'
  plan: string
  periodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnds: string
  daysLeft: number
  billingEnabled: boolean
  hasCustomer: boolean
  prices: { monthly: number; yearly: number }
  configured: boolean
}

// Plans and subscription. Payment and plan changes happen on Stripe's own pages
// (Checkout and the customer portal); this page only sends people there.
export default function BillingPage() {
  const { lang, t } = useI18n()
  const b = t.billing
  const [status, setStatus] = useState<Status | null>(null)
  const [busy, setBusy] = useState<'' | 'monthly' | 'yearly' | 'portal'>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const autoStarted = useRef(false)

  const fmtDate = (iso: string) =>
    iso ? new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  async function go(kind: 'monthly' | 'yearly' | 'portal') {
    setError('')
    setBusy(kind)
    try {
      const res = await fetch(kind === 'portal' ? '/api/billing/portal' : '/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: kind === 'portal' ? '{}' : JSON.stringify({ plan: kind }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error === 'already_subscribed' ? b.alreadySubscribed : res.status === 503 ? b.notConfigured : b.error)
    } catch {
      setError(b.error)
    }
    setBusy('')
  }

  async function toDashboard() {
    const me = await fetch('/api/auth/me', { credentials: 'include' }).then(r => r.json()).catch(() => ({}))
    window.location.href = me.token ? `${DASHBOARD_URL}/sso?token=${encodeURIComponent(me.token)}` : DASHBOARD_URL
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const isSuccess = params.get('success') === '1'
    setSuccess(isSuccess)
    const wanted = params.get('plan')
    let tries = 0
    const load = async () => {
      const s: Status = await fetch('/api/billing/status', { credentials: 'include' }).then(r => r.json())
      setStatus(s)
      // After checkout the webhook may land a moment later: poll briefly
      if (isSuccess && s.state !== 'subscribed' && s.state !== 'comped' && tries++ < 8) setTimeout(load, 1500)
      // Coming from the dashboard's "trial ended" panel with a plan: go straight to checkout
      if (!isSuccess && !autoStarted.current && (wanted === 'monthly' || wanted === 'yearly') && s.configured
          && s.state !== 'subscribed' && s.state !== 'past_due' && s.state !== 'comped') {
        autoStarted.current = true
        window.history.replaceState({}, '', '/billing')
        go(wanted)
      }
    }
    load().catch(() => setError(b.error))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!status) return <AuthSpinner />

  const planName = status.plan === 'yearly' ? b.yearlyName : b.monthlyName
  const sub =
    status.state === 'comped' ? b.compedSub
    : status.state === 'past_due' ? b.pastDueSub
    : status.state === 'subscribed' ? (status.cancelAtPeriodEnd ? b.cancelingSub(planName, fmtDate(status.periodEnd)) : b.subscribedSub(planName, fmtDate(status.periodEnd)))
    : status.state === 'expired' ? b.expiredSub
    : status.billingEnabled ? b.trialSub(status.daysLeft, fmtDate(status.trialEnds))
    : b.trialOpenSub
  const canBuy = status.state === 'trial' || status.state === 'expired'
  const monthlyEquivalent = b.price(Math.round((status.prices.yearly / 12) * 100) / 100)

  return (
    <AuthShell>
      <title>{b.title}</title>
      {success ? (
        <>
          <AuthTitle sub={b.successSub}>{b.successHeading((s) => <em>{s}</em>)}</AuthTitle>
          <button type="button" className="auth-btn" onClick={toDashboard}>{b.toDashboard}</button>
        </>
      ) : (
        <>
          <AuthTitle sub={sub}>{b.heading((s) => <em>{s}</em>)}</AuthTitle>
          {error && <div className="auth-error" role="alert">{error}</div>}
          {busy && busy !== 'portal' && <div className="auth-ok" role="status">{b.redirecting}</div>}

          {canBuy && (
            status.configured ? (
              <div className="billing-plans" style={{ marginTop: error || busy ? 18 : 0 }}>
                {(['monthly', 'yearly'] as const).map((p) => (
                  <button key={p} type="button" className={`billing-plan${p === 'yearly' ? ' best' : ''}`} disabled={!!busy} onClick={() => go(p)}>
                    {p === 'yearly' && <span className="billing-badge">{b.save}</span>}
                    <span className="billing-name">{p === 'yearly' ? b.yearly : b.monthly}</span>
                    <span className="billing-price">
                      {b.price(status.prices[p])}<small> {p === 'yearly' ? b.perYear : b.perMonth}</small>
                    </span>
                    <span className="billing-note">{p === 'yearly' ? b.yearlyNote(monthlyEquivalent) : b.monthlyNote}</span>
                    <span className="billing-cta">{busy === p ? '…' : b.choose}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="auth-ok">{b.notConfigured}</div>
            )
          )}

          {status.hasCustomer && status.state !== 'comped' && (
            <>
              <button type="button" className={`auth-btn${canBuy ? ' ghost' : ''}`} style={{ marginTop: 18 }} disabled={!!busy} onClick={() => go('portal')}>
                {busy === 'portal' ? '…' : b.manage}
              </button>
              <p className="auth-legal" style={{ marginTop: 8 }}>{b.manageNote}</p>
            </>
          )}

          {(status.state === 'subscribed' || status.state === 'comped' || (status.state === 'trial')) && (
            <button type="button" className="auth-btn ghost" style={{ marginTop: 12 }} onClick={toDashboard}>{b.toDashboard}</button>
          )}

          <p className="auth-legal" style={{ marginTop: 18 }}>{b.fineprint}</p>
        </>
      )}
    </AuthShell>
  )
}
