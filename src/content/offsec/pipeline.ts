import type { PipelineStage } from "@/content/types";

// Four phases of an offensive-security engagement: SCOPE (permission and
// method), DISCOVER (find what is exposed), ATTACK (show the real impact, in
// safe and authorized ways) and REPORT (turn it into fixes).

export const pipeline: PipelineStage[] = [
  {
    id: "scope",
    index: "01",
    name: "scope",
    description: "permission, boundaries and method",
    items: [
      { label: "authorization, rules of engagement, ethics", slug: "engagement-scoping-and-ethics" },
      { label: "phases and standards", slug: "pentest-methodology" },
    ],
    gate: "nothing is touched without written authorization and a defined scope",
  },
  {
    id: "discover",
    index: "02",
    name: "discover",
    description: "find what is exposed",
    items: [
      { label: "assets, services and forgotten systems", slug: "recon-and-attack-surface" },
      { label: "two accounts and an intercepting proxy", slug: "web-and-api-testing" },
    ],
    gate: "every test is reproducible and within the agreed rate and scope",
  },
  {
    id: "attack",
    index: "03",
    name: "attack",
    description: "show the real impact, safely",
    items: [
      { label: "chains of small weaknesses", slug: "privilege-escalation-paths" },
      { label: "the human attack surface", slug: "social-engineering-and-phishing" },
      { label: "can defenders stop a realistic adversary", slug: "red-team-and-adversary-emulation" },
    ],
    gate: "impact is proven with the least access needed, and cleaned up",
  },
  {
    id: "report",
    index: "04",
    name: "report",
    description: "turn findings into fixes",
    items: [
      { label: "findings, risk and retest", slug: "reporting-and-remediation" },
      { label: "lessons back into design and detection" },
    ],
    gate: "each finding has an owner, a fix and a verified retest",
  },
];
