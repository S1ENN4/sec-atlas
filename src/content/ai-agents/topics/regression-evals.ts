import type { Topic } from "@/content/types";

export const regressionEvals: Topic = {
  domain: "ai-agents",
  slug: "regression-evals",
  title: "Regression evals - suite fixa no PR",
  short: "suite fixa que bloqueia regressões no PR",
  tagline:
    "Regression evals é a suite imutável: dataset fechado, gate no merge, comparação contra baseline. É o que transforma 'acho que ficou melhor' em 'a métrica X caiu 2 pontos, bloquear o PR'.",
  kind: "pratica",
  stage: "evaluate",
  tools: ["pytest", "DeepEval", "Braintrust CI", "promptfoo"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Regression eval é uma suite de casos que não muda junto com o código. Você congela o dataset (input, gabarito, métrica), e cada PR é avaliado contra esse dataset. Se uma métrica cai abaixo do baseline, o PR falha e o merge trava. O objetivo é simples: parar de discutir se a mudança melhorou ou piorou.",
        "A diferença para o eval genérico é a imutabilidade. O eval do PR pode crescer, ser editado, incluir casos novos. O regression eval é contrato: igual ao da última release, com a única mudança permitida sendo a versão baseline.",
      ],
    },
    {
      heading: "Dataset imutável versus dataset vivo",
      body: [
        "A manutenção do dataset é onde a maioria dos times erra. Dois caminhos. Imutável puro: dataset freezeado a cada release, só cresce quando uma regressão é detectada e adicionada como caso novo. Vivo: dataset versionado (git LFS), PR pode propor casos, merge só aceita se aumentar a cobertura.",
        "A escolha muda o que 'regressão' significa. Imutável puro detecta só drift; vivo detecta drift e adiciona novos buracos. Para times que ainda estão aprendendo o que medir, o vivo vence. Para times que têm o produto estável há meses, imutável vence, porque a suite vira contrato de SLA.",
      ],
    },
    {
      heading: "Gate no PR: o esqueleto",
      body: [
        "O esqueleto abaixo mistura duas referências conhecidas (promptfoo e Braintrust) para mostrar a mecânica real: arquivo de casos em YAML, runner que compara contra baseline, e veredito booleano que o step de CI consome.",
      ],
      code: [
        {
          language: "typescript",
          filename: "regression/run.ts (estilo promptfoo + Braintrust CI)",
          code: "import fs from \"node:fs\";\nimport { runAgent } from \"../src/agent\";\nimport { assertFidelidade, assertRelevancia } from \"./asserts\";\nimport { loadBaseline, saveBaseline } from \"./baseline\";\n\ntype Case = { id: string; pergunta: string; gabarito: string; contexto: string };\n\ntype Metric = \"fidelidade\" | \"relevancia\";\n\nasync function runOne(c: Case) {\n  const out = await runAgent({ pergunta: c.pergunta, contexto: c.contexto });\n  return {\n    id: c.id,\n    fidelidade: await assertFidelidade(out, c.gabarito, c.contexto),\n    relevancia: await assertRelevancia(out, c.pergunta),\n  };\n}\n\nexport async function runRegressionSuite(path: string) {\n  const cases: Case[] = parseCases(fs.readFileSync(path, \"utf8\"));\n  const baseline = loadBaseline(\"regression.baseline.json\");\n  const results = await Promise.all(cases.map(runOne));\n  const report: Record<Metric, number> = { fidelidade: 0, relevancia: 0 };\n  for (const m of [\"fidelidade\", \"relevancia\"] as Metric[]) {\n    const avg = results.reduce((a, r) => a + r[m], 0) / results.length;\n    report[m] = avg;\n    const drop = baseline[m] - avg;\n    if (drop > 0.02) throw new Error(`regressão em ${m}: baseline ${baseline[m]} vs atual ${avg}`);\n  }\n  return report; // CI consome e decide gate\n}",
        },
      ],
    },
    {
      heading: "Baseline, limiar e amostragem",
      body: [
        "O baseline é o último release verde. Você persiste (em artefato, em git, em object store) a métrica por caso, e o runner compara caso a caso. Limiar define o quanto pode cair antes de falhar. Limiar de 0.02 (2 pontos percentuais) costuma ser conservador; abaixo disso, falso positivo come tempo do time. Acima, regressão real vira release.",
        "Nem todo PR precisa rodar a suite completa. Para PR pequeno, amostragem aleatória de 20% dos casos resolve. Para PR de release, suíte completa. O custo é o principal motivo de times abandonarem suite fixa: rodar 500 casos a cada PR custa cinco minutos e logo vira alvo de bypass.",
      ],
    },
    {
      heading: "Onde entra na pipeline",
      body: [
        "Antes do merge, em step dedicado de CI, com baseline congelado por branch protegido (main/release). O gate não é opcional: pipeline sem suite fixa não conta como eval. É como rodar deploy sem teste de fumaça.",
        "Depois do merge, uma versão completa roda noturna para detectar drift acumulado. O resultado alimenta o dataset: caso novo que apareceu na noturna vira caso da suite fixa no próximo release.",
      ],
    },
    {
      heading: "Como manter a suite saudável",
      body: [
        "Regra de ouro: quando uma regressão aparece em produção mas passa na suite, o caso vira caso novo da suite no mesmo PR. Sem essa política a suite vira cobertura falsa e o time perde a fé nela.",
        "A segunda regra é auditar a suite uma vez por trimestre. Casos desatualizados (gabarito errado, contexto removido) viram ruído e contaminam o baseline. Limpar é trabalho, mas limpar é o que mantém a suite útil.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "bloqueio automático: regressão real vira CI fail, sem precisar de alguém lendo o PR",
        "histórico rastreável: cada baseline é um commit, e qualquer queda aponta para o PR que causou",
        "cultura: time para de discutir opinião e começa a discutir número, e o número tem dono",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "falso negativo: a suite só pega regressões cobertas, o resto vira incidente de produção",
        "manutenção constante: dataset desatualizado mente, e a manutenção é trabalho que ninguém pede",
        "custo de runtime: rodar 500 casos a cada PR precisa de orçamento de tempo e de API",
      ],
    },
  ],
};