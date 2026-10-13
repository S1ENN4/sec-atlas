import type { PipelineStage } from "@/content/types";

// Four phases in which the Top 10 risks are decided: DESIGN (what the system
// allows), CODE (how input, secrets and identity are handled), SHIP (what is
// delivered and with which settings) and OPERATE (what you see and how you
// fail). Each risk is listed where the cheapest fix lives.

export const pipeline: PipelineStage[] = [
  {
    id: "design",
    index: "01",
    name: "design",
    description: "decide what must be impossible",
    items: [
      { label: "threat models and abuse cases", slug: "insecure-design" },
      { label: "who may do what, on every request", slug: "broken-access-control" },
      { label: "security requirements (ASVS)" },
    ],
    gate: "every feature has abuse cases and an authorization rule before code",
  },
  {
    id: "code",
    index: "02",
    name: "code",
    description: "handle input, secrets and identity safely",
    items: [
      { label: "keep data away from instructions", slug: "injection" },
      { label: "protect data at rest and in transit", slug: "cryptographic-failures" },
      { label: "prove who the user is", slug: "authentication-failures" },
    ],
    gate: "dangerous patterns are blocked in review and CI",
  },
  {
    id: "ship",
    index: "03",
    name: "ship",
    description: "deliver verified code with safe settings",
    items: [
      { label: "know and lock what you depend on", slug: "supply-chain-failures" },
      { label: "verify what you run", slug: "integrity-failures" },
      { label: "hardened, scanned configuration", slug: "security-misconfiguration" },
    ],
    gate: "only signed, scanned, hardened artifacts reach production",
  },
  {
    id: "operate",
    index: "04",
    name: "operate",
    description: "see attacks and fail safely",
    items: [
      { label: "logs that become alerts", slug: "logging-alerting-failures" },
      { label: "errors that deny, not leak", slug: "exceptional-conditions" },
      { label: "runbooks and response" },
    ],
    gate: "an attack is noticed, contained and leaves a trail",
  },
];
