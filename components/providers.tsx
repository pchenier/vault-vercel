"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user" turns transform/layout animations off for visitors who
// ask their OS for reduced motion; opacity fades still run.
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
