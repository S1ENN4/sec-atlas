import type { Topic } from "@/content/types";

export const guardrails: Topic = {
  domain: "ai-agents",
  slug: "guardrails",
  title: "Guardrails",
  short: "filtros de entrada e saída para conter o agente",
  tagline:
    "Guardrails validam entrada (prompt injection, PII, jailbreak) e saída (PII, schema, política) em cada turno. Complementam a avaliação, não substituem: seguram o que vai ao usuário, mas não medem se a resposta é boa.",
  kind: "conceito",
  stage: null,
  tools: ["Guardrails AI", "NeMo Guardrails", "Lakera", "Rebuff"],
  sections: [],
};