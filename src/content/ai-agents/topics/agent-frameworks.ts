import type { Topic } from "@/content/types";

export const agentFrameworks: Topic = {
  domain: "ai-agents",
  slug: "agent-frameworks",
  title: "Agent frameworks",
  short: "esqueleto para orquestrar raciocínio, memória e ferramentas",
  tagline:
    "Agent frameworks (LangGraph, CrewAI, AutoGen, DeepAgents) definem o loop: estado, plano, ferramentas e o que acontece entre cada chamada do modelo. Sem framework, o agente vira um script.",
  kind: "pratica",
  stage: "act",
  tools: ["LangGraph", "CrewAI", "AutoGen", "DeepAgents"],
  sections: [],
};