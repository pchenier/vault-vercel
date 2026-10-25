"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import { SIGNUP_URL } from "@/lib/links";

const ease = [0.16, 1, 0.3, 1] as const;

const INCLUDED = [
  "Unlimited bank accounts",
  "Wise, crypto and investment accounts",
  "Automatic categorization (EN / FR)",
  "Net worth and savings-rate tracking",
  "Subscription detection",
  "Monthly plain-language recaps",
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  const price = yearly ? 8 : 10;

  return (
    <section id="pricing" className="relative scroll-mt-24 overflow-hidden px-4 py-28 sm:px-6">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.06] blur-[120px]" />
      <div className="relative mx-auto max-w-6xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-lime">Pricing</p>
        <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          One plan. Everything in it.
        </h2>

        <div className="mt-8 inline-flex rounded-xl border border-line bg-surface p-1 text-sm">
          {[
            { k: false, label: "Monthly" },
            { k: true, label: "Yearly · save 20%" },
          ].map((o) => (
            <button
              key={o.label}
              onClick={() => setYearly(o.k)}
              className={`relative rounded-lg px-4 py-1.5 font-medium transition-colors ${yearly === o.k ? "text-bg" : "text-muted hover:text-text"}`}
            >
              {yearly === o.k && (
                <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-lg bg-lime" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <span className="relative">{o.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto mt-10 max-w-md rounded-3xl border border-line-strong bg-surface p-8 text-left"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-muted">$</span>
            <span className="relative inline-flex h-[4.5rem] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={price}
                  initial={{ y: yearly ? 60 : -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: yearly ? -60 : 60, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="tabular text-7xl font-semibold leading-none tracking-tighter"
                >
                  {price}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-muted">/ month</span>
          </div>
          <p className="mt-2 h-5 text-sm text-muted">{yearly ? "Billed $96 yearly" : "Billed monthly, cancel anytime"}</p>

          <ul className="mt-8 space-y-3">
            {INCLUDED.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease }}
                className="flex items-center gap-3 text-sm"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-lime-dim text-lime">
                  <Check size={12} strokeWidth={3} />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>

          <a
            href={SIGNUP_URL}
            className="mt-8 block rounded-xl bg-lime py-3 text-center font-semibold text-bg transition-transform hover:-translate-y-0.5"
          >
            Start 14-day free trial
          </a>
          <p className="mt-3 text-center text-xs text-dim">No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}
