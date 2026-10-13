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
};
