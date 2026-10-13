import type { DomainGraphLayout, DomainId, PipelineStage, TopicKind } from "@/content/types";

// Lean, serialisable slice of a domain that the client-side map needs. The
// server wrapper (`domain-graph.tsx`) builds it from the registry so the full
// topic bodies (sections, code samples) never ship in the client bundle.
export interface GraphTopic {
  title: string;
  short: string;
  tagline: string;
  kind: TopicKind;
  stage: string | null;
}

export interface GraphData {
  domainId: DomainId;
  route: string;
  kindMeta: Record<TopicKind, { label: string; dot: string; text: string }>;
  pipeline: PipelineStage[];
  layout: DomainGraphLayout | undefined;
  topics: Record<string, GraphTopic>;
  relations: { source: string; target: string; label: string }[];
}
