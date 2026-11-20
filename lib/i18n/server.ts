// Server-side language helpers (Server Components, generateMetadata, route handlers).
import { cookies, headers } from "next/headers";
import { isLang, langFromAcceptLanguage, langFromCookieString, LANG_COOKIE, type Lang } from "./config";
import { getDictionary } from "./dictionaries";

// Cookie first, then the browser's Accept-Language, else English.
export async function getLang(): Promise<Lang> {
  const fromCookie = (await cookies()).get(LANG_COOKIE)?.value;
  if (isLang(fromCookie)) return fromCookie;
  return langFromAcceptLanguage((await headers()).get("accept-language"));
}

export async function getI18n() {
  const lang = await getLang();
  return { lang, t: getDictionary(lang) };
}

// Same rule for a route handler's Request (API errors and emails).
export function langFromRequest(request: Request): Lang {
  return (
    langFromCookieString(request.headers.get("cookie")) ??
    langFromAcceptLanguage(request.headers.get("accept-language"))
  );
}
