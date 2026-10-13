"use client";

// Tiny client context so client components can build locale-aware links and
// know the current locale without prop-drilling. Carries only the locale.

import { createContext, useContext, type ReactNode } from "react";

import { localePath, type Locale } from "./config";

const Ctx = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);

/** Locale-aware href builder for client components: `const lp = useLocalePath(); lp("/about")`. */
export function useLocalePath() {
  const locale = useLocale();
  return (path = "/") => localePath(locale, path);
}
