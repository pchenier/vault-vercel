"use client";

import "./globals.css";
import { ErrorScreen, primaryButton } from "@/components/error-screen";

// Replaces the root layout when the layout itself fails, so it brings its own <html>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <ErrorScreen
          code="500"
          title="Fiscit hit a snag."
          message="Something broke while loading the page. It has been logged; try again in a moment."
          reference={error.digest}
          action={
            <button type="button" onClick={reset} className={primaryButton}>
              Try again
            </button>
          }
        />
      </body>
    </html>
  );
}
