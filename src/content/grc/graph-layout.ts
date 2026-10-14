// GRC knowledge-graph layout. Cards sit in the column of their phase
// (identify/design/prove/lead at x = 0/280/560/840), so concept -> stage lines
// stay hidden until hover (`spokes: "focus"`). Canvas relations join
// neighbours only; the full list lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,
  layerSlugs: [],
  layerPositions: {},

  conceptPositions: {
    "risk-management": { x: 0, y: 200 },
    "third-party-risk": { x: 0, y: 380 },
    "security-frameworks": { x: 280, y: 200 },
    "security-architecture": { x: 280, y: 380 },
    "compliance-in-practice": { x: 560, y: 200 },
    "security-metrics": { x: 560, y: 380 },
    "security-strategy-and-budget": { x: 840, y: 200 },
    "crisis-communication-and-culture": { x: 840, y: 380 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "risk-management", stageId: "identify", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "third-party-risk", stageId: "identify", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "security-frameworks", stageId: "design", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "security-architecture", stageId: "design", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "compliance-in-practice", stageId: "prove", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "security-metrics", stageId: "prove", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "security-strategy-and-budget", stageId: "lead", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "crisis-communication-and-culture", stageId: "lead", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "feeds-risk", source: "third-party-risk", target: "risk-management", sourceHandle: "s-t", targetHandle: "t-b", label: "feeds" },
    { id: "structured-by", source: "risk-management", target: "security-frameworks", sourceHandle: "s-r", targetHandle: "t-l", label: "is structured by" },
    { id: "implemented", source: "security-frameworks", target: "security-architecture", sourceHandle: "s-b", targetHandle: "t-t", label: "is implemented through" },
    { id: "evidenced", source: "security-frameworks", target: "compliance-in-practice", sourceHandle: "s-r", targetHandle: "t-l", label: "is evidenced by" },
    { id: "supplies", source: "compliance-in-practice", target: "security-metrics", sourceHandle: "s-b", targetHandle: "t-t", label: "supplies data to" },
    { id: "informs", source: "security-metrics", target: "security-strategy-and-budget", sourceHandle: "s-r", targetHandle: "t-l", label: "informs" },
    { id: "includes", source: "security-strategy-and-budget", target: "crisis-communication-and-culture", sourceHandle: "s-b", targetHandle: "t-t", label: "includes" },
  ],

  stageHref: "/grc",
};
