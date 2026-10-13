import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "offsec" as const, slug });

export const relations: Relation[] = [
  { source: ref("engagement-scoping-and-ethics"), target: ref("pentest-methodology"), label: "bounds" },
  { source: ref("pentest-methodology"), target: ref("recon-and-attack-surface"), label: "starts with" },
  { source: ref("recon-and-attack-surface"), target: ref("web-and-api-testing"), label: "feeds" },
  { source: ref("web-and-api-testing"), target: ref("privilege-escalation-paths"), label: "can lead to" },
  { source: ref("privilege-escalation-paths"), target: ref("red-team-and-adversary-emulation"), label: "is a step of" },
  { source: ref("social-engineering-and-phishing"), target: ref("red-team-and-adversary-emulation"), label: "is an entry for" },
  { source: ref("pentest-methodology"), target: ref("reporting-and-remediation"), label: "ends with" },
  { source: ref("red-team-and-adversary-emulation"), target: ref("reporting-and-remediation"), label: "is summarized in" },
  { source: ref("privilege-escalation-paths"), target: ref("reporting-and-remediation"), label: "is reported in" },
];
