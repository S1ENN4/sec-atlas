import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "defesa-de-borda",
    title: "defesa de borda",
    entries: [
      {
        term: "WAF",
        aka: "web application firewall",
        meaning:
          "Filtro de tráfego HTTP na camada 7 que decide, por requisição, se segue, é desafiada, limitada ou bloqueada. Reduz a superfície exposta e permite patch virtual; não substitui a correção na aplicação.",
        topic: "waf",
      },
      {
        term: "Modelo positivo",
        aka: "allowlist",
        meaning:
          "Definir o que é válido para um endpoint (métodos, caminhos, formatos, tamanhos) e bloquear o resto. Mais preciso que assinaturas, mas exige conhecer a aplicação.",
        topic: "waf",
      },
      {
        term: "Shadow mode",
        meaning:
          "Fase em que uma regra roda em paralelo, sem agir, e a decisão simulada é comparada com a realidade para medir falso positivo antes do enforcement.",
        topic: "waf",
      },
      {
        term: "Patch virtual",
        aka: "virtual patching",
        meaning:
          "Regra de WAF que bloqueia a exploração de uma vulnerabilidade conhecida enquanto a correção real não chega à aplicação. Ganha tempo, não elimina a falha.",
        topic: "waf",
      },
      {
        term: "Rate limiting",
        meaning:
          "Limite de requisições por entidade e janela de tempo. A escolha da chave (IP, conta, token, ASN) pesa tanto quanto o valor do limite.",
        topic: "rate-limiting",
      },
      {
        term: "Challenge",
        aka: "desafio",
        meaning:
          "Verificação que tenta provar que o cliente é um navegador real, sem pedir nada ao usuário na maioria dos casos. É o degrau antes do bloqueio.",
        topic: "bot-management",
      },
      {
        term: "Fail-open / fail-closed",
        meaning:
          "O que o sistema faz quando um controle de segurança falha: fail-open deixa passar (disponível, desprotegido), fail-closed bloqueia (seguro, indisponível). A escolha deve ser consciente por endpoint.",
        topic: "defesa-em-camadas",
      },
    ],
  },
  {
    id: "deteccao-e-metricas",
    title: "detecção e métricas",
    entries: [
      {
        term: "Credential stuffing",
        meaning:
          "Ataque que testa em massa pares usuário/senha vazados de outros serviços. Assinatura: muitas falhas de login distribuídas por muitos IPs, com poucas tentativas por conta.",
        topic: "ataques-l7",
      },
      {
        term: "Z-score",
        meaning:
          "Distância de um valor até a média, medida em desvios padrão. Em detecção, valores muito acima do histórico recente da mesma chave sugerem anomalia.",
        topic: "detection-engineering",
      },
      {
        term: "EWMA",
        aka: "média móvel exponencial",
        meaning:
          "Média que dá mais peso aos dados recentes. Usada como baseline adaptativo: acompanha a mudança do tráfego normal sem ficar presa ao passado.",
        topic: "detection-engineering",
      },
      {
        term: "Cardinalidade",
        meaning:
          "Quantidade de valores distintos de um campo (IPs, user agents). Alta cardinalidade encarece agregações e derruba sistemas de métricas; agregue pelo nível mais grosso que ainda separa o ataque do normal.",
        topic: "escala-telemetria",
      },
      {
        term: "MTTT",
        aka: "mean time to triage",
        meaning: "Tempo médio entre o alerta e a classificação dele como real ou falso.",
        topic: "slos-soc",
      },
      {
        term: "MTTC",
        aka: "mean time to contain",
        meaning: "Tempo médio entre a confirmação de um ataque e a sua contenção.",
        topic: "slos-soc",
      },
      {
        term: "Precisão e recall",
        meaning:
          "Precisão: dos alertas emitidos, quantos eram ataque real. Recall: dos ataques existentes, quantos foram detectados. Subir um tende a derrubar o outro.",
        topic: "slos-soc",
      },
    ],
  },
];
