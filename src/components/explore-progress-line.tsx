"use client";

// Small progress readouts for the explorable maps and the lab, read from the same
// browser-only store the maps use. They render nothing until something is done,
// so a first visit stays clean and the server markup is always the empty state.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fmt } from "@/i18n/format";
import { useExploreProgress } from "@/lib/explore-progress";

export function ProgressLine({ ids, labIds, labels }: { ids: string[]; labIds?: string[]; labels: { explored: string; lab: string } }) {
  const { state } = useExploreProgress();
  const done = ids.filter((i) => state.visited[i]).length;
  const labDone = (labIds ?? []).filter((i) => state.solved[`lab-${i}`]).length;
  if (done === 0 && labDone === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-muted-foreground">
      {ids.length > 0 && done > 0 ? (
        <span className="flex items-center gap-2">
          <span
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={ids.length}
            aria-valuenow={done}
            aria-label={fmt(labels.explored, { done, total: ids.length })}
            className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"
          >
            <span className="block h-full bg-primary" style={{ width: `${(done / ids.length) * 100}%` }} />
          </span>
          {fmt(labels.explored, { done, total: ids.length })}
        </span>
      ) : null}
      {labIds && labDone > 0 ? <span>{fmt(labels.lab, { done: labDone, total: labIds.length })}</span> : null}
    </div>
  );
}

/** "Continue the map you were exploring", from the last node opened. */
export function ContinueMap({
  nodes,
  label,
  base,
}: {
  /** node id -> map id and display title. */
  nodes: Record<string, { world: string; title: string }>;
  label: string;
  base: string;
}) {
  const { state } = useExploreProgress();
  const last = state.last && nodes[state.last] ? nodes[state.last] : null;
  if (!last || !state.last) return null;
  return (
    <Link
      href={`${base}/${last.world}#${state.last}`}
      className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="font-mono text-xs uppercase tracking-wider text-primary">{label}</span>
      <span className="font-medium">{last.title}</span>
      <ArrowRight className="ml-auto size-4 text-primary" aria-hidden />
    </Link>
  );
}
