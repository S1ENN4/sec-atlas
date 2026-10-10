// CloudSec knowledge-graph layout. All CloudSec-specific graph
// configuration (layer slug + position, concept positions, concept→stage
// spoke attachments, cross-concept relation edges, the stage-click target)
// lives here so that the renderer in `src/components/domain-graph.tsx`
// stays generic.
//
// Layout philosophy:
//   - 4 pipeline stages (inventario → proteger → detectar → responder)
//     spaced at columnWidth 280.
//   - 6 "proteger" concepts in a 2×3 staggered grid around the stage
//     spine at column 1 (x≈300); pairs (IAM/network, k8s/containers,
//     KMS/secrets) sit next to each other so the column reads as
//     identity → workload → data without one vertical stack.
//   - 3 "detectar" concepts stacked under the detectar stage column.
//   - The `zero-trust` concept floats off the left edge as a dashed
//     "layer" card (mirrors how AppSec treats shift-left).

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,

  // Top y for every stage header card.
  stageY: 20,

  layerSlugs: ["zero-trust"],
  layerPositions: {
    // Far-left dashed card; emits the dashed "concept overlay" relations
    // rightward into the protecting concepts (IAM + network).
    "zero-trust": { x: -180, y: 300 },
  },

  conceptPositions: {
    // Proteger column — 2×3 staggered grid around x≈300.
    iam: { x: 60, y: 200 },
    network: { x: 320, y: 200 },
    kubernetes: { x: 60, y: 380 },
    containers: { x: 320, y: 380 },
    "kms-crypto": { x: 60, y: 560 },
    "secrets-cloud": { x: 320, y: 560 },

    // Detectar column — 3 stacked at x=600.
    cspm: { x: 600, y: 200 },
    cwpp: { x: 600, y: 400 },
    "logging-detection": { x: 600, y: 600 },
  },

  // Concept → stage spoke edges. 6 protecting concepts → proteger
  // (column 1); 3 detecting concepts → detectar (column 2).
  conceptAttachments: [
    { slug: "iam", stageId: "proteger", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "network", stageId: "proteger", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "kubernetes", stageId: "proteger", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "containers", stageId: "proteger", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "kms-crypto", stageId: "proteger", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "secrets-cloud", stageId: "proteger", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "cspm", stageId: "detectar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "cwpp", stageId: "detectar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "logging-detection", stageId: "detectar", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  // Cross-concept relations. Edges are drawn from `source` (a concept
  // slug or `stage-<id>`) to `target`, using whatever handles keep the
  // smoothstep from doubling back on itself. Two visual flavours:
  //   dashed + arrow:false  → concept overlay (zero-trust → X)
  //   solid + arrow        → functional downstream flow (everything else)
  // A few long-diagonal relations (logging-detection → iam) are
  // intentionally omitted from the canvas; they live in
  // `relations.ts` and surface on the topic page's connections list,
  // which the topic page renders server-side.
  crossRelations: [
    {
      id: "guia-o-modelo",
      source: "zero-trust",
      target: "iam",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "guia o modelo",
      dashed: true,
      arrow: false,
    },
    {
      id: "segmenta-identidade",
      source: "zero-trust",
      target: "network",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "segmenta por identidade",
      dashed: true,
      arrow: false,
    },
    {
      id: "audita-iam",
      source: "cspm",
      target: "iam",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "audita",
    },
    {
      id: "audita-postura-k8s",
      source: "cspm",
      target: "kubernetes",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "audita a postura",
    },
    {
      id: "monitora-runtime",
      source: "cwpp",
      target: "containers",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "monitora o runtime",
    },
    {
      id: "detecta-comportamento",
      source: "cwpp",
      target: "kubernetes",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "detecta comportamento",
    },
    {
      id: "alimenta-postura",
      source: "logging-detection",
      target: "cspm",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "alimenta a postura",
    },
    {
      id: "fornece-trilha",
      source: "logging-detection",
      target: "cwpp",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "fornece a trilha",
    },
    {
      id: "autoriza-chaves",
      source: "iam",
      target: "kms-crypto",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "autoriza o acesso a chaves",
    },
    {
      id: "cifra-segredos",
      source: "kms-crypto",
      target: "secrets-cloud",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "cifra os segredos",
    },
    {
      id: "isola-rede",
      source: "network",
      target: "containers",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "isola a rede",
    },
  ],

  // The route every stage click pushes to. The home of the domain —
  // there is no single stage-overview topic in the skeleton yet
  // (T16 will revisit if one is added).
  stageHref: "/cloudsec",
};
