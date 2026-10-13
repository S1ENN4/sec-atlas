// Overlay storage: one JSON file per (locale, unit), committed to the repo.
//   src/content/i18n/<locale>/ui.json
//   src/content/i18n/<locale>/topic/<domain>/<slug>.json
// Server / Node only (uses fs). Pages call this at build time.

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import type { Overlay } from "./engine";
import type { Locale } from "./config";

const ROOT = process.cwd();
const BASE = join(ROOT, "src", "content", "i18n");

// "topic:secops/waf" -> <BASE>/<locale>/topic/secops/waf.json ; "ui" -> <BASE>/<locale>/ui.json
export function overlayPath(locale: Locale, unitId: string): string {
  const [kind, rest] = unitId.split(":");
  return join(BASE, locale, ...(rest ? [kind, ...rest.split("/")] : [kind])) + ".json";
}

const cache = new Map<string, Overlay | null>();

export function readOverlay(locale: Locale, unitId: string): Overlay | null {
  const file = overlayPath(locale, unitId);
  if (cache.has(file)) return cache.get(file) ?? null;
  let value: Overlay | null = null;
  if (existsSync(file)) {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as { entries?: Overlay };
    value = parsed.entries ?? {};
  }
  cache.set(file, value);
  return value;
}

export function writeOverlay(locale: Locale, unitId: string, entries: Overlay): void {
  const file = overlayPath(locale, unitId);
  const sorted = Object.fromEntries(Object.keys(entries).sort(naturalKeyOrder).map((k) => [k, entries[k]]));
  if (Object.keys(sorted).length === 0) {
    // Nothing left to store: remove the file so coverage reports stay honest.
    if (existsSync(file)) unlinkSync(file);
    cache.delete(file);
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify({ entries: sorted }, null, 2) + "\n", "utf8");
  cache.set(file, sorted);
}

// "sections.2.body.10" sorts after "sections.2.body.9": keep diffs readable.
const naturalKeyOrder = (a: string, b: string) => a.localeCompare(b, "en", { numeric: true });
