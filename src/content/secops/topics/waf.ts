import type { Topic } from "@/content/types";

export const waf: Topic = {
  domain: "secops",
  slug: "waf",
  title: "WAF - observação, shadow e enforcement",
  short: "filtrar o tráfego L7 sem derrubar o que é legítimo",
  tagline:
    "Um WAF bem operado não é uma caixa que se liga: é um programa que começa observando, valida cada regra em sombra e só então bloqueia, com um dono e uma métrica para cada decisão.",
  kind: "tecnica",
  stage: "agir",
  tools: ["Cloudflare WAF", "OWASP Core Rule Set", "AWS WAF", "ModSecurity"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Um WAF (Web Application Firewall) inspeciona o tráfego HTTP na camada 7 e decide, requisição a requisição, se ela segue, é desafiada, limitada ou bloqueada. Ele enxerga o que um firewall de rede não vê: caminho, método, cabeçalhos, parâmetros e o corpo da requisição.",
        "Ele não corrige a aplicação. O papel é reduzir a superfície exposta e ganhar tempo: bloquear padrões conhecidos de ataque, aplicar um \"patch virtual\" enquanto o time corrige a falha de verdade e conter automação abusiva antes que ela chegue à origem.",
      ],
    },
    {
      heading: "Modelo negativo e modelo positivo",
      body: [
        "O modelo negativo bloqueia o que parece ruim: assinaturas de injeção SQL, XSS, path traversal, como as regras gerenciadas (OWASP Core Rule Set e os rulesets mantidos pelo fornecedor). É a base, pronta para usar, mas gera falso positivo e é contornável por quem conhece o padrão.",
        "O modelo positivo define o que é válido e bloqueia o resto: para um endpoint crítico, quais métodos, quais caminhos, quais tipos de conteúdo e tamanhos são aceitos. Dá muito mais precisão, mas exige conhecer a aplicação, então se aplica endpoint por endpoint, começando pelos mais críticos (login, pagamento, administração).",
      ],
      bullets: [
        "Negativo: cobertura ampla e rápida, ruído maior, atualizado pelo fornecedor.",
        "Positivo: precisão alta e superfície mínima, custo de manutenção maior, escrito por quem conhece a aplicação.",
        "Na prática se combinam: o gerenciado como rede de proteção e o positivo nos endpoints que mais importam.",
      ],
    },
    {
      heading: "Observação, shadow e enforcement",
      body: [
        "A regra de ouro é nunca ligar uma regra nova direto em bloqueio. O caminho seguro tem três fases:",
      ],
      bullets: [
        "Observação: a regra só registra (ação de log). Você mede quanto tráfego ela pegaria e de quem.",
        "Shadow: a regra roda em paralelo e a decisão simulada é comparada com a realidade (o que teria sido bloqueado e era legítimo?). Aqui se acerta a precisão.",
        "Enforcement: a regra passa a agir, começando por desafio (challenge) em vez de bloqueio seco quando há dúvida, e ganha um responsável e uma métrica de falso positivo.",
      ],
    },
    {
      heading: "Exemplo: regras na linguagem de expressões da Cloudflare",
      body: [
        "Duas regras ilustrativas. A primeira é positiva: em um endpoint de pedidos, só GET e POST são aceitos. A segunda protege o login: requisições de login vindas de fora de uma lista confiável recebem um desafio. Os nomes de campo seguem a linguagem de regras da Cloudflare; ajuste ao seu ambiente.",
      ],
      code: [
        {
          language: "text",
          filename: "custom rules - ilustrativo",
          code: "# 1) modelo positivo: método inesperado em /api/orders\n(http.request.uri.path eq \"/api/orders\" and not http.request.method in {\"GET\" \"POST\"})\n  -> action: Block\n\n# 2) login fora da lista confiável recebe desafio\n(http.request.method eq \"POST\" and http.request.uri.path eq \"/api/login\" and not ip.src in $trusted_ips)\n  -> action: Managed Challenge\n\n# fase de observação: mesma expressão, só registrando\n  -> action: Log",
        },
      ],
    },
    {
      heading: "Falso positivo é o custo real",
      body: [
        "Bloquear um cliente legítimo custa receita e confiança, e é o que faz times desligarem o WAF. Por isso cada regra precisa de uma métrica de precisão, de uma exceção documentada (e com prazo) e de um ciclo semanal de revisão. Um WAF que ninguém ajusta vira, em poucos meses, ou um muro que atrapalha ou um enfeite que não bloqueia nada.",
      ],
    },
  ],
};
