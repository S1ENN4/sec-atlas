// Display labels that depend on both the domain and the locale.

import { domains } from "@/content/registry";
import type { DomainId, TopicKind } from "@/content/types";

import type { Ui } from "./ui";

/** Badge metadata (dot/text colours stay in the domain; labels come from the UI dictionary). */
export function kindMetaFor(id: DomainId, t: Ui): Record<TopicKind, { label: string; dot: string; text: string }> {
  const base = domains[id].kindMeta;
  const label: Record<TopicKind, string> = {
    tecnica: id === "appsec" ? t.kinds.appsecTecnica : t.kinds.tecnica,
    pratica: id === "ai-agents" ? t.kinds.agentsPratica : t.kinds.pratica,
    conceito: t.kinds.conceito,
  };
  return {
    tecnica: { ...base.tecnica, label: label.tecnica },
    pratica: { ...base.pratica, label: label.pratica },
    conceito: { ...base.conceito, label: label.conceito },
  };
}
