'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { AuthShell, AuthTitle } from '@/components/auth-shell'

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
          // /login forwards a signed-in user on to the dashboard via /sso
          setTimeout(() => { window.location.href = '/login' }, 2000)
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
    <AuthShell stepKey={status}>
      <title>Fiscit — Verify email</title>
      <div style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <span className="auth-spinner" style={{ marginBottom: 20 }} />
            <AuthTitle sub={message}>Verifying…</AuthTitle>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="auth-icon"><Check size={26} strokeWidth={2.5} /></div>
            <AuthTitle sub={message}>You&apos;re <em>in.</em></AuthTitle>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="auth-icon bad"><X size={26} strokeWidth={2.5} /></div>
            <AuthTitle sub={message}>That link didn&apos;t work</AuthTitle>
            <Link href="/login" className="auth-btn ghost" style={{ textDecoration: 'none' }}>Back to sign in</Link>
          </>
        )}
      </div>
    </AuthShell>
  )
}
