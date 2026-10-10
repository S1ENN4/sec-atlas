import type { Topic } from "@/content/types";

export const regressionEvals: Topic = {
  domain: "ai-agents",
  slug: "regression-evals",
  title: "Regression evals",
  short: "suite fixa que bloqueia regressões no PR",
  tagline:
    "Regression evals é a suite imutável: dataset fechado, gate no merge, comparação contra baseline. É o que transforma 'acho que ficou melhor' em 'a métrica X caiu 2 pontos, bloquear'.",
  kind: "pratica",
  stage: "evaluate",
  tools: ["pytest", "DeepEval", "Braintrust CI", "promptfoo"],
  sections: [],
};