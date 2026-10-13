import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "infra-e-politica",
    title: "infraestrutura e política como código",
    entries: [
      {
        term: "IaC",
        aka: "infrastructure as code",
        meaning:
          "Descrever infraestrutura em arquivos versionados (Terraform, Ansible). Dá revisão, histórico e testes à configuração, mas replica erros em escala se não for escaneada.",
        topic: "iac-seguro",
      },
      {
        term: "Drift",
        meaning:
          "Divergência entre o estado real da infraestrutura e o descrito no código, normalmente por mudança manual. Detectá-lo mantém o código como fonte da verdade.",
        topic: "iac-seguro",
      },
      {
        term: "Rego",
        aka: "OPA",
        meaning:
          "Linguagem declarativa do Open Policy Agent para escrever políticas avaliadas sobre uma entrada (plano de Terraform, manifesto Kubernetes, requisição de API).",
        topic: "policy-as-code",
      },
      {
        term: "OIDC na esteira",
        meaning:
          "A esteira prova sua identidade ao provedor de nuvem com um token de curta duração e recebe credenciais temporárias, eliminando chaves estáticas guardadas como segredo.",
        topic: "cicd-hardening",
      },
      {
        term: "SLSA",
        meaning:
          "Framework de níveis de garantia para a cadeia de build: quem construiu o artefato, a partir de qual fonte e em qual ambiente, com proveniência verificável.",
        topic: "cicd-hardening",
      },
    ],
  },
  {
    id: "escala-e-confiabilidade",
    title: "escala e confiabilidade",
    entries: [
      {
        term: "Consumer group",
        meaning:
          "Conjunto de consumidores Kafka que dividem as partições de um tópico entre si. Cada partição é lida por um só consumidor do grupo, o que define o teto de paralelismo.",
        topic: "kafka-eventos",
      },
      {
        term: "Offset",
        meaning:
          "Posição de um consumidor em uma partição do log. Confirmar o offset só depois de processar dá semântica at-least-once.",
        topic: "kafka-eventos",
      },
      {
        term: "Lag",
        meaning:
          "Distância entre o fim do log e a posição do consumidor. É o sinal mais direto de que a detecção está atrasada.",
        topic: "observabilidade-plataforma",
      },
      {
        term: "Idempotência",
        meaning:
          "Propriedade de uma operação que, repetida, produz o mesmo resultado de uma execução. Base para tolerar entregas duplicadas sem agir duas vezes.",
        topic: "confiabilidade-em-escala",
      },
      {
        term: "DLQ",
        aka: "dead letter queue",
        meaning:
          "Fila para eventos que não puderam ser processados após as tentativas. Evita travar o fluxo e preserva o evento para análise.",
        topic: "confiabilidade-em-escala",
      },
      {
        term: "Backpressure",
        meaning:
          "Mecanismo pelo qual um consumidor lento faz o produtor desacelerar (ou o excesso ser descartado de forma consciente), em vez de a memória crescer sem limite.",
        topic: "confiabilidade-em-escala",
      },
      {
        term: "SOAR",
        meaning:
          "Orquestração, automação e resposta de segurança: executar passos de resposta de forma automática, descritos em playbooks, com freios como aprovação humana e auditoria.",
        topic: "automacao-soar",
      },
    ],
  },
];
