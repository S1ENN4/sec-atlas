// Translation engine: pure functions, no I/O. Used by pages at build time and
// by the validator / i18n tooling in plain Node.
//
// MODEL
//   A "unit" is a piece of content (a topic, a quiz, a glossary, the UI...).
//   Its SOURCE is a plain object in the unit's source language. Every string
//   leaf is addressed by a stable key path ("sections.2.body.0") unless its
//   field name is in NON_TRANSLATABLE_KEYS (ids, slugs, enums, tool names...).
//   A translation overlay maps key -> { t: translated text, h: hash of the
//   source string it was made from }.
//
// DRIFT DETECTION
//   When the source string changes, its hash changes, so the stored `h` no
//   longer matches: the entry is STALE. Stale text is never shown (the source
//   text is used instead) and the validator fails the build until someone
//   re-translates it, prunes it, or explicitly confirms it with `keep`.

import { createHash } from "node:crypto";

// Fields whose string values are identifiers, enums, proper names or data, not
// prose. Matched against the nearest non-numeric key on the path, so
// `tools.2` (tool names) and `options.1` (quiz option text) resolve to
// `tools` (skipped) and `options` (translated) respectively.
export const NON_TRANSLATABLE_KEYS = new Set([
  "slug", "domain", "id", "kind", "stage", "stageId", "tools", "topic", "route", "accent", "status",
  "language", "index", "source", "target", "sourceHandle", "targetHandle", "href", "ref", "refs",
  "level", "requires", "topics", "certs", "adjacent", "contentLang", "lang", "role", "icon", "url", "date", "period", "key",
]);

export interface OverlayEntry {
  t: string;
  h: string;
}
export type Overlay = Record<string, OverlayEntry>;

export const hashText = (s: string) => createHash("sha1").update(s, "utf8").digest("hex").slice(0, 8);

const lastNamedKey = (path: string[]) => {
  for (let i = path.length - 1; i >= 0; i--) if (!/^\d+$/.test(path[i])) return path[i];
  return "";
};

/** Every translatable string of `source`, keyed by path. */
export function extract(source: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (node: unknown, path: string[]) => {
    if (typeof node === "string") {
      if (node.trim() && !NON_TRANSLATABLE_KEYS.has(lastNamedKey(path))) out[path.join(".")] = node;
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, [...path, String(i)]));
    } else if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
    }
  };
  walk(source, []);
  return out;
}

/**
 * String leaves that `extract` skips because their field name is in
 * NON_TRANSLATABLE_KEYS. In a unit made only of prose (the UI dictionary) any
 * such leaf is a bug: it could never be translated.
 */
export function skippedStrings(source: unknown): string[] {
  const kept = extract(source);
  const out: string[] = [];
  const walk = (node: unknown, path: string[]) => {
    if (typeof node === "string") {
      const key = path.join(".");
      if (node.trim() && !(key in kept)) out.push(key);
    } else if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...path, String(i)]));
    else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
  };
  walk(source, []);
  return out;
}

export type EntryStatus = "ok" | "stale" | "missing";

export interface Report {
  total: number;
  ok: number;
  stale: string[];
  missing: string[];
  orphans: string[]; // overlay keys that no longer exist in the source
}

export function compare(source: unknown, overlay: Overlay | null): Report {
  const strings = extract(source);
  const rep: Report = { total: 0, ok: 0, stale: [], missing: [], orphans: [] };
  for (const [key, text] of Object.entries(strings)) {
    rep.total++;
    const e = overlay?.[key];
    if (!e) rep.missing.push(key);
    else if (e.h !== hashText(text)) rep.stale.push(key);
    else rep.ok++;
  }
  for (const key of Object.keys(overlay ?? {})) if (!(key in strings)) rep.orphans.push(key);
  return rep;
}

/** Deep clone of `source` with every fresh translation applied. */
export function applyOverlay<T>(source: T, overlay: Overlay | null): { value: T; report: Report } {
  const report = compare(source, overlay);
  if (!overlay || report.ok === 0) return { value: source, report };
  const strings = extract(source);
  const pick = (path: string[], original: string) => {
    const key = path.join(".");
    const e = overlay[key];
    return e && key in strings && e.h === hashText(original) ? e.t : original;
  };
  const walk = (node: unknown, path: string[]): unknown => {
    if (typeof node === "string") {
      return node.trim() && !NON_TRANSLATABLE_KEYS.has(lastNamedKey(path)) ? pick(path, node) : node;
    }
    if (Array.isArray(node)) return node.map((v, i) => walk(v, [...path, String(i)]));
    if (node && typeof node === "object") {
      return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v, [...path, k])]));
    }
    return node;
  };
  return { value: walk(source, []) as T, report };
}

// ---------------------------------------------------------------------------
// Structural checks on a fresh translation (validator + `apply`).
// ---------------------------------------------------------------------------
const tokens = (s: string) => (s.match(/\{[\w.]+\}|<\/?[a-z][\w-]*>/gi) ?? []).sort().join("|");

export function checkTranslation(key: string, source: string, translated: string): string | null {
  if (!translated.trim()) return "empty translation";
  if (tokens(source) !== tokens(translated)) return `placeholders/tags differ (${tokens(source) || "none"} vs ${tokens(translated) || "none"})`;
  if (isCodeKey(key)) {
    const lines = (s: string) => s.split("\n").filter((l) => l.trim()).length;
    if (lines(source) !== lines(translated)) return "code sample changed its number of lines";
  }
  return null;
}

/** A "translation" that is just the source text pasted back. Long prose only; callers skip code samples. */
export const looksUntranslated = (source: string, translated: string) => source.length > 48 && source.trim() === translated.trim();

export const isCodeKey = (key: string) => key.endsWith(".code") && /(^|\.)code\.\d+\.code$/.test(key);
