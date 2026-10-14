// In-text glossary terms. Builds, per locale, the list of phrases in topic prose
// that can open a definition popup, and splits a piece of text into plain
// strings and matches. Pure and deterministic; the React part lives in
// src/components/glossary-text.tsx.
//
// What is linkable (to keep false positives out):
//   * a term that is an acronym, has a digit or an inner capital (SAST, IaC,
//     Argon2id, OAuth), or has a space/hyphen/slash (prompt injection);
//   * NOT a plain single word ("Model", "Control", "Scope"): those are common
//     words and would be linked everywhere.
// Matching is case-insensitive for multi-word terms and case-sensitive for the
// single-token ones. Only the first occurrence of each term on a page is linked.

import { domains } from "@/content/registry";
import type { DomainId } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { termId } from "@/lib/term-id";

export interface TermInfo {
  id: string;
  term: string;
  aka?: string;
  meaning: string;
}

interface Candidate {
  text: string;
  info: TermInfo;
  re: RegExp;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when a phrase is specific enough to link automatically. */
export function linkable(phrase: string): boolean {
  if (phrase.length < 3) return false;
  if (/[\s/-]/.test(phrase)) return true;
  if (/\d/.test(phrase)) return true;
  // all caps (SAST) or an inner capital (IaC, OAuth)
  return /[A-Z]/.test(phrase.slice(1));
}

const cache = new Map<Locale, Candidate[]>();

function build(locale: Locale): Candidate[] {
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const id of Object.keys(domains) as DomainId[]) {
    for (const group of localizeDomain(id, locale).domain.glossary) {
      for (const e of group.entries) {
        const key = termId(e.term);
        if (seen.has(key)) continue; // same term in two domains: the first wins
        seen.add(key);
        const info: TermInfo = { id: key, term: e.term, aka: e.aka, meaning: e.meaning };
        const phrases = [e.term, ...(e.aka ? e.aka.split(/\s*[·|]\s*/) : [])].map((p) => p.trim()).filter(linkable);
        for (const p of new Set(phrases)) {
          const multi = /[\s/-]/.test(p);
          out.push({ text: p, info, re: new RegExp(`(?<![\\p{L}\\p{N}])${escape(p)}(?![\\p{L}\\p{N}])`, multi ? "iu" : "u") });
        }
      }
    }
  }
  return out.sort((a, b) => b.text.length - a.text.length);
}

export function candidatesFor(locale: Locale): Candidate[] {
  let c = cache.get(locale);
  if (!c) {
    c = build(locale);
    cache.set(locale, c);
  }
  return c;
}

export type Piece = string | { match: string; info: TermInfo };

/**
 * Split `text` into pieces, linking the first occurrence of every term that has
 * not been used yet (`used` is shared across a whole page) up to `max` terms.
 */
export function splitTerms(text: string, locale: Locale, used: Set<string>, max: number): Piece[] {
  let pieces: Piece[] = [text];
  for (const c of candidatesFor(locale)) {
    if (used.size >= max) break;
    if (used.has(c.info.id)) continue;
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      if (typeof p !== "string") continue;
      const m = c.re.exec(p);
      if (!m) continue;
      used.add(c.info.id);
      pieces = [...pieces.slice(0, i), ...[p.slice(0, m.index), { match: m[0], info: c.info } as Piece, p.slice(m.index + m[0].length)].filter((x) => x !== ""), ...pieces.slice(i + 1)];
      break;
    }
  }
  return pieces;
}
