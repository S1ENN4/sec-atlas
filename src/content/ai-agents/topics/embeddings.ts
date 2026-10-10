import type { Topic } from "@/content/types";

export const embeddings: Topic = {
  domain: "ai-agents",
  slug: "embeddings",
  title: "Embeddings",
  short: "transformar texto em vetores que aproximam significado",
  tagline:
    "Embeddings mapeiam texto para um espaço onde distância vira semântica: 'cão' e 'pet' ficam perto, 'cão' e 'satélite' ficam longe. É o motor da busca por similaridade do RAG.",
  kind: "tecnica",
  stage: "index",
  tools: ["OpenAI", "Cohere", "sentence-transformers", "Voyage AI"],
  sections: [],
};