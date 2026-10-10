import type { Topic } from "@/content/types";

export const evals: Topic = {
  domain: "ai-agents",
  slug: "evals",
  title: "Evals",
  short: "dataset, métrica e runner para medir qualidade",
  tagline:
    "Evals é o harness que mede se a resposta é boa: dataset de exemplos, métrica (fidelidade, relevância, groundedness) e runner que executa. Sem eval, melhorar um agente é chute.",
  kind: "pratica",
  stage: "evaluate",
  tools: ["LangSmith", "Langfuse", "Braintrust", "Arize Phoenix"],
  sections: [],
};