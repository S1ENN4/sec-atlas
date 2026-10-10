import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { domains, type DomainId } from "@/content/registry";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DOMAIN_LABELS: Record<DomainId, { name: string; pitch: string }> = {
  appsec: {
    name: "AppSec",
    pitch:
      "SAST, DAST, SCA, secrets, SBOM e a esteira — o mapa interativo que mostra cada verificação e onde ela entra na pipeline.",
  },
  cloudsec: {
    name: "CloudSec",
    pitch:
      "Postura em cloud, IAM, segmentação e supply chain — um grafo próprio, mesmo estilo do AppSec. Conteúdo entra nas ondas 3/4.",
  },
  "ai-agents": {
    name: "Agents",
    pitch:
      "Segurança para agentes e workloads de IA — prompt injection, tool sandboxing, tracing de ações. Conteúdo entra nas ondas 3/4.",
  },
};

export default function Home() {
  const domainList = Object.values(domains);
  const liveCount = domainList.filter((d) => d.status === "live").length;
  const draftCount = domainList.length - liveCount;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 md:pt-20">
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
            Comece pelo que está pronto, volte quando os outros saírem do forno.
          </p>
        </div>
        <dl className="font-mono text-xs text-muted-foreground md:text-right">
          <div className="flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt className="text-muted-foreground/70">domínios</dt>
            <dd className="text-base text-foreground">
              {domainList.length.toString().padStart(2, "0")}
            </dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt className="text-muted-foreground/70">live</dt>
            <dd className="text-base text-primary">
              {liveCount.toString().padStart(2, "0")}
            </dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt className="text-muted-foreground/70">draft</dt>
            <dd className="text-base text-amber-400/90">
              {draftCount.toString().padStart(2, "0")}
            </dd>
          </div>
        </dl>
      </header>

      <hr className="mt-10 border-border/60" />

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {domainList.map((d) => {
          const meta = DOMAIN_LABELS[d.id];
          const count = d.topics.length;
          const isLive = d.status === "live";
          return (
            <Link
              key={d.id}
              href={d.route}
              className="group block focus:outline-none"
            >
              <div data-domain={d.id} className="h-full">
                <Card className="h-full transition-colors group-hover:border-primary/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {d.id}
                      </span>
                      {isLive ? (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {count} {count === 1 ? "tópico" : "tópicos"}
                        </span>
                      ) : (
                        <span className="rounded-md border border-amber-400/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
                          em breve
                        </span>
                      )}
                    </div>
                    <CardTitle className="pt-2 text-2xl">{meta.name}</CardTitle>
                    <CardDescription className="leading-snug">
                      {meta.pitch}
                    </CardDescription>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 pt-3 font-mono text-xs",
                        isLive ? "text-primary/80" : "text-muted-foreground"
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