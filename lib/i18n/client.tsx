"use client";

import { createContext, useContext } from "react";
import {
  DEFAULT_LANG,
  LANG_COOKIE,
  LANG_COOKIE_MAX_AGE,
  langFromCookieString,
  pickLang,
  type Lang,
} from "./config";
import { getDictionary } from "./dictionaries";

const LangContext = createContext<Lang>(DEFAULT_LANG);

// The root layout reads the language on the server and passes it in, so the
// first render is already in the right language. Switching sets the cookie and
// calls router.refresh(), which re-renders the layout with the new value.
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const lang = useContext(LangContext);
  return { lang, t: getDictionary(lang) };
}

// Domain=.fiscit.com in production so app.fiscit.com sees the same choice;
// host-only on localhost and preview hosts.
export function setLangCookie(lang: Lang) {
  const host = window.location.hostname;
  const domain = host === "fiscit.com" || host.endsWith(".fiscit.com") ? "; Domain=.fiscit.com" : "";
  document.cookie = `${LANG_COOKIE}=${lang}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax${domain}`;
}

// For code that runs outside the provider (global-error): cookie, then
// navigator.languages, else English. Browser only.
export function detectClientLang(): Lang {
  return (
    langFromCookieString(document.cookie) ??
    pickLang(navigator.languages?.length ? navigator.languages : [navigator.language ?? ""])
  );
}
