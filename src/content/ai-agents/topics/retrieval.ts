import type { Topic } from "@/content/types";

export const retrieval: Topic = {
  domain: "ai-agents",
  slug: "retrieval",
  title: "Retrieval",
  short: "escolher os trechos certos para a pergunta",
  tagline:
    "Retrieval é onde a busca vira resposta: dense, sparse, híbrido e reranking decidem se o contexto que chega no LLM é útil ou se é lixo disfarçado de evidência.",
  kind: "tecnica",
  stage: "retrieve",
  tools: ["Cohere Rerank", "BM25", "ColBERT", "Tavily"],
  sections: [],
};