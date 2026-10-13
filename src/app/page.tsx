import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { domains, type DomainId } from "@/content/registry";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Domain-card copy is the only place on the hub where human-friendly names
// and pitches live. Order is implicit via the registry: `Object.values(domains)`
// returns keys in insertion order — `appsec`, `cloudsec`, `ai-agents` — so the
// three cards render AppSec → CloudSec → Agents without an explicit list.
const DOMAIN_LABELS: Record<DomainId, { name: string; pitch: string }> = {
  appsec: {
    name: "AppSec",
    pitch:
      "SAST, DAST, SCA, secrets, SBOM e a esteira — o mapa interativo que mostra cada verificação e onde ela entra na pipeline.",
  },
  cloudsec: {
    name: "CloudSec",
    pitch:
      "Postura em cloud, IAM, segmentação e supply chain — um grafo próprio, mesmo estilo do AppSec.",
  },
  "ai-agents": {
    name: "Agents",
    pitch:
      "Segurança para agentes e workloads de IA — RAG, tool calling, MCP, guardrails. Mapa completo.",
  },
};

export default function Home() {
  const domainList = Object.values(domains);
  const liveCount = domainList.filter((d) => d.status === "live").length;
  const draftCount = domainList.length - liveCount;

  return (
    <div className="animate-page-enter mx-auto max-w-6xl px-4 pb-10 pt-12 md:pt-20">
      <header className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-end">
        <div>
          <Badge
            variant="outline"
            className="font-mono text-xs font-normal text-muted-foreground"
          >
            knowledge base · segurança de software
          </Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Segurança de software,{" "}
            <span className="text-primary">mapeada por domínio.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Cada domínio é um grafo independente: conceitos, esteira, conexões e glossário.
            Três mapas prontos, todos com o mesmo nível de profundidade.
          </p>
        </div>
        <dl className="font-mono text-xs text-muted-foreground md:text-right">
          <div className="flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt className="text-muted-foreground">domínios</dt>
            <dd className="text-base text-foreground">
              {domainList.length.toString().padStart(2, "0")}
            </dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt className="text-muted-foreground">live</dt>
            <dd className="text-base text-primary">
              {liveCount.toString().padStart(2, "0")}
            </dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt className="text-muted-foreground">draft</dt>
            <dd className={cn(
              "text-base",
              draftCount > 0 ? "text-amber-400/90" : "text-muted-foreground/80",
            )}>
              {draftCount.toString().padStart(2, "0")}
            </dd>
          </div>
        </dl>
      </header>

      <hr className="mt-10 border-border/60" />

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {domainList.map((d, i) => {
          const meta = DOMAIN_LABELS[d.id];
          // Topic count is derived from the registry, not hardcoded. The hub
          // always renders the count (no "em breve" branch) — T23 flipped
          // every domain to `live`, so the badge is informational, not a
          // promise. The live/draft branch on the action text remains as
          // a future-proof switch so a new draft domain wouldn't ship a
          // dead "abrir mapa" CTA.
          const count = d.topics.length;
          const isLive = d.status === "live";
          return (
            <Link
              key={d.id}
              href={d.route}
              transitionTypes={["nav-forward"]}
              className="animate-hero-enter group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ animationDelay: `${120 + i * 80}ms` }}
            >
              <div data-domain={d.id} className="h-full">
                <Card className="relative h-full overflow-hidden transition-[transform,border-color,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:shadow-[0_8px_30px_-12px_var(--primary)]">
                  {/* Soft accent glow that fades in on hover. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  {/* Accent stripe — picks up each domain's --primary token via
                      the wrapping `data-domain` attribute, so the three cards
                      are visually distinct without any domain-specific CSS. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {d.id}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {count} {count === 1 ? "tópico" : "tópicos"}
                      </span>
                    </div>
                    <CardTitle className="pt-2 text-2xl">{meta.name}</CardTitle>
                    <CardDescription className="leading-snug">
                      {meta.pitch}
                    </CardDescription>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 pt-3 font-mono text-xs",
                        isLive ? "text-primary/80" : "text-muted-foreground",
                      )}
                    >
                      {isLive ? "abrir mapa" : "notificar"}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}