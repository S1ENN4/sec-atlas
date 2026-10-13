"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { TopicIcon } from "@/components/topic-icon";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { GraphData } from "@/components/graph-data";
import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";

// Linear alternative to the canvas map: stages top to bottom, topics as
// rows. Used by default on narrow screens, where a pan-and-zoom canvas is
// awkward, and available everywhere through the "lista" toggle.
export function DomainList({ data }: { data: GraphData }) {
  const domain = data;
  const domainId = data.domainId;
  const route = data.route;
  const st = data.strings;
  const locale = data.locale;
  const { isSeen } = useProgress();

  const inStage = new Set<string>();
  const stages = domain.pipeline.map((stage) => {
    const slugs: string[] = [];
    for (const item of stage.items) {
      if (item.slug && !slugs.includes(item.slug) && domain.topics[item.slug]) slugs.push(item.slug);
    }
    slugs.forEach((s) => inStage.add(s));
    const extras = stage.items.filter((i) => !i.slug).map((i) => i.label);
    return { stage, slugs, extras };
  });
  const loose = Object.keys(domain.topics).filter((slug) => !inStage.has(slug));

  const row = (slug: string) => {
    const t = domain.topics[slug];
    if (!t) return null;
    const meta = domain.kindMeta[t.kind];
    const seen = isSeen(domainId, slug);
    return (
      <li key={slug}>
        <Link
          href={localePath(locale, `${route}/topic/${slug}`)}
          className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <TopicIcon slug={slug} className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="text-sm font-semibold leading-tight">{t.title}</span>
              {seen ? <Check className="size-3.5 shrink-0 text-primary" aria-label={st.studied} /> : null}
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{t.short}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 pt-0.5">
            <span className={cn("size-2 rounded-full", meta.dot)} aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{meta.label}</span>
          </span>
        </Link>
      </li>
    );
  };

  return (
    <ol className="space-y-6">
      {stages.map(({ stage, slugs, extras }) => (
        <li key={stage.id}>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-primary/90">{stage.index}</span>
            <h3 className="font-mono text-sm font-semibold">{stage.name}</h3>
            <span className="text-xs text-muted-foreground">{stage.description}</span>
          </div>
          {slugs.length > 0 ? <ul className="mt-2 space-y-2">{slugs.map(row)}</ul> : null}
          {extras.length > 0 ? (
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">{fmt(st.also, { items: extras.join(" · ") })}</p>
          ) : null}
          <p className="mt-2 font-mono text-[10px] text-amber-400/80">{fmt(st.gate, { gate: stage.gate })}</p>
        </li>
      ))}
      {loose.length > 0 ? (
        <li>
          <h3 className="font-mono text-sm font-semibold">{st.crossCutting}</h3>
          <ul className="mt-2 space-y-2">{loose.map((slug) => row(slug))}</ul>
        </li>
      ) : null}
    </ol>
  );
}
