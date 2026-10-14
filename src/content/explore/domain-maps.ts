// Which interactive maps are the best companion to each domain (route segment keys
// are the domain ids). Used for the "explore this on the maps" strip on domain pages.
import type { DomainId } from "@/content/types";

export const domainMaps: Record<DomainId, string[]> = {
  appsec: ["pipeline", "atlas"],
  owasp: ["owasp10", "webapp"],
  seceng: ["pipeline", "atlas"],
  devops: ["pipeline", "net"],
  cloudsec: ["cloud", "atlas"],
  secops: ["soc", "net"],
  response: ["soc", "atlas"],
  offsec: ["net", "webapp"],
  grc: ["atlas", "cloud"],
  "ai-agents": ["agents"],
  vibecoding: ["agents"],
};
