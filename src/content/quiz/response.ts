import type { QuizBank } from "@/content/types";

export const responseQuiz: QuizBank = {
  "ir-lifecycle": [
    {
      "q": "Why agree on severity levels before an incident?",
      "options": [
        "To satisfy the auditors, who expect a severity scale to exist on paper",
        "So people do not argue about severity during the event, and paging and response follow automatically",
        "Because the ticketing tools will not open an incident without one",
        "To reduce the number of incidents by classifying them more strictly"
      ],
      "answer": 1,
      "explain": "Pre-agreed levels remove debate when time is short and make the response proportional."
    },
    {
      "q": "What is the incident commander's job?",
      "options": [
        "To perform the deepest technical analysis of the compromised systems",
        "To own the response and make decisions while others do the hands-on work",
        "To write the final incident report alone, so it reads in one voice",
        "To be the single voice that speaks to the press and the customers"
      ],
      "answer": 1,
      "explain": "Separating the roles keeps someone watching the whole picture."
    },
    {
      "q": "Why keep an out-of-band communication channel?",
      "options": [
        "It is faster than the main channel, so the first minutes are not wasted",
        "The main channel may be compromised or unavailable, and the attacker may be reading it",
        "Auditors require two separate channels for every critical process",
        "It saves money compared with paying for the company chat licences"
      ],
      "answer": 1,
      "explain": "Assume the attacker may be watching, and that your usual tools may be down."
    }
  ],
  "threat-intelligence": [
    {
      "q": "Which is more durable to defend against: indicators or techniques?",
      "options": [
        "Indicators such as file hashes and IP addresses, which an attacker rarely changes",
        "Techniques and behavior, because they are costly for an attacker to change",
        "Both are equally durable, since attackers reuse everything they build",
        "Neither: intelligence is too slow to help with real detections"
      ],
      "answer": 1,
      "explain": "The Pyramid of Pain: hashes and addresses change trivially, tactics and techniques do not."
    },
    {
      "q": "What should accompany a threat intelligence claim?",
      "options": [
        "A vendor logo and a screenshot that show where the claim came from",
        "A source, a freshness and a stated confidence level",
        "A long list of indicators of compromise, to show how thorough it is",
        "A confidential label, so that nobody outside the team questions it"
      ],
      "answer": 1,
      "explain": "Intelligence is judged by provenance, relevance and confidence, not volume."
    },
    {
      "q": "What do STIX and TAXII provide?",
      "options": [
        "A SIEM that collects and correlates events from many log sources",
        "A standard language for describing intelligence and a protocol for exchanging it",
        "An antivirus engine that scans files and flags known malware",
        "A cloud provider's managed service for storing indicators"
      ],
      "answer": 1,
      "explain": "STIX describes the objects, TAXII transports them between systems."
    }
  ],
  "threat-hunting": [
    {
      "q": "How does a hunt differ from reviewing alerts?",
      "options": [
        "It is the same thing, only done by a more senior analyst",
        "It starts from a hypothesis and proactively searches for activity that no alert flagged",
        "It only uses antivirus scans over a larger group of machines",
        "It is performed by customers who report suspicious behavior"
      ],
      "answer": 1,
      "explain": "Hunting assumes something may be inside already and looks for the evidence."
    },
    {
      "q": "What should happen to a hunt that confirms a technique is being used?",
      "options": [
        "It is forgotten, because the technique has already been seen once",
        "It becomes an incident, and the hunt is converted into an automated detection",
        "It is only filed in the wiki as a lesson for the next hunt",
        "It is repeated by hand every day to keep watching for it"
      ],
      "answer": 1,
      "explain": "Operationalize the finding so the next occurrence is caught automatically."
    },
    {
      "q": "A hunt finds nothing. Was it a waste?",
      "options": [
        "Yes, any hunt that finds no attacker is wasted effort",
        "No: a documented negative result, plus any data gaps found, is a valid and useful outcome",
        "Only if you repeat it the following week to be sure",
        "It proves that there are no attackers in the environment"
      ],
      "answer": 1,
      "explain": "Absence of evidence in available data is information, and missing data is itself a finding."
    }
  ],
  "log-and-timeline-analysis": [
    {
      "q": "What is the first step before comparing events from several sources?",
      "options": [
        "Sort every event alphabetically by the name of its source",
        "Normalize every timestamp to UTC and check clock skew",
        "Delete the duplicate events so that the logs are smaller",
        "Convert every log to CSV so that one tool can read them all"
      ],
      "answer": 1,
      "explain": "Time zones and skewed clocks are the most common source of a wrong timeline."
    },
    {
      "q": "What is pivoting?",
      "options": [
        "Moving an attacker from one account to another inside the network",
        "Taking a known fact and searching for everything else that shares it",
        "Encrypting the logs so that they cannot be altered afterwards",
        "Rotating the log files once they reach a size limit"
      ],
      "answer": 1,
      "explain": "Each pivot widens or narrows the scope: from an address to accounts, from an account to resources."
    },
    {
      "q": "Why does a gap in the logs matter?",
      "options": [
        "It does not, because missing logs have no value for the investigation",
        "It can be the attacker's cleanup, or a blind spot you need to fix",
        "It saves storage, so it should be treated as a normal event",
        "It means that no attack happened during that period"
      ],
      "answer": 1,
      "explain": "Missing data is a finding. Record it and improve your logging."
    }
  ],
  "triage-and-containment": [
    {
      "q": "Why isolate an infected host through EDR instead of powering it off?",
      "options": [
        "It is cheaper than the support contract that covers shutting hosts down",
        "Memory and running state are preserved for analysis, and the host stays reachable to your tools",
        "Powering off an infected machine is not allowed by most policies",
        "EDR agents are not able to power hosts off"
      ],
      "answer": 1,
      "explain": "Powering off destroys volatile evidence. Network isolation contains while preserving it."
    },
    {
      "q": "A leaked cloud access key is found. What should you do with the key itself?",
      "options": [
        "Delete it immediately and update the inventory so it is forgotten",
        "Deactivate it and keep it as evidence while you investigate what it did",
        "Share it in the team chat so everyone can test whether it still works",
        "Leave it active so that you can watch what the attacker does with it"
      ],
      "answer": 1,
      "explain": "Deactivation stops use while keeping the record you need for the investigation."
    },
    {
      "q": "Which is a common containment mistake?",
      "options": [
        "Defining the scope of the incident before taking any action",
        "Resetting a password but leaving active sessions, tokens and mailbox rules in place",
        "Recording every action with a timestamp and the person who did it",
        "Coordinating the actions into one window so they take effect together"
      ],
      "answer": 1,
      "explain": "Attackers keep access through sessions, tokens and rules, so revoke them all."
    }
  ],
  "ransomware-playbook": [
    {
      "q": "What should you protect as soon as a ransomware attack is suspected?",
      "options": [
        "The printers and shared devices, which spread the infection fastest",
        "The backups, before they are encrypted or wiped",
        "The public marketing site, since customers see it first",
        "The email signatures, so nobody can impersonate the company"
      ],
      "answer": 1,
      "explain": "Attackers target backups first. They are your path to recovery."
    },
    {
      "q": "Does paying a ransom guarantee recovery and deletion of stolen data?",
      "options": [
        "Yes, as long as the payment is made quickly and in full",
        "No: it guarantees neither, and it can carry legal exposure, so it is a decision for leadership and counsel",
        "Yes, if the criminal group is well known for keeping its word",
        "Yes, for small amounts, because those groups are less careful"
      ],
      "answer": 1,
      "explain": "Settle the policy in advance with legal advice, not under pressure."
    },
    {
      "q": "Before reconnecting restored systems you should:",
      "options": [
        "Restore everything at once so that the business is back as soon as possible",
        "Close the entry point and remove persistence, then monitor closely",
        "Skip the verification step to save time during the outage",
        "Disable the EDR agent so that it does not block the restored software"
      ],
      "answer": 1,
      "explain": "Otherwise the attacker simply encrypts you again."
    }
  ],
  "digital-forensics-basics": [
    {
      "q": "Which evidence should be collected first?",
      "options": [
        "The disk image, because it holds the longest history of the machine",
        "Volatile data such as memory and running processes",
        "The backups, because they may be overwritten first",
        "The paper documents found near the machine"
      ],
      "answer": 1,
      "explain": "The order of volatility puts the most fragile evidence first."
    },
    {
      "q": "Why hash an image at acquisition?",
      "options": [
        "To compress it so that it takes less room in the evidence store",
        "To prove later that the evidence has not changed",
        "To encrypt it so that nobody else can open it",
        "To speed up the analysis by indexing its contents"
      ],
      "answer": 1,
      "explain": "Matching hashes show integrity from collection through analysis."
    },
    {
      "q": "What does the chain of custody record?",
      "options": [
        "The layout of the file system found on the acquired image",
        "Who held the evidence, when, and what was done to it",
        "The name and the motive of the suspected attacker",
        "The cost of the investigation and of the tools used"
      ],
      "answer": 1,
      "explain": "It supports the credibility of the evidence if it is disputed."
    }
  ],
  "malware-analysis-basics": [
    {
      "q": "Where should a suspicious sample be analyzed?",
      "options": [
        "On your work laptop, using the standard antivirus to catch any damage",
        "In an isolated lab VM with snapshots and no connection to the corporate network",
        "On a production server, because it has the right software installed",
        "On a colleague's computer so the result can be compared quickly"
      ],
      "answer": 1,
      "explain": "Treat every sample as live and keep it away from real credentials and networks."
    },
    {
      "q": "What is the practical output of malware analysis?",
      "options": [
        "A report for management about the reputation of the attacker group",
        "Detections and remediation steps, such as indicators and YARA rules",
        "A new variant that can be used to test the company's defenses",
        "A legal complaint with the evidence for the authorities"
      ],
      "answer": 1,
      "explain": "The goal is to find, detect and remove it, not to admire it."
    },
    {
      "q": "Why do you read sandbox reports critically?",
      "options": [
        "They are always wrong because the malware changes what the sandbox shows",
        "Some samples detect sandboxes and stay quiet, so behavior may be incomplete",
        "They are written in code that analysts cannot read",
        "They cost too much to be used for every sample"
      ],
      "answer": 1,
      "explain": "Evasion is common. Combine sandbox output with static analysis."
    }
  ]
};
