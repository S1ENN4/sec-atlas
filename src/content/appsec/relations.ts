import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "appsec" as const, slug });

export const relations: Relation[] = [
  { source: ref("secrets"), target: ref("cicd"), label: "stage: source" },
  { source: ref("sast"), target: ref("cicd"), label: "stage: build/PR" },
  { source: ref("sca"), target: ref("cicd"), label: "stage: build" },
  { source: ref("dast"), target: ref("cicd"), label: "stage: staging" },
  { source: ref("sca"), target: ref("sbom"), label: "gera" },
  { source: ref("shift-left"), target: ref("sast"), label: "antecipa" },
  { source: ref("shift-left"), target: ref("sca"), label: "antecipa" },
  { source: ref("devsecops"), target: ref("cicd"), label: "gates & políticas" },
  { source: ref("sast"), target: ref("dast"), label: "complementa", animated: true },
  { source: ref("shift-left"), target: ref("threat-modeling"), label: "começa no design" },
  { source: ref("threat-modeling"), target: ref("sast"), label: "define o que testar" },
  { source: ref("threat-modeling"), target: ref("devsecops"), label: "vira gate" },
];
