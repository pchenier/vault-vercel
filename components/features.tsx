"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { BellRing, Coins, Globe2, Languages, ShieldCheck, Sparkles, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";

const ease = [0.16, 1, 0.3, 1] as const;

type Feature = { icon: LucideIcon; title: string; body: string; span?: string };

// Icon and grid span per card; the words come from the dictionary, in the same order.
const CARDS: { icon: LucideIcon; span?: string }[] = [
  { icon: Wallet, span: "md:col-span-2" },
  { icon: TrendingUp },
  { icon: BellRing },
  { icon: Globe2 },
  { icon: Coins },
  { icon: Languages },
  { icon: ShieldCheck, span: "md:col-span-2" },
  { icon: Sparkles },
];

function Card({ f, i }: { f: Feature; i: number }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${x}px ${y}px, rgba(184,245,102,0.09), transparent 70%)`;
  const border = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgba(184,245,102,0.5), transparent 70%)`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-200);
        y.set(-200);
      }}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 ${f.span ?? ""}`}
    >
      {/* lit border that follows the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: border,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
      <div className="relative">
        <span className="mb-5 grid size-10 place-items-center rounded-xl border border-line-strong bg-surface-2 text-lime transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
          <f.icon size={18} strokeWidth={1.75} />
        </span>
        <h3 className="mb-2 font-semibold tracking-tight">{f.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{f.body}</p>
      </div>
    </motion.li>
  );
}

export function Features() {
  const { t } = useI18n();
  const features: Feature[] = CARDS.map((c, i) => ({ ...c, ...t.features.items[i] }));
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-28 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="mb-12 max-w-2xl"
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-lime">{t.features.eyebrow}</p>
        <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {t.features.title((s) => <span className="font-serif font-normal italic text-lime">{s}</span>)}
        </h2>
      </motion.div>
      <ul className="grid gap-4 md:grid-cols-3">
        {features.map((f, i) => (
          <Card key={f.title} f={f} i={i} />
        ))}
      </ul>
    </section>
  );
}
