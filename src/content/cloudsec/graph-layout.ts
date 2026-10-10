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
    // Far-left dashed card; emits the "informa" relation rightward into
    // network.
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

  // Cross-concept relations. The dashed style marks the conceptual
  // overlay (zero-trust → network); the solid arrow style marks the
  // functional downstream edges (cspm→iam, cwpp→k8s, logging→cspm).
  crossRelations: [
    {
      id: "informa",
      source: "zero-trust",
      target: "network",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "informa",
      dashed: true,
      arrow: false,
    },
    {
      id: "audita",
      source: "cspm",
      target: "iam",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "audita",
    },
    {
      id: "protege",
      source: "cwpp",
      target: "kubernetes",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "protege",
    },
    {
      id: "alimenta",
      source: "logging-detection",
      target: "cspm",
      sourceHandle: "s-t",
      targetHandle: "t-l",
      label: "alimenta",
    },
  ],

  // The route every stage click pushes to. The home of the domain —
  // there is no single stage-overview topic in the skeleton yet
  // (T16 will revisit if one is added).
  stageHref: "/cloudsec",
};
