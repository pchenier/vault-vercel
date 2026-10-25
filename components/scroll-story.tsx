"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { LogoMark } from "./logo";

const ease = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    n: "01",
    title: "Connect in a minute.",
    body: "Link your banks through Plaid, add Wise with a read-only token, paste a public wallet address. Fiscit never gets the keys to move money.",
  },
  {
    n: "02",
    title: "Messy statements, cleaned up.",
    body: "Cryptic descriptors become real merchants and sensible categories — in English or French — so your spending finally reads like a sentence.",
  },
  {
    n: "03",
    title: "See the whole picture.",
    body: "Net worth across every currency, monthly spend by category, and the savings rate that tells you if you're actually getting ahead.",
  },
];

export function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))));

  return (
    <section id="how" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex gap-6">
            <div className="relative hidden w-px shrink-0 bg-line sm:block">
              <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-lime" style={{ scaleY: progress }} />
            </div>
            <div className="min-h-[15rem] flex-1 sm:min-h-[17rem]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-lime">How it works</p>
              <div className="mb-6 flex gap-2">
                {STEPS.map((s, i) => (
                  <span
                    key={s.n}
                    className={`tabular font-mono text-xs transition-colors duration-300 ${i === step ? "text-text" : "text-dim"}`}
                  >
                    {s.n}
                  </span>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease }}
                >
                  <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                    {STEPS[step].title}
                  </h2>
                  <p className="mt-5 max-w-md leading-relaxed text-muted">{STEPS[step].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[min(440px,48svh)] lg:max-w-[460px]">
            <AnimatePresence mode="wait">
              {step === 0 && <ConnectVisual key="c" />}
              {step === 1 && <CategorizeVisual key="z" />}
              {step === 2 && <InsightVisual key="i" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-3xl border border-line-strong bg-surface p-5 sm:p-7"
      initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.96, rotate: 2 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  );
}

const NODES = [
  { label: "Chequing", x: 18, y: 18 },
  { label: "Credit card", x: 82, y: 16 },
  { label: "Wise", x: 90, y: 54 },
  { label: "TFSA", x: 74, y: 86 },
  { label: "SOL wallet", x: 24, y: 86 },
  { label: "Savings", x: 10, y: 52 },
];

function ConnectVisual() {
  return (
    <Panel>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {NODES.map((n, i) => (
          <motion.line
            key={n.label}
            x1={n.x}
            y1={n.y}
            x2="50"
            y2="52"
            stroke="#b8f566"
            strokeOpacity="0.5"
            strokeWidth="0.4"
            strokeDasharray="1.2 1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute left-1/2 top-[52%] grid -translate-x-1/2 -translate-y-1/2 place-items-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      >
        <motion.span
          className="absolute size-24 rounded-full border border-lime/30"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="grid size-16 place-items-center rounded-2xl border border-line-strong bg-bg shadow-[0_0_60px_rgba(184,245,102,0.25)]">
          <LogoMark size={36} />
        </span>
      </motion.div>
      {NODES.map((n, i) => (
        <motion.span
          key={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-line-strong bg-surface-2 px-3 py-1.5 text-xs font-medium"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 + i * 0.12 }}
        >
          {n.label}
        </motion.span>
      ))}
    </Panel>
  );
}

const TXNS = [
  { raw: "TIM HORTONS #2231 MTL QC", name: "Tim Hortons", cat: "Food", color: "#fbbf24", amt: "−$6.45" },
  { raw: "PAIEMENT HYDRO-QUEBEC 0042", name: "Hydro-Québec", cat: "Utilities", color: "#60a5fa", amt: "−$118.20" },
  { raw: "SQ *CAFE OLIMPICO", name: "Café Olimpico", cat: "Food", color: "#fbbf24", amt: "−$4.75" },
  { raw: "NETFLIX.COM 866-579", name: "Netflix", cat: "Subscriptions", color: "#f472b6", amt: "−$20.99" },
  { raw: "VIR DEPOT PAIE EMPLOYEUR", name: "Salary", cat: "Income", color: "#b8f566", amt: "+$3,240.00" },
];

function CategorizeVisual() {
  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between text-xs text-muted">
        <span>Recent transactions</span>
        <span className="font-mono">auto-categorized</span>
      </div>
      <ul className="space-y-2.5">
        {TXNS.map((t, i) => (
          <li key={t.raw} className="relative h-12 overflow-hidden rounded-xl border border-line bg-surface-2 sm:h-14">
            <motion.div
              className="absolute inset-0 flex items-center px-3 font-mono text-[11px] text-dim sm:text-xs"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -16 }}
              transition={{ delay: 0.5 + i * 0.18, duration: 0.35, ease }}
            >
              {t.raw}
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center gap-3 px-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 + i * 0.18, duration: 0.45, ease }}
            >
              <span className="size-2 shrink-0 rounded-full" style={{ background: t.color }} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.name}</span>
              <span
                className="hidden rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline"
                style={{ background: `${t.color}1f`, color: t.color }}
              >
                {t.cat}
              </span>
              <span className={`tabular text-sm ${t.amt.startsWith("+") ? "text-lime" : ""}`}>{t.amt}</span>
            </motion.div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const BARS = [
  { label: "Housing", v: 0.92, color: "#60a5fa" },
  { label: "Food", v: 0.54, color: "#fbbf24" },
  { label: "Transport", v: 0.33, color: "#a78bfa" },
  { label: "Subs", v: 0.18, color: "#f472b6" },
  { label: "Fun", v: 0.41, color: "#34d399" },
];

function InsightVisual() {
  const rate = 0.31;
  const C = 2 * Math.PI * 40;
  return (
    <Panel>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-5">
          <div className="relative size-28 shrink-0 sm:size-32">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1f1f1f" strokeWidth="9" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#b8f566"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: C * (1 - rate) }}
                transition={{ duration: 1.4, delay: 0.3, ease }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-2xl font-semibold">31%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted">saved</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">October</div>
            <div className="mt-1 text-sm text-muted">
              You kept <span className="font-semibold text-text">$1,240</span> more than September. Food is down 12%.
            </div>
          </div>
        </div>
        <div className="mt-auto flex h-[45%] items-end justify-between gap-2 sm:gap-3">
          {BARS.map((b, i) => (
            <div key={b.label} className="flex h-full flex-1 flex-col justify-end gap-2">
              <motion.div
                className="w-full origin-bottom rounded-t-lg"
                style={{ height: `${b.v * 100}%`, background: `linear-gradient(to top, ${b.color}33, ${b.color})` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.08, ease }}
              />
              <span className="truncate text-center text-[10px] text-muted sm:text-[11px]">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
