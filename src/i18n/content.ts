// Content localisation for pages and tooling (server / Node only).
//
//   localizeUnit()    : apply a locale's overlay to one unit's source object
//   localizeDomain()  : a whole domain (topics, glossary, pipeline, labels)
//   listUnits()       : every translatable unit, for the validator and CLI
//
// A unit whose locale equals its source language is returned untouched. For
// any other locale, fresh translations are applied and everything else falls
// back to the source text, flagged via `fallback` so the UI can say so.

import { domains } from "@/content/registry";
import { getQuiz } from "@/content/quiz";
import type { Domain, DomainId, Topic } from "@/content/types";

import { applyOverlay, compare, type Report } from "./engine";
import { SOURCE_LOCALE, type Locale } from "./config";
import { readOverlay } from "./store";

export type SourceLang = "en" | "pt";

export interface Localized<T> {
  value: T;
  /** Language the source text is written in. */
  sourceLang: SourceLang;
  /** True when part of `value` is still in `sourceLang` because it is untranslated or stale. */
  fallback: boolean;
  report: Report | null;
}

export function localizeUnit<T>(unitId: string, source: T, sourceLang: SourceLang, locale: Locale): Localized<T> {
  if (locale === sourceLang) return { value: source, sourceLang, fallback: false, report: null };
  const { value, report } = applyOverlay(source, readOverlay(locale, unitId));
  return { value, sourceLang, fallback: report.ok < report.total, report };
}

export const domainLang = (d: Domain): SourceLang => d.contentLang ?? "en";

export function localizedTopic(id: DomainId, slug: string, locale: Locale): Topic | undefined {
  const d = domains[id];
  const t = d.topics.find((x) => x.slug === slug);
  return t ? localizeUnit(`topic:${id}/${slug}`, t, domainLang(d), locale).value : undefined;
}

// --- unit sources -----------------------------------------------------------
// Labels that live inside shared structures are lifted into their own unit so
// they translate as a group: pipeline text, relation labels, graph labels.
export const domainUnitSource = (d: Domain) => ({
  pipeline: d.pipeline,
  relations: d.relations.map((r) => ({ label: r.label })),
});
export const glossaryUnitSource = (d: Domain) => ({ groups: d.glossary });
export const quizUnitSource = (id: DomainId, slug: string) => ({ questions: getQuiz(id, slug) });

export interface LocalizedDomain {
  domain: Domain;
  sourceLang: SourceLang;
  /** Some unit of this domain is partly shown in the source language. */
  fallback: boolean;
}

export function localizeDomain(id: DomainId, locale: Locale): LocalizedDomain {
  const d = domains[id];
  const lang = domainLang(d);
  let fallback = false;
  const note = (l: Localized<unknown>) => {
    if (l.fallback) fallback = true;
  };

  const topics: Topic[] = d.topics.map((t) => {
    const l = localizeUnit(`topic:${id}/${t.slug}`, t, lang, locale);
    note(l);
    return l.value;
  });
  const meta = localizeUnit(`domain:${id}`, domainUnitSource(d), lang, locale);
  const gloss = localizeUnit(`glossary:${id}`, glossaryUnitSource(d), lang, locale);
  note(meta);
  note(gloss);

  return {
    sourceLang: lang,
    fallback,
    domain: {
      ...d,
      topics,
      pipeline: meta.value.pipeline,
      relations: d.relations.map((r, i) => ({ ...r, label: meta.value.relations[i]?.label ?? r.label })),
      glossary: gloss.value.groups,
    },
  };
}

// --- enumeration (tooling) --------------------------------------------------
export interface UnitInfo {
  id: string;
  source: unknown;
  lang: SourceLang;
  /** Strict units must be 100% translated and fresh in every locale, or the build fails. */
  strict: boolean;
  /** The unit is pure prose (the UI dictionary): every string leaf must be translatable. */
  allProse?: boolean;
  group: string;
}

export function listUnits(extra: UnitInfo[] = []): UnitInfo[] {
  const out: UnitInfo[] = [];
  for (const d of Object.values(domains)) {
    const lang = domainLang(d);
    out.push({ id: `domain:${d.id}`, source: domainUnitSource(d), lang, strict: false, group: d.id });
    out.push({ id: `glossary:${d.id}`, source: glossaryUnitSource(d), lang, strict: false, group: d.id });
    for (const t of d.topics) {
      out.push({ id: `topic:${d.id}/${t.slug}`, source: t, lang, strict: false, group: d.id });
      out.push({ id: `quiz:${d.id}/${t.slug}`, source: quizUnitSource(d.id, t.slug), lang, strict: false, group: d.id });
    }
  }
  return [...out, ...extra];
}

export { SOURCE_LOCALE, compare };
