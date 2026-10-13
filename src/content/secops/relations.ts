import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "secops" as const, slug });

// Topic-to-topic connections shown on each topic page. The map draws a
// smaller subset (see graph-layout.ts) so no line crosses a card.
export const relations: Relation[] = [
  { source: ref("telemetria-borda"), target: ref("ataques-l7"), label: "revela" },
  { source: ref("telemetria-borda"), target: ref("detection-engineering"), label: "alimenta" },
  { source: ref("escala-telemetria"), target: ref("telemetria-borda"), label: "sustenta" },
  { source: ref("escala-telemetria"), target: ref("detection-engineering"), label: "mantém viável" },
  { source: ref("ataques-l7"), target: ref("detection-engineering"), label: "vira detecção" },
  { source: ref("detection-engineering"), target: ref("waf"), label: "gera regras" },
  { source: ref("detection-engineering"), target: ref("rate-limiting"), label: "gera limites" },
  { source: ref("detection-engineering"), target: ref("bot-management"), label: "pontua automação" },
  { source: ref("bot-management"), target: ref("runbooks-e-hardening"), label: "aciona" },
  { source: ref("waf"), target: ref("runbooks-e-hardening"), label: "executa" },
  { source: ref("slos-soc"), target: ref("waf"), label: "mede a precisão" },
  { source: ref("slos-soc"), target: ref("detection-engineering"), label: "guia o tuning" },
  { source: ref("defesa-em-camadas"), target: ref("rate-limiting"), label: "define onde vive" },
  { source: ref("defesa-em-camadas"), target: ref("waf"), label: "posiciona" },
];
