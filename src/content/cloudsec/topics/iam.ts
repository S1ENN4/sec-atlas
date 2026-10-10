import type { Topic } from "@/content/types";

export const iam: Topic = {
  domain: "cloudsec",
  slug: "iam",
  title: "IAM — identidade e acesso",
  short: "quem é quem, e o que cada um pode fazer",
  tagline:
    "Identidade é o novo perímetro: a segurança em cloud começa por saber quem é cada workload, cada humano e cada serviço, e limitar o que cada um pode tocar.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["AWS IAM", "Okta", "Microsoft Entra ID", "Palo Alto Prisma Cloud"],
  sections: [],
};
