"use client";

// Configuration labs (choose safer settings, run an attack suite) and the
// tabletop (decisions with consequences) of the Atlas lab.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Play, RotateCcw, ShieldAlert, ShieldCheck, X } from "lucide-react";

import {
  evaluateHarden,
  initialPick,
  renderTemplate,
  type HardenExercise,
  type TabletopExercise,
} from "@/content/explore/lab-more";
import { fmt } from "@/i18n/format";
import { useExploreProgress } from "@/lib/explore-progress";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type LabUiMap = Record<string, string>;

interface HardenText {
  title: string;
  story: string;
  goal: string;
  why: string;
  hint: string;
  choices: Record<string, { label: string; options: Record<string, string> }>;
  tests: Record<string, string>;
}

const markTone = {
  vulnerable: "bg-red-500/10 ring-1 ring-red-400/40",
  safe: "bg-emerald-500/10 ring-1 ring-emerald-400/40",
  strict: "bg-amber-500/10 ring-1 ring-amber-400/40",
} as const;

export function HardenLab({ ex, ui, text, nodeHref }: { ex: HardenExercise; ui: LabUiMap; text: HardenText; nodeHref: string }) {
  const { solve } = useExploreProgress();
  const [picked, setPicked] = useState<Record<string, string>>(() => initialPick(ex));
  const [results, setResults] = useState<ReturnType<typeof evaluateHarden> | null>(null);

  const rendered = useMemo(() => renderTemplate(ex, picked), [ex, picked]);
  const solved = !!results && results.every((r) => r.pass);

  useEffect(() => {
    if (solved) solve(`lab-${ex.id}`);
  }, [solved, ex.id, solve]);

  const choose = (choiceId: string, optionId: string) => {
    setPicked((p) => ({ ...p, [choiceId]: optionId }));
    setResults(null);
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="min-w-0 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-xl font-bold tracking-tight">{text.title}</h2>
        <h3 className="mt-4 font-mono text-xs uppercase tracking-wider text-primary">{ui.story}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text.story}</p>
        <h3 className="mt-4 font-mono text-xs uppercase tracking-wider text-primary">{ui.goal}</h3>
        <p className="mt-1 text-sm font-medium">{text.goal}</p>

        <pre className="mt-5 overflow-x-auto rounded-lg border border-border bg-background p-2 font-mono text-xs leading-relaxed" tabIndex={0}>
          <code className="block min-w-max">
            {rendered.code.split("\n").map((l, i) => {
              const mark = rendered.marks.find((m) => m.line === i + 1);
              return (
                <div key={i} className={cn("flex rounded px-1", mark && markTone[mark.kind])}>
                  <span aria-hidden className="w-6 shrink-0 select-none pr-2 text-right text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre">{l || " "}</span>
                </div>
              );
            })}
          </code>
        </pre>
        {solved ? (
          <p className="mt-3 text-sm leading-relaxed" role="status">
            <span className="font-semibold">{ui.why}: </span>
            {text.why}
          </p>
        ) : null}
        <Link href={nodeHref} className={cn("mt-4 inline-block rounded font-mono text-xs text-primary hover:underline", focusRing)}>
          {ui.seeNode} →
        </Link>
      </section>

      <section className="min-w-0 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary">{ui.settings}</h3>
        <div className="mt-3 space-y-4">
          {ex.choices.map((c) => (
            <fieldset key={c.id}>
              <legend className="text-sm font-semibold">{text.choices[c.id].label}</legend>
              <div className="mt-1.5 space-y-1.5">
                {c.options.map((o) => {
                  const on = picked[c.id] === o.id;
                  return (
                    <label
                      key={o.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-sm transition-colors",
                        on ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${ex.id}-${c.id}`}
                        checked={on}
                        onChange={() => choose(c.id, o.id)}
                        className="mt-1 accent-[var(--primary)]"
                      />
                      <span className="min-w-0">
                        <code className="block break-words font-mono text-[11px] text-foreground">{o.code.split("\n")[0]}</code>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{text.choices[c.id].options[o.id]}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setResults(evaluateHarden(ex, picked))}
            className={cn("inline-flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 font-mono text-xs text-primary hover:bg-primary/20", focusRing)}
          >
            <Play className="size-3.5" aria-hidden /> {ui.runTests}
          </button>
          <p className="text-xs text-muted-foreground">
            {ui.hint}: {text.hint}
          </p>
        </div>

        <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-primary">{ui.testsTitle}</h3>
        <ul className="mt-2 space-y-1.5" aria-live="polite">
          {ex.tests.map((t) => {
            const r = results?.find((x) => x.id === t.id);
            const good = r?.pass;
            return (
              <li
                key={t.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-2 text-sm",
                  !r && "border-border text-muted-foreground",
                  r && good && "border-emerald-400/40 bg-emerald-500/5",
                  r && !good && "border-red-400/40 bg-red-500/5",
                )}
              >
                {!r ? (
                  <span aria-hidden className="mt-0.5 size-4 shrink-0 rounded-full border border-border" />
                ) : good ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden />
                )}
                <span className="min-w-0">
                  <span className="block">{text.tests[t.id]}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    {r
                      ? t.type === "attack"
                        ? good
                          ? ui.attackBlocked
                          : ui.attackWorks
                        : good
                          ? ui.stillWorks
                          : ui.nowBroken
                      : t.type === "attack"
                        ? "attack"
                        : "work"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p
          className={cn("mt-3 rounded-lg border px-3 py-2 text-sm font-medium", !results && "border-border text-muted-foreground", solved && "border-emerald-400/50 bg-emerald-500/10 text-emerald-400", results && !solved && "border-amber-400/50 text-amber-400")}
          role="status"
        >
          {!results ? ui.notRun : solved ? ui.allGreen : ui.someRed}
        </p>
      </section>
    </div>
  );
}

// --- tabletop ----------------------------------------------------------------------

interface TabletopText {
  title: string;
  story: string;
  goal: string;
  why: string;
  hint: string;
  debriefGood: string;
  debriefBad: string;
  steps: Record<string, { prompt: string; options: Record<string, { text: string; feedback: string }> }>;
}

export function Tabletop({ ex, ui, text, nodeHref }: { ex: TabletopExercise; ui: LabUiMap; text: TabletopText; nodeHref: string }) {
  const { solve } = useExploreProgress();
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const total = ex.steps.length;
  const finished = idx >= total;
  const max = total * 2;
  const score = ex.steps.reduce((sum, s) => sum + (s.options.find((o) => o.id === chosen[s.id])?.score ?? 0), 0);
  const passed = finished && score >= ex.pass;

  useEffect(() => {
    if (passed) solve(`lab-${ex.id}`);
  }, [passed, ex.id, solve]);

  const step = ex.steps[idx];
  const answered = step ? chosen[step.id] : undefined;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <section className="min-w-0 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-xl font-bold tracking-tight">{text.title}</h2>
        <h3 className="mt-4 font-mono text-xs uppercase tracking-wider text-primary">{ui.story}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text.story}</p>
        <h3 className="mt-4 font-mono text-xs uppercase tracking-wider text-primary">{ui.goal}</h3>
        <p className="mt-1 text-sm font-medium">{text.goal}</p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">{fmt(ui.score, { score, max })}</p>
        <Link href={nodeHref} className={cn("mt-4 inline-block rounded font-mono text-xs text-primary hover:underline", focusRing)}>
          {ui.seeNode} →
        </Link>
      </section>

      <section className="min-w-0 rounded-2xl border border-border bg-card p-5" aria-live="polite">
        {!finished && step ? (
          <>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">{fmt(ui.stepOf, { n: idx + 1, total })}</p>
            <p className="mt-2 text-base font-semibold leading-snug">{text.steps[step.id].prompt}</p>
            {!answered ? <p className="mt-1 text-xs text-muted-foreground">{ui.chooseOne}</p> : null}
            <div className="mt-3 space-y-2">
              {step.options.map((o) => {
                const t = text.steps[step.id].options[o.id];
                const picked = answered === o.id;
                return (
                  <div key={o.id}>
                    <button
                      type="button"
                      disabled={!!answered}
                      onClick={() => setChosen((c) => ({ ...c, [step.id]: o.id }))}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm transition-colors disabled:cursor-default",
                        !answered && "border-border hover:border-primary/60",
                        answered && picked && o.score === 2 && "border-emerald-400/60 bg-emerald-500/10",
                        answered && picked && o.score === 1 && "border-amber-400/60 bg-amber-500/10",
                        answered && picked && o.score === 0 && "border-red-400/60 bg-red-500/10",
                        answered && !picked && "border-border opacity-60",
                        focusRing,
                      )}
                    >
                      {t.text}
                    </button>
                    {answered && picked ? (
                      <p className="mt-1.5 flex items-start gap-2 px-1 text-sm leading-relaxed">
                        {o.score === 2 ? <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden /> : <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden />}
                        {t.feedback}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {answered ? (
              <button
                type="button"
                onClick={() => setIdx((i) => i + 1)}
                className={cn("mt-4 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 font-mono text-xs text-primary hover:bg-primary/20", focusRing)}
              >
                {idx === total - 1 ? ui.seeResult : ui.next}
              </button>
            ) : null}
          </>
        ) : (
          <>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">{ui.debrief}</p>
            <p className={cn("mt-2 rounded-lg border px-3 py-2 text-sm font-medium", passed ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-400" : "border-amber-400/50 text-amber-400")}>
              {fmt(ui.score, { score, max })} · {passed ? text.debriefGood : text.debriefBad}
            </p>
            {passed ? (
              <p className="mt-3 text-sm leading-relaxed">
                <span className="font-semibold">{ui.why}: </span>
                {text.why}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setIdx(0);
                setChosen({});
              }}
              className={cn("mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-mono text-xs hover:border-primary/60", focusRing)}
            >
              <RotateCcw className="size-3.5" aria-hidden /> {ui.restart}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
