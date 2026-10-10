import type { Topic } from "@/content/types";

export const containers: Topic = {
  domain: "cloudsec",
  slug: "containers",
  title: "Containers — imagens e cadeia de suprimentos",
  short: "build, signing e runtime imutável",
  tagline:
    "Imagens baseadas em camadas herdam privilégios: varredura de CVE, signing e runtime rootless reduzem a superfície que o container entrega ao host.",
  kind: "pratica",
  stage: "proteger",
  tools: ["Docker", "Falco", "Trivy", "Cosign"],
  sections: [],
};
