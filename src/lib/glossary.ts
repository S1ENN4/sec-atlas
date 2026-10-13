// Thin re-export shim. The canonical content lives in `src/content/`; this
// file keeps the legacy `glossary` array that older imports still rely on,
// plus the new `getAllGlossaries` aggregator used by the /glossario page
// (which now renders every domain's groups side-by-side with a domain filter
// chip row).

export type { GlossaryEntry, GlossaryGroup } from "@/content/types";
export type { DomainId } from "@/content/types";

import { domains, domainMeta, getTopic } from "@/content/registry";
import { appsec } from "@/content/appsec";
import type { DomainId, GlossaryEntry, GlossaryGroup } from "@/content/types";

// A glossary group tagged with the domain it belongs to. The page-level
// explorer uses this to render a per-domain chip filter and to label groups
// when the "todos" view is active.
export type ResolvedGlossaryEntry = GlossaryEntry & {
  // The entry's topic reference resolved on the server, so the client-side
  // explorer needn't import the whole content registry.
  resolved?: { domain: DomainId; slug: string; title: string; href: string };
};
export type DomainGlossaryGroup = Omit<GlossaryGroup, "entries"> & {
  domain: DomainId;
  entries: ResolvedGlossaryEntry[];
};

// Legacy export — kept so any older caller that still imports `glossary`
// keeps working. Today only the page reads this; new code should prefer
// `getAllGlossaries()` to honour every domain.
export const glossary = appsec.glossary;

// Aggregate every domain's glossary groups into a flat list, in registry
// order. Domains with empty glossary arrays contribute nothing — the
// current `ai-agents` placeholder has zero groups, which is the expected
// behaviour for a not-yet-populated domain.
export function getAllGlossaries(): DomainGlossaryGroup[] {
  const out: DomainGlossaryGroup[] = [];
  for (const domainId of Object.keys(domains) as DomainId[]) {
    for (const group of domains[domainId].glossary) {
      out.push({
        ...group,
        domain: domainId,
        entries: group.entries.map((entry) => {
          const t = entry.topic ? getTopic(entry.topic) : undefined;
          return t
            ? { ...entry, resolved: { domain: t.domain, slug: t.slug, title: t.title, href: `${domainMeta[t.domain].route}/topico/${t.slug}` } }
            : entry;
        }),
      });
    }
  }
  return out;
}

// List of domain ids whose glossary has at least one group, in registry
// order. Used to seed the filter chip row — domains with empty glossaries
// shouldn't appear as an empty filter target.
export function domainsWithGlossary(): DomainId[] {
  return (Object.keys(domains) as DomainId[]).filter(
    (id) => domains[id].glossary.length > 0,
  );
}