import type { Bridge } from "@/content/types";

const a = (slug: string) => ({ domain: "appsec" as const, slug });
const c = (slug: string) => ({ domain: "cloudsec" as const, slug });
const g = (slug: string) => ({ domain: "ai-agents" as const, slug });
const s = (slug: string) => ({ domain: "secops" as const, slug });
const e = (slug: string) => ({ domain: "seceng" as const, slug });

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
  { a: a("dast"), b: s("waf"), label: "acha a falha; o WAF mitiga enquanto ela não é corrigida (patch virtual)" },
  { a: a("sast"), b: s("runbooks-e-hardening"), label: "o hardening do pós-incidente vira regra e correção no código" },
  { a: c("network"), b: s("defesa-em-camadas"), label: "segmentação e borda desenhadas juntas" },
  { a: c("logging-detection"), b: s("telemetria-borda"), label: "mesma ideia de sinal, aplicada ao tráfego L7" },
  { a: c("incident-response"), b: s("runbooks-e-hardening"), label: "o runbook de L7 é um caso específico da resposta geral" },
  { a: s("bot-management"), b: g("guardrails"), label: "distinguir automação legítima de abuso vale também para agentes" },
  { a: s("detection-engineering"), b: g("evals"), label: "detecção e avaliação medem precisão e recall do mesmo jeito" },
  { a: a("cicd"), b: e("cicd-hardening"), label: "a esteira vista como alvo: o mesmo pipeline, agora endurecido" },
  { a: a("devsecops"), b: e("policy-as-code"), label: "gates e políticas, escritos como código executável" },
  { a: c("cspm"), b: e("iac-seguro"), label: "o CSPM vê o ambiente; o IaC seguro corrige na origem e pega o drift" },
  { a: c("secrets-cloud"), b: e("cicd-hardening"), label: "OIDC no lugar de segredos estáticos na esteira" },
  { a: s("escala-telemetria"), b: e("confiabilidade-em-escala"), label: "volume e falha: escalar sem perder nem duplicar" },
  { a: s("runbooks-e-hardening"), b: e("automacao-soar"), label: "o runbook que vira playbook automatizado, com freios" },
  { a: s("slos-soc"), b: e("observabilidade-plataforma"), label: "SLOs do SOC e SLOs da própria plataforma" },
  { a: g("guardrails"), b: e("ia-na-seguranca"), label: "o mesmo cuidado com entrada e saída do modelo" },
  { a: g("tool-calling"), b: e("automacao-soar"), label: "ação disparada por modelo precisa dos mesmos freios de um playbook" },
  { a: c("kms-crypto"), b: g("vector-db"), label: "cifrar o índice com chave gerenciada" },
];

// Bridges touching a topic, normalised so `other` is always the far end.
export function bridgesOf(ref: { domain: string; slug: string }) {
  const same = (r: { domain: string; slug: string }) => r.domain === ref.domain && r.slug === ref.slug;
  return bridges.flatMap((b) =>
    same(b.a) ? [{ other: b.b, label: b.label }] : same(b.b) ? [{ other: b.a, label: b.label }] : [],
  );
}
