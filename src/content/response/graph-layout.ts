// Incident response knowledge-graph layout. Cards sit in the column of their
// phase (prepare/detect/respond/investigate at x = 0/280/560/840), so concept ->
// stage lines stay hidden until hover (`spokes: "focus"`). Canvas relations join
// neighbours only; the full list lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,
  layerSlugs: [],
  layerPositions: {},

  conceptPositions: {
    "ir-lifecycle": { x: 0, y: 200 },
    "threat-intelligence": { x: 0, y: 380 },
    "threat-hunting": { x: 280, y: 200 },
    "log-and-timeline-analysis": { x: 280, y: 380 },
    "triage-and-containment": { x: 560, y: 200 },
    "ransomware-playbook": { x: 560, y: 380 },
    "digital-forensics-basics": { x: 840, y: 200 },
    "malware-analysis-basics": { x: 840, y: 380 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "ir-lifecycle", stageId: "prepare", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "threat-intelligence", stageId: "prepare", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "threat-hunting", stageId: "detect", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "log-and-timeline-analysis", stageId: "detect", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "triage-and-containment", stageId: "respond", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "ransomware-playbook", stageId: "respond", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "digital-forensics-basics", stageId: "investigate", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "malware-analysis-basics", stageId: "investigate", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "supplies", source: "threat-intelligence", target: "threat-hunting", sourceHandle: "s-r", targetHandle: "t-l", label: "supplies hypotheses to" },
    { id: "relies-on", source: "threat-hunting", target: "log-and-timeline-analysis", sourceHandle: "s-b", targetHandle: "t-t", label: "relies on" },
    { id: "scopes", source: "log-and-timeline-analysis", target: "triage-and-containment", sourceHandle: "s-r", targetHandle: "t-l", label: "scopes" },
    { id: "specialised", source: "triage-and-containment", target: "ransomware-playbook", sourceHandle: "s-b", targetHandle: "t-t", label: "is specialised for" },
    { id: "preserves", source: "triage-and-containment", target: "digital-forensics-basics", sourceHandle: "s-r", targetHandle: "t-l", label: "preserves evidence for" },
    { id: "hands-samples", source: "digital-forensics-basics", target: "malware-analysis-basics", sourceHandle: "s-b", targetHandle: "t-t", label: "hands samples to" },
    { id: "carried-out", source: "ir-lifecycle", target: "threat-intelligence", sourceHandle: "s-b", targetHandle: "t-t", label: "is informed by" },
  ],

  stageHref: "/response",
};
