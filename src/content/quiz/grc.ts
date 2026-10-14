import type { QuizBank } from "@/content/types";

export const grcQuiz: QuizBank = {
  "risk-management": [
    {
      "q": "A risk is formally accepted. What makes that a decision and not neglect?",
      "options": [
        "The security team records it in the register and closes the ticket",
        "A named executive owns it for a defined period, with a review date",
        "It is escalated to the next audit cycle and reviewed if time allows",
        "Legal approves the wording of the risk statement before it is archived"
      ],
      "answer": 1,
      "explain": "Accepting risk is the business's call. It must be explicit, owned and time-bound."
    },
    {
      "q": "What does residual risk mean?",
      "options": [
        "The risk that existed before any control was put in place",
        "The risk that remains after controls are applied",
        "The risk the business has chosen not to track in the register",
        "The risk created by legacy systems that cannot be patched"
      ],
      "answer": 1,
      "explain": "Comparing inherent and residual risk shows what the controls actually achieve."
    },
    {
      "q": "Which is NOT one of the four ways to treat a risk?",
      "options": [
        "Reduce it with a control",
        "Transfer it with insurance or a contract",
        "Ignore silently",
        "Avoid it by stopping the activity"
      ],
      "answer": 2,
      "explain": "The responses are reduce, accept (knowingly), transfer or avoid. Silent neglect is not a treatment."
    }
  ],
  "third-party-risk": [
    {
      "q": "How should the depth of a vendor review be decided?",
      "options": [
        "Every vendor gets the same full questionnaire, whatever it touches",
        "By criticality: data handled, access held and how hard the vendor is to replace",
        "By the vendor's size and brand recognition on the market",
        "By the price paid in the contract, so expensive vendors get more scrutiny"
      ],
      "answer": 1,
      "explain": "Tiering focuses effort where a failure would hurt most."
    },
    {
      "q": "Why include breach notification terms in a vendor contract?",
      "options": [
        "To give the procurement team leverage to lower the contract price",
        "So you learn about an incident in time to respond and meet your own obligations",
        "So the vendor's lawyers can review your incident process before signing",
        "Because the audit calendar requires every contract to include a security annex"
      ],
      "answer": 1,
      "explain": "Regulatory clocks often start when you become aware. The contract must make you aware quickly."
    },
    {
      "q": "What is concentration risk?",
      "options": [
        "Having more suppliers than the team can review in a year",
        "Dependence on one supplier or provider, so that its failure becomes yours",
        "Paying a supplier far more than the market rate for the same service",
        "Running a vendor's service on a different network design than your own"
      ],
      "answer": 1,
      "explain": "Plan exits and backups outside a critical single provider."
    }
  ],
  "security-frameworks": [
    {
      "q": "What is true of ISO/IEC 27001?",
      "options": [
        "It is a free checklist that any team can self-assess and publish",
        "It is a certifiable standard for an information security management system, audited by a third party",
        "It applies only to organizations that process card payments",
        "It is a regulation that every company in the sector must follow by law"
      ],
      "answer": 1,
      "explain": "It requires a risk-based management system and certification is granted by an external auditor."
    },
    {
      "q": "What is a sensible way to use several frameworks together?",
      "options": [
        "Run a separate program, team and evidence set for each framework",
        "Use one as the backbone and map the others to it, so one control satisfies many requirements",
        "Adopt whichever framework has the longest list of controls",
        "Avoid frameworks altogether and rely on the team's experience"
      ],
      "answer": 1,
      "explain": "Mapping avoids duplicate work, since most frameworks ask for the same ideas."
    },
    {
      "q": "Why is passing an audit not proof of security?",
      "options": [
        "Audits are not allowed to look at technical controls",
        "Audits sample the past within a defined scope and do not know your specific threats",
        "Auditors lack the skills to evaluate how the systems actually work",
        "Frameworks are confidential and auditors cannot read them before the audit"
      ],
      "answer": 1,
      "explain": "A framework sets a floor. Real security needs risk-based work beyond it."
    }
  ],
  "security-architecture": [
    {
      "q": "What does zero trust mean?",
      "options": [
        "Trusting nobody in the company, including the security team",
        "Granting no trust by network location: authenticate and authorize every request with identity, device and context",
        "Removing every firewall and relying only on the application",
        "Using only open source components so that nothing is hidden"
      ],
      "answer": 1,
      "explain": "Being on the internal network no longer implies being trusted."
    },
    {
      "q": "How does an architect scale security across many teams?",
      "options": [
        "Approve every change personally before it reaches production",
        "Provide reusable patterns and guardrails (landing zones, identity services, paved pipelines)",
        "Write long policies and expect each team to interpret them correctly",
        "Block deployments until each team passes a yearly training"
      ],
      "answer": 1,
      "explain": "Patterns let teams inherit controls instead of queueing for approval."
    },
    {
      "q": "Why record decisions in ADRs?",
      "options": [
        "Documenting decisions adds the paperwork that makes the team look mature",
        "The reasoning and trade-offs remain findable after the team changes",
        "Auditors require an ADR for every change in the system",
        "It replaces meetings, since nobody needs to discuss the decision again"
      ],
      "answer": 1,
      "explain": "Context is what is lost first. A short record preserves it."
    }
  ],
  "compliance-in-practice": [
    {
      "q": "What makes audits routine instead of painful?",
      "options": [
        "Hiring more auditors so each control is checked more often",
        "Controls with owners and evidence produced continuously and automatically",
        "Postponing the audit until the evidence is easier to collect",
        "Shrinking the scope until very few systems are covered"
      ],
      "answer": 1,
      "explain": "Evidence collected by panic in the last week signals controls that nobody operates all year."
    },
    {
      "q": "Who should own a control?",
      "options": [
        "The compliance team, for every control in the company",
        "The person accountable for the control working, usually in the team that operates it",
        "The external auditor, who verifies and operates it at the same time",
        "The most senior person present at the meeting where it was approved"
      ],
      "answer": 1,
      "explain": "Ownership by the operating team keeps controls alive between audits."
    },
    {
      "q": "You find a gap before the audit. What is the best approach?",
      "options": [
        "Keep it internal and fix it quietly, so the auditor never needs to see it",
        "Document it with an action plan and owner, and tell the auditor",
        "Remove the control from the list so that it no longer counts as a gap",
        "Move the audit to a later date until the gap has been closed"
      ],
      "answer": 1,
      "explain": "A known gap with a plan is far better than one the auditor discovers."
    }
  ],
  "security-metrics": [
    {
      "q": "Which is an outcome metric?",
      "options": [
        "Number of vulnerability scans run each month",
        "Time to contain high-severity incidents",
        "Number of phishing trainings sent to employees",
        "Number of firewall rules in production"
      ],
      "answer": 1,
      "explain": "Outcome metrics show results. Activity metrics show effort."
    },
    {
      "q": "How should a board report open?",
      "options": [
        "With a detailed list of technical counts and tool statistics",
        "With the answer: are we getting safer, and what do you need from the board",
        "With the full history of the program since it started",
        "With a catalogue of the tools that were bought this year"
      ],
      "answer": 1,
      "explain": "Leaders need the conclusion and the decision required, in business terms."
    },
    {
      "q": "What goes wrong when a metric becomes an individual target?",
      "options": [
        "Nothing: a number that is tracked closely always keeps improving as intended",
        "People optimize the number instead of the risk (gaming)",
        "The dashboard becomes slower and harder to read",
        "External audits become cheaper because the numbers look better"
      ],
      "answer": 1,
      "explain": "Use metrics to find system bottlenecks, not to rank people."
    }
  ],
  "security-strategy-and-budget": [
    {
      "q": "Where should a security strategy begin?",
      "options": [
        "With the newest tools that competitors and analysts are talking about",
        "With the business goals, crown jewels, obligations and risk appetite",
        "With the audit calendar and the evidence each audit will ask for",
        "With the budget the finance team has already approved"
      ],
      "answer": 1,
      "explain": "Security exists to let the business take risks safely, so it starts from what the business needs to protect."
    },
    {
      "q": "Why should a roadmap state what is accepted for now?",
      "options": [
        "To show humility and make the plan look more realistic to the board",
        "Priorities are choices, and unaddressed risks should be explicit, owned and reviewed",
        "A regulation requires every roadmap to list its omissions",
        "To make the roadmap shorter and easier to present"
      ],
      "answer": 1,
      "explain": "A strategy is as much about what you do not do as what you do."
    },
    {
      "q": "Which spending often gives the best return in a small team?",
      "options": [
        "Another tool that overlaps with the ones the team already runs",
        "Foundations and people: inventory, identity, logging, backups, training and retention",
        "A bigger brand for the security team and its awareness campaigns",
        "More dashboards that summarize the same data in new ways"
      ],
      "answer": 1,
      "explain": "Unused tools protect nobody. Foundations and skilled people reduce risk across the board."
    }
  ],
  "crisis-communication-and-culture": [
    {
      "q": "What should an external incident message say about what you do not yet know?",
      "options": [
        "Leave unknowns out and publish only what is already confirmed",
        "State clearly what is not yet known and when you will update",
        "Offer an educated guess to reassure customers and the press",
        "Deny the incident until the investigation is complete"
      ],
      "answer": 1,
      "explain": "Honesty about uncertainty, with a promised update time, builds trust. Guessing damages it."
    },
    {
      "q": "Why does blameless reporting matter?",
      "options": [
        "It lets the organization avoid accountability for the errors that were made",
        "People report mistakes quickly when they are not punished, and early reports limit damage",
        "It is required by data protection laws in most countries",
        "It reduces the cost of training for new employees"
      ],
      "answer": 1,
      "explain": "The first report is often what saves the day. Fear makes people hide problems."
    },
    {
      "q": "When should you learn your regulatory notification deadlines?",
      "options": [
        "When an incident is already underway and the lawyers are on the call",
        "Before an incident, so decisions are not improvised under pressure",
        "After the investigation has finished and the facts are known",
        "When a regulator sends a formal request for information"
      ],
      "answer": 1,
      "explain": "Deadlines can be short. Know them and rehearse the decision in advance."
    }
  ]
};
