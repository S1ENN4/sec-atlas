import type { PipelineStage } from "@/content/types";

// Four phases of a DevOps practice: FOUNDATIONS (the ground you stand on),
// DELIVER (the path from commit to production), PROVISION (what it runs on)
// and OPERATE (keeping it healthy and learning from failure).

export const pipeline: PipelineStage[] = [
  {
    id: "foundations",
    index: "01",
    name: "foundations",
    description: "the ground everything stands on",
    items: [
      { label: "Linux, processes and networking", slug: "linux-and-networking" },
      { label: "branches, pull requests and ownership", slug: "git-workflows" },
      { label: "images and containers", slug: "container-images" },
    ],
    gate: "you can reproduce, inspect and explain a service from the shell",
  },
  {
    id: "deliver",
    index: "02",
    name: "deliver",
    description: "from commit to production",
    items: [
      { label: "the delivery loop and its principles", slug: "delivery-lifecycle" },
      { label: "fast, reliable pipelines", slug: "ci-pipelines" },
      { label: "canary, blue/green and flags", slug: "release-strategies" },
    ],
    gate: "every change ships through the same automated, reversible path",
  },
  {
    id: "provision",
    index: "03",
    name: "provision",
    description: "what it all runs on",
    items: [
      { label: "infrastructure described as code", slug: "infrastructure-as-code" },
      { label: "running containers across a cluster", slug: "kubernetes-basics" },
    ],
    gate: "environments are rebuilt from code, not repaired by hand",
  },
  {
    id: "operate",
    index: "04",
    name: "operate",
    description: "healthy in production, learning from failure",
    items: [
      { label: "metrics, logs, traces and alerts", slug: "observability" },
      { label: "SLOs, error budgets and incidents", slug: "sre-reliability" },
      { label: "postmortems and toil reduction" },
    ],
    gate: "you know when users are hurting before they tell you",
  },
];
