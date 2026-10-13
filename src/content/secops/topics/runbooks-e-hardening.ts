import type { Topic } from "@/content/types";

export const runbooksEHardening: Topic = {
  domain: "secops",
  slug: "runbooks-e-hardening",
  title: "Runbooks, resposta e hardening pós-incidente",
  short: "da contenção rápida à correção que fecha a porta",
  tagline:
    "O runbook faz a contenção acontecer em minutos, e o pós-incidente transforma o que doeu em uma defesa permanente, na aplicação e não só na borda.",
  kind: "pratica",
  stage: "agir",
  tools: ["PagerDuty", "Cloudflare Rules", "Terraform", "CSP Evaluator"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Runbooks são roteiros curtos e acionáveis para os incidentes mais prováveis: quem decide, o que checar, qual ação tomar e como desfazer. Bom runbook cabe em uma tela e funciona às três da manhã, para quem acabou de acordar.",
        "O hardening pós-incidente é o outro lado: a borda contém, mas só a correção na aplicação e na configuração evita a repetição.",
      ],
    },
    {
      heading: "Escada de contenção com prazo",
      body: [
        "Em ataques volumétricos ou de abuso, a resposta escala em degraus, cada um com TTL, para que um erro de classificação não bloqueie ninguém para sempre. Começar por desafio (barato para o legítimo, caro para o robô) e só então bloquear.",
      ],
      code: [
        {
          language: "yaml",
          filename: "runbook: credential stuffing no login",
          code: "trigger: alerta login_failures_zscore > 4 por 3 minutos\nowner: soc-l7 (plantão)\nsteps:\n  - verificar: ASNs e fingerprints dominantes, contas tentadas (distintas vs repetidas)\n  - conter:\n      1: Managed Challenge nos ASNs ofensores        # TTL 30 min\n      2: Block nos fingerprints confirmados           # TTL 4 h\n      3: exigir MFA / reset forçado nas contas com sucesso suspeito\n  - comunicar: canal #incidentes, atualização a cada 30 min\n  - desfazer: remover regras se a taxa de falhas voltar ao baseline por 30 min\nafter: pós-mortem em até 5 dias úteis",
        },
      ],
    },
    {
      heading: "Pós-mortem sem culpa",
      body: [
        "O objetivo é aprender, não achar culpado. Um bom pós-mortem registra a linha do tempo (quando começou, quando detectamos, quando contivemos), a causa, o que funcionou, o que atrapalhou e ações com dono e prazo. As métricas de detecção e contenção saem dele e alimentam o tuning.",
      ],
    },
    {
      heading: "Hardening na aplicação",
      body: [
        "Cada incidente aponta controles que não deveriam depender da borda. Três exemplos frequentes:",
      ],
      bullets: [
        "CSP com nonce: política de segurança de conteúdo que só executa scripts com um nonce gerado por requisição, reduzindo o impacto de XSS.",
        "CORS estrito: origens permitidas explícitas, sem coringa em endpoints com credenciais.",
        "Validação de schema no gateway: rejeitar corpos e parâmetros que não casam com a especificação da API, o modelo positivo aplicado perto da aplicação.",
      ],
    },
    {
      heading: "Exemplo: CSP com nonce",
      code: [
        {
          language: "text",
          filename: "response header",
          code: "Content-Security-Policy:\n  default-src 'self';\n  script-src 'self' 'nonce-{random-por-requisição}' 'strict-dynamic';\n  object-src 'none';\n  base-uri 'none';\n  frame-ancestors 'none'",
        },
      ],
    },
    {
      heading: "Exercícios",
      body: [
        "Runbook não testado é suposição. Exercícios de mesa (tabletop) e simulações com tráfego sintético revelam lacunas de permissão, de contato e de ferramenta antes do incidente real, e mantêm o time treinado.",
      ],
    },
  ],
};
