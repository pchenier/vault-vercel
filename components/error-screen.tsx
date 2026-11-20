import Link from "next/link";
import { Logo } from "./logo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Lang } from "@/lib/i18n/config";

// Shared by not-found, error and global-error. Plain markup (no motion) so it still
// renders when the thing that broke is the rest of the app. Takes the language as a
// prop (no context), since global-error renders outside the root layout.
export function ErrorScreen({
  lang,
  code,
  title,
  message,
  action,
  reference,
}: {
  lang: Lang;
  code: string;
  title: string;
  message: string;
  action?: React.ReactNode;
  reference?: string;
}) {
  const t = getDictionary(lang);
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 text-text">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(184,245,102,.12), transparent)" }}
      />
      <div className="relative w-full max-w-md text-center">
        <Link href="/" aria-label={t.common.homeAria} className="inline-flex">
          <Logo />
        </Link>
        <div className="mt-10 font-serif text-[88px] italic leading-none text-lime">{code}</div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">{message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {action}
          <Link
            href="/"
            className="rounded-xl border border-line-strong px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-muted"
          >
            {t.errors.home}
          </Link>
          <a
            href="mailto:support@fiscit.com"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-text"
          >
            {t.errors.support}
          </a>
        </div>
        {reference && <p className="mt-8 text-xs text-dim">{t.errors.reference} {reference}</p>}
      </div>
    </main>
  );
}

export const primaryButton =
  "rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90";
