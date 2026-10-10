import type { Relation } from "@/content/types";

// AI-Agents cross-concept relations. Drives the topic-to-topic connections
// list rendered on each topic page (independent of the knowledge-graph
// layout in graph-layout.ts, which describes the same edges visually).
//
// Source-of-truth edges: every relation here MUST resolve to an existing
// topic in the ai-agents domain (verified by validator rule R2). The 14
// edges below mirror the spec on the knowledge graph: 8 solid (functional
// downstream flow) and 6 dashed (concept overlays — they describe how a
// dashed `layer` concept informs a concrete step rather than feeding data
// into it).
//
// The four dashed layer topics (rag, llm, mcp, guardrails) appear only on
// their overlay edges; they are NOT stage-attached in the pipeline.

const ref = (slug: string) => ({ domain: "ai-agents" as const, slug });

export const relations: Relation[] = [
  // ingest → index (solid flow: chunks feed embeddings feed the vector store)
  { source: ref("chunking"), target: ref("embeddings"), label: "gera vetores" },
  { source: ref("embeddings"), target: ref("vector-db"), label: "armazena" },

  // index → retrieve (the vector store is queried)
  { source: ref("vector-db"), target: ref("retrieval"), label: "consulta" },

  // retrieve → layer (RAG assembles a context window from retrieved chunks)
  { source: ref("retrieval"), target: ref("rag"), label: "alimenta contexto" },

  // layer → layer (RAG injects the retrieved context into the LLM)
  { source: ref("rag"), target: ref("llm"), label: "injeta contexto" },

  // layer → act (the LLM is the core of every agent framework)
  { source: ref("llm"), target: ref("agent-frameworks"), label: "é o núcleo" },

  // act internals (frameworks host tool calling; orchestration coordinates them)
  { source: ref("agent-frameworks"), target: ref("tool-calling"), label: "habilita" },
  { source: ref("agent-frameworks"), target: ref("orchestration"), label: "coordena com" },

  // act → layer (tool calling speaks the MCP protocol when integrating tools)
  { source: ref("tool-calling"), target: ref("mcp"), label: "fala o protocolo" },

  // evaluate inputs (benchmarks provide public datasets; jllm-as-judge
  // automates the note; regression evals protect the baseline)
  { source: ref("benchmarks"), target: ref("evals"), label: "fornece dados" },
  { source: ref("llm-as-judge"), target: ref("evals"), label: "automatiza a nota" },
  { source: ref("regression-evals"), target: ref("evals"), label: "protege o baseline" },

  // evaluate → layer (RAG quality is measured by evals — the dashed edge
  // closes the loop from measurement back to the retrieval concept)
  { source: ref("evals"), target: ref("rag"), label: "mede a recuperação" },

  // layer → layer (guardrails filter both directions of LLM traffic)
  { source: ref("guardrails"), target: ref("llm"), label: "filtra entrada/saída" },
];