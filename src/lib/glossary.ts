// Thin re-export shim. The canonical content lives in `src/content/`; this
// file keeps the legacy `glossary` array that the existing app page and
// GlossaryExplorer component already import.

export type { GlossaryEntry, GlossaryGroup } from "@/content/types";

import { appsec } from "@/content/appsec";

export const glossary = appsec.glossary;
