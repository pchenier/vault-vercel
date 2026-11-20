import Link from "next/link";
import { Logo } from "./logo";
import { LangSwitch } from "./lang-switch";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Lang } from "@/lib/i18n/config";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

// One language's version of a legal page (lib/i18n/legal/*). Section ids are the
// same in every language so #anchors keep working.
export type LegalDoc = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  accent: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
};

// Shared layout for /privacy and /terms: sticky table of contents on desktop,
// readable measure, brand header/footer.
export function LegalPage({
  lang,
  title,
  accent,
  updated,
  intro,
  sections,
}: {
  lang: Lang;
  title: string;
  accent: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  const t = getDictionary(lang);
  return (
    <div className="legal">
      <div className="grid-bg pointer-events-none absolute inset-0 h-[520px]" />
      <header className="legal-top">
        <Link href="/" aria-label={t.common.homeAria}>
          <Logo />
        </Link>
        <nav>
          <Link href="/privacy">{t.legal.privacy}</Link>
          <Link href="/terms">{t.legal.terms}</Link>
          <Link href="/login">{t.legal.signIn}</Link>
          <span className="ml-2 hidden sm:inline-flex">
            <LangSwitch />
          </span>
        </nav>
      </header>

      <div className="legal-hero">
        <p className="legal-eyebrow">{t.legal.eyebrow}</p>
        <h1>
          {title} <em>{accent}</em>
        </h1>
        <p className="legal-updated">{t.legal.updated(updated)}</p>
        <div className="legal-intro">{intro}</div>
      </div>

      <div className="legal-body">
        <aside className="legal-toc" aria-label={t.legal.toc}>
          <p>{t.legal.toc}</p>
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
          <Link href="/privacy">{t.legal.privacy}</Link>
          <Link href="/terms">{t.legal.terms}</Link>
          <a href="mailto:privacy@fiscit.com">privacy@fiscit.com</a>
          <LangSwitch />
        </div>
      </footer>
    </div>
  );
}
