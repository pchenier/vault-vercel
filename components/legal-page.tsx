import Link from "next/link";
import { Logo } from "./logo";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

// Shared layout for /privacy and /terms: sticky table of contents on desktop,
// readable measure, brand header/footer.
export function LegalPage({
  title,
  accent,
  updated,
  intro,
  sections,
}: {
  title: string;
  accent: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="legal">
      <div className="grid-bg pointer-events-none absolute inset-0 h-[520px]" />
      <header className="legal-top">
        <Link href="/" aria-label="Fiscit home">
          <Logo />
        </Link>
        <nav>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/login">Sign in</Link>
        </nav>
      </header>

      <div className="legal-hero">
        <p className="legal-eyebrow">Legal</p>
        <h1>
          {title} <em>{accent}</em>
        </h1>
        <p className="legal-updated">Last updated {updated}</p>
        <div className="legal-intro">{intro}</div>
      </div>

      <div className="legal-body">
        <aside className="legal-toc" aria-label="On this page">
          <p>On this page</p>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>
        </aside>
        <article className="legal-article">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id}>
              <h2>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>

      <footer className="legal-foot">
        <Logo />
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>
        </div>
      </footer>
    </div>
  );
}
