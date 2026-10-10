import type { Topic } from "@/content/types";

export const secretsCloud: Topic = {
  domain: "cloudsec",
  slug: "secrets-cloud",
  title: "Secrets — cofres e rotação",
  short: "credenciais nunca no código",
  tagline:
    "Chaves de API, tokens de banco e segredos saem do repositório e vão para cofres com rotação automática, IAM de curta duração e audit log centralizado.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["HashiCorp Vault", "AWS Secrets Manager", "AWS Parameter Store", "Doppler"],
  sections: [],
};
