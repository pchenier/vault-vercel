import Link from "next/link";
import { Logo } from "./logo";

// Shared by not-found, error and global-error. Plain markup (no motion) so it still
// renders when the thing that broke is the rest of the app.
export function ErrorScreen({
  code,
  title,
  message,
  action,
  reference,
}: {
  code: string;
  title: string;
  message: string;
  action?: React.ReactNode;
  reference?: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 text-text">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(184,245,102,.12), transparent)" }}
      />
      <div className="relative w-full max-w-md text-center">
        <Link href="/" aria-label="Fiscit home" className="inline-flex">
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
            Back to home
          </Link>
          <a
            href="mailto:support@fiscit.com"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-text"
          >
            Contact support
          </a>
        </div>
        {reference && <p className="mt-8 text-xs text-dim">Reference: {reference}</p>}
      </div>
    </main>
  );
}

export const primaryButton =
  "rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90";
