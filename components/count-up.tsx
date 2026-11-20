"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/client";
import type { Lang } from "@/lib/i18n/config";

type Props = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  // A dollar amount: "$1,234.56" in English, "1 234,56 $" in French
  currency?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
};

// Counts from 0 to `to` the first time it scrolls into view. Keyed on the language
// so the number is re-formatted when the visitor switches FR / EN.
export function CountUp(props: Props) {
  const { lang } = useI18n();
  return <Counter key={lang} lang={lang} {...props} />;
}

function Counter({ lang, to, decimals = 0, prefix = "", suffix = "", currency = false, duration = 1.6, delay = 0, className }: Props & { lang: Lang }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => {
    const opts = { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
    if (lang === "fr") {
      // fr-CA groups with a narrow no-break space; Québec copy uses a plain no-break space
      const n = v.toLocaleString("fr-CA", opts).replace(/ /g, " ");
      return prefix + n + (currency ? " $" : "") + suffix;
    }
    return (currency ? "$" : "") + prefix + v.toLocaleString("en-US", opts) + suffix;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, delay, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, duration, delay, value]);

  return (
    <motion.span ref={ref} className={`tabular ${className ?? ""}`}>
      {text}
    </motion.span>
  );
}
