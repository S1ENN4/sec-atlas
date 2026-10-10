import type { Topic } from "@/content/types";

export const mcp: Topic = {
  domain: "ai-agents",
  slug: "mcp",
  title: "MCP - model context protocol",
  short: "protocolo padronizado entre modelo e ferramentas",
  tagline:
    "MCP (Model Context Protocol, spec 2025-06-18) padroniza como um cliente LLM descobre, lista e chama ferramentas expostas por servidores — uma única interface para integrar com qualquer fonte de dados ou ação.",
  kind: "conceito",
  stage: null,
  tools: ["Anthropic MCP", "MCP Python SDK", "MCP TypeScript SDK", "FastMCP"],
  sections: [],
};