"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { DashboardMock } from "./dashboard-mock";
import { SIGNIN_URL, SIGNUP_URL } from "@/lib/links";

const ease = [0.16, 1, 0.3, 1] as const;

function Words({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "105%", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease }}
          >
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Cursor-follow glow + card tilt, both spring-smoothed.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const glowX = useTransform(sx, (v) => `${v * 100}%`);
  const glowY = useTransform(sy, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY}, rgba(184,245,102,0.10), transparent 60%)`;
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [6, -6]);

  // Card rises and flattens as you scroll past the hero.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <section ref={ref} onPointerMove={onMove} className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-lime/10 blur-[120px]"
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <motion.div style={{ opacity: textOpacity }} className="text-center lg:text-left">
          <motion.a
            href="#how"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="group mb-7 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur transition-colors hover:border-lime/40 hover:text-text"
          >
            <span className="rounded-full bg-lime px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-bg">New</span>
            Crypto + Questrade now in your net worth
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <h1 className="text-[clamp(2.6rem,7vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            <Words text="Your money," />
            <br />
            <Words
              text="finally clear."
              delay={0.25}
              className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-lime"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mx-auto mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted lg:mx-0"
          >
            Every bank, card, Wise balance, crypto wallet and investment account in one calm dashboard. Net worth,
            spending and savings rate — updated on their own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href={SIGNUP_URL}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-lime px-6 py-3 font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Start free</span>
              <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={SIGNIN_URL}
              className="rounded-xl border border-line-strong px-6 py-3 font-medium transition-colors hover:border-[#3a3a3a] hover:bg-surface"
            >
              Sign in
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-dim lg:justify-start"
          >
            <Lock size={12} /> Read-only connections · 14-day free trial · No card required
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          style={{ perspective: 1200 }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <motion.div style={{ rotateX, rotateY, y: cardY, scale: cardScale, transformStyle: "preserve-3d" }}>
            <DashboardMock />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              transition={{ opacity: { delay: 2 }, x: { delay: 2, duration: 0.6, ease }, y: { delay: 2.6, duration: 5, repeat: Infinity, ease: "easeInOut" } }}
              style={{ translateZ: 60 }}
              className="absolute -right-8 top-[42%] hidden rounded-2xl border border-line-strong bg-surface-2/95 px-4 py-3 shadow-2xl backdrop-blur xl:block"
            >
              <div className="text-[11px] uppercase tracking-wider text-muted">Savings rate</div>
              <div className="text-xl font-semibold text-lime">31%</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
              transition={{ opacity: { delay: 2.2 }, x: { delay: 2.2, duration: 0.6, ease }, y: { delay: 2.8, duration: 6, repeat: Infinity, ease: "easeInOut" } }}
              style={{ translateZ: 40 }}
              className="absolute -left-14 bottom-20 hidden items-center gap-3 rounded-2xl border border-line-strong bg-surface-2/95 px-4 py-3 shadow-2xl backdrop-blur xl:flex"
            >
              <span className="grid size-8 place-items-center rounded-full bg-red/15 text-sm text-red">!</span>
              <div>
                <div className="text-xs font-medium">3 forgotten subscriptions</div>
                <div className="text-[11px] text-muted">$47.97 / month</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
