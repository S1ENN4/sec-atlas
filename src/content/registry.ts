// Domain registry. Aggregates every domain's content (topics, relations,
// pipeline, glossary) and exposes it through a single set of accessors keyed by
// composite id (DomainId + slug). The legacy slug-only lookups still work
// through the re-export shims in src/lib/{topics,pipeline,glossary}.ts.

import type {
  Domain,
  DomainGraphLayout,
  DomainId,
  DomainMeta,
  PipelineStage,
  Relation,
  Topic,
  TopicKind,
  TopicRef,
} from "./types";
// `GlossaryGroup` is exported only as a `type` / `interface`; importing it
// without the `type` keyword works for the TypeScript compiler (the binding
// is silently elided) but trips Node's strict ESM resolution under
// `--experimental-strip-types` because there is no runtime export. Marking
// the import as type-only keeps the source compatible with both toolchains.
import type { GlossaryGroup } from "./types";

// Re-export the structural types so consumers (e.g. DomainGraph) can keep
// a single import path through the registry.
export type {
  Domain,
  DomainGraphLayout,
  DomainId,
  DomainMeta,
  PipelineItem,
  PipelineStage,
  Relation,
  Topic,
  TopicKind,
  TopicRef,
} from "./types";
export type { GlossaryGroup } from "./types";

import { appsec } from "./appsec";
import { cloudsec } from "./cloudsec";
import { aiAgents } from "./ai-agents";
import { secops } from "./secops";
import { seceng } from "./seceng";
import { owasp } from "./owasp";

// Domain metadata for all known domains — `domainMeta` is the only place the
// DomainId → route map and per-domain status/accent are pinned. `appsec` is
// "live" today and ships the curated reference content; `cloudsec` and
// `ai-agents` ship as draft skeletons (validator passes via R1–R5 only;
// the R6 live content floor only runs on `status: "live"`). Topic bodies
// land in the content waves (T14–T17 for cloudsec, T19–T22 for agents);
// T23 flips a domain to `live` once its content meets the floor.

export const domains: Record<DomainId, Domain> = {
  appsec,
  cloudsec,
  "ai-agents": aiAgents,
  secops,
  seceng,
  owasp,
};

// Per-domain metadata table (route + status + accent) keyed by DomainId.
export const domainMeta: Record<DomainId, DomainMeta> = Object.fromEntries(
  (Object.values(domains) as Domain[]).map((d) => [
    d.id,
    { id: d.id, route: d.route, status: d.status, accent: d.accent },
  ]),
) as Record<DomainId, DomainMeta>;

// Flattened list of every topic across every domain, in deterministic order.
export const allTopics: Topic[] = (Object.values(domains) as Domain[]).flatMap(
  (d) => d.topics,
);

export function getTopic(ref: TopicRef | string): Topic | undefined {
  // Accept a slug-only lookup as a convenience: in a single-domain world
  // (today) this avoids forcing every caller to spell out the composite id.
  if (typeof ref === "string") {
    for (const domain of Object.values(domains) as Domain[]) {
      const t = domain.topics.find((x) => x.slug === ref);
      if (t) return t;
    }
    return undefined;
  }
  const domain = domains[ref.domain];
  if (!domain) return undefined;
  return domain.topics.find((t) => t.slug === ref.slug);
}

export function relationsOf(ref: TopicRef | string): Relation[] {
  if (typeof ref === "string") {
    return (Object.values(domains) as Domain[]).flatMap((d) =>
      d.relations.filter(
        (r) => r.source.slug === ref || r.target.slug === ref,
      ),
    );
  }
  const domain = domains[ref.domain];
  if (!domain) return [];
  return domain.relations.filter(
    (r) => r.source.slug === ref.slug || r.target.slug === ref.slug,
  );
}

export function getPipeline(domainId: DomainId): PipelineStage[] {
  return domains[domainId]?.pipeline ?? [];
}

export function getGlossary(domainId: DomainId): GlossaryGroup[] {
  return domains[domainId]?.glossary ?? [];
}

/** Route segment ("secops", "agents"...) of every domain, for generateStaticParams. */
export const domainRouteSegments: string[] = (Object.values(domains) as Domain[]).map((d) => d.route.replace(/^\//, ""));

/** Resolve a route segment back to its domain id. */
export function domainIdFromRoute(segment: string): DomainId | undefined {
  return (Object.values(domains) as Domain[]).find((d) => d.route === "/" + segment)?.id;
}

export function getGraphLayout(domainId: DomainId): DomainGraphLayout | undefined {
  return domains[domainId]?.graphLayout;
}
