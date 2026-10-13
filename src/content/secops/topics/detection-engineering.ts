import type { Topic } from "@/content/types";

export const detectionEngineering: Topic = {
  domain: "secops",
  slug: "detection-engineering",
  title: "Engenharia de detecção",
  short: "tratar detecções como software: versionadas, testadas e medidas",
  tagline:
    "Uma biblioteca de detecções combina assinaturas e heurísticas, cada uma com dono, teste e métrica, e evolui como qualquer código: por revisão, versão e dado.",
  kind: "pratica",
  stage: "detectar",
  tools: ["BigQuery", "Sigma", "Python", "Grafana"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Engenharia de detecção é a disciplina de criar, manter e medir as regras que transformam telemetria em alerta ou ação. Em vez de consultas soltas em um console, cada detecção é um artefato: tem nome, descrição, fonte de dados, lógica, severidade, resposta prevista e um responsável.",
      ],
    },
    {
      heading: "Assinaturas e heurísticas",
      body: [
        "Assinaturas reconhecem algo conhecido: um padrão de payload, um caminho, um fingerprint. São precisas e baratas, mas só pegam o que já se viu. Heurísticas medem comportamento: um desvio de volume, de razão ou de composição, e pegam variações novas ao custo de mais falso positivo.",
        "A biblioteca saudável tem as duas: assinaturas para o conhecido e heurísticas para o resto, com as heurísticas passando por mais observação antes de agir.",
      ],
    },
    {
      heading: "Anomalia com z-score",
      body: [
        "Uma heurística simples e eficaz compara a contagem atual com o histórico recente da mesma chave. Se a contagem está muito acima da média, em desvios padrão, é candidata a alerta. A consulta abaixo calcula, por ASN, o z-score das falhas de login por minuto contra a última hora.",
      ],
      code: [
        {
          language: "sql",
          filename: "login_failures_zscore.sql (BigQuery)",
          code: "WITH per_min AS (\n  SELECT TIMESTAMP_TRUNC(ts, MINUTE) AS minute, asn, COUNT(*) AS fails\n  FROM sec.edge_events\n  WHERE path = '/api/login' AND status = 401\n    AND ts >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 70 MINUTE)\n  GROUP BY minute, asn\n),\nstats AS (\n  SELECT asn, AVG(fails) AS mu, STDDEV_POP(fails) AS sigma\n  FROM per_min\n  WHERE minute < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)\n  GROUP BY asn\n)\nSELECT p.minute, p.asn, p.fails,\n       SAFE_DIVIDE(p.fails - s.mu, s.sigma) AS z\nFROM per_min p JOIN stats s USING (asn)\nWHERE p.minute >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)\n  AND SAFE_DIVIDE(p.fails - s.mu, s.sigma) > 4\nORDER BY z DESC;",
        },
      ],
    },
    {
      heading: "Agrupar por quê?",
      body: [
        "A chave de agrupamento define o que a detecção enxerga: prefixo de rede, ASN, user agent, país. Chaves finas pegam ataques concentrados e geram ruído; chaves grossas pegam ondas distribuídas e escondem focos. Boas detecções costumam existir em mais de uma granularidade, e cada uma com o seu limiar.",
      ],
    },
    {
      heading: "Detecções como código",
      bullets: [
        "Versionadas em repositório, com revisão por par antes de entrar em produção.",
        "Testadas contra eventos de ataque conhecidos (positivos) e tráfego normal (negativos).",
        "Passando pelas mesmas fases das regras de bloqueio: observação, shadow e só depois ação.",
        "Aposentadas quando deixam de entregar valor: detecção que ninguém olha é dívida.",
      ],
    },
  ],
};
