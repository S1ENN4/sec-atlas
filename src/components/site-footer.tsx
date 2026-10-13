import { domains } from "@/content/registry";

// Map of DomainId → lowercase badge label used in the footer's per-domain
// count line. Mirrors the route names (so "agentes" matches `/agentes`,
// not `ai-agents`), which keeps the footer in the same human-friendly
// vocabulary as the hub and the global nav.
const DOMAIN_BADGE_LABEL: Record<string, string> = {
  appsec: "appsec",
  cloudsec: "cloudsec",
  "ai-agents": "agentes",
};

export function SiteFooter() {
  // Counts are derived from the registry every render — no hardcoded
  // numbers anywhere in the footer. Order is the same insertion order as
  // the hub: AppSec → CloudSec → Agents.
  const counts = (Object.values(domains) as { id: string; topics: unknown[] }[])
    .map((d) => `${DOMAIN_BADGE_LABEL[d.id] ?? d.id} ${d.topics.length}`)
    .join(" · ");

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>
          appsec<span className="text-primary">/</span>kb — conteúdo educacional
        </span>
        <div className="flex flex-col gap-1 md:items-end">
          <span>{counts}</span>
          <span>100% estático · sem rastreamento · sem cookies</span>
        </div>
      </div>
    </footer>
  );
}