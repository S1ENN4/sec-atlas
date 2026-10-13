import type { Topic } from "@/content/types";

export const automacaoSoar: Topic = {
  domain: "seceng",
  slug: "automacao-soar",
  title: "Automação de segurança e playbooks como código",
  short: "resposta automática com freios: idempotente, auditável e reversível",
  tagline:
    "Automatizar a resposta tira minutos de cada incidente, mas uma automação mal desenhada é um incidente esperando para acontecer. O que separa as duas coisas são os freios.",
  kind: "pratica",
  stage: "automatizar",
  tools: ["Python", "Shuffle", "Tines", "Temporal"],
  sections: [
    {
      heading: "O que é",
      body: [
        "SOAR (security orchestration, automation and response) é o conjunto de práticas e ferramentas que executam passos de resposta de forma automática: enriquecer um alerta, consultar reputação, abrir um ticket, isolar um recurso, bloquear uma origem. Um playbook é o roteiro desses passos.",
        "Tratar playbooks como código (em repositório, com revisão, testes e versões) evita o caos de fluxos clicados em uma interface que ninguém consegue auditar nem reproduzir.",
      ],
    },
    {
      heading: "Os quatro freios",
      bullets: [
        "Idempotência: executar o playbook duas vezes para o mesmo alerta não pode duplicar efeito (ver o tópico de confiabilidade).",
        "Aprovação humana em ações destrutivas ou de grande alcance: bloquear um ASN inteiro, desativar uma conta de produção, derrubar um serviço.",
        "Dry-run: toda ação deve poder rodar em modo simulado, mostrando o que faria, para testes e para o shadow de uma automação nova.",
        "Auditoria e reversão: cada ação registra quem (ou o quê) a executou, por qual alerta, e tem um desfazer definido, de preferência com prazo (TTL).",
      ],
    },
    {
      heading: "Um playbook em Python",
      body: [
        "O exemplo mostra a estrutura: enriquece, decide por regra, aplica uma ação limitada no tempo e exige aprovação quando o alcance é grande. As funções de integração (cliente de bloqueio, aprovação, auditoria) são ilustrativas.",
      ],
      code: [
        {
          language: "python",
          filename: "playbook_block_source.py",
          code: "from dataclasses import dataclass\n\nTTL_SECONDS = 1800          # todo bloqueio expira\nAPPROVAL_ABOVE = 50         # alcance grande exige humano\n\n@dataclass\nclass Alert:\n    id: str\n    source_ips: list[str]\n    confidence: float\n\ndef run(alert: Alert, *, dry_run: bool = True) -> str:\n    if audit.already_handled(alert.id):          # idempotência\n        return \"skip: já tratado\"\n    if alert.confidence < 0.9:\n        return \"skip: confiança baixa, vai para triagem humana\"\n\n    if len(alert.source_ips) > APPROVAL_ABOVE and not approvals.granted(alert.id):\n        approvals.request(alert.id, reason=\"bloqueio amplo\")\n        return \"pendente: aguardando aprovação\"\n\n    for ip in alert.source_ips:\n        blocker.block(ip, ttl=TTL_SECONDS, dry_run=dry_run)\n    audit.record(alert.id, action=\"block\", ips=alert.source_ips, dry_run=dry_run)\n    return \"ok\"",
        },
    ],
    },
    {
      heading: "Orquestração durável",
      body: [
        "Playbooks reais têm esperas (uma aprovação que demora horas), repetições e partes que falham. Motores de workflow duráveis (como o Temporal) guardam o estado de cada execução, retomam do ponto certo depois de uma falha e dão visibilidade do que está em andamento, o que costuma ser mais robusto do que encadear scripts.",
      ],
    },
    {
      heading: "Segredos e permissões da automação",
      body: [
        "A automação é uma identidade poderosa: ela bloqueia, revoga e apaga. Dê a ela as permissões mínimas por ação, guarde as credenciais em cofre com rotação, e trate o repositório e a esteira de playbooks com o mesmo rigor de qualquer sistema com acesso a produção. Uma automação comprometida é uma ferramenta de ataque pronta.",
      ],
    },
  ],
};
