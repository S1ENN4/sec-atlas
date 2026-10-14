import type { Topic } from "@/content/types";

export const securityArchitecture: Topic = {
  domain: "grc",
  slug: "security-architecture",
  title: "Security architecture principles",
  short: "zero trust, defense in depth, least privilege and reference architectures that scale",
  tagline:
    "A security architect designs the controls once, as patterns, so that hundreds of teams inherit them. The craft is a small set of principles applied consistently across cloud, network, identity and data.",
  kind: "conceito",
  stage: "design",
  tools: ["threat modeling (STRIDE)", "architecture decision records (ADR)", "SABSA / TOGAF (optional)", "reference architectures and landing zones", "NIST SP 800-207 (zero trust)", "C4 diagrams"],
  sections: [
    {
      heading: "Core principles",
      bullets: [
        "Least privilege: every identity and workload gets only the access its task needs, for as long as it needs it.",
        "Defense in depth: several independent layers, so one failure is not a breach.",
        "Zero trust: never trust by network location; authenticate and authorize every request, using identity, device and context, and assume breach.",
        "Secure by default: the easy path is the safe path; insecure options need explicit effort.",
        "Separation of duties and of environments: no single person or compromise should be able to do everything.",
        "Minimize attack surface and blast radius: expose less, segment more, and limit what one failure can reach.",
        "Fail closed and keep it simple: complexity is the enemy of security.",
      ],
    },
    {
      heading: "From principles to patterns",
      body: [
        "Principles do not scale by themselves; patterns do. A landing zone gives every new cloud account the same logging, network baseline and guardrails. A standard identity service gives every application authentication and authorization. A paved path for pipelines carries the security checks. The architect's output is these reusable building blocks, plus the guidance for when to use them and a process for exceptions.",
      ],
    },
    {
      heading: "Recording decisions",
      body: ["Write down significant decisions with their context and trade-offs. Short architecture decision records keep the reasoning findable when the team changes."],
      code: [
        {
          language: "markdown",
          filename: "adr-0012-service-to-service-authentication.md",
          code: "# ADR-0012: Service-to-service authentication uses workload identity (mTLS)\n\nStatus: accepted   Date: 2026-10-02   Owner: security-architecture\n\n## Context\nServices call each other inside the cluster. A network allow-list is the only control today; a compromised pod can call anything.\n\n## Decision\nEvery service gets a workload identity and mutual TLS through the mesh. Authorization policies state which service may call which endpoint. Default is deny.\n\n## Consequences\n+ Compromise of one service no longer grants network access to all.\n+ Calls are attributable in logs.\n- Teams must define their allowed callers; the mesh adds operational complexity.\n\n## Alternatives considered\nNetwork policies only (rejected: no identity, hard to audit); shared API keys (rejected: no rotation, no attribution).",
        },
      ],
    },
    {
      heading: "Working with teams",
      bullets: [
        "Review designs early, when change is cheap; use threat modeling on new systems and major changes.",
        "Give teams self-service patterns and guardrails rather than approval queues that slow them down.",
        "Explain the risk behind each requirement; rules without reasons get bypassed.",
        "Track exceptions with owners and expiry dates, and feed recurring exceptions back into the pattern.",
        "Measure adoption of the patterns: an unused reference architecture protects nobody.",
      ],
    },
  ],
};
