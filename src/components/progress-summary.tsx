"use client";

import { useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";

import { useProgress } from "@/lib/progress";

export interface DomainTotals {
  id: string;
  name: string;
  slugs: string[];
}

// "Seu progresso": studied topics per domain and quiz results, all computed
// from localStorage on the client. Offers a reset.
export function ProgressSummary({ domains }: { domains: DomainTotals[] }) {
  const { state, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);

  const total = domains.reduce((n, d) => n + d.slugs.length, 0);
  const done = domains.reduce((n, d) => n + d.slugs.filter((s) => state.seen[`${d.id}/${s}`]).length, 0);
  const quizzes = Object.values(state.quiz);
  const perfect = quizzes.filter((q) => q.best === q.total).length;

  return (
    <section aria-labelledby="progress-title" className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="progress-title" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          seu progresso
        </h2>
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-base text-foreground">{done}</span>/{total} tópicos estudados
          {quizzes.length > 0 ? (
            <>
              {" "}
              · <Trophy className="mb-0.5 inline size-3.5 text-primary" aria-hidden /> {perfect}/{quizzes.length} quizzes
              perfeitos
            </>
          ) : null}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {domains.map((d) => {
          const n = d.slugs.filter((s) => state.seen[`${d.id}/${s}`]).length;
          const pct = d.slugs.length ? Math.round((n / d.slugs.length) * 100) : 0;
          return (
            <div key={d.id} data-domain={d.id}>
              <div className="flex items-baseline justify-between font-mono text-xs">
                <span>{d.name}</span>
                <span className="text-muted-foreground">
                  {n}/{d.slugs.length}
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={`Progresso em ${d.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
        <span>salvo apenas neste navegador</span>
        {done > 0 || quizzes.length > 0 ? (
          confirming ? (
            <span className="flex items-center gap-2">
              apagar tudo?
              <button
                type="button"
                onClick={() => {
                  reset();
                  setConfirming(false);
                }}
                className="rounded border border-red-500/60 px-2 py-0.5 text-red-400 hover:bg-red-500/10"
              >
                sim
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="rounded border border-border px-2 py-0.5 hover:text-foreground">
                não
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <RotateCcw className="size-3" aria-hidden /> zerar
            </button>
          )
        ) : null}
      </div>
    </section>
  );
}
