import type { Topic } from "@/content/types";

export const cspm: Topic = {
  domain: "cloudsec",
  slug: "cspm",
  title: "CSPM — postura cloud",
  short: "postura contínua na nuvem",
  tagline:
    "Cloud Security Posture Management vasculha a configuração de cada conta contra baselines (CIS, PCI, NIST) e aponta drift antes que vire incidente.",
  kind: "pratica",
  stage: "detectar",
  tools: ["Wiz", "Lacework", "Prisma Cloud", "Orca Security"],
  sections: [],
};
