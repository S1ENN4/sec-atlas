import type { Topic } from "@/content/types";

export const loggingDetection: Topic = {
  domain: "cloudsec",
  slug: "logging-detection",
  title: "Logging & detection — sinais e alertas",
  short: "CloudTrail, audit e correlação de sinais",
  tagline:
    "Detecção em cloud começa no log: CloudTrail, VPC flow logs, audit de IAM e DNS viram sinais correlacionados que alimentam SIEM e automação de resposta.",
  kind: "tecnica",
  stage: "detectar",
  tools: ["AWS CloudTrail", "Amazon GuardDuty", "Datadog", "Splunk"],
  sections: [],
};
