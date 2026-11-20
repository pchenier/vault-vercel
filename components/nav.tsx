"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Logo } from "./logo";
import { LangSwitch } from "./lang-switch";
import { SIGNIN_URL, SIGNUP_URL } from "@/lib/links";
import { useI18n } from "@/lib/i18n/client";

export function Nav() {
  const { t } = useI18n();
  const links = [
    { href: "#how", label: t.nav.how },
    { href: "#features", label: t.nav.features },
    { href: "#pricing", label: t.nav.pricing },
  ];
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
        <a href="/" aria-label={t.common.homeAria}>
          <Logo />
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
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
          <LangSwitch />
          <a href={SIGNIN_URL} className="hidden rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:text-text min-[440px]:inline">
            {t.nav.signIn}
          </a>
          <a
            href={SIGNUP_URL}
            className="rounded-lg bg-lime px-3.5 py-1.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-px active:translate-y-0"
          >
            {t.nav.startFree}
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
