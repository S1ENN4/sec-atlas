import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "response" as const, slug });

export const relations: Relation[] = [
  { source: ref("ir-lifecycle"), target: ref("triage-and-containment"), label: "is carried out by" },
  { source: ref("threat-intelligence"), target: ref("threat-hunting"), label: "supplies hypotheses to" },
  { source: ref("threat-hunting"), target: ref("log-and-timeline-analysis"), label: "relies on" },
  { source: ref("log-and-timeline-analysis"), target: ref("triage-and-containment"), label: "scopes" },
  { source: ref("triage-and-containment"), target: ref("ransomware-playbook"), label: "is specialised for" },
  { source: ref("triage-and-containment"), target: ref("digital-forensics-basics"), label: "preserves evidence for" },
  { source: ref("digital-forensics-basics"), target: ref("malware-analysis-basics"), label: "hands samples to" },
  { source: ref("malware-analysis-basics"), target: ref("threat-intelligence"), label: "produces indicators for" },
  { source: ref("ir-lifecycle"), target: ref("threat-intelligence"), label: "is informed by" },
];
