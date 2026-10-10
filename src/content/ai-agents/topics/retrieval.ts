import type { Topic } from "@/content/types";

export const retrieval: Topic = {
  domain: "ai-agents",
  slug: "retrieval",
  title: "Retrieval",
  short: "escolher os trechos certos para a pergunta",
  tagline:
    "Retrieval é onde a busca vira resposta: dense, sparse, híbrido e reranking decidem se o contexto que chega no LLM é útil ou se é lixo disfarçado de evidência.",
  kind: "tecnica",
  stage: "retrieve",
  tools: ["Cohere Rerank", "BM25", "ColBERT", "Tavily"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Retrieval é o passo que decide quais trechos da base viram contexto para o LLM. Em RAG, é a etapa onde a maior parte da qualidade se ganha ou se perde: contexto bom vira resposta boa, contexto errado vira resposta errada, mesmo com prompt perfeito e modelo excelente. Retrieval ruim não tem conserto depois.",
        "Um sistema de retrieval tem três decisões: qual algoritmo usar (denso, esparso, híbrido), como rerankear o resultado bruto, e como fundir listas vindas de algoritmos diferentes. As três decisões dependem do tipo de pergunta e do tipo de corpus.",
      ],
    },
    {
      heading: "Dense, sparse e híbrido",
      body: [
        "Busca densa usa embeddings: a pergunta vira vetor, o corpus vira vetor, a similaridade é geométrica. É boa para paráfrases, perguntas conceituais e termos não técnicos. É fraca para siglas raras, identificadores, e termos literais que existem no documento mas não no vocabulário do modelo.",
        "Busca esparsa usa frequência de termos (BM25 é o padrão da prática). É boa para palavras exatas, nomes próprios e siglas. É fraca para paráfrases e consultas que misturam termos. BM25 pontua cada termo pelo TF (quantas vezes aparece no documento) e pelo IDF (quão raro é no corpus), e normaliza pelo tamanho do documento. O resultado é uma lista ranqueada por relevância lexical.",
        "Busca híbrida roda as duas em paralelo, e funde as listas. O método de fusão mais comum é o RRF (Reciprocal Rank Fusion): cada lista atribui 1/(k + rank) a cada candidato, e os candidatos são reordenados pela soma. O resultado herda o melhor das duas buscas.",
      ],
    },
    {
      heading: "Reranking",
      body: [
        "Depois do top-fusão, ainda sobra ruído. O reranker entra para reordenar o top-N com um modelo que olha a pergunta e o candidato juntos. Cohere Rerank, BGE Reranker e ColBERT fazem isso por um modelo de linguagem menor que pontua cada par (pergunta, documento) com mais qualidade que similaridade de cosseno.",
        "O custo é proporcional ao número de candidatos rerankeados, então a lista de entrada é tipicamente 50 a 200 itens. O custo em latência fica dentro do orçamento porque reranker é menor e mais barato do que o LLM final.",
      ],
    },
    {
      heading: "Na prática",
      body: [
        "O exemplo junta dense retrieval (Qdrant), BM25 (Pyserini) e reranker Cross-Encoder em um único pipeline. A fusão é RRF, e o reranker corta os 50 melhores para os 5 finais.",
      ],
      code: [
        {
          language: "python",
          filename: "retrieval/pipeline.py",
          code: "from typing import Iterable\nfrom qdrant_client import QdrantClient\nfrom pyserini.search.lucene import LuceneSearcher\nfrom sentence_transformers import CrossEncoder\n\nqdrant = QdrantClient(url=\"http://localhost:6333\")\nsearcher = LuceneSearcher.from_prebuilt_index(\"manual_pt\")\nreranker = CrossEncoder(\"cross-encoder/mmarco-mMiniLMv2-L12-H384-v1\")\n\ndef rrf(ranks: Iterable[list[str]], k: int = 60) -> list[tuple[str, float]]:\n    scores: dict[str, float] = {}\n    for r in ranks:\n        for i, doc_id in enumerate(r):\n            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + i + 1)\n    return sorted(scores.items(), key=lambda x: x[1], reverse=True)\n\ndef retrieve(query: str, embedding: list[float], top_k: int = 5):\n    # 1. dense (Qdrant, top 50)\n    dense_hits = qdrant.search(\n        collection_name=\"chunks\",\n        query_vector=embedding,\n        limit=50,\n        with_payload=False,\n    )\n    dense_ids = [str(h.id) for h in dense_hits]\n\n    # 2. sparse (BM25, top 50)\n    bm25_hits = searcher.search(query, k=50)\n    bm25_ids = [h.docid for h in bm25_hits]\n\n    # 3. fusão RRF\n    fused = rrf([dense_ids, bm25_ids])\n\n    # 4. rerank dos 50 candidatos\n    candidates = [(doc_id, lookup_text(doc_id)) for doc_id, _ in fused[:50]]\n    pairs = [(query, text) for _, text in candidates]\n    scores = reranker.predict(pairs)\n    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)\n\n    return [doc_id for (doc_id, _), _ in ranked[:top_k]]",
        },
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "cobertura dupla: híbrido cobre tanto paráfrase (densa) quanto termo exato (BM25), então os dois pontos cegos são mitigados",
        "reranqueação do top-N entrega expansão: o reranker pequeno filtra o que passou, então o LLM só vê o que realmente importa",
        "custo amortizado: rerank em top-50 sai barato, e o resto da lista bruta nem chega a ser processada",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "complexidade operacional: três subsistemas (vetor, BM25, reranker) precisam estar saudáveis juntos; um falha, o cluster cai",
        "fusão é heurística: RRF não aprende fusão ótima, e o k=60 padrão não é universal; tuning é trabalho de produção",
        "reranqueador vira tema único: o reranker atualiza por modelo, então tarefa de ver se um modelo novo bate o anterior é regressão obrigatória",
      ],
    },
  ],
};