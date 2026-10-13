// Server wrapper for the interactive map. It reduces a (localised) domain to the
// lean `GraphData` the client renderer needs (titles, taglines, layout,
// relations, UI strings) so topic bodies and code samples stay out of the
// client bundle. The renderer lives in `domain-graph-client.tsx` and contains no
// domain literals; per-domain layout comes from `src/content/<domain>/graph-layout.ts`.

import { DomainGraphClient } from "@/components/domain-graph-client";
import type { GraphData } from "@/components/graph-data";
import { type DomainId } from "@/content/registry";
import type { Locale } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { kindMetaFor } from "@/i18n/labels";
import type { Ui } from "@/i18n/ui";

export function buildGraphData(domainId: DomainId, locale: Locale, t: Ui): GraphData {
  const { domain } = localizeDomain(domainId, locale);
  return {
    domainId,
    locale,
    strings: t.graph,
    route: domain.route,
    kindMeta: kindMetaFor(domainId, t),
    pipeline: domain.pipeline,
    layout: domain.graphLayout,
    topics: Object.fromEntries(
      domain.topics.map((tp) => [tp.slug, { title: tp.title, short: tp.short, tagline: tp.tagline, kind: tp.kind, stage: tp.stage }]),
    ),
    relations: domain.relations
      .filter((r) => r.source.domain === domainId && r.target.domain === domainId)
      .map((r) => ({ source: r.source.slug, target: r.target.slug, label: r.label })),
  };
}

export function DomainGraph({ domainId, locale, t }: { domainId: DomainId; locale: Locale; t: Ui }) {
  return <DomainGraphClient data={buildGraphData(domainId, locale, t)} />;
}
