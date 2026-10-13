// OWASP Top 10 knowledge-graph layout. Cards sit in the column of the phase
// where their fix lives (design/code/ship/operate at x = 0/280/560/840), so
// concept -> stage lines stay hidden until hover (`spokes: "focus"`). Canvas
// relations join vertical neighbours or adjacent columns only; the full list
// lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,
  layerSlugs: [],
  layerPositions: {},

  conceptPositions: {
    "insecure-design": { x: 0, y: 200 },
    "broken-access-control": { x: 0, y: 380 },
    injection: { x: 280, y: 200 },
    "cryptographic-failures": { x: 280, y: 380 },
    "authentication-failures": { x: 280, y: 560 },
    "supply-chain-failures": { x: 560, y: 200 },
    "integrity-failures": { x: 560, y: 380 },
    "security-misconfiguration": { x: 560, y: 560 },
    "logging-alerting-failures": { x: 840, y: 200 },
    "exceptional-conditions": { x: 840, y: 380 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "insecure-design", stageId: "design", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "broken-access-control", stageId: "design", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "injection", stageId: "code", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "cryptographic-failures", stageId: "code", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "authentication-failures", stageId: "code", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "supply-chain-failures", stageId: "ship", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "integrity-failures", stageId: "ship", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "security-misconfiguration", stageId: "ship", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "logging-alerting-failures", stageId: "operate", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "exceptional-conditions", stageId: "operate", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "defines-rules", source: "insecure-design", target: "broken-access-control", sourceHandle: "s-b", targetHandle: "t-t", label: "defines the rules for" },
    { id: "bypasses", source: "injection", target: "broken-access-control", sourceHandle: "s-l", targetHandle: "t-r", label: "can bypass" },
    { id: "protects-credentials", source: "cryptographic-failures", target: "authentication-failures", sourceHandle: "s-b", targetHandle: "t-t", label: "protects credentials of" },
    { id: "needs-identity", source: "authentication-failures", target: "broken-access-control", sourceHandle: "s-l", targetHandle: "t-r", label: "feeds identity to" },
    { id: "verified-by", source: "supply-chain-failures", target: "integrity-failures", sourceHandle: "s-b", targetHandle: "t-t", label: "is stopped by verifying" },
    { id: "pipeline-config", source: "integrity-failures", target: "security-misconfiguration", sourceHandle: "s-b", targetHandle: "t-t", label: "depends on safe settings" },
    { id: "records", source: "logging-alerting-failures", target: "exceptional-conditions", sourceHandle: "s-b", targetHandle: "t-t", label: "records" },
  ],

  stageHref: "/owasp",
};
