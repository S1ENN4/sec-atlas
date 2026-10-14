import type { Domain, TopicKind } from "@/content/types";

import { ataquesL7 } from "./topics/ataques-l7";
import { botManagement } from "./topics/bot-management";
import { defesaEmCamadas } from "./topics/defesa-em-camadas";
import { detectionEngineering } from "./topics/detection-engineering";
import { escalaTelemetria } from "./topics/escala-telemetria";
import { rateLimiting } from "./topics/rate-limiting";
import { runbooksEHardening } from "./topics/runbooks-e-hardening";
import { slosSoc } from "./topics/slos-soc";
import { telemetriaBorda } from "./topics/telemetria-borda";
import { waf } from "./topics/waf";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";

// SecOps keeps the "técnica / prática / conceito" vocabulary; badge colors
// match the other domains so the kinds read the same everywhere.
const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "técnica", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "prática", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "conceito", dot: "bg-amber-400", text: "text-amber-400" },
};

export const secops: Domain = {
  id: "secops",
  route: "/secops",
  status: "live",
  contentLang: "pt", // legacy: migrate to "en" with `npm run i18n -- flip`
  accent: "orange",
  kindMeta,
  topics: [
    telemetriaBorda,
    escalaTelemetria,
    ataquesL7,
    detectionEngineering,
    waf,
    rateLimiting,
    botManagement,
    runbooksEHardening,
    slosSoc,
    defesaEmCamadas,
  ],
  relations,
  pipeline,
  glossary,
};
