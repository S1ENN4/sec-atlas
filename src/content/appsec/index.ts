import type { Domain, TopicKind } from "@/content/types";

import { cicd } from "./topics/cicd";
import { sast } from "./topics/sast";
import { dast } from "./topics/dast";
import { sca } from "./topics/sca";
import { secrets } from "./topics/secrets";
import { sbom } from "./topics/sbom";
import { shiftLeft } from "./topics/shift-left";
import { devsecops } from "./topics/devsecops";
import { threatModeling } from "./topics/threat-modeling";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";

// Per-domain kind metadata. AppSec keeps the original Portuguese labels
// ("técnica de teste" / "prática" / "conceito") so that consumer badges and
// legend chips render byte-identical to the pre-refactor site.
const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "técnica de teste", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "prática", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "conceito", dot: "bg-amber-400", text: "text-amber-400" },
};

export const appsec: Domain = {
  id: "appsec",
  route: "/appsec",
  status: "live",
  contentLang: "pt", // legacy: migrate to "en" with `npm run i18n -- flip`
  accent: "emerald",
  kindMeta,
  topics: [cicd, sast, dast, sca, secrets, sbom, shiftLeft, devsecops, threatModeling],
  relations,
  pipeline,
  glossary,
};
