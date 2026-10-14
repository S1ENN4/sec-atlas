import type { Domain, TopicKind } from "@/content/types";

import { engagementScopingAndEthics } from "./topics/engagement-scoping-and-ethics";
import { pentestMethodology } from "./topics/pentest-methodology";
import { privilegeEscalationPaths } from "./topics/privilege-escalation-paths";
import { reconAndAttackSurface } from "./topics/recon-and-attack-surface";
import { redTeamAndAdversaryEmulation } from "./topics/red-team-and-adversary-emulation";
import { reportingAndRemediation } from "./topics/reporting-and-remediation";
import { socialEngineeringAndPhishing } from "./topics/social-engineering-and-phishing";
import { webAndApiTesting } from "./topics/web-and-api-testing";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";

const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "technique", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "practice", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "concept", dot: "bg-amber-400", text: "text-amber-400" },
};

// Authored in English (the source language). Authorization-first: the method,
// the ethics and the defensive lessons of offensive work. No weaponized
// exploit content: techniques are described by concept, test method and fix.
export const offsec: Domain = {
  id: "offsec",
  route: "/offensive",
  status: "live",
  contentLang: "en",
  accent: "red",
  kindMeta,
  topics: [
    engagementScopingAndEthics,
    pentestMethodology,
    reconAndAttackSurface,
    webAndApiTesting,
    privilegeEscalationPaths,
    socialEngineeringAndPhishing,
    redTeamAndAdversaryEmulation,
    reportingAndRemediation,
  ],
  relations,
  pipeline,
  glossary,
};
