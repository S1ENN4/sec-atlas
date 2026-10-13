import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "vibecoding" as const, slug });

export const relations: Relation[] = [
  { source: ref("vibe-spectrum"), target: ref("harness-and-model"), label: "is built from" },
  { source: ref("harness-and-model"), target: ref("agent-tools-compared"), label: "sorts" },
  { source: ref("harness-and-model"), target: ref("model-choice"), label: "separates the model in" },
  { source: ref("agent-tools-compared"), target: ref("when-to-use-what"), label: "feeds" },
  { source: ref("model-choice"), target: ref("when-to-use-what"), label: "feeds" },
  { source: ref("when-to-use-what"), target: ref("context-engineering"), label: "is followed by" },
  { source: ref("context-engineering"), target: ref("parallel-agents"), label: "scales into" },
  { source: ref("parallel-agents"), target: ref("verification-loop"), label: "produces work for" },
  { source: ref("context-engineering"), target: ref("verification-loop"), label: "states the checks of" },
  { source: ref("verification-loop"), target: ref("agent-security"), label: "includes" },
];
