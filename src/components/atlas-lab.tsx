"use client";

// Atlas lab: break it, fix it, prove it. Each exercise runs a small, safe
// simulation (src/lib/atlas-lab.ts) on fake data, entirely in the browser.

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Lock, Play, ShieldAlert, ShieldCheck, Wrench } from "lucide-react";

import type { LabExercise } from "@/content/explore/lab";
import type { AnyExercise } from "@/content/explore/lab-more";
import { HardenLab, Tabletop } from "./atlas-lab-more";
import type { labText } from "@/content/explore/text-lab";
import { fmt } from "@/i18n/format";
import { ME, runIdor, runSqli, runXss, type RunResult } from "@/lib/atlas-lab";
import { useExploreProgress } from "@/lib/explore-progress";
import { cn } from "@/lib/utils";

type LabUi = Record<keyof (typeof labText)["ui"], string>;
type ExerciseText = Record<"title" | "story" | "goal" | "field" | "why" | "hint", string>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyText = any;

export interface AtlasLabProps {
  exercises: AnyExercise[];
  ui: LabUi;
  texts: Record<string, AnyText>;
  /** Href of the company node that explains each exercise. */
  nodeHrefs: Record<string, string>;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getHash = () => window.location.hash.slice(1);

export function AtlasLab({ exercises, ui, texts, nodeHrefs }: AtlasLabProps) {
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const current = exercises.find((e) => e.id === hash) ?? exercises[0];
  const { state } = useExploreProgress();
  const allDone = exercises.every((e) => state.solved[`lab-${e.id}`]);

  return (
    <div data-node-ids={exercises.map((e) => e.id).join(" ")}>
      <nav aria-label={ui.exercisesAria} className="flex flex-wrap gap-2">
        {exercises.map((e) => {
          const done = !!state.solved[`lab-${e.id}`];
          const active = e.id === current.id;
          return (
            <a
              key={e.id}
              href={`#${e.id}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground/90 hover:border-primary/60",
                focusRing,
              )}
            >
              {done ? <Check className="size-4 text-emerald-400" aria-label={ui.solved} /> : null}
              {texts[e.id].title}
            </a>
          );
        })}
      </nav>
      {allDone ? (
        <p className="animate-celebrate mt-4 rounded-xl border border-emerald-400/50 bg-emerald-400/10 px-4 py-3 text-sm font-medium" role="status">
          {ui.done}
        </p>
      ) : null}
      {current.kind === "attack" ? (
        <Exercise key={current.id} ex={current} ui={ui} text={texts[current.id] as ExerciseText} nodeHref={nodeHrefs[current.id]} />
      ) : current.kind === "harden" ? (
        <HardenLab key={current.id} ex={current} ui={ui} text={texts[current.id]} nodeHref={nodeHrefs[current.id]} />
      ) : (
        <Tabletop key={current.id} ex={current} ui={ui} text={texts[current.id]} nodeHref={nodeHrefs[current.id]} />
      )}
    </div>
  );
}

function CodeView({ code, mark, tone }: { code: string; mark: number[]; tone: "bad" | "good" }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-background p-2 font-mono text-xs leading-relaxed" tabIndex={0}>
      <code className="block min-w-max">
        {code.split("\n").map((l, i) => (
          <div
            key={i}
            className={cn(
              "flex rounded px-1",
              mark.includes(i + 1) && (tone === "bad" ? "bg-red-500/10 ring-1 ring-red-400/40" : "bg-emerald-500/10 ring-1 ring-emerald-400/40"),
            )}
          >
            <span aria-hidden className="w-6 shrink-0 select-none pr-2 text-right text-muted-foreground">
              {i + 1}
            </span>
            <span className="whitespace-pre">{l || " "}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}

function Exercise({ ex, ui, text, nodeHref }: { ex: LabExercise; ui: LabUi; text: ExerciseText; nodeHref: string }) {
  const { solve } = useExploreProgress();
  const [fixed, setFixed] = useState(false);
  const [value, setValue] = useState(ex.initial);
  const [result, setResult] = useState<(RunResult & { wasFixed: boolean }) | null>(null);
  const [broke, setBroke] = useState(false);
  const [proved, setProved] = useState(false);

  const run = () => {
    const r = ex.id === "idor" ? runIdor(value, fixed) : ex.id === "sqli" ? runSqli(value, fixed) : runXss(value, fixed);
    setResult({ ...r, wasFixed: fixed });
    if (!fixed && r.leaked) setBroke(true);
    if (fixed && broke && !r.leaked) setProved(true);
  };

  useEffect(() => {
    if (broke && proved) solve(`lab-${ex.id}`);
  }, [broke, proved, ex.id, solve]);

  const steps = useMemo(
    () => [
      { label: ui.step1, done: broke },
      { label: ui.step2, done: fixed || proved },
      { label: ui.step3, done: proved },
    ],
    [broke, fixed, proved, ui],
  );

  const builtLabel = ex.id === "sqli" ? ui.builtSql : ui.builtHtml;
  const verdict = !result
    ? null
    : result.leaked
      ? { tone: "bad" as const, text: ex.id === "xss" ? ui.scriptRan : ui.leak }
      : result.wasFixed
        ? { tone: "good" as const, text: ui.blocked }
        : ex.id === "xss" && result.outcome === "markup"
          ? { tone: "info" as const, text: ui.markupShown }
          : ex.id === "xss"
            ? { tone: "info" as const, text: ui.textShown }
            : { tone: "info" as const, text: ui.normal };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="min-w-0 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-xl font-bold tracking-tight">{text.title}</h2>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">{fmt(ui.youAre, { name: ME.name, id: ME.id })}</p>
        <h3 className="mt-4 font-mono text-xs uppercase tracking-wider text-primary">{ui.story}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text.story}</p>
        <h3 className="mt-4 font-mono text-xs uppercase tracking-wider text-primary">{ui.goal}</h3>
        <p className="mt-1 text-sm font-medium">{text.goal}</p>

        <ol className="mt-4 flex flex-wrap gap-2" aria-label="steps">
          {steps.map((s, i) => (
            <li
              key={s.label}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]",
                s.done ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-400" : "border-border text-muted-foreground",
              )}
            >
              {s.done ? <Check className="size-3" aria-hidden /> : <span aria-hidden>{i + 1}</span>}
              {s.label}
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-primary">
            {fixed ? <ShieldCheck className="size-3.5" aria-hidden /> : <ShieldAlert className="size-3.5" aria-hidden />}
            {fixed ? ui.fixedCode : ui.vulnerableCode}
          </h3>
          <button
            type="button"
            onClick={() => {
              if (!broke && !fixed) return;
              setFixed((f) => !f);
              setResult(null);
            }}
            disabled={!broke && !fixed}
            title={!broke && !fixed ? ui.needBreak : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-xs transition-colors disabled:opacity-50",
              fixed ? "border-border text-muted-foreground hover:text-foreground" : "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20",
              focusRing,
            )}
          >
            {!broke && !fixed ? <Lock className="size-3.5" aria-hidden /> : <Wrench className="size-3.5" aria-hidden />}
            {fixed ? ui.undoFix : ui.applyFix}
          </button>
        </div>
        <div className="mt-2">
          <CodeView code={fixed ? ex.fixed : ex.vulnerable} mark={fixed ? ex.fixedLines : ex.vulnLines} tone={fixed ? "good" : "bad"} />
        </div>
        {fixed ? (
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
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary">{ui.attack}</h3>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">{ui.safe}</p>
        <label className="mt-4 block text-sm font-medium" htmlFor={`field-${ex.id}`}>
          {text.field}
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id={`field-${ex.id}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") run();
            }}
            spellCheck={false}
            autoComplete="off"
            className={cn("min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm", focusRing)}
          />
          <button
            type="button"
            onClick={run}
            className={cn("inline-flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 font-mono text-xs text-primary hover:bg-primary/20", focusRing)}
          >
            <Play className="size-3.5" aria-hidden /> {ui.send}
          </button>
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{ui.presets}</p>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {ex.presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue(p)}
              className={cn("max-w-full truncate rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[11px] hover:border-primary/60", focusRing)}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {ui.hint}: {text.hint}
        </p>

        <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-primary">{ui.response}</h3>
        <div aria-live="polite" className="mt-1.5 min-h-24">
          {result ? (
            <div className="space-y-3">
              {result.built ? (
                <div>
                  <p className="font-mono text-[11px] text-muted-foreground">{builtLabel}</p>
                  <pre className="mt-1 overflow-x-auto rounded-lg border border-border bg-background p-2 font-mono text-xs" tabIndex={0}>
                    {result.built}
                  </pre>
                </div>
              ) : null}
              <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-background p-2 font-mono text-xs" tabIndex={0}>
                {result.output}
              </pre>
              {verdict ? (
                <p
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium",
                    verdict.tone === "bad" && "border-red-400/50 bg-red-500/10 text-red-400",
                    verdict.tone === "good" && "border-emerald-400/50 bg-emerald-500/10 text-emerald-400",
                    verdict.tone === "info" && "border-border text-muted-foreground",
                  )}
                >
                  {verdict.text}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{fixed ? ui.attackedFixed : ui.noResponse}</p>
          )}
        </div>
      </section>
    </div>
  );
}
