import type { Relation } from "@/content/types";

// CloudSec cross-concept relations. Drives the topic-to-topic connections
// list rendered on each topic page (independent of the knowledge-graph
// layout in graph-layout.ts, which describes the same edges visually).
//
// Source-of-truth edges: every relation here MUST resolve to an existing
// topic in the cloudsec domain (verified by validator rule R2). Each edge
// is intentionally directional: source → target + a verb that names the
// role the source plays for the target (e.g. cwpp → kubernetes "detecta
// comportamento" reads as "CWPP detecta comportamento na Kubernetes").
//
// `zero-trust` is a concept (not a stage) and lives as a dashed `layer`
// card in the graph; its outgoing edges are conceptual overlays rather
// than downstream functional flows, which the renderer distinguishes by
// the edge style in graph-layout.ts.

const ref = (slug: string) => ({ domain: "cloudsec" as const, slug });

export const relations: Relation[] = [
  // zero-trust as a conceptual layer informing the protecting pillars
  { source: ref("zero-trust"), target: ref("iam"), label: "guia o modelo" },
  { source: ref("zero-trust"), target: ref("network"), label: "segmenta por identidade" },

  // CSPM audits posture, including IAM and Kubernetes configuration drift
  { source: ref("cspm"), target: ref("iam"), label: "audita" },
  { source: ref("cspm"), target: ref("kubernetes"), label: "audita a postura" },

  // CWPP watches runtime behavior on workloads and clusters
  { source: ref("cwpp"), target: ref("containers"), label: "monitora o runtime" },
  { source: ref("cwpp"), target: ref("kubernetes"), label: "detecta comportamento" },

  // Logging & detection feeds every detective pillar
  { source: ref("logging-detection"), target: ref("cspm"), label: "alimenta a postura" },
  { source: ref("logging-detection"), target: ref("cwpp"), label: "fornece a trilha" },
  { source: ref("logging-detection"), target: ref("iam"), label: "documenta decisões" },

  // Identity authorizes access to keys; keys wrap secrets
  { source: ref("iam"), target: ref("kms-crypto"), label: "autoriza o acesso a chaves" },
  { source: ref("kms-crypto"), target: ref("secrets-cloud"), label: "cifra os segredos" },

  // Network segmentation isolates container traffic east-west
  { source: ref("network"), target: ref("containers"), label: "isola a rede" },
];
