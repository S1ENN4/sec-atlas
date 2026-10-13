import type { DomainId } from "@/content/types";

// Navigation structure. Domains are grouped by what the reader is trying to do,
// so the menu stays readable as more domains are added.
export type ExploreGroupId = "build" | "cloud" | "operate" | "ai";

export const exploreGroups: { id: ExploreGroupId; domains: DomainId[] }[] = [
  { id: "build", domains: ["appsec", "seceng"] },
  { id: "cloud", domains: ["cloudsec"] },
  { id: "operate", domains: ["secops"] },
  { id: "ai", domains: ["ai-agents"] },
];
