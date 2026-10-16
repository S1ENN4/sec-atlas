"use client";

// Explorable map as a living tree: a full-screen canvas where the trail
// (commit to production) grows outwards from the centre. Click a node to open
// its details and grow its branch; drag to pan, wheel or pinch to zoom. The
// selected node lives in the URL hash (#sast), so the browser back button and
// deep links work. Missions guide a route; challenges are "find the risky lines".

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ChevronsDownUp,
  List,
  ChevronsUpDown,
  Copy,
  FileCode2,
  Lightbulb,
  MapPin,
  Maximize2,
  Network,
  Minus,
  Package,
  Plus,
  Search,
  RotateCcw,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  Wrench,
  X,
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
  /** The same idea on other maps. */
  see?: { href: string; label: string }[];
  /** Link to the hands-on lab exercise. */
  lab?: { href: string; label: string };
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

// --- layout ---------------------------------------------------------------------

const NODE_H = 32;
const HUES = [152, 200, 250, 300, 12, 52, 95, 175];

interface Pt {
  x: number;
  y: number;
  /** 1 = visible, 0 = hidden inside a collapsed branch. */
  o: number;
}

const pillWidth = (title: string, isRoot: boolean) => Math.max(isRoot ? 150 : 84, title.length * (isRoot ? 8.6 : 7.1) + 50);

const ROW = 48;
const GAP = 64;

/**
 * Two-sided mind-map: the root sits in the middle, its stops split between the
 * right and the left, and an opened node stacks its children in a column further
 * out. Subtrees get vertical room by size, so labels never collide.
 */
function layoutTree(nodes: Record<string, ExploreNodeData>, rootId: string, expanded: Set<string>) {
  const target: Record<string, Pt> = {};
  const visible = new Set<string>();
  const side: Record<string, 1 | -1> = {};
  const isOpen = (id: string) => id === rootId || expanded.has(id);

  const stations = nodes[rootId].children;
  const rightCount = Math.ceil(stations.length / 2);
  stations.forEach((id, i) => {
    const mark = (n: string) => {
      side[n] = i < rightCount ? 1 : -1;
      nodes[n].children.forEach(mark);
    };
    mark(id);
  });

  const height = (id: string): number => {
    const n = nodes[id];
    if (!isOpen(id) || n.children.length === 0) return ROW;
    return n.children.reduce((sum, c) => sum + height(c), 0);
  };

  // width of each column (per side and depth), so a column lines up
  const colW: Record<string, number> = {};
  const measure = (id: string) => {
    visible.add(id);
    const n = nodes[id];
    if (id !== rootId) {
      const key = `${side[id]}:${n.depth}`;
      colW[key] = Math.max(colW[key] ?? 0, pillWidth(n.title, false));
    }
    if (isOpen(id)) n.children.forEach(measure);
  };
  measure(rootId);

  const rootHalf = pillWidth(nodes[rootId].title, true) / 2;
  const colStart = (sd: 1 | -1, depth: number) => {
    let x = rootHalf + GAP;
    for (let d = 1; d < depth; d++) x += (colW[`${sd}:${d}`] ?? 0) + GAP;
    return x;
  };

  const place = (id: string, top: number, anchor: Pt) => {
    const n = nodes[id];
    const h = height(id);
    const sd = side[id];
    const w = pillWidth(n.title, false);
    const x = sd * (colStart(sd, n.depth) + w / 2);
    const y = top + h / 2;
    const here: Pt = { x, y, o: 1 };
    target[id] = here;
    if (isOpen(id)) {
      let t = top;
      for (const c of n.children) {
        place(c, t, here);
        t += height(c);
      }
    } else {
      const hide = (c: string) => {
        target[c] = { x, y, o: 0 };
        nodes[c].children.forEach(hide);
      };
      n.children.forEach(hide);
    }
    void anchor;
  };

  target[rootId] = { x: 0, y: 0, o: 1 };
  const sideTop = (ids: string[]) => -ids.reduce((sum, c) => sum + height(c), 0) / 2;
  for (const group of [stations.slice(0, rightCount), stations.slice(rightCount)]) {
    let t = sideTop(group);
    for (const id of group) {
      place(id, t, target[rootId]);
      t += height(id);
    }
  }
  return { target, visible, side };
}

interface View {
  x: number;
  y: number;
  k: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** Round for rendering, so server and client markup match to the last digit. */
const f1 = (n: number) => Math.round(n * 10) / 10;

// --- main component ---------------------------------------------------------------

export interface ExploreMapProps {
  nodes: Record<string, ExploreNodeData>;
  rootId: string;
  missions: ExploreMissionData[];
  ui: ExploreUi;
  eyebrow: string;
  heading: string;
  intro: string;
  indexHref: string;
}

export function ExploreMap({ nodes, rootId, missions, ui, eyebrow, heading, intro, indexHref }: ExploreMapProps) {
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const selId = nodes[hash] && hash !== rootId ? hash : null;
  const sel = selId ? nodes[selId] : null;
  const { state, visit, solve, setMission, reset } = useExploreProgress();

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const { target, visible, side } = useMemo(() => layoutTree(nodes, rootId, expanded), [nodes, rootId, expanded]);

  const go = useCallback(
    (id: string | null) => {
      window.location.hash = id && id !== rootId ? id : "";
    },
    [rootId],
  );

  // viewport size
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  const wide = size.w >= 640;
  // Small screens read better as a list; anyone can switch.
  const [forceList, setForceList] = useState<boolean | null>(null);
  const listMode = forceList ?? (size.w > 0 && size.w < 640);

  // --- animation: node positions and camera ease towards their targets ---------------
  const pos = useRef<Record<string, Pt>>({});
  const view = useRef<View>({ x: 0, y: 0, k: 1 });
  const goal = useRef<View | null>(null);
  const raf = useRef(0);
  const [, tick] = useReducer((n: number) => n + 1, 0);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  for (const id of Object.keys(nodes)) if (!pos.current[id]) pos.current[id] = { ...(target[id] ?? { x: 0, y: 0, o: 0 }) };

  const run = useCallback(() => {
    if (raf.current) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const f = reduce.current ? 1 : 1 - Math.exp(-dt / 120);
      let moving = false;
      for (const [id, t] of Object.entries(targetRef.current)) {
        const p = pos.current[id];
        if (!p) continue;
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        const dox = t.o - p.o;
        if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2 || Math.abs(dox) > 0.01) {
          p.x += dx * f;
          p.y += dy * f;
          p.o += dox * f;
          moving = true;
        } else {
          p.x = t.x;
          p.y = t.y;
          p.o = t.o;
        }
      }
      const g = goal.current;
      if (g) {
        const v = view.current;
        const fv = reduce.current ? 1 : 1 - Math.exp(-dt / 140);
        v.x += (g.x - v.x) * fv;
        v.y += (g.y - v.y) * fv;
        v.k += (g.k - v.k) * fv;
        if (Math.abs(g.x - v.x) < 0.3 && Math.abs(g.y - v.y) < 0.3 && Math.abs(g.k - v.k) < 0.001) {
          view.current = { ...g };
          goal.current = null;
        } else moving = true;
      }
      tick();
      if (moving) raf.current = requestAnimationFrame(step);
      else raf.current = 0;
    };
    raf.current = requestAnimationFrame(step);
  }, []);
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
    run();
  }, [target, run]);
  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    },
    [],
  );

  // --- camera ----------------------------------------------------------------------
  const [focusReq, setFocusReq] = useState<{ ids: string[]; n: number } | null>(null);
  const requestFocus = useCallback((ids: string[]) => setFocusReq((r) => ({ ids, n: (r?.n ?? 0) + 1 })), []);

  const fit = useCallback(
    (ids: string[], instant = false) => {
      if (!size.w) return;
      const pts = ids.map((id) => targetRef.current[id]).filter(Boolean);
      if (!pts.length) return;
      let x0 = Infinity,
        x1 = -Infinity,
        y0 = Infinity,
        y1 = -Infinity;
      for (const id of ids) {
        const p = targetRef.current[id];
        if (!p) continue;
        const w = pillWidth(nodes[id].title, id === rootId) / 2 + 24;
        x0 = Math.min(x0, p.x - w);
        x1 = Math.max(x1, p.x + w);
        y0 = Math.min(y0, p.y - 40);
        y1 = Math.max(y1, p.y + 40);
      }
      // Frame inside the part of the screen the info card (left) and details (right) leave free.
      const left = wide && (infoRef.current || missionRef.current) ? 370 : 0;
      const availW = size.w - left - (selId && wide ? 420 : 0);
      const availH = size.h * (selId && !wide ? 0.38 : 1);
      const k = clamp(Math.min(availW / (x1 - x0 + 60), availH / (y1 - y0 + 60)), 0.3, 1);
      const next = { k, x: left + availW / 2 - ((x0 + x1) / 2) * k, y: availH / 2 - ((y0 + y1) / 2) * k };
      if (instant) {
        view.current = next;
        goal.current = null;
        tick();
      } else {
        goal.current = next;
        run();
      }
    },
    [size.w, size.h, selId, wide, nodes, rootId, run],
  );

  const infoRef = useRef(true);
  const missionRef = useRef(false);
  const firstFit = useRef(true);
  useEffect(() => {
    if (!size.w) return;
    if (firstFit.current) {
      firstFit.current = false;
      fit([...visible], true);
    }
  }, [size.w, visible, fit]);

  useEffect(() => {
    if (!focusReq) return;
    fit(focusReq.ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusReq]);

  // Selecting (or deep-linking to) a node opens its ancestors, grows its own branch, and frames it.
  useEffect(() => {
    if (!selId) {
      requestFocus([...visible]);
      return;
    }
    const n = nodes[selId];
    const open = new Set<string>();
    for (let p = n.parent ? nodes[n.parent] : null; p; p = p.parent ? nodes[p.parent] : null) open.add(p.id);
    if (n.children.length) open.add(n.id);
    setExpanded((cur) => {
      const nextSet = new Set(cur);
      open.forEach((i) => nextSet.add(i));
      return nextSet.size === cur.size ? cur : nextSet;
    });
    visit(selId);
    setInfoOpen(false);
    requestFocus([selId, ...(n.parent && n.parent !== rootId ? [n.parent] : []), ...n.children]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selId]);

  const toggle = useCallback(
    (id: string) => {
      setExpanded((cur) => {
        const s = new Set(cur);
        if (s.has(id)) {
          // closing a branch also closes everything inside it
          const drop = (i: string) => {
            s.delete(i);
            nodes[i].children.forEach(drop);
          };
          drop(id);
        } else s.add(id);
        return s;
      });
      requestFocus([id, ...nodes[id].children]);
    },
    [nodes, requestFocus],
  );

  const allIds = useMemo(() => Object.keys(nodes).filter((i) => nodes[i].children.length > 0 && i !== rootId), [nodes, rootId]);
  const expandAll = () => {
    setExpanded(new Set(allIds));
    requestFocus(Object.keys(nodes));
  };
  const collapseAll = () => {
    setExpanded(new Set());
    go(null);
    requestFocus([rootId, ...nodes[rootId].children]);
  };

  // --- pan / zoom ---------------------------------------------------------------------
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; k: number } | null>(null);

  const zoomAt = useCallback((cx: number, cy: number, factor: number) => {
    const v = view.current;
    const k = clamp(v.k * factor, 0.25, 2.2);
    const f = k / v.k;
    view.current = { k, x: cx - (cx - v.x) * f, y: cy - (cy - v.y) * f };
    goal.current = null;
    tick();
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    goal.current = null;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.current.k };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = svgRef.current!.getBoundingClientRect();
      zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, (pinch.current.k * (d / pinch.current.d)) / view.current.k);
    } else if (pointers.current.size === 1) {
      view.current = { ...view.current, x: view.current.x + cur.x - prev.x, y: view.current.y + cur.y - prev.y };
      tick();
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  // Arrow keys walk the tree: towards the outside opens into children, towards the
  // centre climbs to the parent, up and down move between siblings on the same side.
  const focusNode = (id: string) => svgRef.current?.querySelector<SVGGElement>(`[data-id="${id}"]`)?.focus();
  const arrowTarget = (key: string, id: string): string | null => {
    const n = nodes[id];
    const open = id === rootId || expanded.has(id);
    if (key === "ArrowRight" || key === "ArrowLeft") {
      const dir = key === "ArrowRight" ? 1 : -1;
      if (id === rootId) return n.children.find((c) => side[c] === dir) ?? null;
      if (side[id] === dir) return open ? (n.children[0] ?? null) : null;
      return n.parent;
    }
    if (key === "ArrowDown" || key === "ArrowUp") {
      if (!n.parent) return null;
      const sibs = nodes[n.parent].children.filter((c) => side[c] === side[id] && visible.has(c));
      const i = sibs.indexOf(id) + (key === "ArrowDown" ? 1 : -1);
      return sibs[i] ?? null;
    }
    return null;
  };

  // --- search -----------------------------------------------------------------------
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? Object.values(nodes)
        .filter((n) => n.id !== rootId && (n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.points.some((p) => p.toLowerCase().includes(q))))
        .sort((a, b) => Number(b.title.toLowerCase().includes(q)) - Number(a.title.toLowerCase().includes(q)))
        .slice(0, 7)
    : [];

  // --- keyboard -----------------------------------------------------------------------
  const up = useCallback(() => {
    if (sel) go(sel.parent === rootId ? null : sel.parent);
  }, [sel, go, rootId]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" && e.key !== "Backspace") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.querySelector("dialog[open]")) return;
      if (sel) {
        e.preventDefault();
        up();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, up]);

  // --- missions -----------------------------------------------------------------------
  const stepDone = (id: string) => (nodes[id]?.challenge ? !!state.solved[id] : !!state.visited[id]);
  const mission = missions.find((m) => m.id === state.mission) ?? null;
  const stepIdx = mission ? mission.steps.findIndex((s) => !stepDone(s)) : -1;
  const targetId = mission && stepIdx >= 0 ? mission.steps[stepIdx] : null;
  const complete = !!mission && stepIdx === -1;
  // The node to pulse: the target, or the nearest visible ancestor when it is hidden in a collapsed branch.
  let pulseId: string | null = targetId;
  while (pulseId && !visible.has(pulseId)) pulseId = nodes[pulseId].parent;

  const total = Object.keys(nodes).length - 1;
  const explored = Object.keys(state.visited).filter((id) => id !== rootId && nodes[id]).length;

  const [infoOpen, setInfoOpen] = useState(true);
  useEffect(() => {
    if (window.innerWidth < 640) setInfoOpen(false);
  }, []);

  infoRef.current = infoOpen;
  missionRef.current = !!mission;

  const activate = (id: string) => {
    if (selId === id) {
      if (nodes[id].children.length) toggle(id);
    } else go(id);
  };

  const bar = (
    <MissionBar
      ui={ui}
      missions={missions}
      nodes={nodes}
      mission={mission}
      stepIdx={stepIdx}
      target={targetId}
      complete={complete}
      stepDone={stepDone}
      curId={selId ?? rootId}
      onStart={setMission}
      onGo={go}
    />
  );

  const v = view.current;
  const onPath = new Set<string>();
  for (let n = sel; n; n = n.parent ? nodes[n.parent] : null) onPath.add(n.id);
  const hueOf = (id: string) => {
    let n = nodes[id];
    while (n.parent && n.parent !== rootId) n = nodes[n.parent];
    const i = nodes[rootId].children.indexOf(n.id);
    return i < 0 ? 152 : HUES[i % HUES.length];
  };

  const btn =
    "grid size-9 place-items-center rounded-lg border border-border bg-background/85 text-foreground/90 backdrop-blur transition-colors hover:border-primary/60 hover:text-primary";

  return (
    <div ref={boxRef} data-node-ids={Object.keys(nodes).join(" ")} className={cn("explore-canvas relative h-[calc(100svh-3.5rem)] min-h-[30rem] w-full overflow-hidden bg-background", listMode && "flex flex-col")}>
      <svg
        ref={svgRef}
        role="group"
        aria-label={ui.stageAria}
        className={cn("absolute inset-0 size-full cursor-grab touch-none select-none active:cursor-grabbing", listMode && "hidden")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="explore-dots" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform={`translate(${f1(v.x)} ${f1(v.y)}) scale(${Math.round(v.k * 1000) / 1000})`}>
            <circle cx="1.5" cy="1.5" r="1.1" className="fill-border" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#explore-dots)" aria-hidden />
        <g transform={`translate(${f1(v.x)} ${f1(v.y)}) scale(${Math.round(v.k * 1000) / 1000})`}>
          {/* links first, so nodes sit on top */}
          {Object.values(nodes).map((n) => {
            if (!n.parent) return null;
            const a = pos.current[n.parent];
            const b = pos.current[n.id];
            const o = Math.min(a.o, b.o);
            if (o < 0.02) return null;
            const sd = side[n.id];
            const wp = n.parent === rootId ? pillWidth(nodes[rootId].title, true) : pillWidth(nodes[n.parent].title, false);
            const wc = pillWidth(n.title, false);
            const badge = n.parent !== rootId && nodes[n.parent].children.length > 0 ? 24 : 0;
            const x1 = a.x + sd * (wp / 2 + badge);
            const x2 = b.x - sd * (wc / 2);
            const xm = (x1 + x2) / 2;
            const hot = onPath.has(n.id) || (pulseId === n.id);
            return (
              <path
                key={n.id}
                d={`M${f1(x1)},${f1(a.y)} C${f1(xm)},${f1(a.y)} ${f1(xm)},${f1(b.y)} ${f1(x2)},${f1(b.y)}`}
                fill="none"
                strokeLinecap="round"
                style={{ stroke: `oklch(var(--nl) var(--nc) ${hueOf(n.id)})`, strokeWidth: hot ? 3 : n.depth === 1 ? 2.2 : 1.5, opacity: Math.round(o * (hot ? 1 : 0.5) * 100) / 100 }}
              />
            );
          })}
          {Object.values(nodes).map((n) => {
            const p = pos.current[n.id];
            if (p.o < 0.02) return null;
            const isRoot = n.id === rootId;
            const w = pillWidth(n.title, isRoot);
            const h = isRoot ? 40 : NODE_H;
            const Icon = KIND_ICON[n.kind];
            const open = isRoot || expanded.has(n.id);
            const seen = !!state.visited[n.id];
            const isSel = selId === n.id;
            const pulse = pulseId === n.id;
            return (
              <g
                key={n.id}
                className="explore-node"
                transform={`translate(${f1(p.x)} ${f1(p.y)})`}
                style={{ opacity: Math.round(p.o * 100) / 100, ["--hue" as string]: hueOf(n.id) }}
                role="button"
                tabIndex={p.o > 0.5 ? 0 : -1}
                aria-label={`${n.title}, ${ui.kinds[n.kind]}${seen ? `, ${ui.visited}` : ""}`}
                aria-expanded={n.children.length ? open : undefined}
                aria-current={isSel ? "true" : undefined}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => (isRoot ? go(null) : activate(n.id))}
                data-id={n.id}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (isRoot) go(null);
                    else activate(n.id);
                    return;
                  }
                  const next = arrowTarget(e.key, n.id);
                  if (next) {
                    e.preventDefault();
                    focusNode(next);
                  }
                }}
              >
                {pulse ? <rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} rx={(h + 12) / 2} className="explore-ring" style={{ stroke: `oklch(var(--nl) var(--nc) var(--hue))` }} fill="none" /> : null}
                <rect
                  className="explore-pill"
                  x={-w / 2}
                  y={-h / 2}
                  width={w}
                  height={h}
                  rx={h / 2}
                  style={{
                    fill: isSel ? `oklch(var(--nl) var(--nc) var(--hue) / 0.2)` : "var(--card)",
                    stroke: `oklch(var(--nl) var(--nc) var(--hue))`,
                    strokeWidth: isSel ? 2.6 : isRoot ? 2.4 : 1.6,
                  }}
                />
                <Icon x={-w / 2 + 11} y={-7} width={14} height={14} style={{ stroke: `oklch(var(--nl) var(--nc) var(--hue))` }} aria-hidden />
                <text x={-w / 2 + 31} y={0} dominantBaseline="central" className="fill-foreground" fontSize={isRoot ? 14.5 : 13} fontWeight={isRoot || n.depth === 1 ? 600 : 500}>
                  {n.title}
                </text>
                {seen && !isRoot ? (
                  <g transform={`translate(${w / 2 - 12} ${-h / 2 + 2})`} aria-hidden>
                    <circle r={7} className="fill-emerald-400" />
                    <path d="M-3.2 0.2 L-1 2.4 L3.4 -2.2" fill="none" stroke="var(--background)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ) : null}
                {n.challenge && !state.solved[n.id] ? (
                  <circle cx={w / 2 - 12} cy={h / 2 - 2} r={4.5} className="fill-amber-400" aria-hidden />
                ) : null}
                {n.children.length > 0 && !isRoot ? (
                  <g
                    transform={`translate(${(side[n.id] ?? 1) * (w / 2 + 2)} 0)`}
                    className="explore-badge"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(n.id);
                    }}
                  >
                    <circle r={11} style={{ fill: "var(--background)", stroke: `oklch(var(--nl) var(--nc) var(--hue))`, strokeWidth: 1.4 }} />
                    <text textAnchor="middle" dominantBaseline="central" fontSize={open ? 15 : 11} className="fill-foreground" fontWeight={600}>
                      {open ? "−" : `+${n.children.length}`}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>

      {/* info + missions */}
      <div className={cn(listMode ? "relative z-[1] flex shrink-0 flex-col gap-3 p-3 sm:mx-auto sm:w-full sm:max-w-xl" : "pointer-events-none absolute left-3 top-3 flex max-h-[calc(100%-1.5rem)] w-[min(22rem,calc(100%-1.5rem))] flex-col gap-3 overflow-y-auto sm:left-4 sm:top-4", sel && "max-sm:hidden")}>
        <div className="pointer-events-auto rounded-2xl border border-border bg-background/85 p-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setInfoOpen((o) => !o)}
            aria-expanded={infoOpen}
            className={cn("flex w-full items-start justify-between gap-3 text-left", focusRing)}
          >
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-primary">{eyebrow}</span>
              <h1 className="mt-0.5 text-lg font-bold tracking-tight">{heading}</h1>
            </span>
            <ChevronRight className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", infoOpen && "rotate-90")} aria-hidden />
          </button>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={ui.searchLabel}
              placeholder={ui.searchPlaceholder}
              className={cn("w-full rounded-lg border border-border bg-muted/40 py-2 pl-8 pr-2 text-sm placeholder:text-muted-foreground", focusRing)}
            />
          </div>
          {q ? (
            results.length ? (
              <ul className="mt-2 space-y-1" aria-label={ui.searchLabel}>
                {results.map((n) => {
                  const Icon = KIND_ICON[n.kind];
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          go(n.id);
                        }}
                        className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted", focusRing)}
                      >
                        <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <span className="truncate">{n.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground" role="status">
                {ui.searchNone}
              </p>
            )
          ) : null}
          {infoOpen ? (
            <div className="mt-3">
              <Link href={indexHref} className={cn("mb-3 inline-flex items-center gap-1.5 rounded font-mono text-[11px] text-muted-foreground hover:text-foreground", focusRing)}>
                <ArrowLeft className="size-3" aria-hidden /> {ui.allMaps}
              </Link>
              <p className="text-xs leading-relaxed text-muted-foreground">{intro}</p>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{ui.canvasHint}</p>
              <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={explored}
                  aria-label={fmt(ui.explored, { done: explored, total })}
                  className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-muted"
                >
                  <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${(explored / total) * 100}%` }} />
                </div>
                <span>{fmt(ui.explored, { done: explored, total })}</span>
              </div>
              {mission ? null : <div className="mt-4">{bar}</div>}
              <button type="button" onClick={reset} className={cn("mt-3 inline-flex items-center gap-1.5 rounded px-1 font-mono text-[11px] text-muted-foreground hover:text-foreground", focusRing)}>
                <RotateCcw className="size-3" aria-hidden /> {ui.reset}
              </button>
            </div>
          ) : null}
        </div>
        {mission ? <div className="pointer-events-auto">{bar}</div> : null}
      </div>

      {listMode ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-28 sm:mx-auto sm:w-full sm:max-w-xl">
          <button
            type="button"
            onClick={() => {
              setForceList(false);
              requestFocus([...visible]);
            }}
            className={cn("mb-2 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground", focusRing)}
          >
            <Network className="size-3.5" aria-hidden /> {ui.viewMap}
          </button>
          <TreeList
            nodes={nodes}
            rootId={rootId}
            expanded={expanded}
            seen={state.visited}
            solved={state.solved}
            selId={selId}
            pulseId={pulseId}
            ui={ui}
            onOpen={go}
            onToggle={toggle}
          />
        </div>
      ) : null}

      {/* camera controls */}
      <div className={cn("absolute bottom-4 flex flex-col gap-2", sel && wide ? "right-[27rem]" : "right-4", sel && "max-sm:hidden", listMode && "hidden")}>
        <button type="button" className={cn(btn, focusRing)} aria-label={ui.viewList} title={ui.viewList} onClick={() => setForceList(true)}>
          <List className="size-4" aria-hidden />
        </button>
        <button type="button" className={cn(btn, focusRing)} aria-label={ui.zoomIn} title={ui.zoomIn} onClick={() => zoomAt(size.w / 2, size.h / 2, 1.3)}>
          <Plus className="size-4" aria-hidden />
        </button>
        <button type="button" className={cn(btn, focusRing)} aria-label={ui.zoomOut} title={ui.zoomOut} onClick={() => zoomAt(size.w / 2, size.h / 2, 1 / 1.3)}>
          <Minus className="size-4" aria-hidden />
        </button>
        <button type="button" className={cn(btn, focusRing)} aria-label={ui.fit} title={ui.fit} onClick={() => fit([...visible])}>
          <Maximize2 className="size-4" aria-hidden />
        </button>
        <button type="button" className={cn(btn, focusRing)} aria-label={ui.expandAll} title={ui.expandAll} onClick={expandAll}>
          <ChevronsUpDown className="size-4" aria-hidden />
        </button>
        <button type="button" className={cn(btn, focusRing)} aria-label={ui.collapseAll} title={ui.collapseAll} onClick={collapseAll}>
          <ChevronsDownUp className="size-4" aria-hidden />
        </button>
      </div>

      {/* overview */}
      {wide && !listMode && visible.size > 10 ? (
        <Minimap
          target={target}
          visible={visible}
          nodes={nodes}
          rootId={rootId}
          hueOf={hueOf}
          view={v}
          size={size}
          label={ui.overview}
          onJump={(x, y) => {
            goal.current = { k: view.current.k, x: size.w / 2 - x * view.current.k, y: size.h / 2 - y * view.current.k };
            run();
          }}
        />
      ) : null}

      {/* details */}
      {sel ? (
        <aside
          aria-label={sel.title}
          className="absolute inset-x-0 bottom-0 z-10 flex max-h-[58%] flex-col rounded-t-2xl border-t border-border bg-background/95 shadow-2xl backdrop-blur sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[26rem] sm:rounded-none sm:border-l sm:border-t-0"
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <button type="button" onClick={up} className={cn("inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-xs hover:border-primary/60 hover:text-primary", focusRing)}>
              <ArrowLeft className="size-3.5" aria-hidden />
              <span className="sr-only">{fmt(ui.backTo, { name: sel.parent === rootId ? ui.trailhead : nodes[sel.parent!].title })}</span>
              <span aria-hidden>{ui.back}</span>
            </button>
            <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">{sel.parent === rootId ? ui.trailhead : nodes[sel.parent!].title}</p>
            <button type="button" onClick={() => go(null)} aria-label={ui.close} title={ui.close} className={cn("grid size-8 place-items-center rounded-md text-muted-foreground hover:text-foreground", focusRing)}>
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <FocusCard
              key={sel.id}
              node={sel}
              nodes={nodes}
              ui={ui}
              solved={!!state.solved[sel.id]}
              onSolve={() => solve(sel.id)}
              onOpen={go}
              targetIsHere={targetId === sel.id}
            />
            {sel.children.length > 0 ? (
              <section className="mt-5" aria-labelledby="explore-inside">
                <h3 id="explore-inside" className="font-mono text-xs uppercase tracking-wider text-primary">
                  {fmt(ui.childrenTitle, { name: sel.title })}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {sel.children.map((id) => (
                    <li key={id}>
                      <ChildCard node={nodes[id]} ui={ui} seen={!!state.visited[id]} solved={!!state.solved[id]} way={pulseId === id} onOpen={go} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </aside>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {sel?.title ?? heading}
      </p>
    </div>
  );
}

function Minimap({
  target,
  visible,
  nodes,
  rootId,
  hueOf,
  view,
  size,
  label,
  onJump,
}: {
  target: Record<string, Pt>;
  visible: Set<string>;
  nodes: Record<string, ExploreNodeData>;
  rootId: string;
  hueOf: (id: string) => number;
  view: View;
  size: { w: number; h: number };
  label: string;
  onJump: (x: number, y: number) => void;
}) {
  const W = 170;
  const H = 112;
  const ids = [...visible];
  let x0 = Infinity,
    x1 = -Infinity,
    y0 = Infinity,
    y1 = -Infinity;
  for (const id of ids) {
    const p = target[id];
    const w = pillWidth(nodes[id].title, id === rootId) / 2;
    x0 = Math.min(x0, p.x - w);
    x1 = Math.max(x1, p.x + w);
    y0 = Math.min(y0, p.y - 20);
    y1 = Math.max(y1, p.y + 20);
  }
  const sc = Math.min((W - 8) / (x1 - x0), (H - 8) / (y1 - y0));
  const ox = (W - (x1 - x0) * sc) / 2 - x0 * sc;
  const oy = (H - (y1 - y0) * sc) / 2 - y0 * sc;
  const vx = (-view.x / view.k) * sc + ox;
  const vy = (-view.y / view.k) * sc + oy;
  return (
    <svg
      role="img"
      aria-label={label}
      width={W}
      height={H}
      className="absolute bottom-4 left-4 cursor-pointer rounded-lg border border-border bg-background/85 backdrop-blur"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onJump((e.clientX - r.left - ox) / sc, (e.clientY - r.top - oy) / sc);
      }}
    >
      {ids.map((id) => {
        const p = target[id];
        return <circle key={id} cx={f1(p.x * sc + ox)} cy={f1(p.y * sc + oy)} r={id === rootId ? 3 : 2} style={{ fill: `oklch(var(--nl) var(--nc) ${hueOf(id)})` }} />;
      })}
      <rect x={f1(vx)} y={f1(vy)} width={f1((size.w / view.k) * sc)} height={f1((size.h / view.k) * sc)} className="fill-primary/10 stroke-primary" strokeWidth={1} />
    </svg>
  );
}

function TreeList({
  nodes,
  rootId,
  expanded,
  seen,
  solved,
  selId,
  pulseId,
  ui,
  onOpen,
  onToggle,
}: {
  nodes: Record<string, ExploreNodeData>;
  rootId: string;
  expanded: Set<string>;
  seen: Record<string, 1>;
  solved: Record<string, 1>;
  selId: string | null;
  pulseId: string | null;
  ui: ExploreUi;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const row = (id: string, depth: number) => {
    const n = nodes[id];
    const Icon = KIND_ICON[n.kind];
    const open = expanded.has(id);
    return (
      <li key={id}>
        <div
          className={cn(
            "flex items-center rounded-lg",
            selId === id && "bg-primary/10",
            pulseId === id && "explore-target",
          )}
          style={{ paddingLeft: depth * 16 }}
        >
          <button
            type="button"
            onClick={() => onOpen(id)}
            aria-current={selId === id ? "true" : undefined}
            className={cn("flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 text-left text-sm", focusRing)}
          >
            <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className={cn("truncate", depth === 0 && "font-semibold")}>{n.title}</span>
            {seen[id] ? <Check className="size-3.5 shrink-0 text-emerald-400" aria-label={ui.visited} /> : null}
            {n.challenge && !solved[id] ? <span aria-label={ui.challengeTitle} className="size-2 shrink-0 rounded-full bg-amber-400" /> : null}
          </button>
          {n.children.length > 0 ? (
            <button
              type="button"
              onClick={() => onToggle(id)}
              aria-expanded={open}
              aria-label={`${n.title}: ${open ? ui.collapseAll : ui.expandAll}`}
              className={cn("grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-foreground", focusRing)}
            >
              <ChevronRight className={cn("size-4 transition-transform", open && "rotate-90")} aria-hidden />
            </button>
          ) : null}
        </div>
        {open && n.children.length > 0 ? <ul>{n.children.map((c) => row(c, depth + 1))}</ul> : null}
      </li>
    );
  };
  return <ul className="space-y-0.5">{nodes[rootId].children.map((c) => row(c, 0))}</ul>;
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

function FocusCard({
  node,
  nodes,
  ui,
  solved,
  onSolve,
  onOpen,
  targetIsHere,
}: {
  node: ExploreNodeData;
  nodes: Record<string, ExploreNodeData>;
  ui: ExploreUi;
  solved: boolean;
  onSolve: () => void;
  onOpen: (id: string) => void;
  targetIsHere: boolean;
}) {
  const siblings = node.parent ? nodes[node.parent].children : [];
  const nextId = siblings[siblings.indexOf(node.id) + 1];
  const next = nextId ? nodes[nextId] : null;
  return (
    <article className={cn("min-w-0 rounded-2xl border bg-card p-4", targetIsHere ? "explore-target border-primary/70" : "border-border")}>
      <div className="flex flex-wrap items-center gap-2">
        <KindChip kind={node.kind} ui={ui} />
        {node.challenge ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-400">
            <Swords className="size-3" aria-hidden /> {solved ? ui.challengeSolved : ui.challengeTitle}
          </span>
        ) : null}
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight">
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

      {node.lab ? (
        <Link
          href={node.lab.href}
          className={cn(
            "mt-6 flex items-center justify-between gap-3 rounded-xl border border-primary/50 bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20",
            focusRing,
          )}
        >
          <span>{ui.tryLab}</span>
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null}

      {node.see && node.see.length > 0 ? (
        <>
          <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-primary">{ui.seeAlso}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.see.map((t) => (
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
      <ul className="mt-3 grid gap-2">
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
