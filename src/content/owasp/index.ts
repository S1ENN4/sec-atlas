import type { Domain, TopicKind } from "@/content/types";

import { authenticationFailures } from "./topics/authentication-failures";
import { brokenAccessControl } from "./topics/broken-access-control";
import { cryptographicFailures } from "./topics/cryptographic-failures";
import { exceptionalConditions } from "./topics/exceptional-conditions";
import { injection } from "./topics/injection";
import { insecureDesign } from "./topics/insecure-design";
import { integrityFailures } from "./topics/integrity-failures";
import { loggingAlertingFailures } from "./topics/logging-alerting-failures";
import { securityMisconfiguration } from "./topics/security-misconfiguration";
import { supplyChainFailures } from "./topics/supply-chain-failures";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";

const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "technique", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "practice", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "concept", dot: "bg-amber-400", text: "text-amber-400" },
};

// Authored in English (the source language). Ordered as the OWASP Top 10:2025
// list, A01 to A10.
export const owasp: Domain = {
  id: "owasp",
  route: "/owasp",
  status: "live",
  contentLang: "en",
  accent: "lime",
  kindMeta,
  topics: [
    brokenAccessControl,
    securityMisconfiguration,
    supplyChainFailures,
    cryptographicFailures,
    injection,
    insecureDesign,
    authenticationFailures,
    integrityFailures,
    loggingAlertingFailures,
    exceptionalConditions,
  ],
  relations,
  pipeline,
  glossary,
};
