"use client";

import { useEffect } from "react";

import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/i18n/config";

function pickLocale(): string {
  try {
    const saved = window.localStorage.getItem("kb:lang");
    if (saved && isLocale(saved)) return saved;
  } catch {
    /* storage blocked */
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function LocaleRedirect() {
  useEffect(() => {
    const target = `/${pickLocale()}${window.location.hash}`;
    window.location.replace(target);
  }, []);
  return null;
}
