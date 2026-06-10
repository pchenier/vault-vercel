'use client'
import { useState, useEffect, useRef } from 'react'

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

  const features = [
    { icon: '🏦', title: 'All accounts in one place', desc: 'Plaid connects 12,000+ banks. See every account at a glance.' },
    { icon: '📈', title: 'Savings Rate Tracker', desc: 'Know your savings percentage every month. Build wealth consciously.' },
    { icon: '🎯', title: 'Budget Projections', desc: 'Get alerted before you overspend. Stay on track automatically.' },
    { icon: '🔍', title: 'Subscription Radar', desc: 'Spot forgotten subscriptions and recurring charges instantly.' },
    { icon: '💱', title: 'Multi currency', desc: 'Wise integration for USD, CAD, EUR and more in one dashboard.' },
    { icon: '🔒', title: 'Your data, private', desc: 'Encrypted at rest. Never sold. You own your financial story.' },
  ]

  const pricingFeatures = [
    'Connect unlimited bank accounts',
    'Real time transaction sync',
    'Savings rate tracking',
    'Budget projections',
    'Subscription detection',
    'Multi currency support',
    'Wise integration',
    'Secure encrypted storage',
  ]

  return (
    <>
      <style>{`
        :root {
          --bg: #080808;
          --surface: #111;
          --border: #1e1e1e;
          --text: #f4f4f5;
          --muted: #71717a;
          --accent: #4ade80;
          --accent-dim: rgba(74,222,128,0.12);
        }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        /* Grid background */
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }
        /* Nav */
        nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          background: rgba(8,8,8,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -0.03em;
          text-decoration: none;
        }
        .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
        .btn-ghost {
          padding: 0.5rem 1.25rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
        .btn-primary {
          padding: 0.5rem 1.25rem;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          color: #080808;
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .btn-primary:hover { opacity: 0.9; }
        /* Content */
        .content { position: relative; z-index: 1; }
        /* Hero */
        .hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 6rem 2rem 5rem;
          text-align: center;
        }
        .hero-badge {
          display: inline-block;
          padding: 0.35rem 1rem;
          background: var(--accent-dim);
          border: 1px solid rgba(74,222,128,0.25);
          border-radius: 100px;
          color: var(--accent);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .hero h1 span { color: var(--accent); }
        .hero p {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--muted);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .hero-ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-hero-primary {
          padding: 0.875rem 2rem;
          background: var(--accent);
          border: none;
          border-radius: 12px;
          color: #080808;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          display: inline-block;
        }
        .btn-hero-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-hero-ghost {
          padding: 0.875rem 2rem;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          color: var(--text);
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.15s;
          display: inline-block;
        }
        .btn-hero-ghost:hover { border-color: #4a4a4a; }
        .social-proof {
          margin-top: 3rem;
          color: var(--muted);
          font-size: 0.875rem;
        }
        .social-proof span { color: var(--accent); font-weight: 600; }
        /* Section */
        section { padding: 5rem 2rem; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          margin-bottom: 1rem;
        }
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .section-sub {
          color: var(--muted);
          font-size: 1rem;
          max-width: 500px;
          margin-bottom: 3rem;
          line-height: 1.7;
        }
        /* Features grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.75rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover { border-color: rgba(74,222,128,0.3); transform: translateY(-2px); }
        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .feature-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }
        .feature-desc {
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        /* Pricing */
        .pricing-section { background: #0c0c0c; }
        .pricing-card {
          background: var(--surface);
          border: 1px solid rgba(74,222,128,0.3);
          border-radius: 24px;
          padding: 3rem;
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }
        .pricing-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: var(--accent-dim);
          border: 1px solid rgba(74,222,128,0.25);
          border-radius: 100px;
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }
        .pricing-amount {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .pricing-period {
          color: var(--muted);
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .pricing-alt {
          color: var(--muted);
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }
        .pricing-alt strong { color: var(--accent); }
        .pricing-features {
          list-style: none;
          text-align: left;
          margin-bottom: 2rem;
        }
        .pricing-features li {
          padding: 0.6rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .pricing-features li:last-child { border-bottom: none; }
        .check { color: var(--accent); font-weight: 700; }
        .pricing-cta {
          display: block;
          width: 100%;
          padding: 1rem;
          background: var(--accent);
          color: #080808;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          border-radius: 12px;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          transition: opacity 0.15s;
          margin-bottom: 1rem;
        }
        .pricing-cta:hover { opacity: 0.9; }
        .pricing-note {
          color: var(--muted);
          font-size: 0.8rem;
        }
        /* Waitlist */
        .waitlist-section {
          text-align: center;
          background: linear-gradient(180deg, transparent, rgba(74,222,128,0.03));
        }
        .waitlist-form {
          display: flex;
          gap: 0.75rem;
          max-width: 480px;
          margin: 2rem auto 0;
          flex-wrap: wrap;
          justify-content: center;
        }
        .waitlist-input {
          flex: 1;
          min-width: 220px;
          padding: 0.875rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-size: 1rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .waitlist-input:focus { border-color: var(--accent); }
        .waitlist-btn {
          padding: 0.875rem 1.75rem;
          background: var(--accent);
          color: #080808;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .waitlist-btn:hover { opacity: 0.9; }
        .waitlist-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .waitlist-success {
          margin-top: 1rem;
          color: var(--accent);
          font-size: 0.9rem;
        }
        .waitlist-error {
          margin-top: 1rem;
          color: #f87171;
          font-size: 0.9rem;
        }
        /* Footer */
        footer {
          padding: 2.5rem 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: gap;
          gap: 1rem;
        }
        .footer-logo {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -0.03em;
        }
        .footer-tagline {
          color: var(--muted);
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }
        .footer-link {
          color: var(--muted);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.15s;
        }
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
          <a href="/" className="nav-logo"><img src="/logo.svg" alt="Vault" style={{height:'28px'}} /></a>
          <div className="nav-actions">
            <a href="/login" className="btn-ghost">Sign In</a>
            <a href="/register" className="btn-primary">Start Free</a>
          </div>
        </nav>

        {/* Hero */}
        <div className={`fade-in ${visible ? 'visible' : ''}`}>
          <div className="hero">
            <div className="hero-badge">Personal Finance. Reimagined.</div>
            <h1>Your finances.<br /><span>Finally clear.</span></h1>
            <p>
              Connect all your accounts in one place. Track your savings rate,
              monitor every budget category, and understand your net worth at a glance.
            </p>
            <div className="hero-ctas">
              <a href="/register" className="btn-hero-primary">Start for free</a>
              <a href="/login" className="btn-hero-ghost">Sign in</a>
            </div>
            <div className="social-proof">
              Join <span>early adopters</span> tracking their wealth with Vault
            </div>
          </div>
        </div>

        {/* Features */}
        <section>
          <div className="section-inner">
            <div className="section-label">Features</div>
            <div className="section-title">Everything you need to understand your money</div>
            <div className="section-sub">
              Built for people who want clarity. Not another app full of charts you never look at.
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
                  <li key={i}><span className="check">✓</span> {f}</li>
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
              Join the waitlist and be first to know when new features launch.
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
              <button
                type="submit"
                className="waitlist-btn"
                disabled={waitlistStatus === 'loading'}
              >
                {waitlistStatus === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
            {waitlistStatus === 'success' && <div className="waitlist-success">✓ {waitlistMsg}</div>}
            {waitlistStatus === 'error' && <div className="waitlist-error">{waitlistMsg}</div>}
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div>
            <div className="footer-logo"><img src="/logo.svg" alt="Vault" style={{height:'24px'}} /></div>
            <div className="footer-tagline">Your finances. Finally clear.</div>
          </div>
          <a href="/login" className="footer-link">Sign in</a>
        </footer>
      </div>
    </>
  )
}
