import type { Bridge } from "@/content/types";

const a = (slug: string) => ({ domain: "appsec" as const, slug });
const c = (slug: string) => ({ domain: "cloudsec" as const, slug });
const g = (slug: string) => ({ domain: "ai-agents" as const, slug });

// Cross-domain bridges: the same underlying problem showing up in two
// domains. Each shows on both topic pages. Keep labels short, they read as
// "<this topic> <label> <other topic>".
export const bridges: Bridge[] = [
  { a: a("secrets"), b: c("secrets-cloud"), label: "é o mesmo problema: segredo fora do código" },
  { a: a("sca"), b: c("containers"), label: "alimenta: a imagem herda as dependências" },
  { a: a("sbom"), b: c("containers"), label: "inventaria o que vai dentro da imagem" },
  { a: a("devsecops"), b: c("cspm"), label: "vira política contínua em produção" },
  { a: a("threat-modeling"), b: c("zero-trust"), label: "define as fronteiras de confiança" },
  { a: a("threat-modeling"), b: g("guardrails"), label: "mapeia o que o agente não pode fazer" },
  { a: a("sast"), b: g("tool-calling"), label: "pega injeção em código; aqui o alvo é o argumento da ferramenta" },
  { a: a("secrets"), b: g("mcp"), label: "tokens de servidores MCP vazam do mesmo jeito" },
  { a: c("iam"), b: g("agent-frameworks"), label: "privilégio mínimo vale para o agente também" },
  { a: c("logging-detection"), b: g("evals"), label: "observar em produção alimenta a avaliação" },
  { a: c("incident-response"), b: g("regression-evals"), label: "todo incidente vira um caso de teste" },
  { a: c("kms-crypto"), b: g("vector-db"), label: "cifrar o índice com chave gerenciada" },
];
