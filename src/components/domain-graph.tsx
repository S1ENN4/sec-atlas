// Server wrapper for the interactive map. It reduces a domain to the lean
// `GraphData` the client renderer needs (titles, taglines, layout, relations)
// so topic bodies and code samples stay out of the client bundle. The
// renderer itself lives in `domain-graph-client.tsx` and contains no domain
// literals; per-domain layout comes from `src/content/<domain>/graph-layout.ts`.

import { DomainGraphClient } from "@/components/domain-graph-client";
import type { GraphData } from "@/components/graph-data";
import { domains, domainMeta, type DomainId } from "@/content/registry";

export function buildGraphData(domainId: DomainId): GraphData {
  const domain = domains[domainId];
  return {
    domainId,
    route: domainMeta[domainId].route,
    kindMeta: domain.kindMeta,
    pipeline: domain.pipeline,
    layout: domain.graphLayout,
    topics: Object.fromEntries(
      domain.topics.map((t) => [t.slug, { title: t.title, short: t.short, tagline: t.tagline, kind: t.kind, stage: t.stage }]),
    ),
    relations: domain.relations
      .filter((r) => r.source.domain === domainId && r.target.domain === domainId)
      .map((r) => ({ source: r.source.slug, target: r.target.slug, label: r.label })),
  };
}

export function DomainGraph({ domainId }: { domainId: DomainId }) {
  return <DomainGraphClient data={buildGraphData(domainId)} />;
}
