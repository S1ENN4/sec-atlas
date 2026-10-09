// Thin AppSec-specific wrapper around the generic `DomainGraph` renderer.
// Kept so consumers (`src/app/page.tsx`) can stay byte-identical while the
// per-domain graph layout lives in `src/content/appsec/graph-layout.ts`.

import { DomainGraph } from "@/components/domain-graph";

export function StudyGraph() {
  return <DomainGraph domainId="appsec" />;
}
