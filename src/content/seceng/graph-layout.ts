// Security-engineering knowledge-graph layout. Cards sit in the column of
// their stage (definir/entregar/escalar/automatizar at x = 0/280/560/840),
// so concept -> stage lines are hidden until hover (`spokes: "focus"`).
// Canvas relations only join neighbours, so no line crosses another card;
// the full list lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,

  // product mindset: sits beside the reliability card it sets the SLO for.
  layerSlugs: ["plataforma-como-produto"],
  layerPositions: {
    "plataforma-como-produto": { x: 280, y: 380 },
  },

  conceptPositions: {
    "iac-seguro": { x: 0, y: 200 },
    "policy-as-code": { x: 0, y: 380 },
    "cicd-hardening": { x: 280, y: 200 },
    "confiabilidade-em-escala": { x: 560, y: 200 },
    "observabilidade-plataforma": { x: 560, y: 380 },
    "automacao-soar": { x: 840, y: 200 },
    "ia-na-seguranca": { x: 840, y: 380 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "iac-seguro", stageId: "definir", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "policy-as-code", stageId: "definir", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "cicd-hardening", stageId: "entregar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "confiabilidade-em-escala", stageId: "escalar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "observabilidade-plataforma", stageId: "escalar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "automacao-soar", stageId: "automatizar", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "ia-na-seguranca", stageId: "automatizar", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "validado-por", source: "iac-seguro", target: "policy-as-code", sourceHandle: "s-b", targetHandle: "t-t", label: "é validado por" },
    { id: "passa-pela", source: "iac-seguro", target: "cicd-hardening", sourceHandle: "s-r", targetHandle: "t-l", label: "passa pela" },
    { id: "vira-gate", source: "policy-as-code", target: "cicd-hardening", sourceHandle: "s-r", targetHandle: "t-l", label: "vira gate" },
    { id: "medida-por", source: "confiabilidade-em-escala", target: "observabilidade-plataforma", sourceHandle: "s-b", targetHandle: "t-t", label: "é medida por" },
    { id: "depende-de", source: "automacao-soar", target: "confiabilidade-em-escala", sourceHandle: "s-l", targetHandle: "t-r", label: "depende de" },
    { id: "pode-usar", source: "automacao-soar", target: "ia-na-seguranca", sourceHandle: "s-b", targetHandle: "t-t", label: "pode usar" },
    {
      id: "define-slo",
      source: "plataforma-como-produto",
      target: "confiabilidade-em-escala",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "define o SLO",
      dashed: true,
      arrow: false,
    },
  ],

  stageHref: "/engenharia",
};
