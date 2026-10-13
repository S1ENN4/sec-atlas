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
    // Dashed overlay card on the far left, level with the two cards it
    // overlays (network, iam) so both dashed edges are short and straight.
    "zero-trust": { x: -300, y: 290 },
  },

  conceptPositions: {
    // Proteger concepts: two sub-columns x 3 rows. Left sub-column sits in
    // the (empty) inventario column, right sub-column under the stage.
    // Every related pair is adjacent so no edge crosses another card.
    network: { x: 0, y: 200 },
    containers: { x: 280, y: 200 },
    iam: { x: 0, y: 380 },
    kubernetes: { x: 280, y: 380 },
    "kms-crypto": { x: 0, y: 560 },
    "secrets-cloud": { x: 280, y: 560 },

    // Detectar column (stage at x=560): logging in the middle so it sits
    // next to both cwpp and cspm.
    cwpp: { x: 560, y: 200 },
    "logging-detection": { x: 560, y: 380 },
    cspm: { x: 560, y: 560 },
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
