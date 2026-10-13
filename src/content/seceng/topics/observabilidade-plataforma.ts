import type { Topic } from "@/content/types";

export const observabilidadePlataforma: Topic = {
  domain: "seceng",
  slug: "observabilidade-plataforma",
  title: "Observabilidade da própria plataforma de segurança",
  short: "saber quando o pipeline de detecção está cego ou atrasado",
  tagline:
    "Uma detecção que parou de funcionar não faz barulho: ela só deixa de pegar ataques. Observar o próprio pipeline é o que transforma essa falha silenciosa em alerta.",
  kind: "pratica",
  stage: "escalar",
  tools: ["Prometheus", "Grafana", "OpenTelemetry", "Loki"],
  sections: [
    {
      heading: "O que é",
      body: [
        "A plataforma de segurança é um sistema em produção como outro qualquer e precisa de métricas, logs e traces próprios. A diferença é o custo da falha silenciosa: se o pipeline atrasa uma hora, ninguém recebe um erro, mas todo ataque desse período fica sem detecção.",
      ],
    },
    {
      heading: "Os sinais que importam",
      bullets: [
        "Lag do consumidor: quanto o processamento está atrás do fim do log. É o indicador mais direto de detecção atrasada.",
        "Latência fim a fim: do evento na borda até a decisão, em percentis (p50, p95, p99).",
        "Taxa de erro e de eventos descartados ou enviados à DLQ.",
        "Saturação: uso de CPU, memória e profundidade das filas internas.",
        "Frescor: tempo desde o último evento por fonte. Fonte que parou de enviar é uma falha, não calma.",
      ],
    },
    {
      heading: "Alertar sobre o silêncio",
      body: [
        "O alerta mais valioso é o de ausência: \"a fonte X não enviou nada nos últimos 10 minutos\". Em Prometheus, isso se escreve com a métrica de eventos recebidos. O exemplo mostra um alerta para lag alto e outro para fonte silenciosa.",
      ],
      code: [
        {
          language: "yaml",
          filename: "alerts.yml (Prometheus)",
          code: "groups:\n  - name: security-pipeline\n    rules:\n      - alert: DetectionLagHigh\n        expr: max(kafka_consumergroup_lag{group=\"detect-login-failures\"}) > 50000\n        for: 5m\n        labels: { severity: page }\n        annotations:\n          summary: \"Detecção atrasada: lag acima de 50k eventos há 5 min\"\n\n      - alert: EdgeSourceSilent\n        expr: sum(rate(edge_events_received_total[5m])) by (source) == 0\n        for: 10m\n        labels: { severity: page }\n        annotations:\n          summary: \"Fonte {{ $labels.source }} sem eventos há 10 min\"",
        },
      ],
    },
    {
      heading: "Traces para achar o gargalo",
      body: [
        "Quando a latência fim a fim sobe, um trace mostra em qual etapa o tempo foi gasto (consumo, enriquecimento, chamada externa, escrita). Com OpenTelemetry, o contexto do trace acompanha o evento entre os serviços, inclusive através de filas, e o mesmo padrão serve a todas as equipes.",
      ],
    },
    {
      heading: "SLOs da plataforma",
      body: [
        "Trate a plataforma como um produto com metas: por exemplo, \"99% dos eventos viram decisão em menos de 60 segundos\" e \"nenhuma fonte crítica silenciosa por mais de 10 minutos\". As metas dão critério objetivo para priorizar trabalho de confiabilidade contra funcionalidades novas.",
      ],
    },
  ],
};
