import type { Topic } from "@/content/types";

export const thirdPartyRisk: Topic = {
  domain: "grc",
  slug: "third-party-risk",
  title: "Third-party and supply chain risk",
  short: "assessing suppliers and partners, because their weakness becomes yours",
  tagline:
    "A growing share of incidents enter through a vendor, a partner or a dependency: an attacker breaches a smaller company to reach its large customer. Know who you depend on and how much you trust them.",
  kind: "pratica",
  stage: "identify",
  tools: ["vendor risk questionnaires (SIG, CAIQ)", "security ratings services", "SOC 2 and ISO 27001 reports", "SBOMs", "contract security clauses", "vendor inventory"],
  sections: [
    {
      heading: "Why it matters",
      body: [
        "Every vendor with access to your data, systems or code extends your attack surface, and you cannot patch their servers. The risk covers software suppliers and their dependencies, cloud and SaaS providers, outsourced services with network access, and partners who integrate with your systems. Regulators and customers increasingly hold you accountable for the data you give a supplier.",
      ],
    },
    {
      heading: "The lifecycle",
      bullets: [
        "Inventory: a living list of every third party, what they do, what data and access they have and who owns the relationship.",
        "Tier by criticality: the depth of review should match the impact if the vendor fails or is breached (sensitive data, production access, business dependence).",
        "Due diligence before signing: questionnaires, certifications and audit reports, security ratings, and for critical vendors a deeper review or a technical test.",
        "Contract: security requirements, breach notification time, right to audit, data handling and deletion, subcontractor rules, exit terms.",
        "Onboarding with least privilege: the minimum access, time-limited, with named accounts and monitoring.",
        "Ongoing monitoring: reassess on a schedule by tier, watch for incidents and ratings changes, review access.",
        "Offboarding: revoke access and confirm data return or deletion.",
      ],
    },
    {
      heading: "A tiering rule",
      code: [
        {
          language: "yaml",
          filename: "vendor-tiering.yml",
          code: "tiers:\n  critical:   # a breach or outage here hurts the business directly\n    criteria: [processes personal or payment data, has production or network access, no easy substitute]\n    review: [full questionnaire, SOC 2 Type II or ISO 27001 report, architecture review, annual reassessment]\n  important:\n    criteria: [handles internal confidential data, integrates through APIs]\n    review: [standard questionnaire, certification check, reassess every two years]\n  standard:\n    criteria: [no sensitive data, no integration]\n    review: [lightweight check at onboarding]\n\nvendors:\n  - { name: ExamplePay,     tier: critical,  owner: finance-eng, data: [payment tokens] }\n  - { name: ExampleSurvey,  tier: standard,  owner: marketing,   data: [] }",
        },
      ],
    },
    {
      heading: "Software supply chain",
      bullets: [
        "Maintain an SBOM for what you ship and ask critical suppliers for theirs.",
        "Scan dependencies continuously and pin versions; verify signatures on what you install.",
        "Review the vendor's own security practices, such as how they sign releases and respond to vulnerabilities.",
        "Plan for failure: concentration risk (everything on one provider), exit plans and backups outside the vendor.",
      ],
    },
  ],
};
