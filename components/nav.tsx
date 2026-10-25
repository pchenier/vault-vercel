"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Logo } from "./logo";
import { SIGNIN_URL, SIGNUP_URL } from "@/lib/links";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled ? "border-line bg-bg/75 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <a href="/" aria-label="Fiscit home">
          <Logo />
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:text-text"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={SIGNIN_URL} className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:text-text">
            Sign in
          </a>
          <a
            href={SIGNUP_URL}
            className="rounded-lg bg-lime px-3.5 py-1.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-px active:translate-y-0"
          >
            Start free
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
