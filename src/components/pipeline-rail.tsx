import Link from "next/link";
import { MoveDown, MoveLeft, MoveRight } from "lucide-react";

import type { PipelineStage } from "@/content/types";
import { localePath, type Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";

export interface PipelineRailProps {
  /** Localised stages of the domain. */
  stages: PipelineStage[];
  /** Domain route, e.g. "/secops". */
  route: string;
  locale: Locale;
  /** Template with {gate}. */
  gateLabel: string;
  /** Optional closing note (domain specific). */
  loop?: string;
}

const COLS = 3;

export function PipelineRail({ stages: pipelineStages, route, locale, gateLabel, loop }: PipelineRailProps) {
  return (
    <div>
      <div className="overflow-x-auto pb-2 lg:overflow-visible">
        <ol className="flex min-w-max snap-x gap-10 lg:grid lg:min-w-0 lg:grid-cols-3 lg:gap-y-14">
          {pipelineStages.map((stage, i) => {
            // Snake layout on wide screens: row 0 runs left to right, row 1 right to left,
            // and so on, so the arrow that wraps to the next row always points straight down
            // at the next stage. Arrows are derived from the stage count, not hard-coded.
            const row = Math.floor(i / COLS);
            const col = row % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
            const hasNext = i < pipelineStages.length - 1;
            const nextInRow = hasNext && Math.floor((i + 1) / COLS) === row;
            const leftToRight = row % 2 === 0;
            return (
            <li key={stage.id} className="relative w-[240px] shrink-0 snap-start lg:w-auto" style={{ gridColumn: col + 1, gridRow: row + 1 }}>
              <div className="reveal flex h-full flex-col rounded-xl border border-border bg-card p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-primary/90">{stage.index}</span>
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
                        href={localePath(locale, `${route}/topic/${item.slug}`)}
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
                  {fmt(gateLabel, { gate: stage.gate })}
                </p>
              </div>
              {hasNext ? <MoveRight className="absolute -right-7 top-8 size-4 text-primary/50 lg:hidden" aria-hidden /> : null}
              {nextInRow && leftToRight ? (
                <MoveRight className="absolute -right-7 top-1/2 hidden size-4 -translate-y-1/2 text-primary/50 lg:block" aria-hidden />
              ) : null}
              {nextInRow && !leftToRight ? (
                <MoveLeft className="absolute -left-7 top-1/2 hidden size-4 -translate-y-1/2 text-primary/50 lg:block" aria-hidden />
              ) : null}
              {hasNext && !nextInRow ? (
                <MoveDown className="absolute -bottom-9 left-1/2 hidden size-4 -translate-x-1/2 text-primary/50 lg:block" aria-hidden />
              ) : null}
            </li>
            );
          })}
        </ol>
      </div>
      {loop ? (
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          <span className="text-primary/90">loop:</span> {loop}
        </p>
      ) : null}
    </div>
  );
}