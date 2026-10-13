// SecOps knowledge-graph layout. Every card sits in the column of its stage
// (columnWidth 280, stages observar/detectar/agir/medir at x = 0/280/560/840),
// so the concept -> stage lines are hidden until hover (`spokes: "focus"`).
// Canvas relations only join neighbours (same row or adjacent column), so no
// line crosses another card; the full list lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,

  // system-design layer: decides where each control lives.
  layerSlugs: ["defesa-em-camadas"],
  layerPositions: {
    "defesa-em-camadas": { x: 840, y: 380 },
  },

  conceptPositions: {
    "telemetria-borda": { x: 0, y: 200 },
    "escala-telemetria": { x: 0, y: 380 },
    "ataques-l7": { x: 280, y: 200 },
    "detection-engineering": { x: 280, y: 380 },
    waf: { x: 560, y: 200 },
    "rate-limiting": { x: 560, y: 380 },
    "bot-management": { x: 560, y: 560 },
    "runbooks-e-hardening": { x: 560, y: 740 },
    "slos-soc": { x: 840, y: 200 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "telemetria-borda", stageId: "observar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "escala-telemetria", stageId: "observar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "ataques-l7", stageId: "detectar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "detection-engineering", stageId: "detectar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "waf", stageId: "agir", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "rate-limiting", stageId: "agir", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "bot-management", stageId: "agir", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "runbooks-e-hardening", stageId: "agir", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "slos-soc", stageId: "medir", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "revela", source: "telemetria-borda", target: "ataques-l7", sourceHandle: "s-r", targetHandle: "t-l", label: "revela" },
    { id: "sustenta", source: "escala-telemetria", target: "detection-engineering", sourceHandle: "s-r", targetHandle: "t-l", label: "mantém viável" },
    { id: "vira-deteccao", source: "ataques-l7", target: "detection-engineering", sourceHandle: "s-b", targetHandle: "t-t", label: "vira detecção" },
    { id: "gera-regras", source: "detection-engineering", target: "waf", sourceHandle: "s-r", targetHandle: "t-l", label: "gera regras" },
    { id: "gera-limites", source: "detection-engineering", target: "rate-limiting", sourceHandle: "s-r", targetHandle: "t-l", label: "gera limites" },
    { id: "pontua", source: "detection-engineering", target: "bot-management", sourceHandle: "s-r", targetHandle: "t-l", label: "pontua automação" },
    { id: "aciona", source: "bot-management", target: "runbooks-e-hardening", sourceHandle: "s-b", targetHandle: "t-t", label: "aciona" },
    { id: "mede-precisao", source: "slos-soc", target: "waf", sourceHandle: "s-l", targetHandle: "t-r", label: "mede a precisão" },
    {
      id: "define-onde-vive",
      source: "defesa-em-camadas",
      target: "rate-limiting",
      sourceHandle: "s-l",
      targetHandle: "t-r",
      label: "define onde vive",
      dashed: true,
      arrow: false,
    },
  ],

  stageHref: "/secops",
};
