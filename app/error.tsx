"use client";

import { useEffect } from "react";
import { ErrorScreen, primaryButton } from "@/components/error-screen";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // The digest matches the server log line (Vercel → Logs / Better Stack)
    console.error("Page error", error.digest ?? "", error.message);
  }, [error]);

  return (
    <ErrorScreen
      code="500"
      title="Something went wrong."
      message="We hit an unexpected error and it has been logged. Try again; if it keeps happening, contact support."
      reference={error.digest}
      action={
        <button type="button" onClick={reset} className={primaryButton}>
          Try again
        </button>
      }
    />
  );
}
