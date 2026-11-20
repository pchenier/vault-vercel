// Shared by server and client code: the language list, the cookie, and how a
// language is picked when there is no cookie yet.
//
// The cookie is shared with the dashboard (app.fiscit.com): same name, same
// values, Domain=.fiscit.com in production.

export const LANGS = ["en", "fr"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "fiscit_lang";
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, in seconds

export function isLang(v: unknown): v is Lang {
  return v === "en" || v === "fr";
}

// Value for <html lang>
export function htmlLang(lang: Lang): string {
  return lang === "fr" ? "fr-CA" : "en";
}

// First of French or English in the visitor's preference order wins; anything
// else (or nothing) means English. `prefs` is already sorted, most preferred first.
export function pickLang(prefs: readonly string[]): Lang {
  for (const p of prefs) {
    const primary = p.trim().toLowerCase().split("-")[0];
    if (primary === "fr") return "fr";
    if (primary === "en") return "en";
  }
  return DEFAULT_LANG;
}

// "fr-CA,fr;q=0.9,en;q=0.8" → ["fr-CA", "fr", "en"], sorted by q (stable)
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((s) => s.trim()).find((s) => s.startsWith("q="));
      const weight = q ? Number(q.slice(2)) : 1;
      return { tag: tag.trim(), weight: Number.isFinite(weight) ? weight : 0, i };
    })
    .filter((x) => x.tag && x.tag !== "*" && x.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.i - b.i)
    .map((x) => x.tag);
}

export function langFromAcceptLanguage(header: string | null | undefined): Lang {
  return pickLang(parseAcceptLanguage(header));
}

// Reads `fiscit_lang` out of a raw Cookie header (or document.cookie).
export function langFromCookieString(cookie: string | null | undefined): Lang | null {
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === LANG_COOKIE) {
      const v = decodeURIComponent(part.slice(eq + 1).trim());
      return isLang(v) ? v : null;
    }
  }
  return null;
}
