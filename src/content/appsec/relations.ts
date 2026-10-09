import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "appsec" as const, slug });

export const relations: Relation[] = [
  { source: ref("secrets"), target: ref("cicd"), label: "stage: source", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: ref("sast"), target: ref("cicd"), label: "stage: build/PR", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: ref("sca"), target: ref("cicd"), label: "stage: build", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: ref("dast"), target: ref("cicd"), label: "stage: staging", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: ref("sca"), target: ref("sbom"), label: "gera", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: ref("shift-left"), target: ref("sast"), label: "antecipa", sourceHandle: "s-r", targetHandle: "t-l" },
  { source: ref("shift-left"), target: ref("sca"), label: "antecipa", sourceHandle: "s-r", targetHandle: "t-l" },
  { source: ref("devsecops"), target: ref("cicd"), label: "gates & políticas", sourceHandle: "s-t", targetHandle: "t-b" },
  { source: ref("sast"), target: ref("dast"), label: "complementa", sourceHandle: "s-t", targetHandle: "t-t", animated: true },
];
