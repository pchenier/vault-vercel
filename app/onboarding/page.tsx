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
    <div className="min-h-screen flex items-center justify-center" style={{background: '#080808'}}>
      <div className="w-full max-w-[400px] p-10 text-center rounded-2xl border border-[#222] bg-[#111] m-4">
        <div className="text-2xl font-bold text-[#4ade80] mb-8 tracking-tight flex items-center justify-center gap-1">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <rect width="32" height="32" rx="8" fill="#0A0F1A"/>
            <rect x="7" y="6" width="5" height="20" rx="2" fill="#F0F4F8"/>
            <rect x="7" y="6" width="16" height="5" rx="2" fill="#F0F4F8"/>
            <rect x="7" y="14" width="12" height="4" rx="2" fill="#F0F4F8"/>
            <circle cx="26" cy="8.5" r="3.5" fill="#b8f566"/>
          </svg>
          <span className="ml-1">Fiscit</span>
        </div>
        <h1 className="text-xl font-semibold mb-2">What should we call you?</h1>
        <p className="text-[#71717a] text-sm mb-8">Pick a name for your account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f4f4f5] text-center mb-6 outline-none focus:border-[#4ade80] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#4ade80] text-[#080808] font-bold text-base rounded-lg cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>

        <button className="text-[#52525b] text-sm cursor-pointer bg-transparent border-none hover:text-[#a1a1aa] transition-colors" onClick={skip}>
          Skip for now
        </button>
      </div>
    </div>
  )
}