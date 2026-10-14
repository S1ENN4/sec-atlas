"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, RotateCcw, ShieldCheck, Swords } from "lucide-react";

import { fmt } from "@/i18n/format";
import { cn } from "@/lib/utils";

export interface ScenarioStrings {
  tablistAria: string;
  stagesAria: string;
  step: string;
  reveal: string;
  nextStep: string;
  finish: string;
  end: string;
  layersIntro: string;
  layersOutro: string;
  replay: string;
}

export interface ScenarioStageData {
  id: string;
  index: string;
  name: string;
}

export interface ScenarioStepData {
  stageId: string;
  happens: string;
  stops: string;
  controlTitle: string;
  controlHref: string;
}

export interface ScenarioData {
  id: string;
  domain: string;
  domainName: string;
  title: string;
  summary: string;
  stages: ScenarioStageData[];
  steps: ScenarioStepData[];
}

// Step-through of one incident. For each step the reader first sees what
// happens (the attack / accident), then reveals which control answers it.
// The stage track on top lights up the stage the current step lives in.
export function ScenarioPlayer({ scenarios, t }: { scenarios: ScenarioData[]; t: ScenarioStrings }) {
  const [sid, setSid] = useState(scenarios[0].id);
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const sc = scenarios.find((s) => s.id === sid) ?? scenarios[0];
  const cur = sc.steps[step];
  const finished = step >= sc.steps.length;

  const pick = (id: string) => {
    setSid(id);
    setStep(0);
    setRevealed(false);
  };

  const advance = () => {
    setStep((s) => s + 1);
    setRevealed(false);
  };

  const reachedStages = new Set(sc.steps.slice(0, finished ? sc.steps.length : step + 1).map((s) => s.stageId));

  return (
    <div data-domain={sc.domain}>
      <div role="tablist" aria-label={t.tablistAria} className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={s.id === sid}
            onClick={() => pick(s.id)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              s.id === sid ? "border-primary/60 bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.domainName}</span>
            <span className="font-medium">{s.title}</span>
          </button>
        ))}
      </div>

      <p className="mt-5 max-w-2xl text-sm text-muted-foreground">{sc.summary}</p>

      <ol className="mt-6 flex flex-wrap gap-2" aria-label={t.stagesAria}>
        {sc.stages.map((st) => {
          const active = !finished && cur.stageId === st.id;
          const passed = reachedStages.has(st.id) && !active;
          return (
            <li
              key={st.id}
              aria-current={active ? "step" : undefined}
              className={cn(
                "rounded-md border px-3 py-1.5 font-mono text-xs transition-all duration-300",
                active && "scale-105 border-primary bg-primary/15 text-primary shadow-[0_0_20px_-6px_var(--primary)]",
                passed && "border-primary/30 text-foreground/80",
                !active && !passed && "border-border text-muted-foreground"
              )}
            >
              <span className="text-primary/80">{st.index}</span> {st.name}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        {finished ? (
          <div className="animate-pop-in">
            <p className="flex items-center gap-2 font-mono text-sm text-primary">
              <ShieldCheck className="size-4" aria-hidden /> {t.end}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{t.layersIntro}</p>
            <ol className="mt-3 space-y-1.5">
              {sc.steps.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="size-3.5 text-primary" aria-hidden />
                  <Link href={s.controlHref} className="font-medium hover:text-primary">
                    {s.controlTitle}
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">
              {t.layersOutro}
            </p>
            <button
              type="button"
              onClick={() => pick(sc.id)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <RotateCcw className="size-3.5" aria-hidden /> {t.replay}
            </button>
          </div>
        ) : (
          <div key={`${sc.id}-${step}`} className="animate-pop-in">
            <p className="font-mono text-[11px] text-muted-foreground">
              {fmt(t.step, { n: step + 1, total: sc.steps.length })}
            </p>
            <p className="mt-3 flex items-start gap-3 text-base leading-snug">
              <Swords className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden />
              <span>{cur.happens}</span>
            </p>

            {revealed ? (
              <div className="animate-pop-in mt-5 rounded-lg border border-primary/40 bg-primary/5 p-4" role="status">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="size-4 text-primary" aria-hidden />
                  <Link href={cur.controlHref} className="hover:text-primary">
                    {cur.controlTitle}
                  </Link>
                </p>
                <p className="mt-1.5 text-sm leading-snug text-foreground/85">{cur.stops}</p>
                <button
                  type="button"
                  onClick={advance}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {step + 1 < sc.steps.length ? t.nextStep : t.finish} <ArrowRight className="size-3.5" aria-hidden />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Eye className="size-3.5" aria-hidden /> {t.reveal}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
