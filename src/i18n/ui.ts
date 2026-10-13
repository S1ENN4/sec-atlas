// UI strings. English is the source (ui.en.ts); pt/es are overlays in
// src/content/i18n/<locale>/ui.json with per-string drift hashes. The UI unit is
// STRICT: every key must be translated and fresh in every locale or the build
// fails, so a UI string can never silently fall back or go stale.

import { ui as en } from "./ui-source";
import { applyOverlay } from "./engine";
import { readOverlay } from "./store";
import { SOURCE_LOCALE, type Locale } from "./config";

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };
export type Ui = Widen<typeof en>;

export const UI_UNIT = "ui";
export const uiSource = en;

const cache = new Map<Locale, Ui>();

export function getUi(locale: Locale): Ui {
  const hit = cache.get(locale);
  if (hit) return hit;
  const value = locale === SOURCE_LOCALE ? (en as Ui) : (applyOverlay(en as Ui, readOverlay(locale, UI_UNIT)).value as Ui);
  cache.set(locale, value);
  return value;
}
