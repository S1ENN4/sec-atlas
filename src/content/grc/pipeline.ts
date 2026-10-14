import type { PipelineStage } from "@/content/types";

// Four phases of running security as a business function: IDENTIFY what can go
// wrong, DESIGN the controls and the architecture, PROVE that they work, and
// LEAD the function and the organization through decisions and crises.

export const pipeline: PipelineStage[] = [
  {
    id: "identify",
    index: "01",
    name: "identify",
    description: "know what can go wrong, and who it can come through",
    items: [
      { label: "risks with owners and treatment", slug: "risk-management" },
      { label: "suppliers, partners and dependencies", slug: "third-party-risk" },
    ],
    gate: "every important risk has an owner, a rating and a decision",
  },
  {
    id: "design",
    index: "02",
    name: "design",
    description: "frameworks and architecture that scale",
    items: [
      { label: "ISO 27001, NIST CSF, CIS, PCI DSS", slug: "security-frameworks" },
      { label: "zero trust and reusable patterns", slug: "security-architecture" },
    ],
    gate: "controls are designed once, as patterns, and mapped to requirements",
  },
  {
    id: "prove",
    index: "03",
    name: "prove",
    description: "show that controls work",
    items: [
      { label: "evidence and audits", slug: "compliance-in-practice" },
      { label: "outcome metrics and board reporting", slug: "security-metrics" },
    ],
    gate: "evidence is produced continuously and metrics inform decisions",
  },
  {
    id: "lead",
    index: "04",
    name: "lead",
    description: "decide, communicate, build culture",
    items: [
      { label: "strategy, roadmap and budget", slug: "security-strategy-and-budget" },
      { label: "crisis communication and culture", slug: "crisis-communication-and-culture" },
    ],
    gate: "leadership understands the risk, funds the plan and trusts the team",
  },
];
