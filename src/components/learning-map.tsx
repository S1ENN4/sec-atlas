"use client";

// Learning map for one domain. Topics are laid out by LEVEL (Foundations →
// Practice → Advanced) in columns, ordered by pipeline phase inside a column,
// with prerequisite arrows from `levels.ts`. Each card shows its state (done,
// ready, locked) and the recommended next step is called out; the side panel
// previews a topic (summary, key points, reading time, prerequisites, what it
// unlocks, relations) without leaving the page. There is no per-domain layout
// to maintain: position comes from level and prerequisites alone.
//
// On narrow screens the three columns simply stack, which doubles as the list
// view. Progress is read from the reader's local store (no network).

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Circle, Link2, Lock, Sparkles, X } from "lucide-react";

import type { GraphData, MapTopic } from "@/components/graph-data";
import { TopicIcon } from "@/components/topic-icon";
import type { DomainId } from "@/content/types";
import { fmt } from "@/i18n/format";
import { missingPrereqs, pickNext, topicState, unlocksOf, type TopicState } from "@/lib/learning";
import { topicKey, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

interface Edge {
  id: string;
  d: string;
  strong: boolean;
}

export function LearningMap({ data }: { data: GraphData }) {
  const { strings: s, journey: j, topics, domainId } = data;
  const { state, isSeen, toggleSeen } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const els = useRef(new Map<string, HTMLElement>());

  const byId = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);
  const stageIndex = useMemo(() => new Map(data.stages.map((st, i) => [st.id, i])), [data.stages]);
  const done = useCallback((id: string) => !!state.seen[id], [state]);
  const stateOf = (n: MapTopic): TopicState => topicState(n, byId, done);
  const missing = (n: MapTopic) => missingPrereqs(n, byId, done).length;
  const next = useMemo(() => pickNext(topics, done), [topics, done]);
  const anyDone = topics.some((t) => done(t.id));

  const levelName = (l: number) => (l === 1 ? j.level1 : l === 2 ? j.level2 : j.level3);
  const levelDesc = (l: number) => (l === 1 ? j.level1Desc : l === 2 ? j.level2Desc : j.level3Desc);
  const stateLabel = (n: MapTopic, st: TopicState) => (st === "done" ? j.stateDone : st === "ready" ? j.stateReady : fmt(j.stateLocked, { n: missing(n) }));

  // Columns: by level; inside a column, by pipeline phase and then authoring order.
  const columns = useMemo(
    () =>
      [1, 2, 3].map((lv) =>
        topics
          .map((t, i) => ({ t, i }))
          .filter(({ t }) => t.level === lv)
          .sort((a, b) => (stageIndex.get(a.t.stage ?? "") ?? 99) - (stageIndex.get(b.t.stage ?? "") ?? 99) || a.i - b.i)
          .map(({ t }) => t),
      ),
    [topics, stageIndex],
  );

  // Deep links: ?focus=<slug> on load, and the "kb:focus" event from the search palette.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("focus");
    if (slug && byId.has(`${domainId}/${slug}`)) setSelectedId(`${domainId}/${slug}`);
    const onFocus = (e: Event) => {
      const d = (e as CustomEvent<{ domain: string; slug: string }>).detail;
      if (d?.domain === domainId && byId.has(`${domainId}/${d.slug}`)) setSelectedId(`${domainId}/${d.slug}`);
    };
    window.addEventListener("kb:focus", onFocus);
    return () => window.removeEventListener("kb:focus", onFocus);
  }, [byId, domainId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedId]);

  // On small screens the panel sits below the cards: bring it into view on select.
  useEffect(() => {
    if (selectedId && window.innerWidth < 1024) panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  const active = hoverId ?? selectedId;

  // --- prerequisite arrows (measured, drawn over the columns) -----------------
  const recompute = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.innerWidth < 768) {
      setEdges([]);
      return;
    }
    const w = wrap.getBoundingClientRect();
    const rect = (id: string) => {
      const el = els.current.get(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { l: r.left - w.left, r: r.right - w.left, t: r.top - w.top, b: r.bottom - w.top };
    };
    const link = (from: string, to: string, strong: boolean): Edge | null => {
      const a = rect(from);
      const b = rect(to);
      if (!a || !b) return null;
      const my = (a.t + a.b) / 2;
      const ty = (b.t + b.b) / 2;
      if (b.l - a.r > 12) {
        const dx = (b.l - a.r) / 2;
        return { id: `${from}>${to}`, strong, d: `M ${a.r} ${my} C ${a.r + dx} ${my}, ${b.l - dx} ${ty}, ${b.l} ${ty}` };
      }
      const down = b.t > a.t;
      const x1 = (a.l + a.r) / 2;
      const x2 = (b.l + b.r) / 2;
      const y1 = down ? a.b : a.t;
      const y2 = down ? b.t : b.b;
      const dy = (y2 - y1) / 2;
      return { id: `${from}>${to}`, strong, d: `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}` };
    };
    const out: Edge[] = [];
    const seenIds = new Set<string>();
    const push = (e: Edge | null) => {
      if (e && !seenIds.has(e.id)) {
        seenIds.add(e.id);
        out.push(e);
      }
    };
    if (active) {
      const n = byId.get(active);
      if (n) {
        for (const r of n.requires) if (byId.has(r)) push(link(r, n.id, true));
        for (const m of unlocksOf(n.id, topics)) push(link(n.id, m.id, true));
      }
    }
    if (showAll) {
      for (const n of topics) for (const r of n.requires) if (byId.has(r)) push(link(r, n.id, false));
    }
    setEdges(out);
  }, [active, byId, topics, showAll]);

  useLayoutEffect(recompute, [recompute]);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(wrap);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute]);

  const total = topics.length;
  const doneCount = topics.filter((t) => done(t.id)).length;
  const selected = selectedId ? byId.get(selectedId) ?? null : null;
  const shown = selected ?? next;
  const stageName = (id: string | null) => data.stages.find((st) => st.id === id);

  const copy = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?focus=${selected.slug}#map`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  const stateIcon = (st: TopicState) =>
    st === "done" ? <Check className="size-3.5 text-primary" aria-hidden /> : st === "ready" ? <Circle className="size-3.5 text-primary" aria-hidden /> : <Lock className="size-3.5 text-muted-foreground" aria-hidden />;

  const chip = (id: string) => {
    const n = byId.get(id);
    if (!n) return null;
    return (
      <li key={id}>
        <button
          type="button"
          onClick={() => setSelectedId(id)}
          className="focus-ring inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-left text-xs transition-colors hover:border-primary/60"
        >
          {stateIcon(stateOf(n))} {n.title}
        </button>
      </li>
    );
  };

  return (
    <div className="space-y-4">
      <p role="status" aria-live="polite" className="sr-only">
        {selected ? fmt(s.selected, { title: selected.title }) : ""}
      </p>

      {/* progress + next step */}
      <section aria-labelledby="map-next" className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="map-next" className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-4 text-primary" aria-hidden /> {j.nextTitle}
          </h3>
          <span className="font-mono text-xs text-muted-foreground">{fmt(j.progress, { done: doneCount, total })}</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full rounded-full bg-primary" style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }} />
        </div>
        {next ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setSelectedId(next.id)} className="focus-ring min-w-0 rounded-md text-left">
              <span className="flex items-center gap-2 font-semibold">
                <TopicIcon slug={next.slug} className="size-4 text-primary" />
                {next.title}
                {!anyDone ? (
                  <span className="rounded-full bg-primary px-2 py-px font-mono text-[9px] uppercase tracking-wider text-primary-foreground">{s.startHere}</span>
                ) : null}
              </span>
            </button>
            <Link
              href={next.href}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20"
            >
              {j.nextCta} <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{j.nextEmpty}</p>
        )}
      </section>

      <div className="gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <div ref={wrapRef} role="group" aria-label={j.mapAria} className="relative rounded-xl border border-border bg-card/40 p-4">
            <svg aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-full overflow-visible text-primary md:block">
              {edges.map((e) => (
                <path key={e.id} d={e.d} pathLength={1} fill="none" stroke="currentColor" strokeWidth={e.strong ? 2.5 : 1.5} strokeLinecap="round" opacity={e.strong ? 1 : 0.35} className="journey-edge" />
              ))}
            </svg>

            <div className="grid gap-6 md:grid-cols-3 md:gap-x-6">
              {columns.map((col, ci) => {
                const lv = ci + 1;
                const lvDone = col.filter((n) => done(n.id)).length;
                const complete = col.length > 0 && lvDone === col.length;
                if (col.length === 0) return <div key={lv} className="hidden md:block" />;
                return (
                  <div key={lv}>
                    <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                      <span className="text-muted-foreground">0{lv}</span> {levelName(lv)}
                      {complete ? (
                        <span className="animate-chip-in inline-flex items-center gap-1 rounded-full border border-primary/50 bg-primary/10 px-2 py-0.5 text-[10px] normal-case tracking-normal">
                          <Check className="size-3" aria-hidden /> {j.levelComplete}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{levelDesc(lv)}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(lvDone / col.length) * 100}%` }} />
                    </div>
                    <div className="mt-3 space-y-2">
                      {col.map((n) => {
                        const st = stateOf(n);
                        const act = active ? byId.get(active) : null;
                        const dim = !!act && !(n.id === act.id || act.requires.includes(n.id) || n.requires.includes(act.id));
                        const isNext = next?.id === n.id;
                        const stg = stageName(n.stage);
                        return (
                          <button
                            key={n.id}
                            ref={(el) => {
                              if (el) els.current.set(n.id, el);
                              else els.current.delete(n.id);
                            }}
                            type="button"
                            onClick={() => setSelectedId((cur) => (cur === n.id ? null : n.id))}
                            onMouseEnter={() => setHoverId(n.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onFocus={() => setHoverId(n.id)}
                            onBlur={() => setHoverId(null)}
                            aria-pressed={selectedId === n.id}
                            aria-label={fmt(j.nodeAria, { title: n.title, state: stateLabel(n, st) })}
                            className={cn(
                              "group relative flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              st === "done" && "border-primary/50 bg-primary/10",
                              st === "ready" && "border-primary/40 bg-card shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent)] hover:-translate-y-0.5",
                              st === "locked" && "border-border bg-card/50 hover:border-border",
                              isNext && "ring-2 ring-primary",
                              selectedId === n.id && "border-primary bg-primary/15",
                              dim && "opacity-30",
                            )}
                          >
                            <TopicIcon slug={n.slug} className={cn("mt-0.5 size-4 shrink-0", st === "locked" ? "text-muted-foreground" : "text-primary")} />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium leading-tight">{n.title}</span>
                              <span className="mt-0.5 line-clamp-1 block text-[11px] leading-snug text-muted-foreground">{n.short}</span>
                              <span className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                {stg ? (
                                  <span>
                                    {stg.index} {stg.name}
                                  </span>
                                ) : null}
                                <span>{n.minutes} {data.minRead}</span>
                                {state.quiz[topicKey(domainId as DomainId, n.slug)] ? (
                                  <span className="text-primary/80">
                                    ✓ {state.quiz[topicKey(domainId as DomainId, n.slug)].best}/{state.quiz[topicKey(domainId as DomainId, n.slug)].total}
                                  </span>
                                ) : null}
                              </span>
                            </span>
                            <span className="mt-0.5 shrink-0">{stateIcon(st)}</span>
                            {isNext ? (
                              <span className="absolute -top-2 right-2 rounded-full bg-primary px-2 py-px font-mono text-[9px] uppercase tracking-wider text-primary-foreground">
                                {anyDone ? j.stateNext : s.startHere}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" aria-hidden /> {j.legendDone}
              </li>
              <li className="flex items-center gap-1.5">
                <Circle className="size-3.5 text-primary" aria-hidden /> {j.legendReady}
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="size-3.5" aria-hidden /> {j.legendLocked}
              </li>
              <li className="hidden md:block">{s.legend}</li>
            </ul>
            <button
              type="button"
              aria-pressed={showAll}
              onClick={() => setShowAll((v) => !v)}
              className={cn(
                "focus-ring hidden rounded-md border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors md:inline-block",
                showAll ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {s.allPrereqs}
            </button>
          </div>
        </div>

        {/* preview panel: the selected topic, or the recommended next one */}
        <aside ref={panelRef} aria-label={s.details} className="mt-4 lg:sticky lg:top-20 lg:mt-0 lg:self-start">
          {shown ? (
            <div data-domain={domainId} className="animate-pop-in rounded-xl border border-border bg-card p-4" key={shown.id}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                  {selected ? `0${shown.level} · ${levelName(shown.level)} · ${stateLabel(shown, stateOf(shown))}` : j.nextTitle}
                </p>
                {selected ? (
                  <button type="button" onClick={() => setSelectedId(null)} aria-label={j.close} className="focus-ring -mr-1 -mt-1 rounded-md p-1 text-muted-foreground hover:text-foreground">
                    <X className="size-4" aria-hidden />
                  </button>
                ) : null}
              </div>
              <h4 className="mt-1 flex items-center gap-2 text-base font-semibold leading-tight">
                <TopicIcon slug={shown.slug} className="size-5 shrink-0 text-primary" />
                {shown.title}
              </h4>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{shown.tagline}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className={data.kindMeta[shown.kind].text}>{data.kindMeta[shown.kind].label}</span> · {shown.minutes} {data.minRead}
                {stageName(shown.stage) ? ` · ${fmt(s.stageEyebrow, { index: stageName(shown.stage)!.index })}` : ""}
              </p>

              {shown.keyPoints.length > 0 ? (
                <div className="mt-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.keyPoints}</p>
                  <ul className="mt-1 space-y-1.5 text-sm leading-snug">
                    {shown.keyPoints.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{j.prerequisites}</p>
                {shown.requires.length === 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">{j.noPrereqs}</p>
                ) : (
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {shown.requires.map((r) =>
                      byId.has(r) ? (
                        chip(r)
                      ) : data.external[r] ? (
                        <li key={r}>
                          <Link href={data.external[r].href} title={s.needsElsewhere} className="focus-ring inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-xs hover:border-primary/60">
                            {data.external[r].title} <span className="font-mono text-[9px] uppercase text-muted-foreground">{data.external[r].domainName}</span>
                          </Link>
                        </li>
                      ) : null,
                    )}
                  </ul>
                )}
              </div>

              {unlocksOf(shown.id, topics).length > 0 ? (
                <div className="mt-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{j.unlocks}</p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">{unlocksOf(shown.id, topics).map((n) => chip(n.id))}</ul>
                </div>
              ) : null}

              {data.relations.some((r) => r.source === shown.id || r.target === shown.id) ? (
                <div className="mt-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.relations}</p>
                  <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                    {data.relations
                      .filter((r) => r.source === shown.id || r.target === shown.id)
                      .map((r) => {
                        const other = byId.get(r.source === shown.id ? r.target : r.source);
                        if (!other) return null;
                        return (
                          <li key={`${r.source}>${r.target}`}>
                            <span aria-hidden>{r.source === shown.id ? "→" : "←"}</span> {r.label}{" "}
                            <button type="button" onClick={() => setSelectedId(other.id)} className="focus-ring rounded-sm font-medium text-foreground underline-offset-2 hover:text-primary hover:underline">
                              {other.title}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ) : null}

              {stageName(shown.stage) ? (
                <p className="mt-3 border-t border-border pt-2 text-xs text-primary/90">{fmt(s.gate, { gate: stageName(shown.stage)!.gate })}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link href={shown.href} className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary hover:bg-primary/20">
                  {s.openTopic} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
                <button
                  type="button"
                  aria-pressed={isSeen(domainId as DomainId, shown.slug)}
                  onClick={() => toggleSeen(domainId as DomainId, shown.slug)}
                  className={cn(
                    "focus-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors",
                    isSeen(domainId as DomainId, shown.slug) ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <Check className="size-3.5" aria-hidden /> {isSeen(domainId as DomainId, shown.slug) ? s.studied : s.mark}
                </button>
                {selected ? (
                  <button type="button" onClick={copy} className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary/40">
                    <Link2 className="size-3.5" aria-hidden /> {copied ? s.copied : s.copyLink}
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">{s.hint}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
