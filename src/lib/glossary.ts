// Glossary aggregation for the /glossary page: every domain's (localised)
// groups in registry order, with each entry's topic reference resolved on the
// server so the client-side explorer needn't import the content registry.

import { domains, getTopic } from "@/content/registry";
import type { DomainId, GlossaryEntry, GlossaryGroup } from "@/content/types";
import { localePath, type Locale } from "@/i18n/config";
import { localizeDomain, localizedTopic } from "@/i18n/content";

export type { GlossaryEntry, GlossaryGroup } from "@/content/types";
export type { DomainId } from "@/content/types";

export type ResolvedGlossaryEntry = GlossaryEntry & {
  resolved?: { domain: DomainId; slug: string; title: string; href: string };
};
export type DomainGlossaryGroup = Omit<GlossaryGroup, "entries"> & {
  domain: DomainId;
  entries: ResolvedGlossaryEntry[];
};

export function getAllGlossaries(locale: Locale): { groups: DomainGlossaryGroup[]; fallback: boolean } {
  const out: DomainGlossaryGroup[] = [];
  let fallback = false;
  for (const id of Object.keys(domains) as DomainId[]) {
    const loc = localizeDomain(id, locale);
    if (loc.fallback) fallback = true;
    for (const group of loc.domain.glossary) {
      out.push({
        ...group,
        domain: id,
        entries: group.entries.map((entry) => {
          const t = entry.topic ? getTopic(entry.topic) : undefined;
          if (!t) return entry;
          const title = localizedTopic(t.domain, t.slug, locale)?.title ?? t.title;
          return { ...entry, resolved: { domain: t.domain, slug: t.slug, title, href: localePath(locale, `${domains[t.domain].route}/topic/${t.slug}`) } };
        }),
      });
    }
  }
  return { groups: out, fallback };
}
