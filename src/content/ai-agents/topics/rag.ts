import type { Topic } from "@/content/types";

export const rag: Topic = {
  domain: "ai-agents",
  slug: "rag",
  title: "RAG - retrieval-augmented generation",
  short: "resposta com base em documentos recuperados",
  tagline:
    "RAG junta busca e geração: o modelo só responde depois de puxar os trechos relevantes de uma base externa, então a resposta é ancorada em material que existe e pode ser citado.",
  kind: "conceito",
  stage: null,
  tools: ["LangChain", "LlamaIndex", "Haystack", "Pinecone"],
  sections: [],
};