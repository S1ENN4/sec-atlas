import type { DomainId } from "@/content/types";

// Navigation structure. Domains are grouped by what the reader is trying to do,
// so the menu stays readable as more domains are added.
export type ExploreGroupId = "build" | "cloud" | "operate" | "offense" | "govern" | "ai";

export const exploreGroups: { id: ExploreGroupId; domains: DomainId[] }[] = [
  { id: "build", domains: ["appsec", "owasp", "seceng", "devops"] },
  { id: "cloud", domains: ["cloudsec"] },
  { id: "operate", domains: ["secops", "response"] },
  { id: "offense", domains: ["offsec"] },
  { id: "govern", domains: ["grc"] },
  { id: "ai", domains: ["ai-agents", "vibecoding"] },
];
