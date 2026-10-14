import type { Domain, TopicKind } from "@/content/types";

import { rag } from "./topics/rag";
import { chunking } from "./topics/chunking";
import { embeddings } from "./topics/embeddings";
import { vectorDb } from "./topics/vector-db";
import { retrieval } from "./topics/retrieval";
import { llm } from "./topics/llm";
import { agentFrameworks } from "./topics/agent-frameworks";
import { toolCalling } from "./topics/tool-calling";
import { orchestration } from "./topics/orchestration";
import { mcp } from "./topics/mcp";
import { evals } from "./topics/evals";
import { benchmarks } from "./topics/benchmarks";
import { llmAsJudge } from "./topics/llm-as-judge";
import { regressionEvals } from "./topics/regression-evals";
import { guardrails } from "./topics/guardrails";

import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";

// Per-domain kind metadata. AI-Agents renames the pratica kind to "componente"
// (an agent pattern that ships in a library is a component, not a runbook
// practice) and drops the "de teste" qualifier from tecnica (RAG techniques
// aren't tests either). The dot/text colors stay the same as the other
// domains so badges read visually identical — only the textual label differs.
const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "técnica", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "componente", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "conceito", dot: "bg-amber-400", text: "text-amber-400" },
};

export const aiAgents: Domain = {
  id: "ai-agents",
  route: "/agents",
  // Domain is live: R19-T22 filled every one of the 15 topic bodies to the
  // verified R6 floor (≥4 sections + code-or-bullets + non-empty tagline +
  // ≥3 tools) and shipped the 3 ai-agents glossary groups, so the R6 live
  // content floor now runs over every ai-agents topic on every validator
  // invocation. T23 flips this flag to activate R6 across the catalogue.
  status: "live",
  contentLang: "pt", // legacy: migrate to "en" with `npm run i18n -- flip`
  // Violet accent matches the [data-domain="ai-agents"] token override in
  // src/app/globals.css.
  accent: "violet",
  kindMeta,
  topics: [
    rag,
    chunking,
    embeddings,
    vectorDb,
    retrieval,
    llm,
    agentFrameworks,
    toolCalling,
    orchestration,
    mcp,
    evals,
    benchmarks,
    llmAsJudge,
    regressionEvals,
    guardrails,
  ],
  relations,
  pipeline,
  glossary,
};