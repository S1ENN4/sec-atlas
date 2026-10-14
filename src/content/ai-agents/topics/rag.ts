import type { Topic } from "@/content/types";

export const rag: Topic = {
  domain: "ai-agents",
  slug: "rag",
  title: "RAG - retrieval-augmented generation",
  short: "resposta com base em documentos recuperados",
  tagline:
    "RAG junta busca e geração: o modelo só responde depois de puxar os trechos relevantes de uma base externa, então a resposta é ancorada em material que existe e pode ser citado.",
  kind: "conceito",
  stage: null,
  tools: ["LangChain", "LlamaIndex", "Haystack", "Pinecone"],
  sections: [
    {
      heading: "O que é",
      body: [
        "RAG (Retrieval-Augmented Generation) é um padrão de arquitetura em que o modelo de linguagem recebe, junto com o prompt do usuário, um conjunto de documentos vindos de uma busca. O retrieval acontece antes da geração, e o que o LLM lê é essa mistura: a pergunta mais o contexto recuperado. A resposta sai do modelo, mas ancorada no que o retrieval trouxe.",
        "A ideia central é simples: um LLM puro responde com base no que aprendeu no treino, então erra fatos recentes, mistura domínios e inventa referências. Com RAG, o sistema puxa primeiro a parte relevante de uma base atual (uma wiki, um índice de manuais, uma coleção de PDFs) e entrega para o modelo como evidência. O texto final passa a ter fonte.",
        "Em uma definição curta: o retrieval decide com o que o modelo conversa, e a geração decide como ele responde.",
      ],
    },
    {
      heading: "Como funciona",
      body: [
        "O fluxo costuma ter cinco etapas, todas observáveis e auditáveis:",
      ],
      bullets: [
        "1. o usuário envia uma pergunta; o sistema escreve uma versão limpa dela (às vezes expandida por um LLM de query expansion).",
        "2. a pergunta vira um vetor (embedding) e o sistema busca os k trechos mais próximos no índice vetorial.",
        "3. a busca lexical (palavras exatas) roda em paralelo e entra em uma fusão com o vetor, formando o ranking híbrido.",
        "4. um reranker reordena os candidatos por relevância percebida, descartando os que não contribuem.",
        "5. os melhores trechos viram contexto no prompt do LLM, junto com a pergunta; o modelo responde citando as fontes.",
      ],
    },
    {
      heading: "Na prática",
      body: [
        "O exemplo abaixo mostra o pipeline mínimo em TypeScript: recebe uma pergunta, recupera os k chunks, monta o prompt e chama o LLM. Não é produção, mas é o esqueleto que aparece em todo projeto.",
      ],
      code: [
        {
          language: "typescript",
          filename: "rag/pipeline.ts",
          code: "type Chunk = { id: string; text: string; source: string };\n\nasync function retrieve(query: string, k = 5): Promise<Chunk[]> {\n  // 1. embedding da pergunta\n  const qVec = await embedder.embed(query);\n\n  // 2. busca densa\n  const dense = await vectorStore.search(qVec, { topK: k * 2 });\n\n  // 3. busca lexical (BM25) + fusão\n  const lexical = await bm25.search(query, { topK: k * 2 });\n  const fused = rrf([dense, lexical]);\n\n  // 4. rerank\n  const reranked = await reranker.rerank(query, fused, { topK: k });\n\n  return reranked;\n}\n\nasync function answer(query: string) {\n  const chunks = await retrieve(query);\n  const context = chunks.map((c) => `[${c.source}] ${c.text}`).join(\"\\n\\n\");\n  const prompt = `Contexto:\\n${context}\\n\\nPergunta: ${query}\\nResponda citando as fontes.`;\n  return await llm.generate(prompt);\n}",
        },
      ],
    },
    {
      heading: "Variações comuns",
      body: [
        "Três variações aparecem em quase toda arquitetura séria. A primeira é RAG agentivo, em que o agente decide se chama retrieval, quantas vezes e com quais filtros, em vez do retrieval rodar sempre. A segunda é RAG multi-hop, em que a resposta de uma rodada vira a consulta da próxima, montando a partir de várias buscas encadeadas. A terceira é GraphRAG, em que o índice é um grafo de entidades e a busca segue arestas.",
        "Todas compartilham o mesmo princípio: a geração fica restrita ao que o retrieval consegue encontrar, então a qualidade da resposta depende da qualidade do índice. Trocar o LLM sem revisar o retrieval raramente muda o resultado.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "ancoragem em fonte: cada resposta tem referência verificável, então alucinação factual cai e auditoria fica possível",
        "conhecimento atualizável: trocar a base é reindexar; o modelo não precisa de retreino nem fine-tune",
        "controle de escopo: dá para limitar a busca a um domínio (manuais da empresa, jurisprudência, contratos) e bloquear o resto",
        "custo mais baixo que fine-tune: indexar e buscar custa ordens de grandeza menos do que treinar ou adaptar pesos",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "qualidade herdada do retrieval: retrieval ruim vira contexto ruim, e contexto ruim vira resposta ruim, mesmo com LLM excelente",
        "janela de contexto limitada: muitos chunks forçam corte, e o que sai muitas vezes é justamente o relevante",
        "custo de manutenção: índice desatualizado, embeddings sem revisão e chunking mal escolhido degradam em silêncio",
        "raciocínio multi-documento continua difícil: o modelo lê chunks, não conecta fatos entre eles; GraphRAG ataca parte disso",
      ],
    },
  ],
};