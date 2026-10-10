import Link from "next/link";
import { MoveDown, MoveRight } from "lucide-react";

import { domainMeta, getPipeline, type DomainId } from "@/content/registry";

export function PipelineRail({ domain = "appsec" }: { domain?: DomainId }) {
  const route = domainMeta[domain].route;
  const pipelineStages = getPipeline(domain);
  return (
    <div>
      <div className="overflow-x-auto pb-2 lg:overflow-visible">
        <ol className="flex min-w-max snap-x gap-10 lg:grid lg:min-w-0 lg:grid-cols-3 lg:gap-y-14">
          {pipelineStages.map((stage, i) => (
            <li key={stage.id} className="relative w-[240px] shrink-0 snap-start lg:w-auto">
              <div className="reveal flex h-full flex-col rounded-xl border border-border bg-card p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-primary/60">{stage.index}</span>
                  <span className="font-mono text-sm font-semibold">{stage.name}</span>
                </div>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {stage.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {stage.items.map((item) =>
                    item.slug ? (
                      <Link
                        key={item.label}
                        href={`${route}/topico/${item.slug}`}
                        className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[11px] text-foreground/80 transition-colors duration-[120ms] hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        key={item.label}
                        className="rounded-md border border-border/60 px-2 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {item.label}
                      </span>
                    )
                  )}
                </div>
                <p className="mt-auto pt-3 font-mono text-[10px] text-amber-400/80">
                  gate: {stage.gate}
                </p>
              </div>
              {i < pipelineStages.length - 1 ? (
                <MoveRight
                  className="absolute -right-7 top-8 size-4 text-primary/50 lg:hidden"
                  aria-hidden
                />
              ) : null}
              {[0, 1, 3, 4].includes(i) ? (
                <MoveRight
                  className="absolute -right-7 top-1/2 hidden size-4 -translate-y-1/2 text-primary/50 lg:block"
                  aria-hidden
                />
              ) : null}
              {i === 2 ? (
                <MoveDown
                  className="absolute -bottom-9 right-16 hidden size-4 text-primary/50 lg:block"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        <span className="text-primary/70">loop:</span> CVE novo em dependência já usada → SCA
        contínuo abre PR → a esteira recomeça em 01
      </p>
    </div>
  );
}