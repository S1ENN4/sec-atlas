// Domain-content shared types. The content layer is organised as a registry of
// domains (appsec, cloudsec, ai-agents, ...) where each domain owns its own
// topics, relations, pipeline and glossary. A topic is identified by a
// composite id (DomainId + slug) so that two domains can ship a topic with the
// same short slug without colliding.

export type DomainId = "appsec" | "cloudsec" | "ai-agents" | "secops" | "seceng";

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
  // Optional: per-domain knowledge-graph layout consumed by the generic
  // renderer (see `src/components/domain-graph.tsx`). Domains without a
  // layout don't render a graph.
  graphLayout?: DomainGraphLayout;
  // Language the domain's strings are authored in. "en" is the source of
  // truth; "pt" marks LEGACY content that has not been migrated to English
  // yet (see src/i18n). Defaults to "en".
  contentLang?: "en" | "pt";
}

// -- Knowledge-graph layout ----------------------------------------------------
// Owned by the content layer so each domain can describe how its concepts are
// arranged. The generic renderer reads this verbatim — no domain constants
// live in the component.

// Position of a single concept card on the canvas (slug-keyed, includes the
// "layer" concepts rendered as dashed cards).
export interface GraphPosition {
  x: number;
  y: number;
}

// A concept → stage spoke edge (a "this concept attaches to that stage"
// relationship). Handle ids follow the React Flow handle conventions used
// by the StageNode / ConceptNode renderers.
export interface GraphConceptAttachment {
  slug: string;
  stageId: string;
  sourceHandle: string;
  targetHandle: string;
}

// A cross-concept relation edge. `source` / `target` are either a concept
// slug or a `stage-<id>` stage-node id; `dashed` enables the tracejado
// stroke variant; `arrow: false` suppresses the arrow marker. `label`
// is rendered as the edge label.
export interface GraphRelation {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  label: string;
  dashed?: boolean;
  arrow?: boolean;
}

export interface DomainGraphLayout {
  columnWidth: number;
  stageY: number;
  layerSlugs: string[];
  layerPositions: Record<string, GraphPosition>;
  conceptPositions: Record<string, GraphPosition>;
  conceptAttachments: GraphConceptAttachment[];
  // "always" (default): concept -> stage lines are faintly visible at rest.
  // "focus": hidden until the card is hovered/selected. Use "focus" when every
  // card already sits in its stage's column, so the lines add only noise.
  spokes?: "always" | "focus";
  crossRelations: GraphRelation[];
  // Route the stage node click should push to. Today every stage routes to
  // the same CI/CD overview topic; domains with per-stage pages would
  // override this with a function (future work).
  stageHref: string;
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
  level: "iniciante" | "intermediário";
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
