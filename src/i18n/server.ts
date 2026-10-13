// Server-side helpers shared by pages and route handlers.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LOCALES, OG_LOCALE, isLocale, localePath, type Locale } from "./config";
import { getUi, type Ui } from "./ui";

/** Await route params and validate the locale (404 otherwise). */
export async function resolveLocale(params: Promise<{ lang: string }>): Promise<{ locale: Locale; t: Ui }> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { locale: lang, t: getUi(lang) };
}

/** Canonical + hreflang alternates for a path ("/" for the home page). */
export function alternatesFor(locale: Locale, path = "/"): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(locale, path),
    languages: { ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])), "x-default": localePath("en", path) },
  };
}

export const openGraphLocale = (locale: Locale) => ({
  locale: OG_LOCALE[locale],
  alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
});
