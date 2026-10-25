"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

// Counts from 0 to `to` the first time it scrolls into view.
export function CountUp({ to, decimals = 0, prefix = "", suffix = "", duration = 1.6, delay = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) =>
    prefix +
    v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
    suffix,
  );

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
