import type { QuizBank } from "@/content/types";

export const offsecQuiz: QuizBank = {
  "engagement-scoping-and-ethics": [
    {
      "q": "What separates a penetration test from an attack?",
      "options": [
        "The tools used, since pentesters rely on tools that attackers do not use",
        "Written authorization, an agreed scope and a duty to minimize harm",
        "The time of day, because tests are only allowed outside business hours",
        "The operating system, since attackers rarely work from a standard one"
      ],
      "answer": 1,
      "explain": "The techniques overlap. Permission and boundaries define what is legitimate."
    },
    {
      "q": "During a test you discover a path that leads to a system outside the scope. What do you do?",
      "options": [
        "Continue, since the system is connected and the client would want to know",
        "Stop at the boundary and ask the client for permission before going further",
        "Test it quietly and delete the logs so the client is not alarmed",
        "Report it publicly so that other organizations can protect themselves"
      ],
      "answer": 1,
      "explain": "Scope is a hard limit. Extending it needs explicit authorization from someone who can give it."
    },
    {
      "q": "How should you handle real customer data encountered during a test?",
      "options": [
        "Download all of it as proof, so the client sees the full impact",
        "Prove access with the minimum (for example one redacted record) and protect and delete what you touched",
        "Share it in the team chat so a colleague can double-check the finding",
        "Keep a copy for future work, since the client may ask again"
      ],
      "answer": 1,
      "explain": "Minimize harm: use the least access needed and keep everything confidential."
    }
  ],
  "pentest-methodology": [
    {
      "q": "What does a vulnerability assessment do that a penetration test goes beyond?",
      "options": [
        "Nothing: a vulnerability assessment already exploits every weakness it finds",
        "It discovers and ranks weaknesses, while a pentest also tries to exploit them to show real impact",
        "It is always done manually by senior testers, unlike a pentest",
        "It requires access to the source code, which a pentest does not"
      ],
      "answer": 1,
      "explain": "Assessment answers what is exposed. A pentest answers what an attacker can actually do."
    },
    {
      "q": "Why keep timestamped notes and raw evidence during the test?",
      "options": [
        "To make the report longer and more convincing for the client",
        "Reports are written from notes, and findings must be reproducible by someone who was not there",
        "Because the testing tools refuse to run without a notes folder",
        "To justify more billable hours at the end of the project"
      ],
      "answer": 1,
      "explain": "Memory is unreliable. Evidence makes findings credible and fixable."
    },
    {
      "q": "What does gray box testing mean?",
      "options": [
        "The tester is given no information at all about the target",
        "Some knowledge, such as test accounts and documentation, is provided",
        "The tester is given the full source code and nothing else",
        "The test is limited to the night hours when traffic is lower"
      ],
      "answer": 1,
      "explain": "More knowledge finds more issues in the same time."
    }
  ],
  "recon-and-attack-surface": [
    {
      "q": "Why should defenders run asset discovery against their own domains?",
      "options": [
        "To scare users into reporting suspicious sites more often",
        "To find forgotten or unowned assets before an attacker does",
        "To increase traffic and measure how the infrastructure reacts to load",
        "To test competitors' systems and compare their exposure with yours"
      ],
      "answer": 1,
      "explain": "Unknown assets are unpatched and unmonitored. Continuous discovery closes the gap."
    },
    {
      "q": "What is a subdomain takeover?",
      "options": [
        "A DNS outage that makes a company's services unreachable for a few hours",
        "A DNS record that points to a deleted cloud resource which someone else can claim and serve from your domain",
        "A scheduled domain renewal that moves the domain to another registrar",
        "The launch of a new top-level domain that overlaps with your own"
      ],
      "answer": 1,
      "explain": "Remove DNS records when you retire the resource they point to."
    },
    {
      "q": "In an authorized scan, what should you respect?",
      "options": [
        "Nothing: scan as fast as possible to finish before the window closes",
        "The scope and the agreed request rate",
        "Only the time window, since the scope is a suggestion",
        "Only the list of IP addresses, whatever the request rate"
      ],
      "answer": 1,
      "explain": "Aggressive scans can cause outages. Rate and scope come from the rules of engagement."
    }
  ],
  "web-and-api-testing": [
    {
      "q": "Why create two test accounts at the same privilege level?",
      "options": [
        "To double the traffic and see how the application behaves under load",
        "To compare them and find authorization bugs where one user can reach the other's data",
        "Because the proxy tool requires two sessions to record a flow",
        "To measure how fast the login works for different accounts"
      ],
      "answer": 1,
      "explain": "Authorization flaws show up as differences between accounts."
    },
    {
      "q": "What is mass assignment?",
      "options": [
        "Creating many user accounts in bulk to prepare a load test",
        "An API binding client-supplied fields (such as role) onto an object, letting callers set what they should not",
        "A load test that sends many parallel requests to an endpoint",
        "A caching mode that stores several responses under one key"
      ],
      "answer": 1,
      "explain": "Test by sending fields the client never sends and checking whether they are honored."
    },
    {
      "q": "Which is the safest way to prove an access control bug?",
      "options": [
        "Read and download many customers' records to show how wide the problem is",
        "Read one test record belonging to your own second account",
        "Delete data from the application to show the real impact",
        "Post the data in a public channel so the client reacts quickly"
      ],
      "answer": 1,
      "explain": "Use your own test data so the proof does no harm and exposes nobody."
    }
  ],
  "privilege-escalation-paths": [
    {
      "q": "What is the defender's advantage regarding attack paths?",
      "options": [
        "There is none: attackers always know the environment better than defenders",
        "They can map the paths with the same tools and cut the shortest ones first",
        "Attack paths do not exist in cloud environments, only on premises",
        "Paths are always long, so defenders have plenty of time to react"
      ],
      "answer": 1,
      "explain": "Attack-path analysis turns a hidden graph of permissions into a prioritized fix list."
    },
    {
      "q": "Why is iam:PassRole on all resources risky?",
      "options": [
        "It slows deployments because every role must be checked on each release",
        "It can let a user run something as a more privileged role",
        "It disables logging for the services that use the role",
        "It breaks billing by letting any workload create paid resources"
      ],
      "answer": 1,
      "explain": "The right to pass a role can be the right to become it. Scope it to specific roles and services."
    },
    {
      "q": "What does tiered administration mean?",
      "options": [
        "Administrators are grouped in tiers according to their salary",
        "Privileged accounts only log in to systems of the same tier, never to workstations or lower tiers",
        "Each server must have three administrators, one per tier",
        "Privileged users must keep three different passwords, one per tier"
      ],
      "answer": 1,
      "explain": "It stops a credential stolen from a low-trust machine from reaching the top."
    }
  ],
  "social-engineering-and-phishing": [
    {
      "q": "Which control best defeats credential-phishing pages?",
      "options": [
        "A longer and more complex password, changed every few months",
        "Phishing-resistant MFA such as FIDO2 or passkeys, which only work on the real site",
        "Security awareness training once a year for every employee",
        "Blocking all email from outside the company"
      ],
      "answer": 1,
      "explain": "The credential is bound to the genuine domain, so a lookalike page gets nothing."
    },
    {
      "q": "Which phishing metric matters most for defense?",
      "options": [
        "The click rate alone, since fewer clicks always means a safer company",
        "How many people report and how fast, since reporting turns users into detection",
        "The number of simulated emails sent during the quarter",
        "The design and realism of the phishing simulation"
      ],
      "answer": 1,
      "explain": "A fast report lets the team contain the campaign before it spreads."
    },
    {
      "q": "What does a DMARC policy of reject do?",
      "options": [
        "It encrypts the email so that only the recipient can read it",
        "Tells receivers to reject messages that fail authentication for your domain",
        "It deletes the mailbox of any account that sends spam",
        "It blocks all outgoing mail from the domain until it is verified"
      ],
      "answer": 1,
      "explain": "It prevents others from forging your domain in the From address."
    }
  ],
  "red-team-and-adversary-emulation": [
    {
      "q": "What is the main goal of a purple team exercise?",
      "options": [
        "To win against the blue team and show how weak its detection is",
        "To improve detection by running techniques openly and fixing gaps together",
        "To avoid writing a report, since the techniques are discussed live",
        "To test the physical devices, such as printers and badge readers"
      ],
      "answer": 1,
      "explain": "Collaboration shortens the loop between a technique and a working detection."
    },
    {
      "q": "Why have a deconfliction process in a red team exercise?",
      "options": [
        "To make the exercise harder by adding another team that must be avoided",
        "So that a real incident is never mistaken for the exercise, and vice versa",
        "To speed up reporting by sharing findings during the exercise",
        "Because the attack tools require a coordinator to run"
      ],
      "answer": 1,
      "explain": "Defenders must be able to tell the exercise from a real attacker, and escalate real ones."
    },
    {
      "q": "How does a red team differ from a penetration test?",
      "options": [
        "They are identical, only the name changes depending on the company",
        "A red team pursues a goal covertly over a longer time, testing people, process and detection, not only technical weaknesses",
        "A red team only tests web applications, unlike a pentest",
        "A red team operates without rules, which a pentest must follow"
      ],
      "answer": 1,
      "explain": "Red teaming asks whether the organization can detect and stop a realistic adversary."
    }
  ],
  "reporting-and-remediation": [
    {
      "q": "What should the executive summary of a report contain?",
      "options": [
        "Raw tool output, so engineers can find every detail quickly",
        "What was tested, the overall risk in plain language and the most important actions",
        "The full list of requests and responses captured during the test",
        "Only the counts of findings by severity"
      ],
      "answer": 1,
      "explain": "Decision makers need the risk and the priorities, in words they can act on."
    },
    {
      "q": "Why should a finding include reproducible steps?",
      "options": [
        "To make the report longer and show how much work was done",
        "So the client's engineers can confirm and fix it without guessing, and verify the fix later",
        "To show off the tools and techniques the tester used",
        "Because the scoring standard requires steps for every score"
      ],
      "answer": 1,
      "explain": "Reproducibility makes fixes and retests possible."
    },
    {
      "q": "Why retest after fixes?",
      "options": [
        "To bill the client again for work that was already covered",
        "Fixes often only block the exact test case, so you must verify the underlying issue is closed",
        "Retesting is not allowed once the engagement has been closed",
        "To find new clients among the teams that did the fixes"
      ],
      "answer": 1,
      "explain": "A retest confirms that the root cause, not just the reported request, is fixed."
    }
  ]
};
