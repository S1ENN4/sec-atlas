// Offensive security knowledge-graph layout. Cards sit in the column of their
// phase (scope/discover/attack/report at x = 0/280/560/840), so concept ->
// stage lines stay hidden until hover (`spokes: "focus"`). Canvas relations join
// neighbours only; the full list lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,
  layerSlugs: [],
  layerPositions: {},

  conceptPositions: {
    "engagement-scoping-and-ethics": { x: 0, y: 200 },
    "pentest-methodology": { x: 0, y: 380 },
    "recon-and-attack-surface": { x: 280, y: 200 },
    "web-and-api-testing": { x: 280, y: 380 },
    "privilege-escalation-paths": { x: 560, y: 200 },
    "social-engineering-and-phishing": { x: 560, y: 380 },
    "red-team-and-adversary-emulation": { x: 560, y: 560 },
    "reporting-and-remediation": { x: 840, y: 200 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "engagement-scoping-and-ethics", stageId: "scope", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "pentest-methodology", stageId: "scope", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "recon-and-attack-surface", stageId: "discover", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "web-and-api-testing", stageId: "discover", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "privilege-escalation-paths", stageId: "attack", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "social-engineering-and-phishing", stageId: "attack", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "red-team-and-adversary-emulation", stageId: "attack", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "reporting-and-remediation", stageId: "report", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "bounds", source: "engagement-scoping-and-ethics", target: "pentest-methodology", sourceHandle: "s-b", targetHandle: "t-t", label: "bounds" },
    { id: "starts-with", source: "pentest-methodology", target: "recon-and-attack-surface", sourceHandle: "s-r", targetHandle: "t-l", label: "starts with" },
    { id: "feeds", source: "recon-and-attack-surface", target: "web-and-api-testing", sourceHandle: "s-b", targetHandle: "t-t", label: "feeds" },
    { id: "leads-to", source: "web-and-api-testing", target: "privilege-escalation-paths", sourceHandle: "s-r", targetHandle: "t-l", label: "can lead to" },
    { id: "step-of", source: "privilege-escalation-paths", target: "red-team-and-adversary-emulation", sourceHandle: "s-b", targetHandle: "t-t", label: "is a step of" },
    { id: "entry-for", source: "social-engineering-and-phishing", target: "red-team-and-adversary-emulation", sourceHandle: "s-b", targetHandle: "t-t", label: "is an entry for" },
    { id: "summarized", source: "privilege-escalation-paths", target: "reporting-and-remediation", sourceHandle: "s-r", targetHandle: "t-l", label: "is reported in" },
  ],

  stageHref: "/offensive",
};
