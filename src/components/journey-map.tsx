"use client";

// Guided journey: every topic of every domain as a skill tree, arranged by
// level (columns) and domain (rows). A topic is "ready" once all its
// prerequisites are studied; nothing is ever locked, the map only recommends.
// Hover or select a node to see the prerequisite chain drawn on the map.
// Progress comes from the reader's local progress store (no network).

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Circle, Lock, Sparkles, X } from "lucide-react";

import { DomainIcon } from "@/components/domain-icon";
import { TopicIcon } from "@/components/topic-icon";
import { fmt } from "@/i18n/format";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { DomainId } from "@/content/types";

export interface JourneyNode {
  id: string; // "<domain>/<slug>"
  domain: DomainId;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  level: 1 | 2 | 3;
  requires: string[];
  href: string;
}
export interface JourneyLane {
  id: DomainId;
  name: string;
}
export interface JourneyStrings {
  level1: string;
  level1Desc: string;
  level2: string;
  level2Desc: string;
  level3: string;
  level3Desc: string;
  nextTitle: string;
  nextEmpty: string;
  nextCta: string;
  allDomains: string;
  filterAria: string;
  roleBanner: string;
  clearRole: string;
  rolesAria: string;
  anyRole: string;
  progress: string;
  stateDone: string;
  stateReady: string;
  stateLocked: string;
  stateNext: string;
  legendDone: string;
  legendReady: string;
  legendLocked: string;
  prerequisites: string;
  unlocks: string;
  noPrereqs: string;
  open: string;
  mark: string;
  unmark: string;
  close: string;
  levelComplete: string;
  mapAria: string;
  nodeAria: string;
}

type State = "done" | "ready" | "locked";
interface Edge {
  id: string;
  d: string;
}

export function JourneyMap({
  nodes,
  lanes,
  t,
  roles = [],
}: {
  nodes: JourneyNode[];
  lanes: JourneyLane[];
  t: JourneyStrings;
  /** Career paths: choosing one dims every topic that is not on its path. */
  roles?: { id: string; label: string; topics: string[] }[];
}) {
  const { isSeen, toggleSeen } = useProgress();
  const [domainFilter, setDomainFilter] = useState<DomainId | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLElement>());

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const role = roles.find((r) => r.id === roleId) ?? null;
  const onPath = useMemo(() => (role ? new Set(role.topics) : null), [role]);

  // ?role=<id> (from the Careers pages) preselects a career path.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("role");
    if (fromUrl && roles.some((r) => r.id === fromUrl)) setRoleId(fromUrl);
  }, [roles]);
  const levelName = (l: number) => (l === 1 ? t.level1 : l === 2 ? t.level2 : t.level3);
  const levelDesc = (l: number) => (l === 1 ? t.level1Desc : l === 2 ? t.level2Desc : t.level3Desc);

  const seen = (n: JourneyNode) => isSeen(n.domain, n.slug);
  const missing = useCallback(
    (n: JourneyNode) => n.requires.filter((r) => byId.has(r) && !isSeen(byId.get(r)!.domain, byId.get(r)!.slug)).length,
    [byId, isSeen],
  );
  const stateOf = (n: JourneyNode): State => (seen(n) ? "done" : missing(n) === 0 ? "ready" : "locked");

  // Recommended next step: the first ready, unstudied topic in reading order.
  const next = useMemo(() => {
    const pool = nodes.filter((n) => (!onPath || onPath.has(n.id)) && (domainFilter === "all" || n.domain === domainFilter));
    return pool.find((n) => !isSeen(n.domain, n.slug) && missing(n) === 0) ?? null;
  }, [nodes, onPath, domainFilter, isSeen, missing]);

  const visibleLanes = lanes.filter((l) => domainFilter === "all" || l.id === domainFilter);
  const inLane = (lane: DomainId, level: number) => nodes.filter((n) => n.domain === lane && n.level === level);
  const active = hoverId ?? selectedId;

  // --- edges for the active node (prerequisites and dependents) ---------------
  const recompute = useCallback(() => {
    const wrap = wrapRef.current;
    const node = active ? byId.get(active) : null;
    if (!wrap || !node || window.innerWidth < 768) {
      setEdges([]);
      return;
    }
    const w = wrap.getBoundingClientRect();
    const rect = (id: string) => {
      const el = els.current.get(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { l: r.left - w.left + wrap.scrollLeft, r: r.right - w.left + wrap.scrollLeft, t: r.top - w.top + wrap.scrollTop, b: r.bottom - w.top + wrap.scrollTop };
    };
    const link = (fromId: string, toId: string): Edge | null => {
      const a = rect(fromId);
      const b = rect(toId);
      if (!a || !b) return null;
      const my = (a.t + a.b) / 2;
      const ty = (b.t + b.b) / 2;
      if (b.l - a.r > 12) {
        const dx = (b.l - a.r) / 2;
        return { id: `${fromId}>${toId}`, d: `M ${a.r} ${my} C ${a.r + dx} ${my}, ${b.l - dx} ${ty}, ${b.l} ${ty}` };
      }
      const down = b.t > a.t;
      const x1 = (a.l + a.r) / 2;
      const x2 = (b.l + b.r) / 2;
      const y1 = down ? a.b : a.t;
      const y2 = down ? b.t : b.b;
      const dy = (y2 - y1) / 2;
      return { id: `${fromId}>${toId}`, d: `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}` };
    };
    const out: Edge[] = [];
    for (const r of node.requires) {
      const e = link(r, node.id);
      if (e) out.push(e);
    }
    for (const n of nodes) {
      if (n.requires.includes(node.id)) {
        const e = link(node.id, n.id);
        if (e) out.push(e);
      }
    }
    setEdges(out);
  }, [active, byId, nodes]);

  useLayoutEffect(recompute, [recompute, domainFilter]);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(wrap);
    wrap.addEventListener("scroll", recompute, { passive: true });
    return () => {
      ro.disconnect();
      wrap.removeEventListener("scroll", recompute);
    };
  }, [recompute]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const total = nodes.filter((n) => visibleLanes.some((l) => l.id === n.domain)).length;
  const done = nodes.filter((n) => visibleLanes.some((l) => l.id === n.domain) && seen(n)).length;
  const selected = selectedId ? byId.get(selectedId) : null;
  const activeNode = active ? byId.get(active) : null;

  const stateIcon = (s: State) =>
    s === "done" ? <Check className="size-3.5 text-primary" aria-hidden /> : s === "ready" ? <Circle className="size-3.5 text-primary" aria-hidden /> : <Lock className="size-3.5 text-muted-foreground" aria-hidden />;
  const stateLabel = (n: JourneyNode, s: State) => (s === "done" ? t.stateDone : s === "ready" ? t.stateReady : fmt(t.stateLocked, { n: missing(n) }));

  return (
    <div className="space-y-6">
      {role ? (
        <p className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 px-4 py-2 text-sm">
          {fmt(t.roleBanner, { role: role.label })}
          <button type="button" onClick={() => setRoleId(null)} className="font-mono text-xs text-primary underline-offset-2 hover:underline">
            {t.clearRole}
          </button>
        </p>
      ) : null}

      {/* next step */}
      <section aria-labelledby="journey-next" className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="journey-next" className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-4 text-primary" aria-hidden /> {t.nextTitle}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">{fmt(t.progress, { done, total })}</span>
        </div>
        {next ? (
          <div data-domain={next.domain} className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-lg font-semibold">
                <TopicIcon slug={next.slug} className="size-5 text-primary" />
                {next.title}
              </p>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{next.tagline}</p>
            </div>
            <Link
              href={next.href}
              className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.nextCta} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{t.nextEmpty}</p>
        )}
      </section>

      {/* filters */}
      <div role="group" aria-label={t.filterAria} className="flex flex-wrap gap-2">
        {([{ id: "all", name: t.allDomains }, ...lanes] as { id: DomainId | "all"; name: string }[]).map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={domainFilter === l.id}
            onClick={() => setDomainFilter(l.id)}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              domainFilter === l.id ? "border-primary/60 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {l.name}
          </button>
        ))}
      </div>

      {roles.length > 0 ? (
        <div role="group" aria-label={t.rolesAria} className="flex flex-wrap gap-2">
          {([{ id: null, label: t.anyRole }, ...roles] as { id: string | null; label: string }[]).map((r) => (
            <button
              key={r.id ?? "any"}
              type="button"
              aria-pressed={roleId === r.id}
              onClick={() => setRoleId(r.id)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                roleId === r.id ? "border-primary/60 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* the map */}
      <div ref={wrapRef} role="group" aria-label={t.mapAria} className="relative overflow-x-auto rounded-xl border border-border bg-card/40 p-4">
        <svg data-domain={activeNode?.domain} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-full overflow-visible text-primary md:block">
          {edges.map((e) => (
            <path key={e.id} d={e.d} pathLength={1} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="journey-edge" />
          ))}
        </svg>

        <div className="md:min-w-[860px]">
          <div className="hidden grid-cols-[140px_repeat(3,minmax(0,1fr))] gap-x-8 pb-3 md:grid">
            <span />
            {[1, 2, 3].map((lv) => {
              const lvNodes = nodes.filter((n) => n.level === lv && visibleLanes.some((l) => l.id === n.domain));
              const lvDone = lvNodes.filter(seen).length;
              const complete = lvNodes.length > 0 && lvDone === lvNodes.length;
              return (
                <div key={lv}>
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                    <span className="text-muted-foreground">0{lv}</span> {levelName(lv)}
                    {complete ? (
                      <span className="animate-chip-in inline-flex items-center gap-1 rounded-full border border-primary/50 bg-primary/10 px-2 py-0.5 text-[10px] normal-case tracking-normal">
                        <Check className="size-3" aria-hidden /> {t.levelComplete}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{levelDesc(lv)}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${lvNodes.length ? (lvDone / lvNodes.length) * 100 : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {visibleLanes.map((lane) => {
            const laneNodes = nodes.filter((n) => n.domain === lane.id);
            const laneDone = laneNodes.filter(seen).length;
            return (
              <div key={lane.id} data-domain={lane.id} className="grid gap-4 border-t border-border/60 py-4 md:grid-cols-[140px_repeat(3,minmax(0,1fr))] md:gap-x-8">
                <div className="flex items-start gap-2 md:flex-col md:gap-1">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                    <DomainIcon id={lane.id} className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold leading-tight">{lane.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {laneDone}/{laneNodes.length}
                    </p>
                  </div>
                </div>
                {[1, 2, 3].map((lv) => (
                  <div key={lv} className="space-y-2">
                    {inLane(lane.id, lv).length > 0 ? <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:hidden">{levelName(lv)}</p> : null}
                    {inLane(lane.id, lv).map((n) => {
                      const s = stateOf(n);
                      const dim = (onPath && !onPath.has(n.id)) || (active && activeNode && !(n.id === active || n.requires.includes(active) || activeNode.requires.includes(n.id)));
                      const isNext = next?.id === n.id;
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
                          aria-label={fmt(t.nodeAria, { title: n.title, state: stateLabel(n, s) })}
                          className={cn(
                            "group relative flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            s === "done" && "border-primary/50 bg-primary/10",
                            s === "ready" && "border-primary/40 bg-card shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent)] hover:-translate-y-0.5",
                            s === "locked" && "border-border bg-card/50 hover:border-border",
                            isNext && "ring-2 ring-primary",
                            selectedId === n.id && "border-primary bg-primary/15",
                            dim && "opacity-30",
                          )}
                        >
                          <TopicIcon slug={n.slug} className={cn("mt-0.5 size-4 shrink-0", s === "locked" ? "text-muted-foreground" : "text-primary")} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium leading-tight">{n.title}</span>
                            <span className="mt-0.5 line-clamp-1 block text-[11px] leading-snug text-muted-foreground">{n.short}</span>
                          </span>
                          <span className="mt-0.5 shrink-0">{stateIcon(s)}</span>
                          {isNext ? (
                            <span className="absolute -top-2 right-2 rounded-full bg-primary px-2 py-px font-mono text-[9px] uppercase tracking-wider text-primary-foreground">{t.stateNext}</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Check className="size-3.5 text-primary" aria-hidden /> {t.legendDone}
        </li>
        <li className="flex items-center gap-1.5">
          <Circle className="size-3.5 text-primary" aria-hidden /> {t.legendReady}
        </li>
        <li className="flex items-center gap-1.5">
          <Lock className="size-3.5" aria-hidden /> {t.legendLocked}
        </li>
      </ul>

      {/* detail sheet */}
      {selected ? (
        <aside
          data-domain={selected.domain}
          aria-label={selected.title}
          className="animate-pop-in fixed inset-x-3 bottom-3 z-30 mx-auto max-w-xl rounded-xl border border-border bg-background p-4 shadow-2xl"
        >
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            aria-label={t.close}
            className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
          <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
            0{selected.level} · {levelName(selected.level)} · {stateLabel(selected, stateOf(selected))}
          </p>
          <h3 className="mt-1 pr-6 text-base font-semibold leading-tight">{selected.title}</h3>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{selected.tagline}</p>

          <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t.prerequisites}</p>
              {selected.requires.length === 0 ? (
                <p className="mt-1 text-muted-foreground">{t.noPrereqs}</p>
              ) : (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {selected.requires.map((r) => {
                    const rn = byId.get(r);
                    if (!rn) return null;
                    return (
                      <li key={r}>
                        <button type="button" onClick={() => setSelectedId(r)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                          {stateIcon(stateOf(rn))} {rn.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {nodes.some((n) => n.requires.includes(selected.id)) ? (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t.unlocks}</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {nodes
                    .filter((n) => n.requires.includes(selected.id))
                    .map((n) => (
                      <li key={n.id}>
                        <button type="button" onClick={() => setSelectedId(n.id)} className="rounded-md border border-border px-2 py-1 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                          {n.title}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={selected.href}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.open} <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => toggleSeen(selected.domain, selected.slug)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Check className="size-3.5" aria-hidden /> {seen(selected) ? t.unmark : t.mark}
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
