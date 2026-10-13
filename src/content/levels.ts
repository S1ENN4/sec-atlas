// Learning levels and prerequisites for the guided Journey.
//
//   level 1  Foundations   the ideas everything else builds on
//   level 2  Practitioner  applying the controls in practice
//   level 3  Advanced      designing, scaling and operating at depth
//
// `requires` lists topics ("<domain>/<slug>") worth studying first. It is a
// recommendation, never a lock: the Journey only uses it to show what is
// ready. Rule R10 checks that every topic has an entry, every reference
// resolves, there are no cycles, and a prerequisite is never of a higher
// level than the topic that requires it.

export type Level = 1 | 2 | 3;

export interface LevelInfo {
  level: Level;
  requires?: string[];
}

export const levels: Record<string, LevelInfo> = {
  // --- AppSec -------------------------------------------------------------
  "appsec/shift-left": { level: 1 },
  "appsec/cicd": { level: 1 },
  "appsec/secrets": { level: 1, requires: ["appsec/shift-left"] },
  "appsec/sast": { level: 2, requires: ["appsec/cicd", "appsec/shift-left"] },
  "appsec/sca": { level: 2, requires: ["appsec/cicd"] },
  "appsec/threat-modeling": { level: 2, requires: ["appsec/shift-left"] },
  "appsec/dast": { level: 2, requires: ["appsec/cicd", "appsec/sast"] },
  "appsec/sbom": { level: 3, requires: ["appsec/sca"] },
  "appsec/devsecops": { level: 3, requires: ["appsec/sast", "appsec/sca", "appsec/dast"] },

  // --- CloudSec -----------------------------------------------------------
  "cloudsec/iam": { level: 1 },
  "cloudsec/network": { level: 1 },
  "cloudsec/logging-detection": { level: 1 },
  "cloudsec/kms-crypto": { level: 2, requires: ["cloudsec/iam"] },
  "cloudsec/secrets-cloud": { level: 2, requires: ["cloudsec/iam", "cloudsec/kms-crypto"] },
  "cloudsec/containers": { level: 2, requires: ["cloudsec/network"] },
  "cloudsec/cspm": { level: 2, requires: ["cloudsec/iam", "cloudsec/network", "cloudsec/logging-detection"] },
  "cloudsec/zero-trust": { level: 2, requires: ["cloudsec/iam", "cloudsec/network"] },
  "cloudsec/kubernetes": { level: 3, requires: ["cloudsec/containers", "cloudsec/iam"] },
  "cloudsec/cwpp": { level: 3, requires: ["cloudsec/containers", "cloudsec/logging-detection"] },
  "cloudsec/incident-response": { level: 3, requires: ["cloudsec/logging-detection", "cloudsec/iam"] },

  // --- AI agents ----------------------------------------------------------
  "ai-agents/llm": { level: 1 },
  "ai-agents/chunking": { level: 1, requires: ["ai-agents/llm"] },
  "ai-agents/embeddings": { level: 1, requires: ["ai-agents/llm"] },
  "ai-agents/vector-db": { level: 2, requires: ["ai-agents/embeddings"] },
  "ai-agents/retrieval": { level: 2, requires: ["ai-agents/vector-db", "ai-agents/chunking"] },
  "ai-agents/rag": { level: 2, requires: ["ai-agents/retrieval", "ai-agents/llm"] },
  "ai-agents/tool-calling": { level: 2, requires: ["ai-agents/llm"] },
  "ai-agents/guardrails": { level: 2, requires: ["ai-agents/llm"] },
  "ai-agents/evals": { level: 2, requires: ["ai-agents/llm"] },
  "ai-agents/agent-frameworks": { level: 3, requires: ["ai-agents/tool-calling", "ai-agents/llm"] },
  "ai-agents/orchestration": { level: 3, requires: ["ai-agents/agent-frameworks"] },
  "ai-agents/mcp": { level: 3, requires: ["ai-agents/tool-calling"] },
  "ai-agents/benchmarks": { level: 3, requires: ["ai-agents/evals"] },
  "ai-agents/llm-as-judge": { level: 3, requires: ["ai-agents/evals"] },
  "ai-agents/regression-evals": { level: 3, requires: ["ai-agents/evals"] },

  // --- SecOps -------------------------------------------------------------
  "secops/ataques-l7": { level: 1 },
  "secops/telemetria-borda": { level: 1 },
  "secops/waf": { level: 2, requires: ["secops/ataques-l7"] },
  "secops/rate-limiting": { level: 2, requires: ["secops/ataques-l7"] },
  "secops/bot-management": { level: 2, requires: ["secops/ataques-l7", "secops/rate-limiting"] },
  "secops/detection-engineering": { level: 2, requires: ["secops/telemetria-borda", "secops/ataques-l7"] },
  "secops/escala-telemetria": { level: 3, requires: ["secops/telemetria-borda"] },
  "secops/runbooks-e-hardening": { level: 3, requires: ["secops/waf", "secops/detection-engineering"] },
  "secops/slos-soc": { level: 3, requires: ["secops/detection-engineering"] },
  "secops/defesa-em-camadas": { level: 3, requires: ["secops/waf", "secops/rate-limiting"] },

  // --- Security engineering ----------------------------------------------
  "seceng/iac-seguro": { level: 2, requires: ["cloudsec/iam"] },
  "seceng/cicd-hardening": { level: 2, requires: ["appsec/cicd"] },
  "seceng/policy-as-code": { level: 3, requires: ["seceng/iac-seguro"] },
  "seceng/confiabilidade-em-escala": { level: 3, requires: ["appsec/cicd"] },
  "seceng/observabilidade-plataforma": { level: 3, requires: ["seceng/confiabilidade-em-escala"] },
  "seceng/automacao-soar": { level: 3, requires: ["seceng/confiabilidade-em-escala"] },
  "seceng/ia-na-seguranca": { level: 3, requires: ["seceng/automacao-soar", "ai-agents/llm"] },
  "seceng/plataforma-como-produto": { level: 3, requires: ["seceng/cicd-hardening", "seceng/policy-as-code"] },

  // --- OWASP Top 10:2025 ---------------------------------------------------
  "owasp/broken-access-control": { level: 1 },
  "owasp/injection": { level: 1 },
  "owasp/authentication-failures": { level: 1 },
  "owasp/cryptographic-failures": { level: 2, requires: ["owasp/authentication-failures"] },
  "owasp/security-misconfiguration": { level: 2 },
  "owasp/insecure-design": { level: 2, requires: ["owasp/broken-access-control"] },
  "owasp/logging-alerting-failures": { level: 2, requires: ["owasp/broken-access-control"] },
  "owasp/exceptional-conditions": { level: 2, requires: ["owasp/logging-alerting-failures"] },
  "owasp/supply-chain-failures": { level: 2, requires: ["appsec/sca"] },
  "owasp/integrity-failures": { level: 3, requires: ["owasp/supply-chain-failures", "owasp/cryptographic-failures"] },
};

export const levelOf = (domain: string, slug: string): Level => levels[`${domain}/${slug}`]?.level ?? 1;
