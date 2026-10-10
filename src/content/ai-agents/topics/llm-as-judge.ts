import type { Topic } from "@/content/types";

export const llmAsJudge: Topic = {
  domain: "ai-agents",
  slug: "llm-as-judge",
  title: "LLM as judge",
  short: "usar um LLM para pontuar a saída de outro",
  tagline:
    "LLM as judge automatiza a nota: um modelo aplica rubrica (pairwise, Likert, score) sobre a saída do sistema. Funciona quando bem calibrado contra humano; vira circularidade quando o juiz usa o mesmo modelo que está sendo julgado.",
  kind: "tecnica",
  stage: "evaluate",
  tools: ["Prometheus", "MT-Bench", "G-Eval", "Braintrust pairwise"],
  sections: [],
};