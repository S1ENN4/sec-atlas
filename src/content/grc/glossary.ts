import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "risk",
    title: "risk",
    entries: [
      {
        term: "Risk appetite",
        meaning: "How much risk the organization is willing to accept in pursuit of its goals. It frames which risks need treatment and which can be accepted.",
        topic: "risk-management",
      },
      {
        term: "Inherent and residual risk",
        meaning: "Inherent risk is the level before controls; residual risk is what remains after them. Reporting both shows what the controls achieve.",
        topic: "risk-management",
      },
      {
        term: "Risk register",
        meaning: "The working record of identified risks: owner, rating, controls, treatment, actions and review date.",
        topic: "risk-management",
      },
      {
        term: "Risk treatment",
        meaning: "The four responses to a risk: reduce it with controls, accept it knowingly, transfer it (insurance, contract) or avoid it by stopping the activity.",
        topic: "risk-management",
      },
      {
        term: "Concentration risk",
        meaning: "Excess dependence on one supplier, provider or technology, so that its failure becomes your failure.",
        topic: "third-party-risk",
      },
      {
        term: "Vendor tiering",
        meaning: "Grouping suppliers by criticality so that the depth of review and monitoring matches the impact of their failure.",
        topic: "third-party-risk",
      },
    ],
  },
  {
    id: "frameworks",
    title: "frameworks and compliance",
    entries: [
      {
        term: "ISMS",
        aka: "information security management system",
        meaning: "The set of policies, processes and controls that an organization uses to manage information security, as required by ISO 27001.",
        topic: "security-frameworks",
      },
      {
        term: "NIST CSF",
        meaning: "A voluntary framework that organizes a security program into functions: Govern, Identify, Protect, Detect, Respond and Recover.",
        topic: "security-frameworks",
      },
      {
        term: "CIS Controls",
        meaning: "A prioritized list of practical safeguards grouped in implementation levels, helpful for deciding where to start.",
        topic: "security-frameworks",
      },
      {
        term: "SOC 2",
        meaning: "An auditor's report on a service provider's controls for security and related criteria, commonly requested by customers.",
        topic: "security-frameworks",
      },
      {
        term: "Control",
        meaning: "A safeguard that reduces the likelihood or impact of a risk; to be auditable it must have an owner, a frequency and evidence.",
        topic: "compliance-in-practice",
      },
      {
        term: "Evidence",
        meaning: "Proof that a control operated during a period, such as a configuration export, a log, a ticket or an approval record.",
        topic: "compliance-in-practice",
      },
    ],
  },
  {
    id: "leadership",
    title: "architecture and leadership",
    entries: [
      {
        term: "Zero trust",
        meaning: "An approach that grants no trust by network location: every request is authenticated and authorized using identity, device and context.",
        topic: "security-architecture",
      },
      {
        term: "ADR",
        aka: "architecture decision record",
        meaning: "A short document recording a significant decision, its context, alternatives and consequences.",
        topic: "security-architecture",
      },
      {
        term: "KRI",
        aka: "key risk indicator",
        meaning: "A measure that warns that risk is increasing, such as a growing backlog of critical findings or unsupported systems.",
        topic: "security-metrics",
      },
      {
        term: "Crown jewels",
        meaning: "The assets whose loss or compromise would hurt the organization most. Strategy starts by identifying and protecting them.",
        topic: "security-strategy-and-budget",
      },
      {
        term: "Blameless reporting",
        meaning: "A culture where people who report mistakes or incidents quickly are supported, because early reports limit the damage.",
        topic: "crisis-communication-and-culture",
      },
      {
        term: "Security champion",
        meaning: "A person in an engineering or business team who acts as the local point of contact for security and brings it into daily work.",
        topic: "crisis-communication-and-culture",
      },
    ],
  },
];
