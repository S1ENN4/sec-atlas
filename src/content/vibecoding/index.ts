import type { Domain, TopicKind } from "@/content/types";

import { agentSecurity } from "./topics/agent-security";
import { agentToolsCompared } from "./topics/agent-tools-compared";
import { contextEngineering } from "./topics/context-engineering";
import { harnessAndModel } from "./topics/harness-and-model";
import { modelChoice } from "./topics/model-choice";
import { parallelAgents } from "./topics/parallel-agents";
import { verificationLoop } from "./topics/verification-loop";
import { vibeSpectrum } from "./topics/vibe-spectrum";
import { whenToUseWhat } from "./topics/when-to-use-what";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";

const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "technique", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "practice", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "concept", dot: "bg-amber-400", text: "text-amber-400" },
};

// Authored in English (the source language). The tool landscape changes fast:
// every tool-specific claim carries an "as of" note and a source link.
export const vibecoding: Domain = {
  id: "vibecoding",
  route: "/vibecoding",
  status: "live",
  contentLang: "en",
  accent: "fuchsia",
  kindMeta,
  topics: [
    vibeSpectrum,
    harnessAndModel,
    agentToolsCompared,
    modelChoice,
    whenToUseWhat,
    contextEngineering,
    parallelAgents,
    verificationLoop,
    agentSecurity,
  ],
  relations,
  pipeline,
  glossary,
};
