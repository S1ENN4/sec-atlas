import type { Topic } from "@/content/types";

export const cwpp: Topic = {
  domain: "cloudsec",
  slug: "cwpp",
  title: "CWPP — proteção de workload",
  short: "runtime e comportamento de carga",
  tagline:
    "Cloud Workload Protection Platform vigia o que acontece dentro da VM, container e serverless — syscalls, conexões e processos, em tempo de execução.",
  kind: "pratica",
  stage: "detectar",
  tools: ["CrowdStrike", "SentinelOne", "Aqua Security", "Trend Micro Cloud One"],
  sections: [],
};
