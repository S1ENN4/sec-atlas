// AI-Agents knowledge-graph layout. All AI-Agents-specific graph
// configuration (layer slug + position, concept positions, concept→stage
// spoke attachments, cross-concept relation edges, the stage-click target)
// lives here so that the renderer in `src/components/domain-graph.tsx`
// stays generic.
//
// Layout philosophy:
//   - 5 pipeline stages (ingest → index → retrieve → act → evaluate)
//     spaced at columnWidth 280.
//   - 11 "act-class" topics hung under their stage column in a vertical
//     stack; longer stacks (act=3, evaluate=4) get larger y deltas.
//   - 4 dashed "layer" topics placed at the canvas edges so their dashed
//     overlay relations read as conceptual cross-cutting concerns rather
//     than downstream functional flows:
//       - rag       : top, overlays retrieve (retrieval → rag)
//       - llm       : top-right, overlays act (llm → agent-frameworks)
//       - mcp       : right, overlays tool-calling (tool-calling → mcp)
//       - guardrails: left, overlays llm (guardrails → llm)
//   - Concept ↔ stage spoke edges are 1:1 with stage items[].slug (mirrors
//     cloudsec's spoke convention).

import type { DomainGraphLayout } from "@/content/types";

export const graphLayout: DomainGraphLayout = {
  columnWidth: 280,

  // Top y for every stage header card.
  stageY: 20,

  layerSlugs: ["rag", "llm", "mcp", "guardrails"],
  layerPositions: {
    // Top dashed card; the retrieval → rag dashed edge drops down from
    // retrieve into this card.
    rag: { x: 770, y: -180 },
    // Above the act column; the llm → agent-frameworks dashed edge runs
    // straight down into the act concept.
    llm: { x: 1180, y: -180 },
    // Right of the act column; tool-calling → mcp dashed edge runs right.
    mcp: { x: 1480, y: 380 },
    // Left of the ingest column; guardrails → llm dashed edge runs far
    // right across the canvas (canonical lambda-shape overlay).
    guardrails: { x: -300, y: 580 },
  },

  conceptPositions: {
    // ingest column (x ≈ 70 below stage at x=0)
    chunking: { x: 70, y: 200 },

    // index column (stage at x=280)
    embeddings: { x: 350, y: 200 },
    "vector-db": { x: 350, y: 380 },

    // retrieve column (stage at x=560)
    retrieval: { x: 630, y: 200 },

    // act column (stage at x=840) — 3 concepts stacked
    "agent-frameworks": { x: 910, y: 200 },
    "tool-calling": { x: 910, y: 380 },
    orchestration: { x: 910, y: 560 },

    // evaluate column (stage at x=1120) — 4 concepts stacked
    evals: { x: 1190, y: 200 },
    benchmarks: { x: 1190, y: 380 },
    "llm-as-judge": { x: 1190, y: 560 },
    "regression-evals": { x: 1190, y: 740 },
  },

  // Concept → stage spoke attachments. The 11 non-layer topics attach to
  // their respective stage column header. Solid neutral stroke (the
  // renderer applies the default concept↔stage style).
  conceptAttachments: [
    { slug: "chunking", stageId: "ingest", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "embeddings", stageId: "index", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "vector-db", stageId: "index", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "retrieval", stageId: "retrieve", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "agent-frameworks", stageId: "act", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "tool-calling", stageId: "act", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "orchestration", stageId: "act", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "evals", stageId: "evaluate", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "benchmarks", stageId: "evaluate", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "llm-as-judge", stageId: "evaluate", sourceHandle: "s-t", targetHandle: "t-b" },
    { slug: "regression-evals", stageId: "evaluate", sourceHandle: "s-t", targetHandle: "t-b" },
  ],

  // Cross-concept relations. 8 solid functional downstream flows + 6 dashed
  // concept-overlay edges (mirroring relations.ts). Edge handles follow the
  // cloudsec convention: s-t (top source) → t-l (left target) for a clean
  // smoothstep that does not double back.
  crossRelations: [
    // ingest → index (solid)
    {
      id: "gera-vetores",
      source: "chunking",
      target: "embeddings",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "gera vetores",
    },
    {
      id: "armazena",
      source: "embeddings",
      target: "vector-db",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "armazena",
    },

    // index → retrieve (solid)
    {
      id: "consulta",
      source: "vector-db",
      target: "retrieval",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "consulta",
    },

    // retrieve → rag (dashed overlay)
    {
      id: "alimenta-contexto",
      source: "retrieval",
      target: "rag",
      sourceHandle: "s-t",
      targetHandle: "t-b",
      label: "alimenta contexto",
      dashed: true,
      arrow: false,
    },

    // rag → llm (dashed overlay)
    {
      id: "injeta-contexto",
      source: "rag",
      target: "llm",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "injeta contexto",
      dashed: true,
      arrow: false,
    },

    // llm → agent-frameworks (dashed overlay)
    {
      id: "e-o-nucleo",
      source: "llm",
      target: "agent-frameworks",
      sourceHandle: "s-b",
      targetHandle: "t-t",
      label: "é o núcleo",
      dashed: true,
      arrow: false,
    },

    // act internals (solid)
    {
      id: "habilita",
      source: "agent-frameworks",
      target: "tool-calling",
      sourceHandle: "s-b",
      targetHandle: "t-t",
      label: "habilita",
    },
    {
      id: "coordena-com",
      source: "agent-frameworks",
      target: "orchestration",
      sourceHandle: "s-b",
      targetHandle: "t-t",
      label: "coordena com",
    },

    // tool-calling → mcp (dashed overlay)
    {
      id: "fala-o-protocolo",
      source: "tool-calling",
      target: "mcp",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "fala o protocolo",
      dashed: true,
      arrow: false,
    },

    // evaluate inputs (solid)
    {
      id: "fornece-dados",
      source: "benchmarks",
      target: "evals",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "fornece dados",
    },
    {
      id: "automatiza-a-nota",
      source: "llm-as-judge",
      target: "evals",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "automatiza a nota",
    },
    {
      id: "protege-o-baseline",
      source: "regression-evals",
      target: "evals",
      sourceHandle: "s-t",
      targetHandle: "t-b",
      label: "protege o baseline",
    },

    // evals → rag (dashed overlay)
    {
      id: "mede-a-recuperacao",
      source: "evals",
      target: "rag",
      sourceHandle: "s-t",
      targetHandle: "t-b",
      label: "mede a recuperação",
      dashed: true,
      arrow: false,
    },

    // guardrails → llm (dashed overlay)
    {
      id: "filtra-entrada-saida",
      source: "guardrails",
      target: "llm",
      sourceHandle: "s-r",
      targetHandle: "t-l",
      label: "filtra entrada/saída",
      dashed: true,
      arrow: false,
    },
  ],

  // The route every stage click pushes to. Today every stage routes to
  // the domain home — there is no single stage-overview topic in the
  // skeleton yet (T19-21 will revisit if one is added).
  stageHref: "/agentes",
};