import type { Topic } from "@/content/types";

export const orchestration: Topic = {
  domain: "ai-agents",
  slug: "orchestration",
  title: "Orchestration",
  short: "coordenar múltiplos agentes e etapas",
  tagline:
    "Orchestration é o padrão acima do agente único: pipeline (sequência fixa), supervisor (um orquestra N) ou swarm (N se organizam). Define quem fala com quem, quando e em que ordem.",
  kind: "pratica",
  stage: "act",
  tools: ["Temporal", "LangGraph", "Apache Airflow", "Prefect"],
  sections: [],
};