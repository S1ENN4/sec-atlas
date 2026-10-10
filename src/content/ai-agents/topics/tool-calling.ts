import type { Topic } from "@/content/types";

export const toolCalling: Topic = {
  domain: "ai-agents",
  slug: "tool-calling",
  title: "Tool calling",
  short: "o modelo invoca funções externas tipadas",
  tagline:
    "Tool calling é o contrato entre o LLM e o mundo: o modelo devolve JSON estruturado (nome, argumentos), o runtime valida contra schema e executa. É o que transforma texto em ação.",
  kind: "tecnica",
  stage: "act",
  tools: ["OpenAI Function Calling", "Anthropic Tool Use", "JSON Schema", "Pydantic"],
  sections: [],
};