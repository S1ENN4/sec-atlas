import type { Domain, TopicKind } from "@/content/types";

import { digitalForensicsBasics } from "./topics/digital-forensics-basics";
import { irLifecycle } from "./topics/ir-lifecycle";
import { logAndTimelineAnalysis } from "./topics/log-and-timeline-analysis";
import { malwareAnalysisBasics } from "./topics/malware-analysis-basics";
import { ransomwarePlaybook } from "./topics/ransomware-playbook";
import { threatHunting } from "./topics/threat-hunting";
import { threatIntelligence } from "./topics/threat-intelligence";
import { triageAndContainment } from "./topics/triage-and-containment";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";
import { graphLayout } from "./graph-layout";

const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "technique", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "practice", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "concept", dot: "bg-amber-400", text: "text-amber-400" },
};

// Authored in English (the source language). Defensive content only: how to
// prepare for, detect, contain and investigate incidents.
export const response: Domain = {
  id: "response",
  route: "/response",
  status: "live",
  contentLang: "en",
  accent: "cyan",
  kindMeta,
  topics: [
    irLifecycle,
    threatIntelligence,
    threatHunting,
    logAndTimelineAnalysis,
    triageAndContainment,
    ransomwarePlaybook,
    digitalForensicsBasics,
    malwareAnalysisBasics,
  ],
  relations,
  pipeline,
  glossary,
  graphLayout,
};
