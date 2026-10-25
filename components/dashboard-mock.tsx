"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Bitcoin, Building2, Globe2, LineChart, PiggyBank } from "lucide-react";
import { CountUp } from "./count-up";

const W = 480;
const H = 132;

// Same point count per range so Motion can tween the path `d` between them.
const SERIES: Record<string, number[]> = {
  "1M": [62, 60, 63, 61, 64, 66, 65, 67, 66, 69, 71, 70, 72, 74, 73, 76, 75, 78, 80, 79, 82, 84, 83, 86],
  "6M": [38, 41, 40, 44, 43, 47, 46, 50, 49, 48, 53, 55, 54, 58, 61, 60, 64, 63, 68, 71, 70, 76, 80, 86],
  "1Y": [20, 22, 21, 25, 28, 27, 31, 30, 35, 38, 36, 41, 45, 44, 50, 53, 52, 58, 62, 66, 70, 74, 79, 86],
};

const RANGES = Object.keys(SERIES);

function toPath(values: number[]) {
  const max = 100;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - (v / max) * H] as const);
  // Catmull-Rom → cubic Bézier for a smooth line.
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const ACCOUNTS = [
  { icon: Building2, name: "Chequing", meta: "Bank · Plaid", amount: "$8,412.30", delta: "+$1,240" },
  { icon: PiggyBank, name: "High-interest savings", meta: "Bank · Plaid", amount: "$42,150.00", delta: "+$600" },
  { icon: LineChart, name: "TFSA", meta: "Investments · Questrade", amount: "$61,880.12", delta: "+2.8%" },
  { icon: Globe2, name: "Wise · USD", meta: "Multi-currency", amount: "$3,250.00", delta: "≈ C$4,485" },
  { icon: Bitcoin, name: "Crypto wallets", meta: "Solana · Bitcoin", amount: "$4,210.44", delta: "−1.9%", down: true },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function DashboardMock() {
  const [range, setRange] = useState("6M");
  const line = useMemo(() => toPath(SERIES[range]), [range]);
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const lastY = H - (SERIES[range].at(-1)! / 100) * H;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-line-strong bg-surface/90 p-5 shadow-[0_40px_120px_-40px_rgba(184,245,102,0.25)] backdrop-blur-xl sm:p-6">
      {/* top bar */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#2a2a2a]" />
          <span className="size-2.5 rounded-full bg-[#2a2a2a]" />
          <span className="size-2.5 rounded-full bg-[#2a2a2a]" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="relative flex size-2">
            <motion.span
              className="absolute inset-0 rounded-full bg-lime"
              animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative size-2 rounded-full bg-lime" />
          </span>
          Synced just now
        </div>
      </div>

      {/* net worth */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Net worth · CAD</div>
          <div className="mt-1 text-[2.1rem] font-semibold leading-none tracking-tight sm:text-[2.6rem]">
            <CountUp to={184320.57} decimals={2} prefix="$" duration={2.2} delay={0.5} />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.5, ease }}
          className="rounded-full bg-lime-dim px-2.5 py-1 text-xs font-semibold text-lime"
        >
          ▲ 4.2% this month
        </motion.div>
      </div>

      {/* chart */}
      <div className="relative mt-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full overflow-visible sm:h-32" preserveAspectRatio="none">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8f566" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#b8f566" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#1f1f1f" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          ))}
          <motion.path
            d={area}
            fill="url(#area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, d: area }}
            transition={{ opacity: { delay: 1.2, duration: 0.8 }, d: { duration: 0.7, ease } }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="#b8f566"
            strokeWidth="2.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, d: line }}
            transition={{ pathLength: { delay: 0.4, duration: 1.6, ease }, d: { duration: 0.7, ease } }}
          />
        </svg>
        <motion.span
          className="absolute right-0 size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-lime shadow-[0_0_0_4px_rgba(184,245,102,0.2)]"
          initial={{ opacity: 0, top: `${(lastY / H) * 100}%` }}
          animate={{ opacity: 1, top: `${(lastY / H) * 100}%` }}
          transition={{ opacity: { delay: 1.9 }, top: { duration: 0.7, ease } }}
        />
        <div className="mt-3 flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`relative rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                range === r ? "text-bg" : "text-muted hover:text-text"
              }`}
            >
              {range === r && (
                <motion.span layoutId="range-pill" className="absolute inset-0 rounded-md bg-lime" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
      </div>

      {/* accounts */}
      <motion.ul
        className="mt-5 divide-y divide-line border-t border-line"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.9 } } }}
      >
        {ACCOUNTS.map((a) => (
          <motion.li
            key={a.name}
            variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
            className="flex items-center gap-3 py-2.5"
          >
            <span className="grid size-8 place-items-center rounded-lg border border-line bg-surface-2 text-muted">
              <a.icon size={15} strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{a.name}</span>
              <span className="block truncate text-xs text-dim">{a.meta}</span>
            </span>
            <span className="text-right">
              <span className="tabular block text-sm font-medium">{a.amount}</span>
              <span className={`tabular block text-xs ${a.down ? "text-red" : "text-lime"}`}>{a.delta}</span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
