"use client";

// Career roadmap: the stages of one role with per-topic progress read from the
// reader's local progress store. Nothing is locked; it only shows what is next.

import Link from "next/link";
import { Check, Circle } from "lucide-react";

import { fmt } from "@/i18n/format";
import { useProgress } from "@/lib/progress";
import type { DomainId } from "@/content/types";

export interface RoadmapTopic {
  domain: DomainId;
  slug: string;
  title: string;
  href: string;
}
export interface RoadmapStage {
  level: number;
  levelName: string;
  goal: string;
  topics: RoadmapTopic[];
  outside: string[];
  project: string;
}
export interface RoadmapStrings {
  stageN: string;
  goal: string;
  inKb: string;
  outside: string;
  project: string;
  progress: string;
  nextStep: string;
  roadmapComplete: string;
  stageComplete: string;
}

export function CareerRoadmap({ stages, t }: { stages: RoadmapStage[]; t: RoadmapStrings }) {
  const { isSeen } = useProgress();
  const all = stages.flatMap((s) => s.topics);
  const done = all.filter((tp) => isSeen(tp.domain, tp.slug)).length;
  const next = all.find((tp) => !isSeen(tp.domain, tp.slug));

  return (
    <div>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-mono text-xs text-muted-foreground">{fmt(t.progress, { done, total: all.length })}</span>
          {next ? (
            <span>
              <span className="text-muted-foreground">{t.nextStep}: </span>
              <Link href={next.href} className="font-medium text-primary hover:underline">
                {next.title}
              </Link>
            </span>
          ) : (
            <span className="text-primary">{t.roadmapComplete}</span>
          )}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${all.length ? (done / all.length) * 100 : 0}%` }} />
        </div>
      </div>

      <ol className="mt-8 space-y-8">
        {stages.map((s, i) => {
          const stageDone = s.topics.length > 0 && s.topics.every((tp) => isSeen(tp.domain, tp.slug));
          return (
            <li key={i} className="relative rounded-xl border border-border bg-card p-5">
              <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                <span>{fmt(t.stageN, { n: i + 1 })}</span>
                <span className="text-muted-foreground">· {s.levelName}</span>
                {stageDone ? <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{t.stageComplete}</span> : null}
              </p>
              <p className="mt-2 text-lg font-semibold leading-snug">{s.goal}</p>

              <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t.inKb}</h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {s.topics.map((tp) => {
                  const seen = isSeen(tp.domain, tp.slug);
                  return (
                    <li key={`${tp.domain}/${tp.slug}`}>
                      <Link
                        href={tp.href}
                        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-muted/40"
                      >
                        {seen ? <Check className="size-4 shrink-0 text-primary" aria-hidden /> : <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
                        <span className={seen ? "text-muted-foreground line-through decoration-primary/40" : ""}>{tp.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {s.outside.length ? (
                <>
                  <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t.outside}</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {s.outside.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t.project}</h3>
              <p className="mt-2 text-sm leading-relaxed">{s.project}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Small progress bar for a role card on the careers index. */
export function CareerProgress({ topics, label }: { topics: { domain: DomainId; slug: string }[]; label: string }) {
  const { isSeen } = useProgress();
  const done = topics.filter((tp) => isSeen(tp.domain, tp.slug)).length;
  return (
    <div>
      <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${topics.length ? (done / topics.length) * 100 : 0}%` }} />
      </div>
      <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{fmt(label, { done, total: topics.length })}</p>
    </div>
  );
}
