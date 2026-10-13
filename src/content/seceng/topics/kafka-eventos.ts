import type { Topic } from "@/content/types";

export const kafkaEventos: Topic = {
  domain: "seceng",
  slug: "kafka-eventos",
  title: "Kafka e pipelines de eventos de segurança",
  short: "desacoplar quem gera eventos de quem os detecta",
  tagline:
    "Um log distribuído e durável entre a borda e a detecção deixa o pipeline absorver picos, reprocessar o passado e crescer por partições, sem que cada consumidor precise conhecer o produtor.",
  kind: "tecnica",
  stage: "escalar",
  tools: ["Apache Kafka", "Schema Registry", "Redpanda", "kafka-go"],
  sections: [
    {
      heading: "O que é e por que usar",
      body: [
        "Kafka é um log distribuído: produtores anexam eventos a tópicos, e consumidores leem em seu próprio ritmo, guardando a posição (offset) de onde pararam. Os eventos ficam retidos por um período, então dá para reler.",
        "Para segurança isso resolve problemas reais: a borda gera picos que a detecção não consegue acompanhar (o log absorve), várias equipes consomem o mesmo evento sem se afetar, e uma regra nova pode ser testada contra os últimos dias reprocessando o tópico.",
      ],
    },
    {
      heading: "Tópicos, partições e chaves",
      body: [
        "Um tópico é dividido em partições, que são a unidade de paralelismo: cada partição é lida por um consumidor do grupo. A ordem só é garantida dentro de uma partição, então a chave do evento importa. Para detecções que precisam de estado por entidade (contagem de falhas por conta, por IP, por sessão), use essa entidade como chave: todos os eventos dela caem na mesma partição, em ordem, e o mesmo consumidor mantém o estado.",
      ],
      bullets: [
        "Chave por entidade da detecção (conta, IP, sessão): ordem e estado local.",
        "Número de partições define o teto de paralelismo: planeje com folga, pois aumentar depois muda a distribuição das chaves.",
        "Retenção por tempo ou tamanho define até onde dá para reprocessar.",
        "Esquemas versionados (Schema Registry) evitam que uma mudança do produtor quebre os consumidores.",
      ],
    },
    {
      heading: "Consumir com segurança: commit depois de processar",
      body: [
        "A semântica prática é at-least-once: se você só confirma o offset depois de processar, uma falha reentrega o evento, o que significa que o processamento precisa tolerar duplicatas (assunto do tópico de confiabilidade). Confirmar antes de processar troca duplicata por perda silenciosa, quase sempre a pior escolha em segurança.",
      ],
      code: [
        {
          language: "go",
          filename: "consumer.go (segmentio/kafka-go)",
          code: "r := kafka.NewReader(kafka.ReaderConfig{\n\tBrokers: []string{\"kafka:9092\"},\n\tGroupID: \"detect-login-failures\",\n\tTopic:   \"edge.events.v1\",\n})\ndefer r.Close()\n\nfor {\n\tm, err := r.FetchMessage(ctx) // não confirma ainda\n\tif err != nil {\n\t\tbreak // ctx cancelado ou erro fatal\n\t}\n\tif err := handle(ctx, m); err != nil {\n\t\t// política de retry / DLQ; não confirma enquanto não resolver\n\t\tcontinue\n\t}\n\tif err := r.CommitMessages(ctx, m); err != nil { // confirma depois de processar\n\t\tlog.Printf(\"commit: %v\", err)\n\t}\n}",
        },
      ],
    },
    {
      heading: "Segurança do próprio Kafka",
      bullets: [
        "Autenticação (SASL ou mTLS) e autorização por tópico (ACLs): o tópico de eventos de segurança é sensível.",
        "TLS em trânsito e criptografia em repouso nos discos dos brokers.",
        "Dados pessoais nos eventos: minimizar, mascarar ou tokenizar antes de publicar; a retenção também é uma decisão de privacidade.",
        "Quotas por cliente para que um consumidor ou produtor descontrolado não afete os outros.",
      ],
    },
    {
      heading: "Quando algo falha",
      body: [
        "Eventos que não conseguem ser processados (formato inválido, dependência fora do ar por tempo demais) vão para uma fila de mensagens mortas (DLQ), em vez de travar a partição inteira. Monitorar o lag do consumidor (quanto atrás do fim do log ele está) é o sinal mais direto de que a detecção está atrasada.",
      ],
    },
  ],
};
