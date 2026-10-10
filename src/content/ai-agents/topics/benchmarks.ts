import type { Topic } from "@/content/types";

export const benchmarks: Topic = {
  domain: "ai-agents",
  slug: "benchmarks",
  title: "Benchmarks",
  short: "conjuntos públicos para comparar agentes e LLMs",
  tagline:
    "Benchmarks (SWE-bench, GAIA, τ-bench, HumanEval) dão referência: você compara seu agente contra o mesmo dataset que outros publicaram. Risco clássico: otimizar para o benchmark e perder no mundo real.",
  kind: "tecnica",
  stage: "evaluate",
  tools: ["SWE-bench", "GAIA", "τ-bench", "HumanEval"],
  sections: [],
};