import type { Topic } from "@/content/types";

export const vectorDb: Topic = {
  domain: "ai-agents",
  slug: "vector-db",
  title: "Vector DB",
  short: "banco que busca por distância em vez de por termo exato",
  tagline:
    "Vector DB é o componente que guarda embeddings e responde 'quais vetores estão mais próximos deste?' em milissegundos — é onde o ANN (HNSW, IVF) paga o custo da busca semântica.",
  kind: "pratica",
  stage: "index",
  tools: ["Pinecone", "Weaviate", "Qdrant", "pgvector"],
  sections: [],
};