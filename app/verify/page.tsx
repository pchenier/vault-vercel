'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { AuthShell, AuthTitle } from '@/components/auth-shell'
import { useI18n } from '@/lib/i18n/client'

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const { t } = useI18n()
  // A key rather than the text, so the message follows a language switch
  const [messageKey, setMessageKey] = useState<'verifying' | 'invalidLink' | 'verified' | 'failed' | 'network'>('verifying')
  const [token, setToken] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (!t) {
      setStatus('error')
      setMessageKey('invalidLink')
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
          setMessageKey('verified')
          // /login forwards a signed-in user on to the dashboard via /sso
          setTimeout(() => { window.location.href = '/login' }, 2000)
        } else {
          setStatus('error')
          setMessageKey('failed')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessageKey('network')
      })
  }, [])

  const message = messageKey === 'network' ? t.auth.networkError : t.verify[messageKey]

  return (
    <AuthShell stepKey={status}>
      <title>{t.verify.title}</title>
      <div style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <span className="auth-spinner" style={{ marginBottom: 20 }} />
            <AuthTitle sub={message}>{t.verify.loadingHeading}</AuthTitle>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="auth-icon"><Check size={26} strokeWidth={2.5} /></div>
            <AuthTitle sub={message}>{t.verify.successHeading((s) => <em>{s}</em>)}</AuthTitle>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="auth-icon bad"><X size={26} strokeWidth={2.5} /></div>
            <AuthTitle sub={message}>{t.verify.errorHeading}</AuthTitle>
            <Link href="/login" className="auth-btn ghost" style={{ textDecoration: 'none' }}>{t.verify.back}</Link>
          </>
        )}
      </div>
    </AuthShell>
  )
}
