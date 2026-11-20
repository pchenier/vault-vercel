"use client";

import "./globals.css";
import { useSyncExternalStore } from "react";
import { ErrorScreen, primaryButton } from "@/components/error-screen";
import { detectClientLang } from "@/lib/i18n/client";
import { DEFAULT_LANG, htmlLang, type Lang } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const noSubscribe = () => () => {};

// Replaces the root layout when the layout itself fails, so it brings its own <html>.
// The layout (and its language) is gone here, so the language is read in the browser:
// fiscit_lang cookie, else navigator.languages.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = useSyncExternalStore<Lang>(noSubscribe, detectClientLang, () => DEFAULT_LANG);
  const t = getDictionary(lang);
  return (
    <html lang={htmlLang(lang)}>
      <body>
        <ErrorScreen
          lang={lang}
          code="500"
          title={t.errors.globalTitle}
          message={t.errors.globalMessage}
          reference={error.digest}
          action={
            <button type="button" onClick={reset} className={primaryButton}>
              {t.errors.tryAgain}
            </button>
          }
        />
      </body>
    </html>
  );
}
