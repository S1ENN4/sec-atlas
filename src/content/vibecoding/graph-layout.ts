// Vibecoding knowledge-graph layout. Cards sit in the column of their phase
// (understand/choose/drive/verify at x = 0/280/560/840), so concept -> stage
// lines stay hidden until hover (`spokes: "focus"`). Canvas relations join
// neighbours only; the full list lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,
  layerSlugs: [],
  layerPositions: {},

  conceptPositions: {
    "vibe-spectrum": { x: 0, y: 200 },
    "harness-and-model": { x: 0, y: 380 },
    "agent-tools-compared": { x: 280, y: 200 },
    "model-choice": { x: 280, y: 380 },
    "when-to-use-what": { x: 280, y: 560 },
    "context-engineering": { x: 560, y: 200 },
    "parallel-agents": { x: 560, y: 380 },
    "verification-loop": { x: 840, y: 200 },
    "agent-security": { x: 840, y: 380 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "vibe-spectrum", stageId: "understand", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "harness-and-model", stageId: "understand", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "agent-tools-compared", stageId: "choose", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "model-choice", stageId: "choose", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "when-to-use-what", stageId: "choose", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "context-engineering", stageId: "drive", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "parallel-agents", stageId: "drive", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "verification-loop", stageId: "verify", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "agent-security", stageId: "verify", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "built-from", source: "vibe-spectrum", target: "harness-and-model", sourceHandle: "s-b", targetHandle: "t-t", label: "is built from" },
    { id: "sorts", source: "harness-and-model", target: "agent-tools-compared", sourceHandle: "s-r", targetHandle: "t-l", label: "sorts" },
    { id: "separates", source: "harness-and-model", target: "model-choice", sourceHandle: "s-r", targetHandle: "t-l", label: "separates the model in" },
    { id: "feeds-decision", source: "model-choice", target: "when-to-use-what", sourceHandle: "s-b", targetHandle: "t-t", label: "feeds" },
    { id: "then-context", source: "agent-tools-compared", target: "context-engineering", sourceHandle: "s-r", targetHandle: "t-l", label: "is followed by" },
    { id: "scales-into", source: "context-engineering", target: "parallel-agents", sourceHandle: "s-b", targetHandle: "t-t", label: "scales into" },
    { id: "work-for", source: "parallel-agents", target: "verification-loop", sourceHandle: "s-r", targetHandle: "t-l", label: "produces work for" },
    { id: "includes", source: "verification-loop", target: "agent-security", sourceHandle: "s-b", targetHandle: "t-t", label: "includes" },
  ],

  stageHref: "/vibecoding",
};
