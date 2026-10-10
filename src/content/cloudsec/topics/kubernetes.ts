import type { Topic } from "@/content/types";

export const kubernetes: Topic = {
  domain: "cloudsec",
  slug: "kubernetes",
  title: "Kubernetes — runtime seguro",
  short: "RBAC, admission e segurança de cluster",
  tagline:
    "O cluster Kubernetes é um sistema operacional distribuído: RBAC, admission controllers e policies regem o que cada pod pode fazer, montar e expor.",
  kind: "pratica",
  stage: "proteger",
  tools: ["Kubernetes", "OPA Gatekeeper", "Kyverno", "Kube-bench"],
  sections: [],
};
