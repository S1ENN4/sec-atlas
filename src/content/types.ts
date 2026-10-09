// Domain-content shared types. The content layer is organised as a registry of
// domains (appsec, cloudsec, ai-agents, ...) where each domain owns its own
// topics, relations, pipeline and glossary. A topic is identified by a
// composite id (DomainId + slug) so that two domains can ship a topic with the
// same short slug without colliding.

export type DomainId = "appsec" | "cloudsec" | "ai-agents";

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
export interface Relation {
  source: TopicRef;
  target: TopicRef;
  label: string;
  sourceHandle: string;
  targetHandle: string;
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
}
