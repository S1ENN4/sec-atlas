import type { Topic } from "@/content/types";

export const riskManagement: Topic = {
  domain: "grc",
  slug: "risk-management",
  title: "Security risk management",
  short: "identify, rate, treat and track risks so that decisions are made on purpose",
  tagline:
    "Security cannot remove all risk, and does not need to. Risk management turns \"everything is urgent\" into a ranked list the business can accept, reduce, transfer or avoid.",
  kind: "conceito",
  stage: "identify",
  tools: ["risk register", "ISO 31000", "NIST SP 800-30", "FAIR (quantitative)", "threat modeling", "GRC platforms"],
  sections: [
    {
      heading: "The vocabulary",
      bullets: [
        "Asset: something of value (data, a system, a service, reputation).",
        "Threat: something that can cause harm (an attacker, an error, a failure).",
        "Vulnerability: a weakness a threat can use.",
        "Risk: the chance and impact of a threat using a vulnerability against an asset. Often rated as likelihood times impact.",
        "Control: something that reduces likelihood or impact.",
        "Inherent risk is before controls, residual risk is what remains after them.",
      ],
    },
    {
      heading: "The cycle",
      bullets: [
        "Establish context: what the business is trying to achieve and what it can tolerate (risk appetite).",
        "Identify risks: from threat modeling, assessments, incidents, audits, vendors and changes.",
        "Analyze and evaluate: rate likelihood and impact on a consistent scale, and rank.",
        "Treat: reduce (add controls), accept (with an owner and a date), transfer (insurance, contract) or avoid (stop the activity).",
        "Monitor and review: risks change; revisit them on a schedule and after major events.",
      ],
    },
    {
      heading: "A risk register entry",
      body: ["A register is the working record. Each risk has one owner who can decide about it, not just a security contact."],
      code: [
        {
          language: "yaml",
          filename: "risk-register.yml",
          code: "- id: R-014\n  title: Customer data exposed through an API authorization flaw\n  asset: customer-api\n  threat: external attacker with a free account\n  likelihood: 4          # 1 rare .. 5 almost certain\n  impact: 5              # 1 minor .. 5 severe (regulatory, financial, trust)\n  inherent_score: 20\n  controls: [authorization tests in CI, WAF anomaly rules]\n  residual_score: 10\n  treatment: reduce\n  actions:\n    - { what: \"central authorization layer\", owner: platform-lead, due: 2027-01-31 }\n  risk_owner: vp-engineering\n  review_date: 2026-12-15",
        },
      ],
    },
    {
      heading: "Doing it well",
      bullets: [
        "Use one scale across the company so scores can be compared; explain what each level means in money, users or downtime.",
        "Quantify where you can: ranges of loss are more useful than a color, even if rough.",
        "Make acceptance explicit: a risk accepted by a named executive for a defined period is a decision; one nobody mentions is neglect.",
        "Keep the register short enough to act on, and tied to the work: each risk links to actions with owners.",
        "Connect it to reality: incidents, audit findings and threat intelligence should change scores.",
      ],
    },
  ],
};
