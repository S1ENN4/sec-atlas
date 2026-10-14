import type { Topic } from "@/content/types";

export const vectorDb: Topic = {
  domain: "ai-agents",
  slug: "vector-db",
  title: "Vector DB",
  short: "banco que busca por distância em vez de por termo exato",
  tagline:
    "Vector DB é o componente que guarda embeddings e responde 'quais vetores estão mais próximos deste?' em milissegundos. É onde o ANN (HNSW, IVF) paga o custo da busca semântica.",
  kind: "pratica",
  stage: "index",
  tools: ["Pinecone", "Weaviate", "Qdrant", "pgvector"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Vector DB é um banco de dados especializado em armazenar vetores densos e responder consultas de vizinhança. A consulta típica é 'top-k vizinhos mais próximos deste vetor', e ela roda em latência baixa mesmo com milhões ou bilhões de vetores indexados.",
        "Diferente de um banco relacional, o índice primário é a distância geométrica, não a chave primaria. A comparação por exato (termo, id) ainda existe, mas a busca principal usa algoritmos aproximados de vizinhos mais próximos (ANN), que abrem mão do resultado exato em troca de velocidade.",
      ],
    },
    {
      heading: "ANN: HNSW e IVF",
      body: [
        "Dois algoritmos dominam o estado da prática. O HNSW (Hierarchical Navigable Small World) constrói um grafo em camadas: cada camada é um grafo navegável, e os vértices pulam de camada em camada seguindo os vizinhos mais próximos. Busca entra pela camada de cima, desce e converge. Latência excelente, uso de memória alto.",
        "O IVF (Inverted File Index) particiona o espaço em células e guarda, por célula, os vetores que pertencem a ela. Na busca, comparamos o vetor de consulta com os centróides, escolhemos as células mais próximas, e só então comparamos com os vetores daquelas células. Menos memória que HNSW, latência ligeiramente maior. A maioria dos bancos usa IVF combinado com quantização (PQ, SQ) para reduzir ainda mais o custo.",
      ],
    },
    {
      heading: "Metadata e filtros",
      body: [
        "Vetor sozinho resolve pouco. Em produção, cada embedding vem com metadata: documento de origem, data, autor, categoria, tags, idioma, nível de acesso. A busca combina 'vizinhos mais próximos' com 'filtro de metadata'. Filtros cortam o espaço de busca antes do ANN rodar, então reduzem latência e melhoram precisão.",
        "Dois padrões se destacam. Pré-filtro: aplica o filtro de metadata, e roda ANN sobre o subconjunto. Pós-filtro: roda ANN completo, e descarta o que não passa no filtro. Pré-filtro é melhor quando o filtro é restritivo; pós-filtro é melhor quando quase tudo passa.",
      ],
    },
    {
      heading: "Na prática",
      body: [
        "pgvector é a extensão vetorial do PostgreSQL: roda junto com o banco relacional e permite combinar a busca vetorial com filtros de metadata na cláusula WHERE. Atenção: com índice HNSW o filtro é aplicado depois da varredura do índice, então um filtro muito restritivo pode devolver menos de k resultados (use iterative scan, índices parciais ou particionamento). O exemplo cria a tabela com vetor de 1536 dimensões (tamanho típico de text-embedding-3-small), insere chunks e faz a busca top-5 com filtro de categoria.",
      ],
      code: [
        {
          language: "sql",
          filename: "vector-db/query.sql",
          code: "-- criação\nCREATE EXTENSION IF NOT EXISTS vector;\n\nCREATE TABLE chunks (\n  id          BIGSERIAL,\n  doc_id      TEXT NOT NULL,\n  category    TEXT NOT NULL,\n  content     TEXT NOT NULL,\n  embedding   vector(1536),\n  PRIMARY KEY (id)\n);\n\nCREATE INDEX chunks_embedding_hnsw\n  ON chunks USING hnsw (embedding vector_cosine_ops);\nCREATE INDEX chunks_category_idx ON chunks (category);\n\n-- inserção (chunks já embeddings calculados em outro passo)\nINSERT INTO chunks (doc_id, category, content, embedding)\nVALUES ($1, $2, $3, $4);\n\n-- busca top-5 com filtro de metadata\nSELECT id, doc_id, content,\n       1 - (embedding <=> $1::vector) AS score\nFROM chunks\nWHERE category = 'manual'\nORDER BY embedding <=> $1::vector\nLIMIT 5;",
        },
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "busca por similaridade em escala: ANN entrega top-k em milissegundos com milhões de vetores",
        "filtro híbrido: combina vizinhança geométrica com WHERE de SQL ou filter nativo, então busca por espaço é alcançável",
        "opções para todo orçamento: pgvector economiza infra adicional; Pinecone/Qdrant/Weaviate entregam throughput dedicado",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "ANN é aproximado: ranking pode trocar vizinhos verdadeiros por vizinhos próximos; tuning de recall vs latência é trabalho contínuo",
        "memória alta: HNSW em alta dimensionalidade consome mais RAM do que o dado original",
        "consistência entre sharding e reindexação: recriar o índice durante tráfego real exige cuidado, e o downtime vira problema de produção",
      ],
    },
  ],
};