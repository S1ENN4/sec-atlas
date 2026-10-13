import type { DomainGraphLayout, DomainId, PipelineStage, TopicKind } from "@/content/types";
import type { Locale } from "@/i18n/config";

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

export interface GraphStrings {
  viewMode: string;
  viewMap: string;
  viewList: string;
  allRelations: string;
  kindShow: string;
  kindHide: string;
  legend: string;
  nodeDetails: string;
  stageEyebrow: string;
  stageAria: string;
  detailsAria: string;
  closeDetails: string;
  alsoInStage: string;
  relations: string;
  openTopic: string;
  mark: string;
  studied: string;
  copyLink: string;
  copied: string;
  also: string;
  crossCutting: string;
  gate: string;
}

export interface GraphData {
  domainId: DomainId;
  locale: Locale;
  strings: GraphStrings;
  route: string;
  kindMeta: Record<TopicKind, { label: string; dot: string; text: string }>;
  pipeline: PipelineStage[];
  layout: DomainGraphLayout | undefined;
  topics: Record<string, GraphTopic>;
  relations: { source: string; target: string; label: string }[];
}
