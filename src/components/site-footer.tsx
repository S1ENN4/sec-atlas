import Link from "next/link";

import { profile } from "@/content/profile";
import { domains } from "@/content/registry";

// Map of DomainId → lowercase badge label used in the footer's per-domain
// count line. Mirrors the route names (so "agentes" matches `/agentes`,
// not `ai-agents`), which keeps the footer in the same human-friendly
// vocabulary as the hub and the global nav.
const DOMAIN_BADGE_LABEL: Record<string, string> = {
  appsec: "appsec",
  cloudsec: "cloudsec",
  "ai-agents": "agentes",
  secops: "secops",
};

export function SiteFooter() {
  // Counts are derived from the registry every render — no hardcoded
  // numbers anywhere in the footer. Order is the same insertion order as
  // the hub: AppSec → CloudSec → Agents.
  const counts = (Object.values(domains) as { id: string; topics: unknown[] }[])
    .map((d) => `${DOMAIN_BADGE_LABEL[d.id] ?? d.id} ${d.topics.length}`)
    .join(" · ");

  return (
    <footer className="border-t border-border/60 print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span>
            appsec<span className="text-primary">/</span>kb — conteúdo educacional por {profile.name}
          </span>
          <span className="flex flex-wrap gap-x-4">
            <Link href="/sobre" className="hover:text-foreground">sobre</Link>
            <Link href="/novidades" className="hover:text-foreground">novidades</Link>
            <Link href="/fontes" className="hover:text-foreground">fontes</Link>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer me" className="hover:text-foreground">
              linkedin
            </a>
          </span>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <span>{counts}</span>
          <span>100% estático · sem rastreamento · sem cookies</span>
          <span>seu progresso fica só neste navegador</span>
        </div>
      </div>
    </footer>
  );
}