import type { Topic } from "@/content/types";

export const llmAsJudge: Topic = {
  domain: "ai-agents",
  slug: "llm-as-judge",
  title: "LLM as judge - rubrica automatizada",
  short: "usar um LLM para pontuar a saída de outro",
  tagline:
    "LLM as judge automatiza a nota: um modelo aplica uma rubrica (pairwise, Likert, score) sobre a saída do sistema e devolve um veredito escalável. Funciona quando calibrado direito; vira circularidade quando o juiz usa o mesmo modelo que está julgando.",
  kind: "tecnica",
  stage: "evaluate",
  tools: ["Prometheus", "MT-Bench", "G-Eval", "Braintrust pairwise"],
  sections: [
    {
      heading: "O que é",
      body: [
        "LLM as judge é um padrão onde um segundo LLM lê a saída do sistema (e opcionalmente um gabarito) e devolve uma nota ou um veredito. A motivação é simples: anotar mil casos com humanos custa semanas, e o juiz de modelo custa centavos por caso. A pergunta é se essa nota corresponde à humana com correlação boa o bastante para ser útil.",
        "Três formatos dominam o uso. Score contínuo (0 a 1, Likert 1 a 5). Pairwise (qual de A ou B é melhor, ou empate). Binário (passa ou não passa). Cada um tem afinidade com métricas diferentes, e a rubrica define o resto.",
      ],
    },
    {
      heading: "Por que calibrar contra humano",
      body: [
        "O juiz LLM tem vieses próprios: prefere resposta prolixa, prefere o primeiro item em comparações, prefere tom didático. Sem calibração esses vieses viram veredito, e o número publicado não significa nada.",
        "Calibração é um experimento offline. Você pega 100 a 300 casos reais anotados por humanos, roda o juiz, compara nota do juiz com nota humana, e mede correlação (Pearson para contínuo, acurácia/κ para binário). Aceita o juiz se a correlação passar de um limiar (0.7 em Pearson, 0.6 em Cohen κ é um piso razoável). Não passa, volta para a rubrica.",
      ],
    },
    {
      heading: "Rubrica: o que entra no prompt",
      body: [
        "A rubrica é o coração do juiz. Quatro blocos costumam bastar: contexto (input do usuário, contexto recuperado, gabarito se houver), critério (o que está sendo avaliado, em uma frase), escala (como converter em nota), e formato da resposta (um número, um JSON curto, nada de prosa livre).",
        "Quanto mais curta a rubrica, mais o juiz inova. O oposto também é ruim: rubricão de 800 palavras trava o juiz em burocracia. O ponto certo cabe em 6 a 10 linhas e ainda cita um exemplo positivo e um negativo da escala.",
      ],
    },
    {
      heading: "Viés de posição e como mitigar",
      body: [
        "Em pairwise o juiz tende a preferir o item da esquerda, e a tendência inverte quando a posição é trocada. Solução: rodar cada comparação nas duas ordens (A,B e B,A), e considerar empate quando os dois vereditos discordam. É o que o MT-Bench original fez, e virou padrão em qualquer benchmark sério.",
        "Em score, o viés é de ancoragem: o juiz puxa para os extremos do espectro. Solução: usar escala com referência explícita (Likert 1-5 com descritor em cada nível) em vez de contínuo livre. O contínuo funciona, mas precisa de mais calibração.",
      ],
    },
    {
      heading: "Implementação mínima",
      body: [
        "O snippet mostra um juiz binário (passa ou não passa) com guard-rail contra circularidade: o juiz é um modelo diferente do que está no agente. Em produção vale trocar o modelo por um especializado (Prometheus, G-Eval) quando o caso é fechado e exige profundidade.",
      ],
      code: [
        {
          language: "typescript",
          filename: "judges/binario.ts",
          code: "import { openai } from \"../llm\"; // juiz: família diferente do agente\n\ntype Verdict = { passa: boolean; motivo: string };\n\nconst RUBRICA = `Você é um juiz binário.\nRecebe (1) a pergunta, (2) o contexto recuperado, (3) a saída do agente e (4) o gabarito.\nResponda APENAS um JSON no formato {\"passa\": bool, \"motivo\": \"<1 frase>\"}.\nConsidere passa=true apenas se a saída for fiel ao gabarito E não inventar informação fora do contexto.`;\n\nexport async function judge(input: string, contexto: string, output: string, gabarito: string): Promise<Verdict> {\n  const user = `Pergunta: ${input}\\nContexto: ${contexto}\\nSaída: ${output}\\nGabarito: ${gabarito}`;\n  const resp = await openai.chat.completions.create({\n    model: \"gpt-4o-mini\",\n    response_format: { type: \"json_object\" },\n    messages: [{ role: \"system\", content: RUBRICA }, { role: \"user\", content: user }],\n  });\n  return JSON.parse(resp.choices[0].message.content);\n}",
        },
      ],
    },
    {
      heading: "Quando NÃO usar LLM as judge",
      body: [
        "Quando existe métrica exata disponível. Se o caso é 'o agente resolveu a equação?', a resposta é comparação de string ou execução do asserts. Colocar juiz LLM nisso é adicionar custo e variância sem motivo.",
        "Quando o domínio é fechado e a rubrica exigiria descrever nuances demais. Em tarefas muito específicas (cálculo financeiro, validação de política regulatória), o juiz genérico erra e o custo de calibrar supera o custo de humano. Volte para anotação humana por amostragem.",
        "Quando o orçamento é curto. Juiz LLM cobra por token de entrada e saída, e rodar 500 casos com juiz vira despesa recorrente que precisa caber no orçamento mensal. Meça antes de escalar.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "escala: anota mil casos no tempo que humanos anotam cem, com custo por caso muito menor",
        "consistência: juiz humano diverge entre si, juiz LLM mantém a mesma rubrica em todo caso",
        "rastreabilidade: cada nota tem um prompt e uma resposta, fácil de auditar e versionar",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "calibração não é opcional: juiz sem calibração vira carimbo que aceita qualquer coisa",
        "ruim para tarefas com gabarito exato: comparação de string ou asserts é mais barato e mais preciso",
        "custo: juiz LLM por caso em dataset grande vira despesa recorrente que precisa caber no orçamento",
      ],
    },
  ],
};