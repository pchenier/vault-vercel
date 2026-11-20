"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLangCookie, useI18n } from "@/lib/i18n/client";
import type { Lang } from "@/lib/i18n/config";

const OPTIONS: { lang: Lang; label: string; name: string }[] = [
  { lang: "fr", label: "FR", name: "Français" },
  { lang: "en", label: "EN", name: "English" },
];

// Compact "FR / EN" switch. Sets the shared fiscit_lang cookie, then refreshes
// so the server re-renders everything (layout included) in the new language.
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Lang) {
    if (next === lang) return;
    setLangCookie(next);
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="group"
      aria-label={t.common.langSwitch}
      className={`inline-flex items-center gap-0.5 text-xs font-medium tracking-wide ${pending ? "opacity-60" : ""} ${className}`}
    >
      {OPTIONS.map((o, i) => (
        <span key={o.lang} className="inline-flex items-center gap-0.5">
          {i > 0 && (
            <span aria-hidden className="text-dim">
              /
            </span>
          )}
          <button
            type="button"
            lang={o.lang}
            aria-label={o.name}
            aria-pressed={lang === o.lang}
            onClick={() => choose(o.lang)}
            className={`cursor-pointer rounded px-1.5 py-1 transition-colors ${
              lang === o.lang ? "bg-surface-2 text-text" : "text-muted hover:text-text"
            }`}
          >
            {o.label}
          </button>
        </span>
      ))}
    </div>
  );
}
