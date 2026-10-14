"use client";

// Explorable map: a world of nested places (repository, CI workflow, scanners,
// registry, cluster, runtime). Opening a node makes it the focus and shows its
// children beside it; "back" climbs one level. The current node lives in the URL
// hash (#sast), so the browser back button, deep links and reloads all work.
// Missions are guided trails, challenges are "find the risky lines" exercises.

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  FileCode2,
  Flag,
  Lightbulb,
  MapPin,
  MoveDown,
  MoveLeft,
  MoveRight,
  Package,
  RotateCcw,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { NodeKind } from "@/content/explore/world";
import type { ExploreText } from "@/content/explore/text";
import { fmt } from "@/i18n/format";
import { useExploreProgress } from "@/lib/explore-progress";
import { cn } from "@/lib/utils";

export interface ExploreNodeData {
  id: string;
  kind: NodeKind;
  parent: string | null;
  children: string[];
  depth: number;
  title: string;
  summary: string;
  points: string[];
  where?: string;
  path?: string;
  topics: { href: string; label: string }[];
  code?: { lang: string; text: string };
  risky?: number[];
  challenge?: { prompt: string; why: string; hint: string };
}

export interface ExploreMissionData {
  id: string;
  title: string;
  intro: string;
  steps: string[];
}

export type ExploreUi = Record<Exclude<keyof ExploreText["ui"], "kinds">, string> & { kinds: Record<NodeKind, string> };

const KIND_ICON: Record<NodeKind, LucideIcon> = {
  place: MapPin,
  file: FileCode2,
  tool: Wrench,
  check: ShieldCheck,
  artifact: Package,
  concept: Lightbulb,
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getHash = () => {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return "";
  }
};

export interface ExploreMapProps {
  nodes: Record<string, ExploreNodeData>;
  rootId: string;
  missions: ExploreMissionData[];
  ui: ExploreUi;
}

export function ExploreMap({ nodes, rootId, missions, ui }: ExploreMapProps) {
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const curId = nodes[hash] ? hash : rootId;
  const cur = nodes[curId];
  const { state, visit, solve, setMission, reset } = useExploreProgress();

  const go = useCallback(
    (id: string) => {
      window.location.hash = id === rootId ? "" : id;
    },
    [rootId],
  );

  // Direction of the last move decides which way the stage slides in. Derived
  // during render (not in an effect) so the first frame already uses it.
  const [prev, setPrev] = useState<{ id: string; dir: "in" | "out" | "side" }>({ id: curId, dir: "side" });
  if (prev.id !== curId) {
    const a = nodes[prev.id]?.depth ?? 0;
    setPrev({ id: curId, dir: cur.depth > a ? "in" : cur.depth < a ? "out" : "side" });
  }

  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    visit(curId);
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const top = stageRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) stageRef.current?.scrollIntoView({ block: "start" });
  }, [curId, visit]);

  const up = useCallback(() => {
    if (cur.parent) go(cur.parent);
  }, [cur.parent, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" && e.key !== "Backspace") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.querySelector("dialog[open]")) return;
      if (cur.parent) {
        e.preventDefault();
        up();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur.parent, up]);

  // --- missions ---------------------------------------------------------------
  const stepDone = (id: string) => (nodes[id]?.challenge ? !!state.solved[id] : !!state.visited[id]);
  const mission = missions.find((m) => m.id === state.mission) ?? null;
  const stepIdx = mission ? mission.steps.findIndex((s) => !stepDone(s)) : -1;
  const target = mission && stepIdx >= 0 ? mission.steps[stepIdx] : null;
  const complete = !!mission && stepIdx === -1;

  const isAncestorOrSelf = (a: string, b: string) => {
    for (let n: ExploreNodeData | undefined = nodes[b]; n; n = n.parent ? nodes[n.parent] : undefined) if (n.id === a) return true;
    return false;
  };
  const onWay = (id: string) => !!target && isAncestorOrSelf(id, target);

  const total = Object.keys(nodes).length - 1;
  const explored = Object.keys(state.visited).filter((id) => id !== rootId && nodes[id]).length;

  const crumbs: ExploreNodeData[] = [];
  for (let n = cur.parent ? nodes[cur.parent] : undefined; n; n = n.parent ? nodes[n.parent] : undefined) crumbs.unshift(n);
  const parent = cur.parent ? nodes[cur.parent] : null;
  const label = (n: ExploreNodeData) => (n.id === rootId ? ui.trailhead : n.title);
  const stageAnim = prev.dir === "in" ? "explore-stage-in" : prev.dir === "out" ? "explore-stage-out" : "explore-stage-side";

  const bar = (
    <MissionBar
        ui={ui}
        missions={missions}
        nodes={nodes}
        mission={mission}
        stepIdx={stepIdx}
        target={target}
        complete={complete}
        stepDone={stepDone}
        curId={curId}
        onStart={setMission}
        onGo={go}
      />
  );

  return (
    <div className="space-y-8">
      {mission ? bar : null}

      <div ref={stageRef} role="region" aria-label={ui.stageAria} className="scroll-mt-20">
        <div className="mb-4 flex min-h-9 flex-wrap items-center gap-x-3 gap-y-2">
          {parent ? (
            <button
              type="button"
              onClick={up}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs text-foreground/90 transition-colors hover:border-primary/60 hover:text-primary",
                focusRing,
                target && !onWay(curId) && "explore-target border-primary/60",
              )}
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              <span className="sr-only">{fmt(ui.backTo, { name: label(parent) })}</span>
              <span aria-hidden>{ui.back}</span>
            </button>
          ) : null}
          <nav aria-label={ui.pathAria} className="min-w-0 lg:hidden">
            <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-muted-foreground">
              {crumbs.map((c) => (
                <li key={c.id} className="flex items-center gap-1">
                  <button type="button" onClick={() => go(c.id)} className={cn("rounded px-1 hover:text-foreground", focusRing)}>
                    {label(c)}
                  </button>
                  <ChevronRight className="size-3" aria-hidden />
                </li>
              ))}
              <li aria-current="page" className="text-foreground">
                {label(cur)}
              </li>
            </ol>
          </nav>
          {cur.parent ? <p className="ml-auto hidden font-mono text-[11px] text-muted-foreground lg:block">{ui.keys}</p> : null}
        </div>

        <div key={curId} className={stageAnim}>
          {curId === rootId ? (
            <Trailhead
              node={cur}
              nodes={nodes}
              ui={ui}
              state={state}
              onOpen={go}
              onWay={onWay}
              target={target}
            />
          ) : (
            <div
              className={cn(
                "grid gap-8",
                cur.children.length > 0
                  ? "lg:grid-cols-[10rem_minmax(0,1.1fr)_minmax(0,0.9fr)]"
                  : "lg:grid-cols-[10rem_minmax(0,1fr)]",
              )}
            >
              <nav aria-label={ui.pathAria} className="hidden lg:block">
                <ol className="relative space-y-2 pb-2">
                  {crumbs.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => go(c.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg border border-border bg-card/60 px-2.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground",
                          focusRing,
                        )}
                      >
                        {(() => {
                          const I = KIND_ICON[c.kind];
                          return <I className="size-3.5 shrink-0" aria-hidden />;
                        })()}
                        <span className="truncate">{label(c)}</span>
                      </button>
                      <span aria-hidden className="ml-4 block h-2 border-l border-dashed border-border" />
                    </li>
                  ))}
                </ol>
              </nav>

              <FocusCard
                node={cur}
                nodes={nodes}
                ui={ui}
                headingRef={headingRef}
                solved={!!state.solved[cur.id]}
                onSolve={() => solve(cur.id)}
                onOpen={go}
                targetIsHere={target === cur.id}
              />

              {cur.children.length > 0 ? (
                <section aria-labelledby="explore-inside">
                  <h3 id="explore-inside" className="font-mono text-xs uppercase tracking-wider text-primary">
                    {fmt(ui.childrenTitle, { name: cur.title })}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{ui.childrenHint}</p>
                  <ul className="relative mt-4 space-y-3 border-l border-border pl-5">
                    {cur.children.map((id, i) => (
                      <li key={id} className="explore-rise relative" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                        <span aria-hidden className="absolute -left-5 top-1/2 h-px w-5 bg-border" />
                        <ChildCard
                          node={nodes[id]}
                          ui={ui}
                          seen={!!state.visited[id]}
                          solved={!!state.solved[id]}
                          way={onWay(id)}
                          onOpen={go}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {cur.title}
        </p>
      </div>

      {mission ? null : bar}

      <footer className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={explored}
            aria-label={fmt(ui.explored, { done: explored, total })}
            className="h-1.5 w-32 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${(explored / total) * 100}%` }} />
          </div>
          <span>{fmt(ui.explored, { done: explored, total })}</span>
        </div>
        <button
          type="button"
          onClick={reset}
          className={cn("inline-flex items-center gap-1.5 rounded px-1 hover:text-foreground", focusRing)}
        >
          <RotateCcw className="size-3" aria-hidden /> {ui.reset}
        </button>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------

function KindChip({ kind, ui }: { kind: NodeKind; ui: ExploreUi }) {
  const Icon = KIND_ICON[kind];
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3" aria-hidden /> {ui.kinds[kind]}
    </span>
  );
}

function ChildCard({
  node,
  ui,
  seen,
  solved,
  way,
  onOpen,
}: {
  node: ExploreNodeData;
  ui: ExploreUi;
  seen: boolean;
  solved: boolean;
  way: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(node.id)}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border bg-card p-3.5 text-left transition-[border-color,transform,background-color] duration-150 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5",
        way ? "explore-target border-primary/70" : "border-border",
        focusRing,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <KindChip kind={node.kind} ui={ui} />
          {node.challenge ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-400">
              <Swords className="size-3" aria-hidden /> {solved ? ui.challengeSolved : ui.challengeTitle}
            </span>
          ) : null}
          {seen ? (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
              <Check className="size-3" aria-hidden /> {ui.visited}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-sm font-semibold">{node.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{node.summary}</p>
      </div>
      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
    </button>
  );
}

function Trailhead({
  node,
  nodes,
  ui,
  state,
  onOpen,
  onWay,
  target,
}: {
  node: ExploreNodeData;
  nodes: Record<string, ExploreNodeData>;
  ui: ExploreUi;
  state: { visited: Record<string, 1>; solved: Record<string, 1> };
  onOpen: (id: string) => void;
  onWay: (id: string) => boolean;
  target: string | null;
}) {
  const COLS = 4;
  const stations = node.children;
  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-lg text-muted-foreground">{node.summary}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {node.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <ol className="mt-8 flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14">
        {stations.map((id, i) => {
          const n = nodes[id];
          const row = Math.floor(i / COLS);
          const col = row % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);
          const hasNext = i < stations.length - 1;
          const nextInRow = hasNext && Math.floor((i + 1) / COLS) === row;
          const leftToRight = row % 2 === 0;
          const Icon = KIND_ICON[n.kind];
          const seen = !!state.visited[id];
          return (
            <li key={id} className="explore-rise relative" style={{ gridColumn: col + 1, gridRow: row + 1, animationDelay: `${i * 50}ms` }}>
              <button
                type="button"
                onClick={() => onOpen(id)}
                className={cn(
                  "group flex h-full w-full flex-col rounded-2xl border bg-card p-4 text-left transition-[border-color,transform,background-color] duration-150 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5",
                  onWay(id) && target ? "explore-target border-primary/70" : "border-border",
                  focusRing,
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-mono text-xs text-primary/90">
                    <span className="grid size-6 place-items-center rounded-full border border-primary/40 bg-primary/10">{i + 1}</span>
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  {seen ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                      <Check className="size-3" aria-hidden /> {ui.visited}
                    </span>
                  ) : i === 0 ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-primary">
                      <Flag className="size-3" aria-hidden /> {ui.start}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-base font-semibold">{n.title}</p>
                <p className="mt-1 line-clamp-3 text-xs leading-snug text-muted-foreground">{n.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[11px] text-primary">
                  {ui.enter} <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </button>
              {hasNext ? <MoveDown className="absolute -bottom-8 left-1/2 size-4 -translate-x-1/2 text-primary/50 lg:hidden" aria-hidden /> : null}
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
  );
}

function FocusCard({
  node,
  nodes,
  ui,
  headingRef,
  solved,
  onSolve,
  onOpen,
  targetIsHere,
}: {
  node: ExploreNodeData;
  nodes: Record<string, ExploreNodeData>;
  ui: ExploreUi;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  solved: boolean;
  onSolve: () => void;
  onOpen: (id: string) => void;
  targetIsHere: boolean;
}) {
  const siblings = node.parent ? nodes[node.parent].children : [];
  const nextId = siblings[siblings.indexOf(node.id) + 1];
  const next = nextId ? nodes[nextId] : null;
  return (
    <article className={cn("min-w-0 rounded-2xl border bg-card p-5 sm:p-6", targetIsHere ? "explore-target border-primary/70" : "border-border")}>
      <div className="flex flex-wrap items-center gap-2">
        <KindChip kind={node.kind} ui={ui} />
        {node.challenge ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-400">
            <Swords className="size-3" aria-hidden /> {solved ? ui.challengeSolved : ui.challengeTitle}
          </span>
        ) : null}
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-2xl font-bold tracking-tight outline-none">
        {node.title}
      </h2>
      {node.path || node.where ? (
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-wider">{ui.whereTitle}</span>
          {node.path ? <code className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground">{node.path}</code> : null}
          {node.where ? <span>{node.where}</span> : null}
        </p>
      ) : null}
      <p className="mt-4 leading-relaxed text-foreground/90">{node.summary}</p>

      <h3 className="mt-5 font-mono text-xs uppercase tracking-wider text-primary">{ui.pointsTitle}</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        {node.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {node.code ? (
        <div className="mt-6">
          {node.challenge && node.risky ? (
            <Challenge key={node.id} node={node} ui={ui} solved={solved} onSolve={onSolve} />
          ) : (
            <CodeBlock code={node.code} ui={ui} />
          )}
        </div>
      ) : null}

      {node.topics.length > 0 ? (
        <>
          <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-primary">{ui.studyTitle}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.topics.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/60 hover:text-primary",
                  focusRing,
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </>
      ) : null}

      {node.children.length === 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <p className="font-mono text-xs text-muted-foreground">{ui.leaf}</p>
          {next ? (
            <button
              type="button"
              onClick={() => onOpen(next.id)}
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20",
                focusRing,
              )}
            >
              {ui.nextOnTrail}: {next.title} <ArrowRight className="size-3.5" aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

// --- code ---------------------------------------------------------------------

function splitComment(line: string): [string, string] {
  const m = /(^|\s)#/.exec(line);
  if (!m) return [line, ""];
  const at = m.index + m[1].length;
  return [line.slice(0, at), line.slice(at)];
}

function CodeBlock({ code, ui }: { code: { lang: string; text: string }; ui: ExploreUi }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: nothing to do */
    }
  };
  const lines = code.text.split("\n");
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span>
          {ui.codeTitle} · {code.lang}
        </span>
        <button type="button" onClick={copy} className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:text-foreground", focusRing)}>
          {copied ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
          <span aria-live="polite">{copied ? ui.copied : ui.copy}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed" tabIndex={0}>
        <code>
          {lines.map((l, i) => {
            const [body, comment] = splitComment(l);
            return (
              <div key={i} className="flex">
                <span aria-hidden className="w-7 shrink-0 select-none pr-3 text-right text-muted-foreground">
                  {i + 1}
                </span>
                <span className="whitespace-pre">
                  {body}
                  {comment ? <span className="text-muted-foreground">{comment}</span> : null}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}

function Challenge({ node, ui, solved, onSolve }: { node: ExploreNodeData; ui: ExploreUi; solved: boolean; onSolve: () => void }) {
  const risky = node.risky ?? [];
  const lines = (node.code?.text ?? "").split("\n");
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<null | { right: number; extra: number }>(null);
  const [shown, setShown] = useState(false);
  const reveal = solved || shown;

  const toggle = (n: number) => {
    if (reveal) return;
    setResult(null);
    setSel((s) => {
      const c = new Set(s);
      if (c.has(n)) c.delete(n);
      else c.add(n);
      return c;
    });
  };
  const check = () => {
    const right = risky.filter((n) => sel.has(n)).length;
    const extra = [...sel].filter((n) => !risky.includes(n)).length;
    if (right === risky.length && extra === 0) {
      setShown(true);
      onSolve();
    } else setResult({ right, extra });
  };

  const c = node.challenge!;
  return (
    <section aria-label={ui.challengeTitle} className="rounded-xl border border-amber-400/40 bg-amber-400/5 p-4">
      <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400">
        <Swords className="size-3.5" aria-hidden /> {ui.challengeTitle}
        {solved ? (
          <span className="ml-auto inline-flex items-center gap-1 text-emerald-400">
            <Check className="size-3" aria-hidden /> {ui.challengeSolved}
          </span>
        ) : null}
      </h3>
      <p className="mt-2 text-sm font-medium">{c.prompt}</p>
      {!reveal ? <p className="mt-1 text-xs text-muted-foreground">{fmt(ui.challengeSelect, { n: risky.length })}</p> : null}

      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-background p-2 font-mono text-xs leading-relaxed">
        <code className="block min-w-max">
          {lines.map((l, i) => {
            const n = i + 1;
            const isRisky = risky.includes(n);
            const on = sel.has(n);
            const [body, comment] = splitComment(l);
            return (
              <button
                key={n}
                type="button"
                aria-pressed={reveal ? isRisky : on}
                aria-label={`${fmt(ui.lineAria, { n })}: ${l}`}
                onClick={() => toggle(n)}
                disabled={reveal}
                className={cn(
                  "flex w-full cursor-pointer items-start rounded px-1 text-left disabled:cursor-default",
                  focusRing,
                  !reveal && "hover:bg-muted",
                  !reveal && on && "bg-primary/15 ring-1 ring-primary/50",
                  reveal && isRisky && "bg-red-500/10 ring-1 ring-red-400/40",
                )}
              >
                <span aria-hidden className="w-7 shrink-0 select-none pr-3 text-right text-muted-foreground">
                  {n}
                </span>
                <span className="whitespace-pre">
                  {body || " "}
                  {comment ? <span className="text-muted-foreground">{comment}</span> : null}
                </span>
              </button>
            );
          })}
        </code>
      </pre>

      {reveal ? (
        <div className="explore-rise mt-3 text-sm leading-relaxed" role="status">
          {solved ? <p className="font-semibold text-emerald-400">{ui.challengeCorrect}</p> : null}
          <p className="mt-1 text-foreground/90">{c.why}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={check}
              disabled={sel.size === 0}
              className={cn(
                "rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 disabled:opacity-40",
                focusRing,
              )}
            >
              {ui.challengeCheck}
            </button>
            <button
              type="button"
              onClick={() => {
                setSel(new Set());
                setResult(null);
              }}
              disabled={sel.size === 0}
              className={cn("rounded-md px-2 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-40", focusRing)}
            >
              {ui.challengeClear}
            </button>
            <button type="button" onClick={() => setShown(true)} className={cn("ml-auto rounded-md px-2 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground", focusRing)}>
              {ui.challengeShow}
            </button>
          </div>
          <div role="status" aria-live="polite">
            {result ? (
              <p className="text-sm text-amber-400">
                {fmt(ui.challengeWrong, { right: result.right, n: risky.length, extra: result.extra })} {c.hint}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

// --- missions -----------------------------------------------------------------

function MissionBar({
  ui,
  missions,
  nodes,
  mission,
  stepIdx,
  target,
  complete,
  stepDone,
  curId,
  onStart,
  onGo,
}: {
  ui: ExploreUi;
  missions: ExploreMissionData[];
  nodes: Record<string, ExploreNodeData>;
  mission: ExploreMissionData | null;
  stepIdx: number;
  target: string | null;
  complete: boolean;
  stepDone: (id: string) => boolean;
  curId: string;
  onStart: (id: string | null, clear?: string[]) => void;
  onGo: (id: string) => void;
}) {
  if (mission) {
    return (
      <section aria-label={ui.missionsTitle} className={cn("rounded-2xl border bg-card p-4 sm:p-5", complete ? "animate-celebrate border-emerald-400/50" : "border-primary/40")}>
        <div className="flex flex-wrap items-center gap-3">
          {complete ? <Trophy className="size-5 text-emerald-400" aria-hidden /> : <Target className="size-5 text-primary" aria-hidden />}
          <div className="min-w-[14rem] flex-1">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">{fmt(ui.missionActive, { name: mission.title })}</p>
            {complete ? (
              <p className="mt-1 text-sm">
                <span className="font-semibold">{fmt(ui.missionDone, { name: mission.title })}</span> {ui.missionDoneBody}
              </p>
            ) : (
              <p className="mt-1 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{fmt(ui.missionStep, { n: stepIdx + 1, total: mission.steps.length })}</span>{" "}
                · {ui.missionTarget}: <span className="font-semibold">{target ? nodes[target].title : ""}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!complete && target && target !== curId ? (
              <button
                type="button"
                onClick={() => onGo(target)}
                className={cn("inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary hover:bg-primary/20", focusRing)}
              >
                {ui.missionGo} <ArrowRight className="size-3.5" aria-hidden />
              </button>
            ) : null}
            <button type="button" onClick={() => onStart(null)} className={cn("rounded-md px-2 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground", focusRing)}>
              {ui.missionLeave}
            </button>
          </div>
        </div>
        <ol className="mt-3 flex flex-wrap gap-1.5" aria-hidden>
          {mission.steps.map((s, i) => (
            <li
              key={s}
              className={cn(
                "grid size-6 place-items-center rounded-full border font-mono text-[10px]",
                stepDone(s) ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-400" : i === stepIdx ? "border-primary text-primary" : "border-border text-muted-foreground",
              )}
            >
              {stepDone(s) ? <Check className="size-3" /> : i + 1}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section aria-labelledby="explore-missions">
      <h2 id="explore-missions" className="font-mono text-xs uppercase tracking-wider text-primary">
        {ui.missionsTitle}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{ui.missionsHint}</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {missions.map((m) => {
          const done = m.steps.filter(stepDone).length;
          return (
            <li key={m.id} className="flex flex-col rounded-xl border border-border bg-card p-3.5">
              <p className="text-sm font-semibold">{m.title}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{m.intro}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {done}/{m.steps.length}
                </span>
                <button
                  type="button"
                  onClick={() => onStart(m.id, done === m.steps.length ? m.steps : [])}
                  className={cn("rounded-md border border-primary/50 bg-primary/10 px-2.5 py-1 font-mono text-xs text-primary hover:bg-primary/20", focusRing)}
                >
                  {done === m.steps.length ? ui.missionAgain : ui.missionStart}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
