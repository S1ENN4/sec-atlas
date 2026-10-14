// Cross-cutting content (bridges, study paths, scenarios, changelog, source
// notes, profile) as translatable units. These are LEGACY (authored in
// Portuguese) until migrated; they use the same drift rules as everything else.

import { bridges } from "@/content/bridges";
import { roles } from "@/content/careers";
import { changelog } from "@/content/changelog";
import { exploreText } from "@/content/explore/text";
import { paths } from "@/content/paths";
import { profile } from "@/content/profile";
import { scenarios } from "@/content/scenarios";
import { sources } from "@/content/sources";

import type { Locale } from "./config";
import { localizeUnit, type Localized, type SourceLang, type UnitInfo } from "./content";

const LANG: SourceLang = "pt";

// Only the prose of a profile is translatable; links, ids and proper nouns stay.
const profileSource = () => ({
  headline: profile.headline,
  location: profile.location,
  summary: profile.summary,
  languages: profile.languages,
  experience: profile.experience,
  education: profile.education,
  certifications: profile.certifications,
  contentNote: profile.contentNote,
});

// Source labels are names (OWASP Top 10, ...): only the one-line notes translate.
const sourcesSource = () => ({ notes: Object.fromEntries(Object.entries(sources).map(([d, list]) => [d, list.map((s) => ({ note: s.note }))])) });

export const GLOBAL_UNITS: { id: string; source: () => unknown; strict: boolean; lang?: SourceLang }[] = [
  // Authored in English: strict, so all three languages must be complete and fresh.
  { id: "careers", source: () => ({ roles }), strict: true, lang: "en" },
  { id: "explore", source: () => exploreText, strict: true, lang: "en" },
  { id: "bridges", source: () => ({ items: bridges }), strict: false },
  { id: "paths", source: () => ({ items: paths }), strict: false },
  { id: "scenarios", source: () => ({ items: scenarios }), strict: false },
  { id: "changelog", source: () => ({ items: changelog }), strict: false },
  { id: "sources", source: sourcesSource, strict: false },
  { id: "profile", source: profileSource, strict: false },
];

export const globalUnitInfos = (): UnitInfo[] =>
  GLOBAL_UNITS.map((u) => ({ id: u.id, source: u.source(), lang: u.lang ?? LANG, strict: u.strict, group: u.id === "careers" || u.id === "explore" ? u.id : "global" }));

const get = (id: string) => GLOBAL_UNITS.find((u) => u.id === id)!;
const localized = (id: string, locale: Locale) => localizeUnit(id, get(id).source(), get(id).lang ?? LANG, locale);

export const localizedBridges = (locale: Locale): Localized<typeof bridges> => {
  const l = localized("bridges", locale) as Localized<{ items: typeof bridges }>;
  return { ...l, value: l.value.items };
};
export const localizedPaths = (locale: Locale): Localized<typeof paths> => {
  const l = localized("paths", locale) as Localized<{ items: typeof paths }>;
  return { ...l, value: l.value.items };
};
export const localizedScenarios = (locale: Locale): Localized<typeof scenarios> => {
  const l = localized("scenarios", locale) as Localized<{ items: typeof scenarios }>;
  return { ...l, value: l.value.items };
};
export const localizedChangelog = (locale: Locale): Localized<typeof changelog> => {
  const l = localized("changelog", locale) as Localized<{ items: typeof changelog }>;
  return { ...l, value: l.value.items };
};
export const localizedSourceNotes = (locale: Locale) =>
  (localized("sources", locale) as Localized<ReturnType<typeof sourcesSource>>).value.notes;
export const localizedProfile = (locale: Locale): Localized<typeof profile> => {
  const l = localized("profile", locale) as Localized<ReturnType<typeof profileSource>>;
  return { ...l, value: { ...profile, ...l.value } };
};

export const localizedRoles = (locale: Locale): Localized<typeof roles> => {
  const l = localized("careers", locale) as Localized<{ roles: typeof roles }>;
  return { ...l, value: l.value.roles };
};

export const localizedExplore = (locale: Locale): Localized<typeof exploreText> => localized("explore", locale) as Localized<typeof exploreText>;
