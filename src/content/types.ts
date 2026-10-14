// Domain-content shared types. The content layer is organised as a registry of
// domains (appsec, cloudsec, ai-agents, ...) where each domain owns its own
// topics, relations, pipeline and glossary. A topic is identified by a
// composite id (DomainId + slug) so that two domains can ship a topic with the
// same short slug without colliding.

export type DomainId = "appsec" | "cloudsec" | "ai-agents" | "secops" | "seceng" | "owasp" | "vibecoding" | "devops" | "response" | "offsec" | "grc";

export interface DomainMeta {
  id: DomainId;
  route: string;
  status: "live" | "draft";
  accent: string;
}

export interface TopicRef {
  domain: DomainId;
  slug: string;
}

export type TopicKind = "tecnica" | "pratica" | "conceito";

export interface CodeSample {
  language: string;
  filename?: string;
  code: string;
}

export interface TopicSection {
  heading: string;
  body?: string[];
  bullets?: string[];
  code?: CodeSample[];
}

export interface Topic {
  domain: DomainId;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  kind: TopicKind;
  stage: string | null;
  tools: string[];
  sections: TopicSection[];
}

// A relation is between two composite ids; the slug-only form is gone.
// The `sourceHandle` / `targetHandle` fields were dropped when the
// knowledge-graph renderer moved to a generic layout driven by
// `DomainGraphLayout.crossRelations` and `DomainGraphLayout.conceptAttachments`
// (which still carry their own per-edge handle ids). Nothing reads the
// relation-level handles anymore — see T4.
export interface Relation {
  source: TopicRef;
  target: TopicRef;
  label: string;
  animated?: boolean;
}

export interface PipelineItem {
  label: string;
  slug?: string;
}

export interface PipelineStage {
  id: string;
  index: string;
  name: string;
  description: string;
  items: PipelineItem[];
  gate: string;
}

export interface GlossaryEntry {
  term: string;
  aka?: string;
  meaning: string;
  topic?: string;
}

export interface GlossaryGroup {
  id: string;
  title: string;
  entries: GlossaryEntry[];
}

// A domain bundles all of its content under a single id.
export interface Domain extends DomainMeta {
  kindMeta: Record<TopicKind, { label: string; dot: string; text: string }>;
  topics: Topic[];
  relations: Relation[];
  pipeline: PipelineStage[];
  glossary: GlossaryGroup[];
  // Language the domain's strings are authored in. "en" is the source of
  // truth; "pt" marks LEGACY content that has not been migrated to English
  // yet (see src/i18n). Defaults to "en".
  contentLang?: "en" | "pt";
}

// -- Quiz ----------------------------------------------------------------------
// One multiple-choice question. `answer` indexes `options`; `explain` is shown
// after the reader picks. Options are shuffled at render time (stable seed).
export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

// Slug-keyed quiz bank for a single domain.
export type QuizBank = Record<string, QuizQuestion[]>;

// -- Cross-domain bridges ------------------------------------------------------
// An undirected "these two ideas are the same problem in two domains" link,
// shown on both topic pages.
export interface Bridge {
  a: TopicRef;
  b: TopicRef;
  label: string;
}

// -- Study paths ---------------------------------------------------------------
export interface PathStep {
  ref: TopicRef;
  why: string;
}

export interface StudyPath {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate";
  steps: PathStep[];
}

// -- Attack scenarios ----------------------------------------------------------
// A walk through a single incident: at each step the attacker (or an accident)
// does something at a pipeline stage, and one topic's control is what stops,
// detects or limits it.
export interface ScenarioStep {
  stageId: string;
  happens: string;
  control: TopicRef;
  stops: string;
}

export interface Scenario {
  id: string;
  domain: DomainId;
  title: string;
  summary: string;
  steps: ScenarioStep[];
}
