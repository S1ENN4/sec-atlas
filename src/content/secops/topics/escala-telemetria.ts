import type { Topic } from "@/content/types";

export const escalaTelemetria: Topic = {
  domain: "secops",
  slug: "escala-telemetria",
  title: "Escala: telemetria, cardinalidade e custo",
  short: "manter a detecção rápida e barata quando o volume explode",
  tagline:
    "A mesma consulta que roda em segundos com um milhão de eventos pode custar uma fortuna com um trilhão. Escalar a segurança é um problema de design de dados.",
  kind: "conceito",
  stage: "observar",
  tools: ["BigQuery", "ClickHouse", "Cloudflare Logpush", "Vector"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Em uma aplicação grande, a borda gera bilhões de eventos por dia, e a maior parte é tráfego normal. Escalar a telemetria de segurança significa continuar enxergando os ataques sem pagar para guardar e varrer todo o resto da mesma forma.",
        "Três variáveis mandam: volume (quantos eventos), cardinalidade (quantos valores distintos em um campo, como IPs ou user agents) e retenção (por quanto tempo cada dado precisa ficar quente).",
      ],
    },
    {
      heading: "Cardinalidade: o inimigo silencioso",
      body: [
        "Agregar por IP produz milhões de grupos; agregar por país, dezenas. Uma detecção que agrupa por uma chave de cardinalidade alta fica lenta e cara, e métricas com cardinalidade explosiva derrubam sistemas de monitoramento. A regra é agregar pelo nível mais grosso que ainda separa o ataque do normal (ASN, prefixo, país, família de user agent) e descer ao IP só quando necessário.",
      ],
    },
    {
      heading: "Particionar e pré-agregar",
      body: [
        "Duas técnicas resolvem a maior parte do custo: particionar as tabelas por tempo (e agrupar por colunas de filtro), para que uma consulta leia só a janela necessária, e manter agregados por minuto em uma tabela pequena para as detecções e painéis, deixando o dado bruto só para investigação.",
      ],
      code: [
        {
          language: "sql",
          filename: "agregado por minuto (BigQuery)",
          code: "-- tabela bruta: particionada por dia, agrupada por host e path\nCREATE TABLE sec.edge_events (\n  ts TIMESTAMP, client_ip STRING, asn INT64, host STRING,\n  path STRING, status INT64, user_agent STRING, bot_score INT64\n)\nPARTITION BY DATE(ts)\nCLUSTER BY host, path;\n\n-- agregado: é ele que as detecções leem\nCREATE OR REPLACE TABLE sec.edge_1m AS\nSELECT TIMESTAMP_TRUNC(ts, MINUTE) AS minute, host, path, asn,\n       COUNT(*) AS reqs,\n       COUNTIF(status IN (401, 403)) AS denied\nFROM sec.edge_events\nGROUP BY minute, host, path, asn;",
        },
      ],
    },
    {
      heading: "Amostragem e retenção em camadas",
      bullets: [
        "Amostragem: para tráfego volumétrico e uniforme, guardar uma fração basta para estatística; eventos de segurança relevantes (bloqueios, desafios, anomalias) ficam sempre completos.",
        "Retenção em camadas: bruto por poucos dias ou semanas, agregados por meses, indicadores executivos por anos.",
        "Custo por detecção: toda regra nova deve estimar quanto lê e com que frequência roda.",
        "Pipeline resiliente: filas e buffers para absorver picos sem descartar eventos, e contadores para saber quando algo foi perdido.",
      ],
    },
    {
      heading: "Escalar também é escalar o time",
      body: [
        "Volume não é só máquina: é número de regras, de exceções e de alertas que um time consegue manter. Padronizar o esquema, nomear e versionar detecções e automatizar o que é repetitivo é o que deixa o SOC crescer com o tráfego sem crescer na mesma proporção.",
      ],
    },
  ],
};
