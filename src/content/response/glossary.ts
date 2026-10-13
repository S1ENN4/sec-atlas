import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "process",
    title: "process and roles",
    entries: [
      {
        term: "Incident commander",
        aka: "IC",
        meaning: "The person who owns the response and makes decisions, while others do the hands-on work. Keeping these roles apart prevents the leader from disappearing into the technical details.",
        topic: "ir-lifecycle",
      },
      {
        term: "Severity",
        aka: "SEV level",
        meaning: "An agreed scale for how serious an incident is, decided in advance so that people do not argue about it during the event. It sets who is paged and how fast.",
        topic: "ir-lifecycle",
      },
      {
        term: "Tabletop exercise",
        meaning: "A discussion-based rehearsal of an incident scenario. It tests the plan, the contacts and the decisions without touching production.",
        topic: "ir-lifecycle",
      },
      {
        term: "Containment",
        meaning: "Limiting an incident's spread and damage: isolate a host, revoke credentials, block a destination. Short-term containment buys time; long-term containment prepares a clean recovery.",
        topic: "triage-and-containment",
      },
      {
        term: "Triage",
        meaning: "The first assessment of an alert: is it real, how far has it gone, and how urgent is it.",
        topic: "triage-and-containment",
      },
    ],
  },
  {
    id: "detection-and-intel",
    title: "detection and intelligence",
    entries: [
      {
        term: "Threat hunting",
        meaning: "A proactive search of telemetry for attacker activity that automated detections missed, driven by a testable hypothesis.",
        topic: "threat-hunting",
      },
      {
        term: "IOC",
        aka: "indicator of compromise",
        meaning: "An observable that suggests compromise, such as a file hash, a domain or an address. Quick to use and quick to expire, since attackers change them easily.",
        topic: "threat-intelligence",
      },
      {
        term: "TTP",
        aka: "tactics, techniques and procedures",
        meaning: "How an adversary operates. Behavior is much harder for them to change than an indicator, so it is a more durable basis for detection.",
        topic: "threat-intelligence",
      },
      {
        term: "MITRE ATT&CK",
        meaning: "A public knowledge base of adversary tactics and techniques observed in real intrusions, used to describe behavior and measure detection coverage.",
        topic: "threat-intelligence",
      },
      {
        term: "Pyramid of Pain",
        meaning: "A model that ranks indicators by how much blocking them hurts an attacker, from trivial (hash values) to painful (tactics and techniques).",
        topic: "threat-intelligence",
      },
      {
        term: "Sigma",
        meaning: "A vendor-neutral format for detection rules that can be converted to the query language of many SIEM products.",
        topic: "log-and-timeline-analysis",
      },
      {
        term: "Pivoting",
        meaning: "Taking one known fact (an address, an account, a hash) and searching for everything else that shares it, to widen or narrow the scope.",
        topic: "log-and-timeline-analysis",
      },
    ],
  },
  {
    id: "forensics",
    title: "forensics and malware",
    entries: [
      {
        term: "Chain of custody",
        meaning: "A written record of who held a piece of evidence, when and what was done with it. It supports the credibility of evidence in a dispute.",
        topic: "digital-forensics-basics",
      },
      {
        term: "Order of volatility",
        meaning: "The principle of collecting the most fragile evidence first: memory, then processes and connections, then temporary files, then disk and logs.",
        topic: "digital-forensics-basics",
      },
      {
        term: "Write blocker",
        meaning: "A device or software that lets you read a disk without allowing any change to it, so the evidence stays intact.",
        topic: "digital-forensics-basics",
      },
      {
        term: "YARA",
        meaning: "A language for describing the patterns that identify a family of files, used to find malware samples and variants.",
        topic: "malware-analysis-basics",
      },
      {
        term: "Sandbox",
        meaning: "An isolated environment where a suspicious file can run under monitoring so its behavior can be observed safely.",
        topic: "malware-analysis-basics",
      },
      {
        term: "Double extortion",
        meaning: "A ransomware tactic that both encrypts systems and steals data, threatening to publish it, so that restoring from backup does not end the pressure.",
        topic: "ransomware-playbook",
      },
    ],
  },
];
