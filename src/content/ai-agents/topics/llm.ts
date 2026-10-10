import type { Topic } from "@/content/types";

export const llm: Topic = {
  domain: "ai-agents",
  slug: "llm",
  title: "LLM - large language model",
  short: "o modelo que gera texto a partir de contexto",
  tagline:
    "LLM é o motor generativo: recebe contexto (system, histórico, retrieval, ferramentas) e produz a próxima resposta. Não 'sabe' fatos — usa o contexto para parecer saber.",
  kind: "conceito",
  stage: null,
  tools: ["OpenAI", "Anthropic Claude", "Google Gemini", "Mistral"],
  sections: [],
};