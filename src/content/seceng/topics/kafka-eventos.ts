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
  tools: ["Apache Kafka", "Schema Registry", "Redpanda", "Kafka Connect"],
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
        "O padrão independe do cliente: toda biblioteca (em Go, Java, Python) expõe a mesma ideia de buscar uma mensagem, processá-la e então confirmar. O trecho abaixo usa uma interface mínima, no lugar de um cliente específico, para mostrar só o contrato que importa.",
      ],
      code: [
        {
          language: "go",
          filename: "consumer.go - contrato mínimo, qualquer cliente Kafka",
          code: "// Message e Consumer são o contrato; qualquer cliente Kafka se adapta a ele.\ntype Message struct {\n\tKey, Value []byte\n\tPartition  int\n\tOffset     int64\n}\n\ntype Consumer interface {\n\tFetch(ctx context.Context) (Message, error) // lê, mas NÃO confirma\n\tCommit(ctx context.Context, m Message) error // confirma o offset\n}\n\nfunc Run(ctx context.Context, c Consumer, handle func(context.Context, Message) error) error {\n\tfor {\n\t\tm, err := c.Fetch(ctx)\n\t\tif err != nil {\n\t\t\treturn err // ctx cancelado ou erro fatal\n\t\t}\n\t\tif err := handle(ctx, m); err != nil {\n\t\t\t// política de retry / DLQ; sem Commit, o evento volta a ser entregue\n\t\t\tcontinue\n\t\t}\n\t\tif err := c.Commit(ctx, m); err != nil { // só depois de processar\n\t\t\tlog.Printf(\"commit: %v\", err)\n\t\t}\n\t}\n}",
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
