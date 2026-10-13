// Locale configuration. Plain constants only: safe to import from server,
// client and plain-Node scripts (validator, i18n tooling).
//
// English is the SOURCE OF TRUTH: new content is authored in English and the
// other locales are translations that must follow it (see engine.ts for how
// drift is detected). Content that has not been migrated yet is "legacy" and
// is authored in Portuguese: see `contentLang` on Domain and src/i18n/units.ts.

export const LOCALES = ["en", "pt", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const SOURCE_LOCALE: Locale = "en";
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

// BCP 47 tag for <html lang>, and Open Graph locale.
export const HTML_LANG: Record<Locale, string> = { en: "en", pt: "pt-BR", es: "es" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", pt: "pt_BR", es: "es_ES" };

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

// "/" + locale + path. localePath("pt", "/about") -> "/pt/about"; "/" -> "/pt".
export const localePath = (locale: Locale, path = "/") => (path === "/" || path === "" ? `/${locale}` : `/${locale}${path.startsWith("/") ? path : `/${path}`}`);

// Replace the locale segment of a pathname: "/en/secops/topic/waf" -> "/pt/secops/topic/waf".
export function switchLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] && isLocale(parts[1])) parts[1] = next;
  else parts.splice(1, 0, next);
  return parts.join("/") || `/${next}`;
}
