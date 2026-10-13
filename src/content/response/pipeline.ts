import type { PipelineStage } from "@/content/types";

// Four phases of handling an intrusion: PREPARE (process and knowledge before
// anything happens), DETECT (find what alerts missed), RESPOND (stop the harm)
// and INVESTIGATE (understand exactly what happened).

export const pipeline: PipelineStage[] = [
  {
    id: "prepare",
    index: "01",
    name: "prepare",
    description: "decide before the crisis",
    items: [
      { label: "roles, severity and communication", slug: "ir-lifecycle" },
      { label: "who attacks us and how", slug: "threat-intelligence" },
      { label: "tabletop exercises" },
    ],
    gate: "the first hour of an incident is a rehearsed procedure, not an improvisation",
  },
  {
    id: "detect",
    index: "02",
    name: "detect",
    description: "find what alerts missed",
    items: [
      { label: "hypothesis-driven search", slug: "threat-hunting" },
      { label: "clean timestamps and pivots", slug: "log-and-timeline-analysis" },
      { label: "hunts become detections" },
    ],
    gate: "every confirmed technique leaves behind an automated detection",
  },
  {
    id: "respond",
    index: "03",
    name: "respond",
    description: "stop the harm, keep the evidence",
    items: [
      { label: "scope first, then contain", slug: "triage-and-containment" },
      { label: "the ransomware playbook", slug: "ransomware-playbook" },
      { label: "recover from known-good" },
    ],
    gate: "containment is proportional, coordinated and recorded",
  },
  {
    id: "investigate",
    index: "04",
    name: "investigate",
    description: "understand exactly what happened",
    items: [
      { label: "evidence, order of volatility, custody", slug: "digital-forensics-basics" },
      { label: "safe triage of a suspicious file", slug: "malware-analysis-basics" },
      { label: "blameless post-incident review" },
    ],
    gate: "the report explains how they got in, what they did and what changes",
  },
];
