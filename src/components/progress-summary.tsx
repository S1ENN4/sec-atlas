"use client";

import { useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";

import { fmt } from "@/i18n/format";
import { useProgress } from "@/lib/progress";

export interface DomainTotals {
  id: string;
  name: string;
  slugs: string[];
}

export interface ProgressStrings {
  title: string;
  studiedOf: string;
  perfectQuizzes: string;
  savedLocally: string;
  reset: string;
  confirm: string;
  yes: string;
  no: string;
  progressIn: string;
}

// "Your progress": studied topics per domain and quiz results, all computed
// from localStorage on the client. Offers a reset.
export function ProgressSummary({ domains, t }: { domains: DomainTotals[]; t: ProgressStrings }) {
  const { state, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);

  const total = domains.reduce((n, d) => n + d.slugs.length, 0);
  const done = domains.reduce((n, d) => n + d.slugs.filter((s) => state.seen[`${d.id}/${s}`]).length, 0);
  const quizzes = Object.values(state.quiz);
  const perfect = quizzes.filter((q) => q.best === q.total).length;
  // "{done}/{total} topics studied": keep the number emphasised wherever the translation puts it.
  const [before, after] = fmt(t.studiedOf, { done: "\u0000", total }).split("\u0000");

  return (
    <section aria-labelledby="progress-title" className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="progress-title" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          {t.title}
        </h2>
        <p className="font-mono text-xs text-muted-foreground">
          {before}
          <span className="text-base text-foreground">{done}</span>
          {after}
          {quizzes.length > 0 ? (
            <>
              {" "}
              · <Trophy className="mb-0.5 inline size-3.5 text-primary" aria-hidden /> {fmt(t.perfectQuizzes, { perfect, n: quizzes.length })}
            </>
          ) : null}
        </p>
      </div>

      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={t.title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={total ? Math.round((done / total) * 100) : 0}
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>

      <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
        <span>{t.savedLocally}</span>
        {done > 0 || quizzes.length > 0 ? (
          confirming ? (
            <span className="flex items-center gap-2">
              {t.confirm}
              <button
                type="button"
                onClick={() => {
                  reset();
                  setConfirming(false);
                }}
                className="focus-ring rounded border border-red-500/60 px-2 py-0.5 text-red-400 hover:bg-red-500/10"
              >
                {t.yes}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="focus-ring rounded border border-border px-2 py-0.5 hover:text-foreground">
                {t.no}
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="focus-ring inline-flex items-center gap-1 rounded-sm hover:text-foreground">
              <RotateCcw className="size-3" aria-hidden /> {t.reset}
            </button>
          )
        ) : null}
      </div>
    </section>
  );
}
