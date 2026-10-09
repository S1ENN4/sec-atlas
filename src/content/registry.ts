// Domain registry. Aggregates every domain's content (topics, relations,
// pipeline, glossary) and exposes it through a single set of accessors keyed by
// composite id (DomainId + slug). The legacy slug-only lookups still work
// through the re-export shims in src/lib/{topics,pipeline,glossary}.ts.

import type {
  Domain,
  DomainId,
  DomainMeta,
  PipelineStage,
  Relation,
  Topic,
  TopicRef,
} from "./types";
import { GlossaryGroup } from "./types";

import { appsec } from "./appsec";

// Domain metadata for all known domains — `domainMeta` is the only place the
// DomainId → route map and per-domain status/accent are pinned. Only `appsec`
// is "live" today; the other two are placeholders that ship empty content but
// already carry a route so that links resolve to a placeholder page when the
// domain is implemented.
const EMPTY_KIND_META: Domain["kindMeta"] = {
  tecnica: { label: "técnica de teste", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "prática", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "conceito", dot: "bg-amber-400", text: "text-amber-400" },
};

const cloudsec: Domain = {
  id: "cloudsec",
  route: "/cloudsec",
  status: "draft",
  accent: "sky",
  kindMeta: EMPTY_KIND_META,
  topics: [],
  relations: [],
  pipeline: [],
  glossary: [],
};

const aiAgents: Domain = {
  id: "ai-agents",
  route: "/agentes",
  status: "draft",
  accent: "violet",
  kindMeta: EMPTY_KIND_META,
  topics: [],
  relations: [],
  pipeline: [],
  glossary: [],
};

export const domains: Record<DomainId, Domain> = {
  appsec,
  cloudsec,
  "ai-agents": aiAgents,
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
