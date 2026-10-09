// Thin re-export shim. The canonical content lives in `src/content/` behind a
// domain registry (composite ids). This file keeps the legacy slug-only
// surface that the existing app and components already import, so that
// consumer code can stay byte-identical while the data moves to a
// per-domain layout.

import { appsec } from "@/content/appsec";
import { getTopic as getTopicRef, relationsOf as relationsOfRef } from "@/content/registry";
import type { CodeSample, Topic, TopicKind, TopicSection } from "@/content/types";

export type { CodeSample, Topic, TopicKind, TopicSection } from "@/content/types";

// Legacy Relation shape: `source` and `target` are slugs, not composite ids.
// All current relations live inside the appsec domain, so flattening is just
// dropping the `{ domain }` wrapper.
// The per-relation `sourceHandle` / `targetHandle` were dropped from the
// canonical Relation type when the knowledge-graph renderer moved to a
// generic layout driven by DomainGraphLayout. The legacy shim mirrors the
// trimmed shape so consumer code keeps compiling.
export interface Relation {
  source: string;
  target: string;
  label: string;
  animated?: boolean;
}

const flatten = (r: import("@/content/types").Relation): Relation => ({
  source: r.source.slug,
  target: r.target.slug,
  label: r.label,
  ...(r.animated ? { animated: r.animated } : {}),
});

export const kindMeta = appsec.kindMeta;
export const topics: Topic[] = appsec.topics;
export const relations: Relation[] = appsec.relations.map(flatten);

export function getTopic(slug: string): Topic | undefined {
  return getTopicRef({ domain: "appsec", slug });
}

export function relationsOf(slug: string): Relation[] {
  return relationsOfRef({ domain: "appsec", slug }).map(flatten);
}
