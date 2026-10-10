import type { Topic } from "@/content/types";

export const embeddings: Topic = {
  domain: "ai-agents",
  slug: "embeddings",
  title: "Embeddings",
  short: "transformar texto em vetores que aproximam significado",
  tagline:
    "Embeddings mapeiam texto para um espaço onde distância vira semântica: 'cão' e 'pet' ficam perto, 'cão' e 'satélite' ficam longe. É o motor da busca por similaridade do RAG.",
  kind: "tecnica",
  stage: "index",
  tools: ["OpenAI", "Cohere", "sentence-transformers", "Voyage AI"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Embedding é um vetor denso de números reais (tipicamente entre 300 e 3072) que representa um trecho de texto. A propriedade útil é geométrica: dois textos com significado parecido ficam a pouca distância no espaço, e dois textos sem relação ficam longe. A 'distância' é medida por cosseno, produto interno ou euclidiana.",
        "O vetor é gerado por um modelo treinado em pares de texto (origem e tradução, pergunta e resposta, ou títulos parecidos). Depois do treino, o modelo aprendeu a colocar palavras e frases próximas de palavras similares e longe de outras. Não há regra simbólica. O arranjo é puramente estatístico.",
      ],
    },
    {
      heading: "Modelos e dimensões",
      body: [
        "Três famílias dominam. Modelos de uso geral, como text-embedding-3-small da OpenAI ou embed-multilingual-v3 da Cohere, retornam vetores de 384 a 3072 e funcionam razoavelmente em qualquer domínio. Modelos ajustados por domínio (jurídico, biomédico, código) ganham precisão quando o corpus é técnico, e perdem quando saem dele. Modelos locais via sentence-transformers rodam sem chamada externa, custam mais CPU e são úteis quando o dado não pode sair da infraestrutura.",
        "Mais dimensões custam mais armazenamento, mais memória e mais tempo de busca. Para um corpus pequeno, 384 dimensões são suficientes; para um milhão de documentos, vale medir se o ganho de subir para 1024 cobre o custo.",
      ],
    },
    {
      heading: "Similaridade na prática",
      body: [
        "A similaridade do cosseno mede o ângulo entre dois vetores e ignora a magnitude, então dois textos longos e dois curtos podem ter o mesmo valor de similaridade por conteúdo. A fórmula é a do produto interno dividido pela norma de cada vetor.",
      ],
      code: [
        {
          language: "typescript",
          filename: "embeddings/cosine.ts",
          code: "type Vec = number[];\n\nexport function dot(a: Vec, b: Vec): number {\n  let s = 0;\n  for (let i = 0; i < a.length; i++) s += a[i] * b[i];\n  return s;\n}\n\nexport function norm(a: Vec): number {\n  return Math.sqrt(dot(a, a));\n}\n\nexport function cosine(a: Vec, b: Vec): number {\n  const denom = norm(a) * norm(b);\n  if (denom === 0) return 0;\n  return dot(a, b) / denom;\n}\n\n// uso\nconst doc: Vec = await embedder.embed(\"rag combina busca e geração\");\nconst query: Vec = await embedder.embed(\"como funciona rag?\");\nconst score = cosine(doc, query);\nconsole.log(score.toFixed(3));",
        },
      ],
    },
    {
      heading: "Escolhendo o modelo",
      body: [
        "Quatro perguntas determinam a escolha. Primeira: o domínio é geral ou técnico? Modelo multilingual ajuda em PT-BR; modelo de código ajuda em bases de código. Segunda: precisa rodar offline ou pode chamar API? Offline força sentence-transformers ou BGE local. Terceira: qual o orçamento de armazenamento? Vetores de 3072 dimensões para 10 milhões de documentos são 120 GB só de embeddings. Quarta: precisa de consistência semântica ao longo do tempo? Trocar o modelo de embedding depois da indexação obriga reindexar tudo.",
        "A regra que evita mais arrependimento: defina o modelo antes de indexar e congele essa decisão. Reindexação é cara, e ficar alternando entre modelos no meio do projeto degrada a qualidade do retrieval sem aviso.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "comprensão semântica aproximada sem regras: frases diferentes com o mesmo sentido ficam perto, sem precisar de sinônimos hardcoded",
        "modelos prontos de qualidade: open weights (BGE, E5, mE5) e APIs gerenciadas cobrem a maior parte dos casos sem treinamento",
        "custo por chamada baixo: embeddings são tipicamente ordens de grandeza mais baratos do que a geração do LLM",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "cegueira lexical: 'alface' e 'verdura' ficam perto, mas 'alface' e 'Alface S.A.' (empresa) também ficam, e o retrieval não sabe distinguir",
        "modelo desatualizado: o modelo viu dados até a data do treino; termos novos não têm posição boa no espaço",
        "sem garantia de alinhamento entre idiomas: modelos multilingues aproximam, mas traduções literais saem na frente de paráfrases",
        "custo de trocar: mudar o modelo de embedding é reindexação completa, então a decisão inicial pesa",
      ],
    },
  ],
};