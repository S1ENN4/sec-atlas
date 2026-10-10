import type { Topic } from "@/content/types";

export const zeroTrust: Topic = {
  domain: "cloudsec",
  slug: "zero-trust",
  title: "Zero-trust — modelo de confiança",
  short: "nunca confiar, sempre verificar",
  tagline:
    "Zero-trust substitui o perímetro por política: cada requisição é autenticada, autorizada e logada, independente da origem ser interna ou externa.",
  kind: "conceito",
  stage: null,
  tools: ["BeyondCorp", "Cloudflare Access", "NIST SP 800-207", "OpenZiti"],
  sections: [],
};
