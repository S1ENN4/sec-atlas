import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "devops" as const, slug });

export const relations: Relation[] = [
  { source: ref("linux-and-networking"), target: ref("container-images"), label: "is what a container isolates" },
  { source: ref("git-workflows"), target: ref("ci-pipelines"), label: "triggers" },
  { source: ref("container-images"), target: ref("kubernetes-basics"), label: "is scheduled by" },
  { source: ref("delivery-lifecycle"), target: ref("ci-pipelines"), label: "is automated by" },
  { source: ref("ci-pipelines"), target: ref("release-strategies"), label: "hands artifacts to" },
  { source: ref("release-strategies"), target: ref("kubernetes-basics"), label: "runs on" },
  { source: ref("infrastructure-as-code"), target: ref("kubernetes-basics"), label: "provisions" },
  { source: ref("kubernetes-basics"), target: ref("observability"), label: "is watched by" },
  { source: ref("observability"), target: ref("sre-reliability"), label: "feeds the SLOs of" },
  { source: ref("release-strategies"), target: ref("sre-reliability"), label: "spends the budget of" },
];
