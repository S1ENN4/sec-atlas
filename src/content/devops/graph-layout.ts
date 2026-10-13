// DevOps knowledge-graph layout. Cards sit in the column of their phase
// (foundations/deliver/provision/operate at x = 0/280/560/840), so concept ->
// stage lines stay hidden until hover (`spokes: "focus"`). Canvas relations join
// neighbours only; the full list lives in relations.ts.

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,
  stageY: 20,
  layerSlugs: [],
  layerPositions: {},

  conceptPositions: {
    "linux-and-networking": { x: 0, y: 200 },
    "git-workflows": { x: 0, y: 380 },
    "container-images": { x: 0, y: 560 },
    "delivery-lifecycle": { x: 280, y: 200 },
    "ci-pipelines": { x: 280, y: 380 },
    "release-strategies": { x: 280, y: 560 },
    "infrastructure-as-code": { x: 560, y: 200 },
    "kubernetes-basics": { x: 560, y: 380 },
    observability: { x: 840, y: 200 },
    "sre-reliability": { x: 840, y: 380 },
  },

  spokes: "focus",

  conceptAttachments: [
    { slug: "linux-and-networking", stageId: "foundations", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "git-workflows", stageId: "foundations", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "container-images", stageId: "foundations", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "delivery-lifecycle", stageId: "deliver", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "ci-pipelines", stageId: "deliver", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "release-strategies", stageId: "deliver", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "infrastructure-as-code", stageId: "provision", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "kubernetes-basics", stageId: "provision", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "observability", stageId: "operate", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "sre-reliability", stageId: "operate", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  crossRelations: [
    { id: "isolates", source: "linux-and-networking", target: "container-images", sourceHandle: "s-b", targetHandle: "t-t", label: "is what a container isolates" },
    { id: "triggers", source: "git-workflows", target: "ci-pipelines", sourceHandle: "s-r", targetHandle: "t-l", label: "triggers" },
    { id: "automated-by", source: "delivery-lifecycle", target: "ci-pipelines", sourceHandle: "s-b", targetHandle: "t-t", label: "is automated by" },
    { id: "hands-artifacts", source: "ci-pipelines", target: "release-strategies", sourceHandle: "s-b", targetHandle: "t-t", label: "hands artifacts to" },
    { id: "runs-on", source: "release-strategies", target: "kubernetes-basics", sourceHandle: "s-r", targetHandle: "t-l", label: "runs on" },
    { id: "provisions", source: "infrastructure-as-code", target: "kubernetes-basics", sourceHandle: "s-b", targetHandle: "t-t", label: "provisions" },
    { id: "watched-by", source: "kubernetes-basics", target: "observability", sourceHandle: "s-r", targetHandle: "t-l", label: "is watched by" },
    { id: "feeds-slos", source: "observability", target: "sre-reliability", sourceHandle: "s-b", targetHandle: "t-t", label: "feeds the SLOs of" },
  ],

  stageHref: "/devops",
};
