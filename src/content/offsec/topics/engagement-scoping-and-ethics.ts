import type { Topic } from "@/content/types";

export const engagementScopingAndEthics: Topic = {
  domain: "offsec",
  slug: "engagement-scoping-and-ethics",
  title: "Authorization, scope and ethics",
  short: "what separates a security test from a crime: permission, boundaries and rules of engagement",
  tagline:
    "The techniques of a penetration tester and an attacker overlap. What differs is written authorization, an agreed scope and a duty to minimize harm.",
  kind: "conceito",
  stage: "scope",
  tools: ["rules of engagement document", "scope and authorization letter", "bug bounty platforms", "coordinated disclosure policies (security.txt)", "engagement tracker", "deconfliction contacts"],
  sections: [
    {
      heading: "Authorization comes first",
      body: [
        "Testing a system you do not own, or beyond what its owner allowed, can be illegal in most jurisdictions, regardless of your intent. Laws differ by country and can be strict, so this is not legal advice: confirm with counsel. The professional rule is simple. Never test anything without explicit, written permission from someone with the authority to give it, and never go beyond what that permission covers.",
      ],
      bullets: [
        "Written authorization from the asset owner (for third-party hosting or cloud, also check the provider's testing policy).",
        "A defined scope: which systems, addresses, applications and accounts are in, and which are explicitly out.",
        "A time window and a way to stop: when testing may happen and who can halt it immediately.",
        "A named contact on the client side who can be reached if something goes wrong.",
      ],
    },
    {
      heading: "Rules of engagement",
      body: ["The rules of engagement (RoE) turn permission into practical limits. Agree on them before the first packet."],
      code: [
        {
          language: "yaml",
          filename: "rules-of-engagement.yml",
          code: "engagement: Q4 external web and API assessment\nauthorized_by: \"CISO, Example Corp (signed letter attached)\"\nwindow: { start: 2026-11-02T08:00:00Z, end: 2026-11-13T20:00:00Z, hours: \"business days only\" }\nin_scope:\n  - https://app.example.com\n  - https://api.example.com/v2/*\n  - test accounts: [tester-a@example.com, tester-b@example.com]\nout_of_scope:\n  - production payment processor (third party)\n  - denial-of-service testing\n  - social engineering of employees\nconstraints:\n  - no data exfiltration beyond proof of access (one record, redacted)\n  - rate limit scans to 10 requests per second\n  - stop and call the contact if production degradation is observed\nemergency_contact: \"+55 11 5555-0100 (24h SOC)\"\nreporting: \"critical findings reported within 24 hours; final report in 10 business days\"",
        },
      ],
    },
    {
      heading: "Ethical principles",
      bullets: [
        "Minimize harm: prove the issue with the least access needed. Do not read, copy or keep real customer data you do not need.",
        "Protect what you find: findings and any data touched are confidential, stored encrypted and deleted at the end as agreed.",
        "Be honest in the report: do not exaggerate or hide anything, including your own mistakes (for example, a test that caused an outage).",
        "Stop at the boundary: if a path leads outside scope, ask for permission instead of continuing.",
        "Prefer safe proof: demonstrate impact with a harmless marker or a read of a test record, not with destructive actions.",
      ],
    },
    {
      heading: "Bug bounties and disclosure",
      body: [
        "A bug bounty program publishes a scope and rules and invites researchers to test within them, often with rewards; the program's terms are your authorization, and straying outside them removes it. When you find a vulnerability on a system outside any program, report it responsibly through the owner's disclosure channel (a security.txt file, a security@ address or a coordinated disclosure policy), give reasonable time to fix, and do not exploit it further or publish details early.",
      ],
    },
  ],
};
