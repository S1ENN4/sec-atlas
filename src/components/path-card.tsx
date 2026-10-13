"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { fmt } from "@/i18n/format";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export interface PathCardStep {
  domain: "appsec" | "cloudsec" | "ai-agents" | "secops" | "seceng";
  slug: string;
  title: string;
  why: string;
  href: string;
}

export interface PathCardData {
  id: string;
  title: string;
  description: string;
  level: string;
  steps: PathCardStep[];
}

export interface PathCardStrings {
  progressAria: string;
  studiedSr: string;
  start: string;
  continue: string;
  done: string;
}

// One study path: ordered steps with a studied checkmark each, a progress bar
// and a "continue" link to the first step not studied yet.
export function PathCard({ path, t }: { path: PathCardData; t: PathCardStrings }) {
  const { isSeen } = useProgress();
  const done = path.steps.filter((s) => isSeen(s.domain, s.slug)).length;
  const next = path.steps.find((s) => !isSeen(s.domain, s.slug));
  const pct = Math.round((done / path.steps.length) * 100);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{path.title}</h2>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {path.level}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{path.description}</p>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={fmt(t.progressAria, { title: path.title })}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {done}/{path.steps.length}
        </span>
      </div>

      <ol className="mt-5 space-y-1">
        {path.steps.map((step, i) => {
          const seen = isSeen(step.domain, step.slug);
          return (
            <li key={`${step.domain}/${step.slug}`}>
              <Link
                href={step.href}
                data-domain={step.domain}
                className="group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]",
                    seen ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {seen ? <Check className="size-3" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium group-hover:text-primary">{step.title}</span>
                    <span className="rounded border border-border px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      {step.domain}
                    </span>
                    {seen ? <span className="sr-only">{t.studiedSr}</span> : null}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{step.why}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {next ? (
        <Link
          href={next.href}
          className="mt-4 inline-flex items-center rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {done === 0 ? t.start : t.continue}: {next.title}
        </Link>
      ) : (
        <p className="mt-4 font-mono text-xs text-primary">{t.done}</p>
      )}
    </article>
  );
}
