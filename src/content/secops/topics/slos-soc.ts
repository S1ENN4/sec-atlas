import type { Topic } from "@/content/types";

export const slosSoc: Topic = {
  domain: "secops",
  slug: "slos-soc",
  title: "SLOs de SOC e tuning contínuo",
  short: "medir tempo, precisão e cobertura, e ajustar toda semana",
  tagline:
    "Sem números, o SOC só conta histórias. Com SLOs claros (tempo de triagem, de contenção, precisão e recall) cada ajuste vira uma decisão com evidência.",
  kind: "pratica",
  stage: "medir",
  tools: ["BigQuery", "Grafana", "Looker Studio", "PagerDuty"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Um SLO (service level objective) de segurança é uma meta numérica para o que o time promete entregar: por exemplo, triar alertas críticos em poucos minutos ou conter ataques de credential stuffing antes de tantos por cento das tentativas passarem. Ele transforma um desejo vago (\"responder rápido\") em algo mensurável e discutível.",
      ],
    },
    {
      heading: "As quatro métricas que sustentam o resto",
      bullets: [
        "MTTT (tempo médio de triagem): do alerta até alguém classificá-lo como real ou falso.",
        "MTTC (tempo médio de contenção): da confirmação até o ataque estar contido.",
        "Precisão: dos alertas ou bloqueios que a detecção emitiu, quantos eram realmente ataque.",
        "Recall: dos ataques que existiam, quantos a detecção pegou.",
      ],
    },
    {
      heading: "Precisão e recall puxam em direções opostas",
      body: [
        "Subir a sensibilidade aumenta o recall e derruba a precisão, com mais falso positivo; apertar a regra faz o contrário. O ponto certo depende do custo: no login de um banco um bloqueio errado custa um cliente irritado, mas um ataque que passa custa muito mais; em um catálogo público, o equilíbrio é outro. Por isso o limiar é uma decisão de negócio apoiada em dados, não um ajuste técnico solitário.",
      ],
      code: [
        {
          language: "sql",
          filename: "precisão por regra (BigQuery)",
          code: "-- 'confirmed' vem da revisão semanal dos eventos que a regra atuou\nSELECT rule_id,\n       COUNTIF(confirmed_attack) AS true_pos,\n       COUNTIF(NOT confirmed_attack) AS false_pos,\n       SAFE_DIVIDE(COUNTIF(confirmed_attack), COUNT(*)) AS precision\nFROM sec.rule_actions_reviewed\nWHERE week = DATE_TRUNC(CURRENT_DATE(), WEEK)\nGROUP BY rule_id\nORDER BY precision;",
        },
      ],
    },
    {
      heading: "Tuning semanal",
      body: [
        "Um ritual curto e fixo mantém a qualidade: revisar as regras com pior precisão, olhar os falsos positivos reclamados, checar o que passou (recall) pelos incidentes da semana e decidir ajustes. O objetivo declarado é reduzir falso positivo sem perder cobertura, e a prova é a métrica de precisão subindo enquanto o recall se mantém.",
      ],
    },
    {
      heading: "Indicadores para a liderança",
      body: [
        "O que a diretoria precisa não são alertas, e sim tendência: ataques contidos, tempo de resposta, impacto evitado, regras em shadow prontas para virar enforcement. Poucos números estáveis, apresentados com o mesmo formato todo mês, constroem confiança no programa e sustentam o investimento.",
      ],
    },
  ],
};
