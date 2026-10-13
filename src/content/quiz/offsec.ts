import type { QuizBank } from "@/content/types";

export const offsecQuiz: QuizBank = {
  "engagement-scoping-and-ethics": [
    {
      q: "What separates a penetration test from an attack?",
      options: [
        "The tools used",
        "Written authorization, an agreed scope and a duty to minimize harm",
        "The time of day",
        "The operating system",
      ],
      answer: 1,
      explain: "The techniques overlap. Permission and boundaries define what is legitimate.",
    },
    {
      q: "During a test you discover a path that leads to a system outside the scope. What do you do?",
      options: [
        "Continue, since it is connected",
        "Stop at the boundary and ask the client for permission before going further",
        "Test it quietly and delete the logs",
        "Report it publicly",
      ],
      answer: 1,
      explain: "Scope is a hard limit. Extending it needs explicit authorization from someone who can give it.",
    },
    {
      q: "How should you handle real customer data encountered during a test?",
      options: [
        "Download all of it as proof",
        "Prove access with the minimum (for example one redacted record) and protect and delete what you touched",
        "Share it with the team chat",
        "Keep it for future work",
      ],
      answer: 1,
      explain: "Minimize harm: use the least access needed and keep everything confidential.",
    },
  ],
  "pentest-methodology": [
    {
      q: "What does a vulnerability assessment do that a penetration test goes beyond?",
      options: [
        "Nothing",
        "It discovers and ranks weaknesses, while a pentest also tries to exploit them to show real impact",
        "It is always manual",
        "It requires source code",
      ],
      answer: 1,
      explain: "Assessment answers what is exposed. A pentest answers what an attacker can actually do.",
    },
    {
      q: "Why keep timestamped notes and raw evidence during the test?",
      options: [
        "To fill the report with pages",
        "Reports are written from notes, and findings must be reproducible by someone who was not there",
        "Because tools require it",
        "To bill more hours",
      ],
      answer: 1,
      explain: "Memory is unreliable. Evidence makes findings credible and fixable.",
    },
    {
      q: "What does gray box testing mean?",
      options: [
        "No information at all",
        "Some knowledge, such as test accounts and documentation, is provided",
        "Full source code access only",
        "Testing at night",
      ],
      answer: 1,
      explain: "More knowledge finds more issues in the same time.",
    },
  ],
  "recon-and-attack-surface": [
    {
      q: "Why should defenders run asset discovery against their own domains?",
      options: [
        "To scare users",
        "To find forgotten or unowned assets before an attacker does",
        "To increase traffic",
        "To test competitors",
      ],
      answer: 1,
      explain: "Unknown assets are unpatched and unmonitored. Continuous discovery closes the gap.",
    },
    {
      q: "What is a subdomain takeover?",
      options: [
        "A DNS outage",
        "A DNS record that points to a deleted cloud resource which someone else can claim and serve from your domain",
        "A domain renewal",
        "A new TLD",
      ],
      answer: 1,
      explain: "Remove DNS records when you retire the resource they point to.",
    },
    {
      q: "In an authorized scan, what should you respect?",
      options: [
        "Nothing, scan as fast as possible",
        "The scope and the agreed request rate",
        "Only the time window",
        "Only the IP list",
      ],
      answer: 1,
      explain: "Aggressive scans can cause outages. Rate and scope come from the rules of engagement.",
    },
  ],
  "web-and-api-testing": [
    {
      q: "Why create two test accounts at the same privilege level?",
      options: [
        "To double the traffic",
        "To compare them and find authorization bugs where one user can reach the other's data",
        "Because the proxy requires it",
        "To test login speed",
      ],
      answer: 1,
      explain: "Authorization flaws show up as differences between accounts.",
    },
    {
      q: "What is mass assignment?",
      options: [
        "Bulk user creation",
        "An API binding client-supplied fields (such as role) onto an object, letting callers set what they should not",
        "A load test",
        "A caching mode",
      ],
      answer: 1,
      explain: "Test by sending fields the client never sends and checking whether they are honored.",
    },
    {
      q: "Which is the safest way to prove an access control bug?",
      options: [
        "Read and download many customers' records",
        "Read one test record belonging to your own second account",
        "Delete data to show impact",
        "Post the data in a public channel",
      ],
      answer: 1,
      explain: "Use your own test data so the proof does no harm and exposes nobody.",
    },
  ],
  "privilege-escalation-paths": [
    {
      q: "What is the defender's advantage regarding attack paths?",
      options: [
        "There is none",
        "They can map the paths with the same tools and cut the shortest ones first",
        "Paths do not exist in cloud",
        "Paths are always long",
      ],
      answer: 1,
      explain: "Attack-path analysis turns a hidden graph of permissions into a prioritized fix list.",
    },
    {
      q: "Why is iam:PassRole on all resources risky?",
      options: [
        "It slows deployments",
        "It can let a user run something as a more privileged role",
        "It disables logging",
        "It breaks billing",
      ],
      answer: 1,
      explain: "The right to pass a role can be the right to become it. Scope it to specific roles and services.",
    },
    {
      q: "What does tiered administration mean?",
      options: [
        "Admins work in tiers of salary",
        "Privileged accounts only log in to systems of the same tier, never to workstations or lower tiers",
        "Three admins per server",
        "Using three passwords",
      ],
      answer: 1,
      explain: "It stops a credential stolen from a low-trust machine from reaching the top.",
    },
  ],
  "social-engineering-and-phishing": [
    {
      q: "Which control best defeats credential-phishing pages?",
      options: [
        "A longer password",
        "Phishing-resistant MFA such as FIDO2 or passkeys, which only work on the real site",
        "Security training once a year",
        "Blocking all email",
      ],
      answer: 1,
      explain: "The credential is bound to the genuine domain, so a lookalike page gets nothing.",
    },
    {
      q: "Which phishing metric matters most for defense?",
      options: [
        "The click rate alone",
        "How many people report and how fast, since reporting turns users into detection",
        "The number of emails sent",
        "The simulation's design",
      ],
      answer: 1,
      explain: "A fast report lets the team contain the campaign before it spreads.",
    },
    {
      q: "What does a DMARC policy of reject do?",
      options: [
        "Encrypts email",
        "Tells receivers to reject messages that fail authentication for your domain",
        "Deletes your inbox",
        "Blocks outgoing mail",
      ],
      answer: 1,
      explain: "It prevents others from forging your domain in the From address.",
    },
  ],
  "red-team-and-adversary-emulation": [
    {
      q: "What is the main goal of a purple team exercise?",
      options: [
        "To win against the blue team",
        "To improve detection by running techniques openly and fixing gaps together",
        "To avoid reporting",
        "To test the printers",
      ],
      answer: 1,
      explain: "Collaboration shortens the loop between a technique and a working detection.",
    },
    {
      q: "Why have a deconfliction process in a red team exercise?",
      options: [
        "To make it harder",
        "So that a real incident is never mistaken for the exercise, and vice versa",
        "To speed up reporting",
        "Because tools need it",
      ],
      answer: 1,
      explain: "Defenders must be able to tell the exercise from a real attacker, and escalate real ones.",
    },
    {
      q: "How does a red team differ from a penetration test?",
      options: [
        "They are identical",
        "A red team pursues a goal covertly over a longer time, testing people, process and detection, not only technical weaknesses",
        "A red team only tests websites",
        "A red team has no rules",
      ],
      answer: 1,
      explain: "Red teaming asks whether the organization can detect and stop a realistic adversary.",
    },
  ],
  "reporting-and-remediation": [
    {
      q: "What should the executive summary of a report contain?",
      options: [
        "Tool output",
        "What was tested, the overall risk in plain language and the most important actions",
        "The full list of requests",
        "Only the severity counts",
      ],
      answer: 1,
      explain: "Decision makers need the risk and the priorities, in words they can act on.",
    },
    {
      q: "Why should a finding include reproducible steps?",
      options: [
        "To make the report longer",
        "So the client's engineers can confirm and fix it without guessing, and verify the fix later",
        "To show off tools",
        "Because CVSS requires it",
      ],
      answer: 1,
      explain: "Reproducibility makes fixes and retests possible.",
    },
    {
      q: "Why retest after fixes?",
      options: [
        "To bill again",
        "Fixes often only block the exact test case, so you must verify the underlying issue is closed",
        "Retesting is illegal",
        "To find new clients",
      ],
      answer: 1,
      explain: "A retest confirms that the root cause, not just the reported request, is fixed.",
    },
  ],
};
