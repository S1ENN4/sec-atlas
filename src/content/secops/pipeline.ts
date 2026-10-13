import type { PipelineStage } from "@/content/types";

// Four-stage SecOps / L7 defense loop. It mirrors how an edge defense program
// actually runs: you can only defend what you observe, detections turn
// signals into decisions, actions enforce them, and measurement tells you
// whether any of it works (and feeds the next round of tuning).
//
// `defesa-em-camadas` is NOT stage-attached: it is the design layer that
// decides where each control lives, so it floats as a dashed card on the map.

export const pipeline: PipelineStage[] = [
  {
    id: "observar",
    index: "01",
    name: "observar",
    description: "ver todo o tráfego, em escala e com contexto",
    items: [
      { label: "telemetria de borda", slug: "telemetria-borda" },
      { label: "escala, cardinalidade e custo", slug: "escala-telemetria" },
      { label: "baseline de tráfego legítimo" },
    ],
    gate: "toda requisição relevante vira evento normalizado",
  },
  {
    id: "detectar",
    index: "02",
    name: "detectar",
    description: "sinais viram decisões",
    items: [
      { label: "taxonomia de ataques L7", slug: "ataques-l7" },
      { label: "biblioteca de detecções", slug: "detection-engineering" },
      { label: "baselines comportamentais" },
    ],
    gate: "cada detecção tem dono, severidade e ação prevista",
  },
  {
    id: "agir",
    index: "03",
    name: "agir",
    description: "bloquear, desafiar ou limitar, com cuidado",
    items: [
      { label: "WAF: observação, shadow, enforcement", slug: "waf" },
      { label: "rate limiting adaptativo", slug: "rate-limiting" },
      { label: "bot management", slug: "bot-management" },
      { label: "runbooks e hardening", slug: "runbooks-e-hardening" },
    ],
    gate: "toda ação nova passa por shadow antes de enforcement",
  },
  {
    id: "medir",
    index: "04",
    name: "medir",
    description: "provar que funciona e ajustar",
    items: [
      { label: "SLOs de SOC", slug: "slos-soc" },
      { label: "tuning semanal" },
      { label: "indicadores executivos" },
    ],
    gate: "precisão e recall acompanhados · falso positivo cai a cada ciclo",
  },
];
