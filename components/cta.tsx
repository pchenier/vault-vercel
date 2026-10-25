"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { SIGNIN_URL, SIGNUP_URL } from "@/lib/links";

function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.a
      href={href}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      className="group inline-flex items-center gap-3 rounded-2xl bg-lime px-8 py-4 text-lg font-semibold text-bg"
    >
      {children}
      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
    </motion.a>
  );
}

export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pt-24 pb-10 sm:px-6">
      <div className="grid-bg pointer-events-none absolute inset-0 rotate-180" />
      <motion.div style={{ scale, opacity }} className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
          Stop guessing.
          <br />
          <span className="font-serif font-normal italic text-lime">Start knowing.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-muted">Connect your first account in under a minute. Free for 14 days.</p>
        <div className="mt-10">
          <MagneticButton href={SIGNUP_URL}>Create your dashboard</MagneticButton>
        </div>
      </motion.div>

      <footer className="relative mx-auto mt-32 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-dim sm:flex-row">
        <Logo />
        <div className="flex gap-6">
          <a href="#features" className="hover:text-text">Features</a>
          <a href="#pricing" className="hover:text-text">Pricing</a>
          <a href={SIGNIN_URL} className="hover:text-text">Sign in</a>
        </div>
        <span>© {new Date().getFullYear()} Fiscit</span>
      </footer>
    </section>
  );
}
