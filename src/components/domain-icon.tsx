import { Bot, Cloud, ListChecks, Radar, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";

import type { DomainId } from "@/content/types";

const icons: Record<DomainId, LucideIcon> = {
  appsec: ShieldCheck,
  cloudsec: Cloud,
  "ai-agents": Bot,
  secops: Radar,
  seceng: Wrench,
  owasp: ListChecks,
};

export function DomainIcon({ id, className }: { id: DomainId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} aria-hidden />;
}
