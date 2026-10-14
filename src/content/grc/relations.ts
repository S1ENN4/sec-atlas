import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "grc" as const, slug });

export const relations: Relation[] = [
  { source: ref("risk-management"), target: ref("security-frameworks"), label: "is structured by" },
  { source: ref("third-party-risk"), target: ref("risk-management"), label: "feeds" },
  { source: ref("security-frameworks"), target: ref("security-architecture"), label: "is implemented through" },
  { source: ref("security-frameworks"), target: ref("compliance-in-practice"), label: "is evidenced by" },
  { source: ref("security-architecture"), target: ref("compliance-in-practice"), label: "makes evidence automatic" },
  { source: ref("compliance-in-practice"), target: ref("security-metrics"), label: "supplies data to" },
  { source: ref("security-metrics"), target: ref("security-strategy-and-budget"), label: "informs" },
  { source: ref("risk-management"), target: ref("security-strategy-and-budget"), label: "sets priorities for" },
  { source: ref("security-strategy-and-budget"), target: ref("crisis-communication-and-culture"), label: "includes" },
];
