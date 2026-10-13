import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "owasp" as const, slug });

export const relations: Relation[] = [
  { source: ref("insecure-design"), target: ref("broken-access-control"), label: "defines the rules for" },
  { source: ref("insecure-design"), target: ref("authentication-failures"), label: "sets the recovery flow of" },
  { source: ref("broken-access-control"), target: ref("authentication-failures"), label: "needs a trusted identity from" },
  { source: ref("injection"), target: ref("broken-access-control"), label: "can bypass" },
  { source: ref("cryptographic-failures"), target: ref("authentication-failures"), label: "protects credentials of" },
  { source: ref("supply-chain-failures"), target: ref("integrity-failures"), label: "is stopped by verifying" },
  { source: ref("security-misconfiguration"), target: ref("supply-chain-failures"), label: "includes the pipeline of" },
  { source: ref("logging-alerting-failures"), target: ref("exceptional-conditions"), label: "records" },
  { source: ref("logging-alerting-failures"), target: ref("broken-access-control"), label: "detects abuse of" },
];
