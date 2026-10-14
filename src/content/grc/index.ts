import type { Domain, TopicKind } from "@/content/types";

import { complianceInPractice } from "./topics/compliance-in-practice";
import { crisisCommunicationAndCulture } from "./topics/crisis-communication-and-culture";
import { riskManagement } from "./topics/risk-management";
import { securityArchitecture } from "./topics/security-architecture";
import { securityFrameworks } from "./topics/security-frameworks";
import { securityMetrics } from "./topics/security-metrics";
import { securityStrategyAndBudget } from "./topics/security-strategy-and-budget";
import { thirdPartyRisk } from "./topics/third-party-risk";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";
import { graphLayout } from "./graph-layout";

const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "technique", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "practice", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "concept", dot: "bg-amber-400", text: "text-amber-400" },
};

// Authored in English (the source language). Governance, risk, compliance and
// the leadership side of security. Legal and regulatory statements are general
// orientation, not legal advice.
export const grc: Domain = {
  id: "grc",
  route: "/grc",
  status: "live",
  contentLang: "en",
  accent: "indigo",
  kindMeta,
  topics: [
    riskManagement,
    thirdPartyRisk,
    securityFrameworks,
    securityArchitecture,
    complianceInPractice,
    securityMetrics,
    securityStrategyAndBudget,
    crisisCommunicationAndCulture,
  ],
  relations,
  pipeline,
  glossary,
  graphLayout,
};
