"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

const ease = [0.16, 1, 0.3, 1] as const;

const POINTS = [
  "Every bank, card, Wise balance and wallet in one place",
  "Read-only connections — we can never move your money",
  "Spending sorted automatically, in English or French",
];

// Shared frame for login, register, verify and onboarding: brand panel on the
// left (desktop), animated card on the right. `stepKey` re-animates the card
// content when it changes (onboarding steps).
export function AuthShell({
  children,
  stepKey,
  wide = false,
}: {
  children: React.ReactNode;
  stepKey?: string;
  wide?: boolean;
}) {
  return (
    <div className="auth">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        className="auth-glow"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="auth-top">
        <Link href="/" aria-label="Fiscit home">
          <Logo />
        </Link>
      </header>

      <div className="auth-layout">
        <aside className="auth-brand" aria-hidden>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            Your money,
            <br />
            <em>finally clear.</em>
          </motion.h2>
          <svg viewBox="0 0 320 90" className="auth-spark">
            <defs>
              <linearGradient id="authArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8f566" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#b8f566" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 78 C 40 70, 60 74, 90 60 S 150 52, 180 40 S 250 30, 280 16 L 320 8 L 320 90 L 0 90 Z"
              fill="url(#authArea)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
            <motion.path
              d="M0 78 C 40 70, 60 74, 90 60 S 150 52, 180 40 S 250 30, 280 16 L 320 8"
              fill="none"
              stroke="#b8f566"
              strokeWidth="2.25"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 1.6, ease }}
            />
          </svg>
          <ul>
            {POINTS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease }}
              >
                <span>
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </motion.li>
            ))}
          </ul>
        </aside>

        <motion.main
          className={`auth-card ${wide ? "auth-card-wide" : ""}`}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stepKey ?? "static"}
              initial={{ opacity: 0, x: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -16, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}

export function AuthTitle({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="auth-head">
      <h1>{children}</h1>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export function GoogleButton({ label }: { label: string }) {
  return (
    <a href="/api/auth/google-signin" className="auth-google">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.909c1.702-1.567 2.683-3.875 2.683-6.615Z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
      </svg>
      {label}
    </a>
  );
}

export function AuthSpinner() {
  return (
    <div className="auth auth-center">
      <span className="auth-spinner" aria-label="Loading" />
    </div>
  );
}
