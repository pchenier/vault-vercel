"use client";

import { useEffect } from "react";
import { ErrorScreen, primaryButton } from "@/components/error-screen";
import { useI18n } from "@/lib/i18n/client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang, t } = useI18n();

  useEffect(() => {
    // The digest matches the server log line (Vercel → Logs / Better Stack)
    console.error("Page error", error.digest ?? "", error.message);
  }, [error]);

  return (
    <ErrorScreen
      lang={lang}
      code="500"
      title={t.errors.errorTitle}
      message={t.errors.errorMessage}
      reference={error.digest}
      action={
        <button type="button" onClick={reset} className={primaryButton}>
          {t.errors.tryAgain}
        </button>
      }
    />
  );
}
