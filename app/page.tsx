'use client'
import { useState, useEffect } from 'react'

const Logo = ({ height = 28 }: { height?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/logo.svg" alt="Vault" height={height} style={{height:`${height}px`, width:'auto', display:'block'}} />
)

const FaviconV = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#080808"/>
    <path d="M9 9 L16 23 L23 9" stroke="#b8f566" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

export default function LandingPage() {
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [waitlistMsg, setWaitlistMsg] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    setWaitlistStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail })
      })
      const data = await res.json()
      if (data.ok) {
        setWaitlistStatus('success')
        setWaitlistMsg('You are on the list. We will reach out soon.')
        setWaitlistEmail('')
      } else {
        setWaitlistStatus('error')
        setWaitlistMsg(data.error || 'Something went wrong.')
      }
    } catch {
      setWaitlistStatus('error')
      setWaitlistMsg('Network error. Please try again.')
    }
  }

  const Check = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',flexShrink:0}}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )

  const features = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>,
      title: 'All accounts in one place',
      desc: 'Plaid connects 12,000+ banks. See every balance, transaction, and account at a glance.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      title: 'Unified calendar',
      desc: 'Google Calendar, work, gym sessions, meals, and finance events in one clean view.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
      title: 'Food and nutrition',
      desc: 'Log meals, track macros, and see how your grocery spending aligns with your health goals.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>,
      title: 'Gym and fitness',
      desc: 'Track workouts, log sets and reps, see your gym spend vs results. All linked to your schedule.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
      title: 'Savings rate tracker',
      desc: 'Know your savings percentage every month. Build wealth consciously with targets and trends.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      title: 'Habits and streaks',
      desc: 'Build routines that stick. Track daily habits alongside your health and finance goals.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
      title: 'Subscription radar',
      desc: 'Spot forgotten subscriptions and recurring charges. Cancel what you stopped using.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
      title: 'Budget projections',
      desc: 'Get alerted before you overspend. AI flags risky weeks before you hit your limit.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      title: 'Multi currency',
      desc: 'Wise integration for USD, CAD, EUR and more in one dashboard. No manual conversions.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title: 'Your data, private',
      desc: 'Encrypted at rest. Never sold. You own your financial story, not us.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      title: 'AI insights',
      desc: 'Get plain language summaries of your month. Know exactly what changed and why.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      title: 'Family and shared budgets',
      desc: 'Invite a partner. Track shared expenses, split costs, and plan together.'
    },
  ]

  const pricingFeatures = [
    'Connect unlimited bank accounts',
    'Real time transaction sync',
    'Savings rate and net worth tracking',
    'Budget projections and alerts',
    'Subscription detection',
    'Unified calendar (Google, Apple)',
    'Food and fitness tracking',
    'Multi currency with Wise',
    'AI monthly insights',
    'Secure encrypted storage',
  ]

  const googleImports = [
    { name: 'Google Calendar', desc: 'All your events, meetings and reminders', color: '#4285F4' },
    { name: 'Google Contacts', desc: 'Sync people to shared budgets and splits', color: '#34A853' },
    { name: 'Google Fit', desc: 'Steps, workouts, sleep and health data', color: '#EA4335' },
    { name: 'Gmail', desc: 'Auto detect subscriptions and receipts', color: '#FBBC05' },
  ]

  return (
    <>
      <style>{`
        :root {
          --bg: #080808;
          --surface: #111;
          --surface2: #161616;
          --border: #1e1e1e;
          --text: #f4f4f5;
          --muted: #71717a;
          --accent: #b8f566;
          --accent-dim: rgba(184,245,102,0.1);
        }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }
        .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(184,245,102,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,245,102,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }
        nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2rem;
          background: rgba(8,8,8,0.88); backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }
        .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
        .btn-ghost {
          padding: 0.5rem 1.25rem; background: transparent;
          border: 1px solid var(--border); border-radius: 8px;
          color: var(--text); font-size: 0.875rem; font-weight: 500;
          text-decoration: none; cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
        .btn-primary {
          padding: 0.5rem 1.25rem; background: var(--accent);
          border: none; border-radius: 8px; color: #080808;
          font-size: 0.875rem; font-weight: 700;
          text-decoration: none; cursor: pointer; transition: opacity 0.15s;
        }
        .btn-primary:hover { opacity: 0.9; }
        .content { position: relative; z-index: 1; }
        .hero { max-width: 900px; margin: 0 auto; padding: 6rem 2rem 5rem; text-align: center; }
        .hero-badge {
          display: inline-block; padding: 0.35rem 1rem;
          background: var(--accent-dim); border: 1px solid rgba(184,245,102,0.2);
          border-radius: 100px; color: var(--accent);
          font-size: 0.78rem; font-weight: 600; margin-bottom: 2rem;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800;
          letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 1.5rem;
        }
        .hero h1 span { color: var(--accent); }
        .hero p {
          font-size: clamp(1rem, 2vw, 1.2rem); color: var(--muted);
          max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.75;
        }
        .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-hero-primary {
          padding: 0.875rem 2.25rem; background: var(--accent);
          border: none; border-radius: 12px; color: #080808;
          font-size: 1rem; font-weight: 700; text-decoration: none;
          display: inline-block; transition: opacity 0.15s, transform 0.1s;
        }
        .btn-hero-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-hero-ghost {
          padding: 0.875rem 2.25rem; background: transparent;
          border: 1px solid #252525; border-radius: 12px; color: var(--text);
          font-size: 1rem; font-weight: 500; text-decoration: none;
          display: inline-block; transition: border-color 0.15s;
        }
        .btn-hero-ghost:hover { border-color: #3a3a3a; }
        .social-proof { margin-top: 3rem; color: var(--muted); font-size: 0.875rem; }
        .social-proof span { color: var(--accent); font-weight: 600; }
        section { padding: 5rem 2rem; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 0.73rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--accent); margin-bottom: 1rem;
        }
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 800;
          letter-spacing: -0.03em; margin-bottom: 1rem;
        }
        .section-sub {
          color: var(--muted); font-size: 1rem;
          max-width: 500px; margin-bottom: 3rem; line-height: 1.7;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .feature-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 1.75rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover { border-color: rgba(184,245,102,0.28); transform: translateY(-2px); }
        .feature-icon { margin-bottom: 1rem; }
        .feature-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
        .feature-desc { color: var(--muted); font-size: 0.875rem; line-height: 1.65; }

        /* Google Import section */
        .import-section { background: #0b0b0b; }
        .import-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem; margin-bottom: 2.5rem;
        }
        .import-card {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 14px; padding: 1.25rem 1.5rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .import-dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        }
        .import-card-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.2rem; }
        .import-card-desc { font-size: 0.8rem; color: var(--muted); }
        .import-cta-wrap { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
        .btn-google {
          display: inline-flex; align-items: center; gap: 0.75rem;
          padding: 0.875rem 1.75rem;
          background: #fff; border: none; border-radius: 12px;
          color: #1a1a1a; font-size: 0.95rem; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .btn-google:hover { opacity: 0.93; transform: translateY(-1px); }
        .import-note { color: var(--muted); font-size: 0.85rem; }

        /* Pricing */
        .pricing-section { background: #0c0c0c; }
        .pricing-card {
          background: var(--surface); border: 1px solid rgba(184,245,102,0.25);
          border-radius: 24px; padding: 3rem; max-width: 480px;
          margin: 0 auto; text-align: center; position: relative; overflow: hidden;
        }
        .pricing-card::before {
          content: ''; position: absolute; top: 0; left: 50%;
          transform: translateX(-50%); width: 200px; height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }
        .pricing-badge {
          display: inline-block; padding: 0.25rem 0.75rem;
          background: var(--accent-dim); border: 1px solid rgba(184,245,102,0.2);
          border-radius: 100px; color: var(--accent);
          font-size: 0.73rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; margin-bottom: 1.5rem;
        }
        .pricing-amount { font-size: 3.5rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
        .pricing-period { color: var(--muted); font-size: 1rem; margin-bottom: 0.5rem; }
        .pricing-alt { color: var(--muted); font-size: 0.875rem; margin-bottom: 2rem; }
        .pricing-alt strong { color: var(--accent); }
        .pricing-features { list-style: none; text-align: left; margin-bottom: 2rem; }
        .pricing-features li {
          padding: 0.6rem 0; border-bottom: 1px solid var(--border);
          font-size: 0.9rem; display: flex; align-items: center; gap: 0.75rem;
        }
        .pricing-features li:last-child { border-bottom: none; }
        .pricing-cta {
          display: block; width: 100%; padding: 1rem;
          background: var(--accent); color: #080808; font-weight: 700;
          font-size: 1rem; border: none; border-radius: 12px;
          text-decoration: none; text-align: center;
          cursor: pointer; transition: opacity 0.15s; margin-bottom: 1rem;
        }
        .pricing-cta:hover { opacity: 0.9; }
        .pricing-note { color: var(--muted); font-size: 0.8rem; }

        /* Waitlist */
        .waitlist-section {
          text-align: center;
          background: linear-gradient(180deg, transparent, rgba(184,245,102,0.025));
        }
        .waitlist-form {
          display: flex; gap: 0.75rem; max-width: 480px;
          margin: 2rem auto 0; flex-wrap: wrap; justify-content: center;
        }
        .waitlist-input {
          flex: 1; min-width: 220px; padding: 0.875rem 1.25rem;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; color: var(--text); font-size: 1rem;
          outline: none; transition: border-color 0.15s;
        }
        .waitlist-input:focus { border-color: var(--accent); }
        .waitlist-btn {
          padding: 0.875rem 1.75rem; background: var(--accent);
          color: #080808; font-weight: 700; font-size: 0.95rem;
          border: none; border-radius: 12px; cursor: pointer;
          transition: opacity 0.15s; white-space: nowrap;
        }
        .waitlist-btn:hover { opacity: 0.9; }
        .waitlist-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .waitlist-success { margin-top: 1rem; color: var(--accent); font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .waitlist-error { margin-top: 1rem; color: #f87171; font-size: 0.9rem; }

        footer {
          padding: 2.5rem 2rem; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1rem;
        }
        .footer-tagline { color: var(--muted); font-size: 0.8rem; margin-top: 0.25rem; }
        .footer-link { color: var(--muted); font-size: 0.875rem; text-decoration: none; transition: color 0.15s; }
        .footer-link:hover { color: var(--text); }
        @media (max-width: 600px) {
          .hero { padding: 4rem 1.25rem 3rem; }
          section { padding: 3.5rem 1.25rem; }
          .pricing-card { padding: 2rem 1.5rem; }
          footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="grid-bg" />

      <div className="content">
        <nav>
          <a href="/" style={{textDecoration:'none'}}><Logo height={28} /></a>
          <div className="nav-actions">
            <a href="/login" className="btn-ghost">Sign In</a>
            <a href="/register" className="btn-primary">Start Free</a>
          </div>
        </nav>

        <div className={`fade-in ${visible ? 'visible' : ''}`}>
          <div className="hero">
            <div className="hero-badge">Personal Finance. Reimagined.</div>
            <h1>Your whole life.<br /><span>One dashboard.</span></h1>
            <p>
              Finance, fitness, food, and calendar in one place.
              Connect your bank, your gym, your Google apps and finally see the full picture.
            </p>
            <div className="hero-ctas">
              <a href="/register" className="btn-hero-primary">Start for free</a>
              <a href="/login" className="btn-hero-ghost">Sign in</a>
            </div>
            <div className="social-proof">
              Join <span>early adopters</span> who ditched five apps for one
            </div>
          </div>
        </div>

        {/* Features */}
        <section>
          <div className="section-inner">
            <div className="section-label">Features</div>
            <div className="section-title">Everything in one place</div>
            <div className="section-sub">
              Not just finance. Your entire lifestyle in one calm, focused dashboard.
            </div>
            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Google 1-click import */}
        <section className="import-section">
          <div className="section-inner">
            <div className="section-label">Integrations</div>
            <div className="section-title">1-click Google import</div>
            <div className="section-sub">
              Everything from your Google account flows in automatically.
              No CSV, no copy paste, no setup friction.
            </div>
            <div className="import-grid">
              {googleImports.map((g, i) => (
                <div key={i} className="import-card">
                  <div className="import-dot" style={{background: g.color}} />
                  <div>
                    <div className="import-card-name">{g.name}</div>
                    <div className="import-card-desc">{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="import-cta-wrap">
              <a href="/register" className="btn-google">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Connect Google Account
              </a>
              <span className="import-note">Read-only access. Revoke anytime.</span>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="pricing-section">
          <div className="section-inner">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="section-label">Pricing</div>
              <div className="section-title">Simple, honest pricing</div>
              <div className="section-sub" style={{ margin: '0 auto' }}>
                One plan. Everything included. No surprise charges.
              </div>
            </div>
            <div className="pricing-card">
              <div className="pricing-badge">Pro Plan</div>
              <div className="pricing-amount">$10</div>
              <div className="pricing-period">/month</div>
              <div className="pricing-alt">or <strong>$96/year (save 20%)</strong></div>
              <ul className="pricing-features">
                {pricingFeatures.map((f, i) => (
                  <li key={i}><Check />{f}</li>
                ))}
              </ul>
              <a href="/register" className="pricing-cta">Start Free Trial</a>
              <div className="pricing-note">14 day free trial. No credit card required.</div>
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section className="waitlist-section">
          <div className="section-inner">
            <div className="section-label">Early Access</div>
            <div className="section-title">Get early access</div>
            <div className="section-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
              Join the waitlist and be first when new features like Google sync, food tracking, and fitness launch.
            </div>
            <form className="waitlist-form" onSubmit={handleWaitlist}>
              <input
                type="email"
                className="waitlist-input"
                placeholder="you@example.com"
                value={waitlistEmail}
                onChange={e => setWaitlistEmail(e.target.value)}
                required
              />
              <button type="submit" className="waitlist-btn" disabled={waitlistStatus === 'loading'}>
                {waitlistStatus === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
            {waitlistStatus === 'success' && (
              <div className="waitlist-success">
                <Check />{waitlistMsg}
              </div>
            )}
            {waitlistStatus === 'error' && <div className="waitlist-error">{waitlistMsg}</div>}
          </div>
        </section>

        <footer>
          <div>
            <Logo height={24} />
            <div className="footer-tagline">Your whole life. One dashboard.</div>
          </div>
          <a href="/login" className="footer-link">Sign in</a>
        </footer>
      </div>
    </>
  )
}
