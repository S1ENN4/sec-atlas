import type { QuizBank } from "@/content/types";

export const grcQuiz: QuizBank = {
  "risk-management": [
    {
      q: "A risk is formally accepted. What makes that a decision and not neglect?",
      options: [
        "Nobody mentions it",
        "A named executive owns it for a defined period, with a review date",
        "It is removed from the register",
        "The security team signs it",
      ],
      answer: 1,
      explain: "Accepting risk is the business's call. It must be explicit, owned and time-bound.",
    },
    {
      q: "What does residual risk mean?",
      options: [
        "Risk before any controls",
        "The risk that remains after controls are applied",
        "Risk from old systems",
        "Insurance cost",
      ],
      answer: 1,
      explain: "Comparing inherent and residual risk shows what the controls actually achieve.",
    },
    {
      q: "Which is NOT one of the four ways to treat a risk?",
      options: ["Reduce", "Transfer", "Ignore silently", "Avoid"],
      answer: 2,
      explain: "The responses are reduce, accept (knowingly), transfer or avoid. Silent neglect is not a treatment.",
    },
  ],
  "third-party-risk": [
    {
      q: "How should the depth of a vendor review be decided?",
      options: [
        "Every vendor gets the same full review",
        "By criticality: data handled, access held and how hard the vendor is to replace",
        "By the vendor's size",
        "By price",
      ],
      answer: 1,
      explain: "Tiering focuses effort where a failure would hurt most.",
    },
    {
      q: "Why include breach notification terms in a vendor contract?",
      options: [
        "To lower the price",
        "So you learn about an incident in time to respond and meet your own obligations",
        "Because auditors like contracts",
        "To avoid the vendor's patches",
      ],
      answer: 1,
      explain: "Regulatory clocks often start when you become aware. The contract must make you aware quickly.",
    },
    {
      q: "What is concentration risk?",
      options: [
        "Too many vendors",
        "Dependence on one supplier or provider, so that its failure becomes yours",
        "A high price",
        "A network design",
      ],
      answer: 1,
      explain: "Plan exits and backups outside a critical single provider.",
    },
  ],
  "security-frameworks": [
    {
      q: "What is true of ISO/IEC 27001?",
      options: [
        "It is a free checklist",
        "It is a certifiable standard for an information security management system, audited by a third party",
        "It applies only to payments",
        "It is a law",
      ],
      answer: 1,
      explain: "It requires a risk-based management system and certification is granted by an external auditor.",
    },
    {
      q: "What is a sensible way to use several frameworks together?",
      options: [
        "Run a separate program for each",
        "Use one as the backbone and map the others to it, so one control satisfies many requirements",
        "Pick the longest one",
        "Avoid all of them",
      ],
      answer: 1,
      explain: "Mapping avoids duplicate work, since most frameworks ask for the same ideas.",
    },
    {
      q: "Why is passing an audit not proof of security?",
      options: [
        "Audits are illegal",
        "Audits sample the past within a defined scope and do not know your specific threats",
        "Auditors are not skilled",
        "Frameworks are secret",
      ],
      answer: 1,
      explain: "A framework sets a floor. Real security needs risk-based work beyond it.",
    },
  ],
  "security-architecture": [
    {
      q: "What does zero trust mean?",
      options: [
        "Trusting nobody in the company",
        "Granting no trust by network location: authenticate and authorize every request with identity, device and context",
        "Removing all firewalls",
        "Using only open source",
      ],
      answer: 1,
      explain: "Being on the internal network no longer implies being trusted.",
    },
    {
      q: "How does an architect scale security across many teams?",
      options: [
        "Approve every change personally",
        "Provide reusable patterns and guardrails (landing zones, identity services, paved pipelines)",
        "Write long policies",
        "Block deployments",
      ],
      answer: 1,
      explain: "Patterns let teams inherit controls instead of queueing for approval.",
    },
    {
      q: "Why record decisions in ADRs?",
      options: [
        "To increase paperwork",
        "The reasoning and trade-offs remain findable after the team changes",
        "Auditors require ADRs",
        "To avoid meetings",
      ],
      answer: 1,
      explain: "Context is what is lost first. A short record preserves it.",
    },
  ],
  "compliance-in-practice": [
    {
      q: "What makes audits routine instead of painful?",
      options: [
        "Hiring more auditors",
        "Controls with owners and evidence produced continuously and automatically",
        "Postponing the audit",
        "Reducing the scope to nothing",
      ],
      answer: 1,
      explain: "Evidence collected by panic in the last week signals controls that nobody operates all year.",
    },
    {
      q: "Who should own a control?",
      options: [
        "The compliance team always",
        "The person accountable for the control working, usually in the team that operates it",
        "The auditor",
        "Nobody",
      ],
      answer: 1,
      explain: "Ownership by the operating team keeps controls alive between audits.",
    },
    {
      q: "You find a gap before the audit. What is the best approach?",
      options: [
        "Hide it",
        "Document it with an action plan and owner, and tell the auditor",
        "Delete the control",
        "Change the audit date",
      ],
      answer: 1,
      explain: "A known gap with a plan is far better than one the auditor discovers.",
    },
  ],
  "security-metrics": [
    {
      q: "Which is an outcome metric?",
      options: [
        "Number of scans run",
        "Time to contain high-severity incidents",
        "Number of trainings sent",
        "Number of firewall rules",
      ],
      answer: 1,
      explain: "Outcome metrics show results. Activity metrics show effort.",
    },
    {
      q: "How should a board report open?",
      options: [
        "With technical counts",
        "With the answer: are we getting safer, and what do you need from the board",
        "With a list of tools",
        "With a long history",
      ],
      answer: 1,
      explain: "Leaders need the conclusion and the decision required, in business terms.",
    },
    {
      q: "What goes wrong when a metric becomes an individual target?",
      options: [
        "Nothing",
        "People optimize the number instead of the risk (gaming)",
        "The dashboard breaks",
        "Audits get cheaper",
      ],
      answer: 1,
      explain: "Use metrics to find system bottlenecks, not to rank people.",
    },
  ],
  "security-strategy-and-budget": [
    {
      q: "Where should a security strategy begin?",
      options: [
        "With the newest tools",
        "With the business goals, crown jewels, obligations and risk appetite",
        "With the audit calendar",
        "With the budget",
      ],
      answer: 1,
      explain: "Security exists to let the business take risks safely, so it starts from what the business needs to protect.",
    },
    {
      q: "Why should a roadmap state what is accepted for now?",
      options: [
        "To look humble",
        "Priorities are choices, and unaddressed risks should be explicit, owned and reviewed",
        "It is a legal rule",
        "To shorten the roadmap",
      ],
      answer: 1,
      explain: "A strategy is as much about what you do not do as what you do.",
    },
    {
      q: "Which spending often gives the best return in a small team?",
      options: [
        "Another overlapping tool",
        "Foundations and people: inventory, identity, logging, backups, training and retention",
        "A larger logo",
        "More dashboards",
      ],
      answer: 1,
      explain: "Unused tools protect nobody. Foundations and skilled people reduce risk across the board.",
    },
  ],
  "crisis-communication-and-culture": [
    {
      q: "What should an external incident message say about what you do not yet know?",
      options: [
        "Nothing",
        "State clearly what is not yet known and when you will update",
        "Guess to reassure",
        "Deny the incident",
      ],
      answer: 1,
      explain: "Honesty about uncertainty, with a promised update time, builds trust. Guessing damages it.",
    },
    {
      q: "Why does blameless reporting matter?",
      options: [
        "It avoids accountability",
        "People report mistakes quickly when they are not punished, and early reports limit damage",
        "It is required by law",
        "It reduces training costs",
      ],
      answer: 1,
      explain: "The first report is often what saves the day. Fear makes people hide problems.",
    },
    {
      q: "When should you learn your regulatory notification deadlines?",
      options: [
        "When an incident occurs",
        "Before an incident, so decisions are not improvised under pressure",
        "After the investigation",
        "Never",
      ],
      answer: 1,
      explain: "Deadlines can be short. Know them and rehearse the decision in advance.",
    },
  ],
};
