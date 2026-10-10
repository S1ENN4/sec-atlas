import type { Relation } from "@/content/types";

// Skeleton relations (T13). T16 expands this set once topic content
// (T14-15) is in; these four are the irreducible "this domain makes
// sense without this link" edges.
//
//   zero-trust         ── informa ───▶ network
//   cspm               ── audita  ───▶ iam
//   cwpp               ── protege ───▶ kubernetes
//   logging-detection  ── alimenta ──▶ cspm
//
// `zero-trust` is a concept (not a stage); the remaining three flow
// downstream (detect → detect, detect → protect, signal → posture) so
// the graph always has at least one edge leaving each stage.

const ref = (slug: string) => ({ domain: "cloudsec" as const, slug });

export const relations: Relation[] = [
  { source: ref("zero-trust"), target: ref("network"), label: "informa" },
  { source: ref("cspm"), target: ref("iam"), label: "audita" },
  { source: ref("cwpp"), target: ref("kubernetes"), label: "protege" },
  { source: ref("logging-detection"), target: ref("cspm"), label: "alimenta" },
];
