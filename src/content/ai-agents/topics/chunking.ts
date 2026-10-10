import type { Topic } from "@/content/types";

export const chunking: Topic = {
  domain: "ai-agents",
  slug: "chunking",
  title: "Chunking",
  short: "cortar o documento em pedaços recuperáveis",
  tagline:
    "Chunking é a primeira decisão técnica de RAG: o tamanho, a sobreposição e a estratégia de corte determinam o que o retrieval consegue encontrar depois — pedaços ruins viram respostas sem contexto.",
  kind: "tecnica",
  stage: "ingest",
  tools: ["LangChain", "LlamaIndex", "Unstructured", "spaCy"],
  sections: [],
};