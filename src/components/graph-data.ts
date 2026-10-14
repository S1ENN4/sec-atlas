import type { JourneyStrings } from "@/components/journey-map";
import type { DomainId, TopicKind } from "@/content/types";
import type { Locale } from "@/i18n/config";

// Lean, serialisable slice of a domain that the client-side learning map needs.
// The server wrapper (`domain-graph.tsx`) builds it from the registry so the
// full topic bodies (sections, code samples) never ship in the client bundle.
export interface MapTopic {
  id: string; // "<domain>/<slug>"
  slug: string;
  title: string;
  short: string;
  tagline: string;
  kind: TopicKind;
  /** Pipeline stage id (the phase this topic belongs to), or null for cross-cutting. */
  stage: string | null;
  level: 1 | 2 | 3;
  /** Prerequisites as "<domain>/<slug>"; may point into other domains. */
  requires: string[];
  minutes: number;
  keyPoints: string[];
  href: string;
}

export interface MapStage {
  id: string;
  index: string;
  name: string;
  gate: string;
}

/** A prerequisite that lives in another domain: shown as a link, not a node. */
export interface MapExternal {
  title: string;
  href: string;
  domainName: string;
}

export interface GraphStrings {
  allPrereqs: string;
  hint: string;
  legend: string;
  selected: string;
  details: string;
  keyPoints: string;
  startHere: string;
  needsElsewhere: string;
  relations: string;
  openTopic: string;
  mark: string;
  studied: string;
  copyLink: string;
  copied: string;
  stageEyebrow: string;
  gate: string;
}

export interface GraphData {
  domainId: DomainId;
  locale: Locale;
  strings: GraphStrings;
  /** Level names, state labels and the "next step" copy are shared with the Journey. */
  journey: JourneyStrings;
  minRead: string;
  kindMeta: Record<TopicKind, { label: string; dot: string; text: string }>;
  stages: MapStage[];
  topics: MapTopic[];
  external: Record<string, MapExternal>;
  relations: { source: string; target: string; label: string }[];
}
