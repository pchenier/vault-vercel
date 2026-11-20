"use client";

import { MotionConfig } from "motion/react";
import { LangProvider } from "@/lib/i18n/client";
import type { Lang } from "@/lib/i18n/config";

// reducedMotion="user" turns transform/layout animations off for visitors who
// ask their OS for reduced motion; opacity fades still run.
export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <LangProvider lang={lang}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LangProvider>
  );
}
