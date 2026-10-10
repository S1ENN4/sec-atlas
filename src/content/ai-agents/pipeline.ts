import type { PipelineStage } from "@/content/types";

// Five-stage AI-Agents cycle. The pipeline follows the data path of an LLM
// application: documents are ingested, indexed into a vector store, retrieved
// at query time, acted on by an agent (optionally augmented by tools and
// orchestration), and finally evaluated against quality metrics.
//
// Item order within each stage matches the data flow:
//   - ingest    : chunking splits raw documents
//   - index     : embeddings turn chunks into vectors; vector-db persists them
//   - retrieve  : retrieval ranks candidate chunks against the query
//   - act       : agent-frameworks host the LLM loop; orchestration
//                 coordinates multi-agent flows; tool-calling bridges model
//                 and external capability
//   - evaluate  : evals is the harness; benchmarks, llm-as-judge and
//                 regression-evals are the supporting practices that feed
//                 data into the harness
//
// The four concept layers (rag, llm, mcp, guardrails) are NOT stage-attached:
// they live as dashed cards on the knowledge graph and inform several of the
// stage items via overlay relations (see relations.ts / graph-layout.ts).

export const pipeline: PipelineStage[] = [
  {
    id: "ingest",
    index: "01",
    name: "ingest",
    description: "documentos viram pedaços recuperáveis",
    items: [
      { label: "chunking", slug: "chunking" },
    ],
    gate: "cada pedaço cabe no contexto e preserva a ideia local",
  },
  {
    id: "index",
    index: "02",
    name: "index",
    description: "pedaços viram vetores e entram no banco",
    items: [
      { label: "embeddings", slug: "embeddings" },
      { label: "vector-db", slug: "vector-db" },
    ],
    gate: "vetores persistidos e consultáveis por similaridade",
  },
  {
    id: "retrieve",
    index: "03",
    name: "retrieve",
    description: "o pedaço certo para a pergunta certa",
    items: [
      { label: "retrieval", slug: "retrieval" },
    ],
    gate: "ranking estável e cobertura dos trechos relevantes",
  },
  {
    id: "act",
    index: "04",
    name: "act",
    description: "o agente decide, chama ferramentas, responde",
    items: [
      { label: "agent frameworks", slug: "agent-frameworks" },
      { label: "tool calling", slug: "tool-calling" },
      { label: "orchestration", slug: "orchestration" },
    ],
    gate: "ação tipada, auditada e dentro do escopo do agente",
  },
  {
    id: "evaluate",
    index: "05",
    name: "evaluate",
    description: "medir para poder confiar",
    items: [
      { label: "evals", slug: "evals" },
      { label: "benchmarks", slug: "benchmarks" },
      { label: "LLM as judge", slug: "llm-as-judge" },
      { label: "regression evals", slug: "regression-evals" },
    ],
    gate: "qualidade medida, baseline protegido, gate no merge",
  },
];