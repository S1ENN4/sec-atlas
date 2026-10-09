// Thin re-export shim. The canonical content lives in `src/content/`; this
// file keeps the legacy `pipelineStages` array name that the existing
// components already import.

export type { PipelineItem, PipelineStage } from "@/content/types";

import { appsec } from "@/content/appsec";

export const pipelineStages = appsec.pipeline;
