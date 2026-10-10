import type { Topic } from "@/content/types";

export const kmsCrypto: Topic = {
  domain: "cloudsec",
  slug: "kms-crypto",
  title: "KMS & crypto — chaves e envelopes",
  short: "gerenciamento de chaves e criptografia",
  tagline:
    "KMS controla quem cria, usa e revoga chaves: criptografia em reposo, em trânsito e envelope encryption dependem de um plano de chaves bem governado.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["AWS KMS", "HashiCorp Vault Transit", "Google Cloud KMS", "Azure Key Vault"],
  sections: [],
};
