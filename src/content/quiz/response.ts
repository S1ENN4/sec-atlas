import type { QuizBank } from "@/content/types";

export const responseQuiz: QuizBank = {
  "ir-lifecycle": [
    {
      q: "Why agree on severity levels before an incident?",
      options: [
        "To impress auditors",
        "So people do not argue about severity during the event, and paging and response follow automatically",
        "Because tools require it",
        "To reduce the number of incidents",
      ],
      answer: 1,
      explain: "Pre-agreed levels remove debate when time is short and make the response proportional.",
    },
    {
      q: "What is the incident commander's job?",
      options: [
        "To do the deepest technical analysis",
        "To own the response and make decisions while others do the hands-on work",
        "To write the final report alone",
        "To talk to the press",
      ],
      answer: 1,
      explain: "Separating the roles keeps someone watching the whole picture.",
    },
    {
      q: "Why keep an out-of-band communication channel?",
      options: [
        "It is faster",
        "The main channel may be compromised or unavailable, and the attacker may be reading it",
        "Auditors require two channels",
        "It saves money",
      ],
      answer: 1,
      explain: "Assume the attacker may be watching, and that your usual tools may be down.",
    },
  ],
  "threat-intelligence": [
    {
      q: "Which is more durable to defend against: indicators or techniques?",
      options: [
        "Indicators such as hashes",
        "Techniques and behavior, because they are costly for an attacker to change",
        "Both are equally durable",
        "Neither is useful",
      ],
      answer: 1,
      explain: "The Pyramid of Pain: hashes and addresses change trivially, tactics and techniques do not.",
    },
    {
      q: "What should accompany a threat intelligence claim?",
      options: [
        "Nothing",
        "A source, a freshness and a stated confidence level",
        "A vendor logo",
        "A long list of IOCs",
      ],
      answer: 1,
      explain: "Intelligence is judged by provenance, relevance and confidence, not volume.",
    },
    {
      q: "What do STIX and TAXII provide?",
      options: [
        "A SIEM",
        "A standard language for describing intelligence and a protocol for exchanging it",
        "An antivirus engine",
        "A cloud provider",
      ],
      answer: 1,
      explain: "STIX describes the objects, TAXII transports them between systems.",
    },
  ],
  "threat-hunting": [
    {
      q: "How does a hunt differ from reviewing alerts?",
      options: [
        "It is the same thing",
        "It starts from a hypothesis and proactively searches for activity that no alert flagged",
        "It only uses antivirus",
        "It is done by customers",
      ],
      answer: 1,
      explain: "Hunting assumes something may be inside already and looks for the evidence.",
    },
    {
      q: "What should happen to a hunt that confirms a technique is being used?",
      options: [
        "Forget it",
        "It becomes an incident, and the hunt is converted into an automated detection",
        "It is only filed in a wiki",
        "It is repeated every day by hand",
      ],
      answer: 1,
      explain: "Operationalize the finding so the next occurrence is caught automatically.",
    },
    {
      q: "A hunt finds nothing. Was it a waste?",
      options: [
        "Yes",
        "No: a documented negative result, plus any data gaps found, is a valid and useful outcome",
        "Only if you repeat it",
        "It proves there are no attackers",
      ],
      answer: 1,
      explain: "Absence of evidence in available data is information, and missing data is itself a finding.",
    },
  ],
  "log-and-timeline-analysis": [
    {
      q: "What is the first step before comparing events from several sources?",
      options: [
        "Sort alphabetically",
        "Normalize every timestamp to UTC and check clock skew",
        "Delete duplicates",
        "Convert to CSV",
      ],
      answer: 1,
      explain: "Time zones and skewed clocks are the most common source of a wrong timeline.",
    },
    {
      q: "What is pivoting?",
      options: [
        "Changing jobs",
        "Taking a known fact and searching for everything else that shares it",
        "Encrypting logs",
        "Rotating log files",
      ],
      answer: 1,
      explain: "Each pivot widens or narrows the scope: from an address to accounts, from an account to resources.",
    },
    {
      q: "Why does a gap in the logs matter?",
      options: [
        "It does not",
        "It can be the attacker's cleanup, or a blind spot you need to fix",
        "It saves storage",
        "It means no attack happened",
      ],
      answer: 1,
      explain: "Missing data is a finding. Record it and improve your logging.",
    },
  ],
  "triage-and-containment": [
    {
      q: "Why isolate an infected host through EDR instead of powering it off?",
      options: [
        "It is cheaper",
        "Memory and running state are preserved for analysis, and the host stays reachable to your tools",
        "Power off is illegal",
        "EDR cannot power off hosts",
      ],
      answer: 1,
      explain: "Powering off destroys volatile evidence. Network isolation contains while preserving it.",
    },
    {
      q: "A leaked cloud access key is found. What should you do with the key itself?",
      options: [
        "Delete it immediately and forget it",
        "Deactivate it and keep it as evidence while you investigate what it did",
        "Post it in the team chat",
        "Leave it active to watch the attacker",
      ],
      answer: 1,
      explain: "Deactivation stops use while keeping the record you need for the investigation.",
    },
    {
      q: "Which is a common containment mistake?",
      options: [
        "Scoping before acting",
        "Resetting a password but leaving active sessions, tokens and mailbox rules in place",
        "Recording actions with timestamps",
        "Coordinating the actions into one window",
      ],
      answer: 1,
      explain: "Attackers keep access through sessions, tokens and rules, so revoke them all.",
    },
  ],
  "ransomware-playbook": [
    {
      q: "What should you protect as soon as a ransomware attack is suspected?",
      options: [
        "The printers",
        "The backups, before they are encrypted or wiped",
        "The marketing site",
        "The email signature",
      ],
      answer: 1,
      explain: "Attackers target backups first. They are your path to recovery.",
    },
    {
      q: "Does paying a ransom guarantee recovery and deletion of stolen data?",
      options: [
        "Yes",
        "No: it guarantees neither, and it can carry legal exposure, so it is a decision for leadership and counsel",
        "Yes, if the criminals are famous",
        "Yes, for small amounts",
      ],
      answer: 1,
      explain: "Settle the policy in advance with legal advice, not under pressure.",
    },
    {
      q: "Before reconnecting restored systems you should:",
      options: [
        "Restore everything at once",
        "Close the entry point and remove persistence, then monitor closely",
        "Skip verification",
        "Disable EDR",
      ],
      answer: 1,
      explain: "Otherwise the attacker simply encrypts you again.",
    },
  ],
  "digital-forensics-basics": [
    {
      q: "Which evidence should be collected first?",
      options: [
        "The disk image",
        "Volatile data such as memory and running processes",
        "Backups",
        "The paper documents",
      ],
      answer: 1,
      explain: "The order of volatility puts the most fragile evidence first.",
    },
    {
      q: "Why hash an image at acquisition?",
      options: [
        "To compress it",
        "To prove later that the evidence has not changed",
        "To encrypt it",
        "To speed up analysis",
      ],
      answer: 1,
      explain: "Matching hashes show integrity from collection through analysis.",
    },
    {
      q: "What does the chain of custody record?",
      options: [
        "The file system layout",
        "Who held the evidence, when, and what was done to it",
        "The attacker's name",
        "The cost of the investigation",
      ],
      answer: 1,
      explain: "It supports the credibility of the evidence if it is disputed.",
    },
  ],
  "malware-analysis-basics": [
    {
      q: "Where should a suspicious sample be analyzed?",
      options: [
        "On your work laptop",
        "In an isolated lab VM with snapshots and no connection to the corporate network",
        "On a production server",
        "On a colleague's computer",
      ],
      answer: 1,
      explain: "Treat every sample as live and keep it away from real credentials and networks.",
    },
    {
      q: "What is the practical output of malware analysis?",
      options: [
        "A poster",
        "Detections and remediation steps, such as indicators and YARA rules",
        "A new malware family",
        "A fine for the attacker",
      ],
      answer: 1,
      explain: "The goal is to find, detect and remove it, not to admire it.",
    },
    {
      q: "Why do you read sandbox reports critically?",
      options: [
        "They are always wrong",
        "Some samples detect sandboxes and stay quiet, so behavior may be incomplete",
        "They are written in code",
        "They cost money",
      ],
      answer: 1,
      explain: "Evasion is common. Combine sandbox output with static analysis.",
    },
  ],
};
