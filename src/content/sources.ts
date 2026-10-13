import type { DomainId } from "@/content/types";

export interface Source {
  label: string;
  href: string;
  note: string;
}

// Primary references per domain, shown at the end of every topic and on the
// domain pages. Only well-known, stable, first-party pages.
export const sources: Record<DomainId, Source[]> = {
  appsec: [
    { label: "OWASP Top 10", href: "https://owasp.org/www-project-top-ten/", note: "categorias de risco em aplicações web" },
    { label: "OWASP Cheat Sheet Series", href: "https://cheatsheetseries.owasp.org/", note: "guias práticos por tema" },
    { label: "OWASP ASVS", href: "https://owasp.org/www-project-application-security-verification-standard/", note: "checklist verificável de segurança" },
    { label: "NIST SP 800-218 (SSDF)", href: "https://csrc.nist.gov/pubs/sp/800/218/final", note: "práticas de desenvolvimento seguro" },
    { label: "OWASP Threat Modeling", href: "https://owasp.org/www-community/Threat_Modeling", note: "introdução à modelagem de ameaças" },
    { label: "CycloneDX", href: "https://cyclonedx.org/", note: "padrão de SBOM" },
  ],
  cloudsec: [
    { label: "CIS Benchmarks", href: "https://www.cisecurity.org/cis-benchmarks", note: "linhas de base de configuração segura" },
    { label: "NIST SP 800-61 Rev. 2", href: "https://csrc.nist.gov/pubs/sp/800/61/r2/final", note: "guia de resposta a incidentes" },
    { label: "NIST SP 800-207", href: "https://csrc.nist.gov/pubs/sp/800/207/final", note: "arquitetura Zero Trust" },
    { label: "Kubernetes: Security", href: "https://kubernetes.io/docs/concepts/security/", note: "conceitos oficiais de segurança" },
    { label: "AWS Well-Architected: Security", href: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html", note: "pilar de segurança" },
    { label: "CNCF Cloud Native Security", href: "https://www.cncf.io/", note: "ecossistema e whitepapers cloud native" },
  ],
  "ai-agents": [
    { label: "OWASP Top 10 for LLM Applications", href: "https://genai.owasp.org/llm-top-10/", note: "riscos de aplicações com LLM" },
    { label: "NIST AI Risk Management Framework", href: "https://www.nist.gov/itl/ai-risk-management-framework", note: "gestão de risco de IA" },
    { label: "Model Context Protocol", href: "https://modelcontextprotocol.io/", note: "especificação e documentação do MCP" },
    { label: "MITRE ATLAS", href: "https://atlas.mitre.org/", note: "táticas e técnicas contra sistemas de IA" },
  ],
  secops: [
    { label: "Cloudflare WAF", href: "https://developers.cloudflare.com/waf/", note: "regras gerenciadas, regras customizadas e ações" },
    { label: "Cloudflare Rate limiting rules", href: "https://developers.cloudflare.com/waf/rate-limiting-rules/", note: "características, períodos e mitigação" },
    { label: "Cloudflare Bots", href: "https://developers.cloudflare.com/bots/", note: "bot management, score e desafios" },
    { label: "OWASP Core Rule Set", href: "https://coreruleset.org/", note: "conjunto aberto de regras de WAF" },
    { label: "OWASP Automated Threats", href: "https://owasp.org/www-project-automated-threats-to-web-applications/", note: "taxonomia de ameaças automatizadas" },
    { label: "MITRE ATT&CK", href: "https://attack.mitre.org/", note: "táticas e técnicas de adversários" },
  ],
  owasp: [
    { label: "OWASP Top 10:2025", href: "https://top10.owasp.org/2025", note: "a lista oficial de categorias de risco" },
    { label: "OWASP Cheat Sheet Series", href: "https://cheatsheetseries.owasp.org/", note: "guias práticos de correção por tema" },
    { label: "OWASP ASVS", href: "https://owasp.org/www-project-application-security-verification-standard/", note: "requisitos verificáveis de segurança" },
    { label: "OWASP WSTG", href: "https://owasp.org/www-project-web-security-testing-guide/", note: "guia de testes de segurança web" },
  ],
  vibecoding: [
    { label: "Claude Code: documentação", href: "https://docs.claude.com/en/docs/claude-code/overview", note: "agente de terminal da Anthropic: permissões, hooks, skills e MCP" },
    { label: "OpenCode", href: "https://opencode.ai/", note: "agente de código aberto, independente de provedor" },
    { label: "oh-my-pi (OMP)", href: "https://github.com/can1357/oh-my-pi", note: "agente de terminal derivado do Pi, com edição estruturada, LSP e subagentes" },
    { label: "Oh My OpenAgent (OMO)", href: "https://github.com/code-yeongyu/oh-my-opencode", note: "plugin de orquestração multiagente para o OpenCode" },
    { label: "herdr", href: "https://github.com/herdrdev/herdr", note: "multiplexador de terminal para vários agentes de código" },
    { label: "AGENTS.md", href: "https://agents.md/", note: "convenção de instruções para agentes de código" },
    { label: "Model Context Protocol", href: "https://modelcontextprotocol.io/", note: "protocolo aberto para conectar agentes a ferramentas" },
    { label: "git worktree", href: "https://git-scm.com/docs/git-worktree", note: "vários diretórios de trabalho para o mesmo repositório" },
  ],
  seceng: [
    { label: "Open Policy Agent", href: "https://www.openpolicyagent.org/docs/latest/", note: "policy as code com Rego" },
    { label: "Terraform: documentação", href: "https://developer.hashicorp.com/terraform/docs", note: "IaC, estado remoto e módulos" },
    { label: "SLSA", href: "https://slsa.dev/", note: "níveis de integridade da cadeia de build" },
    { label: "OpenTelemetry", href: "https://opentelemetry.io/docs/", note: "métricas, traces e logs padronizados" },
  ],
};
