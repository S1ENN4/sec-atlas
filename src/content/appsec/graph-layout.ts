// AppSec knowledge-graph layout. All AppSec-specific graph configuration
// (layer slugs + positions, concept positions, concept→stage spoke edges,
// cross-concept relation edges, the stage-click target) lives here in the
// content layer so that the renderer in `src/components/domain-graph.tsx`
// stays generic.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  // Column width matches the x-step used to lay out pipeline stages.
  columnWidth: 280,

  // Top y for every stage header card (column headers).
  stageY: 20,

  // Concepts whose card renders dashed and floats off the spine as a
  // "layer" — pinned to fixed coordinates rather than a column.
  layerSlugs: ["shift-left", "devsecops"],
  layerPositions: {
    "shift-left": { x: -320, y: 520 },
    devsecops: { x: 620, y: 640 },
  },

  // Explicit concept card positions. The renderer looks each slug up here
  // (unknown slugs fall back to the per-column heuristic, but AppSec
  // pins every card for byte-identical output with the pre-refactor code).
  conceptPositions: {
    secrets: { x: 0, y: 300 },
    sast: { x: 280, y: 170 },
    sca: { x: 280, y: 350 },
    cicd: { x: 560, y: 300 },
    sbom: { x: 840, y: 520 },
    dast: { x: 1120, y: 300 },
  },

  // Concept → stage spoke attachments. The renderer's concept node exposes
  // `s-t` (top source), `s-r` (right source) handles; the stage node
  // exposes `t-l` (left target), `t-b` (bottom target) handles.
  conceptAttachments: [
    { slug: "secrets", stageId: "source", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "sast", stageId: "build", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "sca", stageId: "package", sourceHandle: "s-r", targetHandle: "t-b" },
    { slug: "sbom", stageId: "package", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "dast", stageId: "deploy", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  // Cross-concept (and concept ↔ stage) relation edges with labels. These
  // are independent of `src/content/appsec/relations.ts`: the relations
  // registry powers the topic page links, while this list powers the graph
  // — they describe different facets of the same domain.
  crossRelations: [
    { id: "gera", source: "sca", target: "sbom", sourceHandle: "s-r", targetHandle: "t-l", label: "gera" },
    {
      id: "complementa",
      source: "sast",
      target: "dast",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "complementa",
      dashed: true,
      arrow: false,
    },
    {
      id: "antecipa",
      source: "shift-left",
      target: "stage-source",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "antecipa",
      dashed: true,
    },
    {
      id: "gates",
      source: "devsecops",
      target: "stage-test",
      sourceHandle: "s-t",
      targetHandle: "t-b",
      label: "gates & políticas",
      dashed: true,
    },
  ],

  // The route the stage-node click pushes to. Today every stage routes to
  // the same CI/CD overview topic; domains with per-stage pages would
  // override this with a function (future work).
  stageHref: "/appsec/topico/cicd",
};
