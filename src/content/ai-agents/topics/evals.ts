import type { Topic } from "@/content/types";

export const evals: Topic = {
  domain: "ai-agents",
  slug: "evals",
  title: "Evals - qualidade medida em produção",
  short: "dataset, métrica e runner para medir qualidade",
  tagline:
    "Evals é o harness que mede se a resposta é boa: dataset de exemplos, métrica (fidelidade, relevância, groundedness) e runner que executa ponta a ponta. Sem eval, melhorar um agente é chute e qualquer ajuste vira rotina.",
  kind: "pratica",
  stage: "evaluate",
  tools: ["LangSmith", "Langfuse", "Braintrust", "Arize Phoenix"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Eval é um experimento de software. Você junta um dataset de prompts com a saída esperada, define uma métrica (heurística, embedding ou juiz LLM) e roda tudo por um runner que pontua cada caso e devolve uma média. Quando a média sobe, você sabe que melhorou. Quando cai, você sabe que piorou, sem precisar discutir.",
        "Três peças sustentam tudo: o dataset (pares input/expected ou trilhas de produção), a métrica (como comparar saída com esperado) e o runner (loop que chama o agente, captura a saída, aplica a métrica e agrega). A métrica é o ponto onde quase todo time tropeça: a primeira versão costuma ser vaga demais e aceita qualquer coisa.",
      ],
    },
    {
      heading: "Dataset, métrica e runner",
      body: [
        "O dataset precisa ter cobertura real: casos fáceis (smoke), casos de borda (contradição no histórico, ferramenta que falha) e casos adversariais (instrução maliciosa embutida num documento recuperado). 50 casos bem escolhidos vencem 5.000 casos gerados por template. Cobertura importa mais que volume.",
        "A métrica define o que é 'bom'. Fidelidade pergunta se a resposta é fiel ao contexto recuperado (sem inventar fonte). Relevância pergunta se ela responde o que foi pedido. Groundedness pergunta se cada afirmação tem apoio no contexto, e não foi inventada pelo modelo. Cada métrica vira uma função determinística ou um prompt de juiz; as duas moram no mesmo arquivo.",
        "O runner é a cola. Recebe o dataset, percorre cada caso, chama o agente com timeout, captura a saída (e a cadeia de tool calls, se for agente), aplica a métrica e devolve um relatório em JSON ou CSV. É o componente que entra no CI.",
      ],
    },
    {
      heading: "Exemplo de caso avaliado",
      body: [
        "Antes de rodar 500 casos, vale rodar um único e ler o resultado a olho. Um caso para um agente RAG de políticas de férias pode ser:",
      ],
      code: [
        {
          language: "yaml",
          filename: "evals/cases/férias-elegibilidade.yaml",
          code: "id: ferias-elege-01\ninput:\n  pergunta: \"Posso vender 5 dias de férias para pagar o plano de saúde?\"\n  contexto_recuperado:\n    - \"Política 7.2: é permitido vender até 10 dias de férias por ano.\"\n    - \"Política 4.1: o adiantamento é depositado em conta corrente do titular.\"\nexpected:\n  tem_que_dizer:\n    - \"Sim, é permitido vender até 10 dias\"\n  nao_pode_dizer:\n    - \"É proibido vender férias\"\nmetricas:\n  - fidelidade: groundedness\n  - relevancia: resposta-cobre-pergunta\n  - completude: contem-valor-numerico",
        },
      ],
    },
    {
      heading: "Métricas: as três que importam",
      body: [
        "Fidelidade (groundedness) compara cada frase da resposta com o contexto recuperado. Se o modelo afirmar algo sem apoio no contexto, perde pontos. É a métrica que mais cedo pega alucinação.",
        "Relevância mede se a resposta cobre o que foi perguntado. Um juiz LLM com rubrica binária (respondeu / não respondeu) já resolve. A pegadinha é a resposta tecnicamente correta que ignora a pergunta, e a métrica precisa pegar isso.",
        "Qualidade geral (helpfulness, completeness) agrega tudo: tom, clareza, utilidade. Costuma ser a mais subjetiva e onde o juiz humano brilha. Reserve-a para amostras pequenas, não para 100% do dataset.",
      ],
    },
    {
      heading: "O runner mínimo viável",
      body: [
        "O esqueleto abaixo carrega um YAML de caso, chama o agente, aplica um juiz LLM e devolve um veredito. Em produção o runner é maior (paralelismo, cache, retries), mas o formato fica bem neste documento:",
      ],
      code: [
        {
          language: "typescript",
          filename: "evals/run.ts",
          code: "import fs from \"node:fs\";\nimport { runAgent } from \"../src/agent\";\nimport { judge } from \"./judges\";\n\ntype Case = {\n  id: string;\n  input: Record<string, unknown>;\n  expected: { tem_que_dizer?: string[]; nao_pode_dizer?: string[] };\n  metricas: string[];\n};\n\nasync function evalCase(c: Case) {\n  const t0 = Date.now();\n  const out = await runAgent(c.input);\n  const scores: Record<string, number> = {};\n  for (const m of c.metricas) {\n    scores[m] = await judge(m, c, out);\n  }\n  return { id: c.id, ms: Date.now() - t0, scores, output: out };\n}\n\nexport async function evalFile(path: string) {\n  const cases = fs.readFileSync(path, \"utf8\")\n    .split(\"\\n---\")\n    .map(parseYaml);\n  const results = await Promise.all(cases.map(evalCase));\n  const media = (k: string) =>\n    results.reduce((a, r) => a + (r.scores[k] ?? 0), 0) / results.length;\n  return { n: results.length, results, media: { fidelidade: media(\"fidelidade\") } };\n}",
        },
      ],
    },
    {
      heading: "Onde entra na pipeline",
      body: [
        "Duas vezes. Antes do merge: a suite de regressão roda em todo PR e bloqueia se cair. Depois do merge: amostras de produção são re-avaliadas para detectar drift (modelo mudou, retrieval degradou, prompt injection vazou).",
        "Sem o segundo estágio você acaba em autoengano. Métricas que olham só para o histórico do PR não pegam regressões de runtime, e o defeito aparece só quando o usuário reclama.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "substitui discussão por número: 'a fidelidade caiu 4 pontos' é um argumento que fecha thread",
        "cobre regressões invisíveis a olho nu, principalmente em chains longos de tool calling",
        "gera dataset corrigível que a própria suite usa, virando um loop virtuoso de melhoria",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "métricas ruins passam a iludir: juiz LLM não calibrado vira carimbo que aceita qualquer coisa",
        "dataset parado envelhece: o agente evolui, a suite não, e a métrica para de refletir a realidade",
        "custo: rodar 500 casos com juiz LLM cobra por token, leva tempo e exige respeitar o rate limit da API do juiz",
      ],
    },
  ],
};