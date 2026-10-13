"use client";

// Generic per-domain knowledge-graph renderer. All domain-specific graph
// configuration (layer / concept positions, concept→stage spokes, cross
// relations, the stage-click target) lives in the content layer — see
// `DomainGraphLayout` in `src/content/types.ts` and the per-domain
// `graph-layout.ts` modules. This file contains no domain literals.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Check } from "lucide-react";

import { DomainList } from "@/components/domain-list";
import { GraphPanel } from "@/components/graph-panel";
import { TopicIcon } from "@/components/topic-icon";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { GraphData } from "@/components/graph-data";
import type { DomainGraphLayout, DomainId, PipelineStage, TopicKind } from "@/content/types";

interface StageNodeData extends Record<string, unknown> {
  index: string;
  name: string;
  description: string;
}

interface ConceptNodeData extends Record<string, unknown> {
  slug: string;
  title: string;
  short: string;
  kind: TopicKind;
  dashed: boolean;
  seen: boolean;
}

type StageFlowNode = Node<StageNodeData, "stage">;
type ConceptFlowNode = Node<ConceptNodeData, "topic">;
type AnyFlowNode = StageFlowNode | ConceptFlowNode;

const hidden = "!opacity-0";

// Every card exposes a source + target handle on all four sides so edges can
// pick the side that faces the other card (see `pickHandles`).
function AllHandles() {
  return (
    <>
      <Handle id="t-l" type="target" position={Position.Left} className={hidden} />
      <Handle id="t-r" type="target" position={Position.Right} className={hidden} />
      <Handle id="t-t" type="target" position={Position.Top} className={hidden} />
      <Handle id="t-b" type="target" position={Position.Bottom} className={hidden} />
      <Handle id="s-l" type="source" position={Position.Left} className={hidden} />
      <Handle id="s-r" type="source" position={Position.Right} className={hidden} />
      <Handle id="s-t" type="source" position={Position.Top} className={hidden} />
      <Handle id="s-b" type="source" position={Position.Bottom} className={hidden} />
    </>
  );
}

// Choose the facing sides from the relative position of the two cards so
// edges never loop around the cards they connect.
function pickHandles(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { sourceHandle: "s-r", targetHandle: "t-l" } : { sourceHandle: "s-l", targetHandle: "t-r" };
  }
  return dy >= 0 ? { sourceHandle: "s-b", targetHandle: "t-t" } : { sourceHandle: "s-t", targetHandle: "t-b" };
}

interface StageNodeActivate {
  onActivate: () => void;
}

function StageNode({ data, selected, onActivate }: NodeProps<StageFlowNode> & StageNodeActivate) {
  // aria-label must include the visible stage name so axe
  // "label-content-name-mismatch" stays clean; the "Abrir" prefix alone
  // diverges from the inner `<span>{data.name}</span>` text.
  const label = `${data.name} (ver detalhes)`;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      aria-pressed={selected}
      className={cn(
        "w-[240px] cursor-pointer rounded-lg border border-primary/30 bg-card px-3 py-2.5 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected && "ring-2 ring-primary"
      )}
    >
      <AllHandles />
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[11px] text-primary/90">{data.index}</span>
        <span className="font-mono text-sm font-semibold">{data.name}</span>
      </div>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{data.description}</p>
    </div>
  );
}

interface ConceptNodeProps extends NodeProps<ConceptFlowNode> {
  domainMeta: Record<TopicKind, { dot: string; label: string; text: string }>;
  onActivate: () => void;
}

function ConceptNode({ data, selected, domainMeta, onActivate }: ConceptNodeProps) {
  const meta = domainMeta[data.kind];
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${data.title} (ver detalhes)`}
      aria-pressed={selected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className={cn(
        "w-[240px] cursor-pointer rounded-xl border bg-card px-4 py-3 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        data.dashed ? "border-dashed border-border" : "border-border",
        selected && "ring-2 ring-primary"
      )}
    >
      <AllHandles />
      <div className="flex items-center gap-2">
        <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {meta.label}
        </span>
        {data.seen ? <Check className="ml-auto size-3.5 text-primary" aria-label="estudado" /> : null}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <TopicIcon slug={data.slug} className="size-4 shrink-0 text-primary" />
        <span className="text-sm font-semibold leading-tight">{data.title}</span>
      </div>
      <p className="mt-1 text-xs leading-snug text-muted-foreground">{data.short}</p>
    </div>
  );
}

interface DomainGraphProps {
  data: GraphData;
}

interface BuildResult {
  nodes: AnyFlowNode[];
  edges: Edge[];
}

// Spine edges get a primary-tinted stroke (`oklch(0.78 0.19 155 / 0.6)`) so
// the dashed flow reads as the domain accent rather than the neutral
// `--xy-edge-stroke` gray that concept↔stage spokes use.
const SPINE_STROKE = "color-mix(in oklch, var(--primary) 60%, transparent)";

function buildGraph(
  pipeline: PipelineStage[],
  layout: DomainGraphLayout,
  topics: GraphData["topics"],
  edgesAnimated: boolean
): BuildResult {
  const layerSlugs = new Set(layout.layerSlugs);
  const seen = new Set<string>();
  const concepts: ConceptFlowNode[] = [];
  pipeline.forEach((stage, col) => {
    const slugs = stage.items
      .map((item) => item.slug)
      .filter((slug): slug is string => !!slug && !layerSlugs.has(slug) && !seen.has(slug));
    slugs.forEach((slug) => seen.add(slug));
    slugs.forEach((slug) => {
      const topic = topics[slug];
      if (!topic) return;
      const pos = layout.conceptPositions[slug] ?? { x: col * layout.columnWidth, y: 300 };
      concepts.push({
        id: slug,
        type: "topic",
        position: pos,
        data: { slug, title: topic.title, short: topic.short, kind: topic.kind, dashed: false, seen: false },
      });
    });
  });
  const layers: ConceptFlowNode[] = layout.layerSlugs.map((slug) => {
    const topic = topics[slug];
    return {
      id: slug,
      type: "topic",
      position: layout.layerPositions[slug],
      data: {
        slug,
        title: topic?.title ?? slug,
        short: topic?.short ?? "",
        kind: topic?.kind ?? "conceito",
        dashed: true,
        seen: false,
      },
    };
  });
  const stageNodes: StageFlowNode[] = pipeline.map((stage, col) => ({
    id: `stage-${stage.id}`,
    type: "stage",
    position: { x: col * layout.columnWidth, y: layout.stageY },
    data: { index: stage.index, name: stage.name, description: stage.description },
  }));

  const edges: Edge[] = [];
  pipeline.forEach((stage, i) => {
    if (i === pipeline.length - 1) return;
    edges.push({
      id: `spine-${stage.id}`,
      source: `stage-${stage.id}`,
      target: `stage-${pipeline[i + 1].id}`,
      sourceHandle: "s-r",
      targetHandle: "t-l",
      animated: edgesAnimated,
      style: { stroke: SPINE_STROKE, strokeWidth: 1.4 },
    });
  });
  for (const a of layout.conceptAttachments) {
    edges.push({
      id: `at-${a.slug}-${a.stageId}`,
      source: a.slug,
      target: `stage-${a.stageId}`,
      sourceHandle: "s-t",
      targetHandle: "t-b",
      style: { stroke: "oklch(0.45 0.03 260)", strokeWidth: 1.2 },
    });
  }
  const posOf = new Map<string, { x: number; y: number }>();
  for (const n of [...stageNodes, ...concepts, ...layers]) posOf.set(n.id, n.position);
  for (const r of layout.crossRelations) {
    const a = posOf.get(r.source);
    const b = posOf.get(r.target);
    const handles = a && b ? pickHandles(a, b) : { sourceHandle: r.sourceHandle, targetHandle: r.targetHandle };
    edges.push({
      id: r.id,
      source: r.source,
      target: r.target,
      ...handles,
      label: r.label,
      ...(r.arrow === false ? {} : { markerEnd: { type: "arrowclosed" as const } }),
      ...(r.dashed
        ? { style: { strokeDasharray: "6 4", stroke: "oklch(0.6 0.06 250)", strokeWidth: 1.6 } }
        : { style: { stroke: "oklch(0.7 0.05 260)", strokeWidth: 1.6 } }),
    });
  }

  return { nodes: [...stageNodes, ...concepts, ...layers], edges };
}

// `useReducedMotion` returns true once and stays subscribed to
// `(prefers-reduced-motion: reduce)`. The matchMedia read + listener run
// once via the empty-deps effect, so the subscription fires only on actual
// preference changes (not on every render). ~10 LOC, zero deps —
// `motion/react` would also work but pulling
// the provider in for one boolean felt disproportionate given T6 already
// ships a defensive CSS clamp.
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// Below 640px a full fit makes card text unreadable; floor the zoom and let
// the user pan instead.
function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setNarrow(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

// Cubic ease-out — `t => 1 - (1 - t)^3`. Matches the `easeOutCubic` curve
// commonly used for camera/viewport transitions.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type View = "mapa" | "lista";

function DomainGraphInner({ data }: DomainGraphProps) {
  const domainId: DomainId = data.domainId;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const entranceRanRef = useRef(false);
  const { fitView } = useReactFlow();
  const narrow = useNarrow();
  const reduced = useReducedMotion();
  const { isSeen } = useProgress();

  // Focus mode: the hovered card (or, when nothing is hovered, the selected
  // one) keeps its own relations visible with labels; everything else fades.
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hiddenKinds, setHiddenKinds] = useState<ReadonlySet<TopicKind>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [viewChoice, setViewChoice] = useState<View | null>(null);
  const activeId = hoverId ?? selectedId;
  // Narrow screens default to the list; an explicit choice always wins.
  const view: View = viewChoice ?? (narrow ? "lista" : "mapa");

  const domain = data;
  const layout = data.layout;
  // The renderer is meaningless without a layout — render an empty shell
  // so the homepage keeps the same height if a future domain forgets one.
  const ready = !!layout;
  const fitOpts = useMemo(() => ({ padding: 0.15, minZoom: narrow ? 0.55 : undefined }), [narrow]);

  // Resize → re-fit (RAF-throttled via the observer's own batching).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      fitView({ ...fitOpts, duration: reduced ? 0 : 200 });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fitView, reduced, fitOpts, view]);

  const { nodes, edges } = useMemo<BuildResult>(() => {
    if (!layout) return { nodes: [], edges: [] };
    // Disable `animated` on edges when the user prefers reduced motion so the
    // dash-draw loop (CSS `@keyframes dashdraw`) does not run.
    return buildGraph(domain.pipeline, layout, domain.topics, !reduced);
  }, [domain.pipeline, domain.topics, layout, reduced]);

  const edgeStyles = useMemo(
    () => ({
      labelStyle: { fill: "oklch(0.82 0.02 250)", fontSize: 11, fontFamily: "var(--font-jetbrains), monospace" },
      labelBgStyle: { fill: "oklch(0.2 0.014 260)" },
      labelBgPadding: [6, 4] as [number, number],
      labelBgBorderRadius: 4,
    }),
    []
  );

  const styledEdges = useMemo<Edge[]>(
    () =>
      edges.map((e) => {
        if (e.id.startsWith("spine-")) return { ...e, ...edgeStyles };
        const isSpoke = e.id.startsWith("at-");
        const active = activeId !== null && (e.source === activeId || e.target === activeId);
        // Resting opacity: faint, or strong for relations (not spokes) when
        // the reader asked to see everything.
        const rest = showAll ? (isSpoke ? 0.5 : 0.9) : 0.35;
        return {
          ...e,
          ...edgeStyles,
          label: active || (showAll && activeId === null && !isSpoke) ? e.label : undefined,
          zIndex: active ? 10 : 0,
          animated: active && !reduced,
          style: {
            ...e.style,
            ...(active ? { stroke: "var(--primary)", strokeWidth: 2 } : {}),
            opacity: activeId === null ? rest : active ? 1 : 0.08,
            transition: "opacity 150ms",
          },
        };
      }),
    [edges, edgeStyles, activeId, reduced, showAll]
  );

  // Nodes: per-card flags (selected / studied / hidden by the kind filter),
  // plus the focus-mode fade for cards unrelated to the active one.
  const styledNodes = useMemo<AnyFlowNode[]>(() => {
    const related = new Set<string>();
    if (activeId !== null) {
      related.add(activeId);
      for (const e of edges) {
        if (e.id.startsWith("spine-")) continue;
        if (e.source === activeId) related.add(e.target);
        if (e.target === activeId) related.add(e.source);
      }
    }
    return nodes.map((n) => {
      const base = {
        selected: n.id === selectedId,
        style: {
          ...n.style,
          opacity: activeId === null || related.has(n.id) ? 1 : 0.35,
          transition: "opacity 150ms",
        },
      };
      if (n.type === "topic") {
        const data = n.data as ConceptNodeData;
        return { ...n, ...base, hidden: hiddenKinds.has(data.kind), data: { ...data, seen: isSeen(domainId, data.slug) } } as ConceptFlowNode;
      }
      return { ...n, ...base } as StageFlowNode;
    });
  }, [nodes, edges, activeId, selectedId, hiddenKinds, isSeen, domainId]);

  const select = useCallback((id: string) => setSelectedId((cur) => (cur === id ? null : id)), []);

  // Zoom to a card and its neighbours, select it, and bring the map into
  // view. Used by `?foco=<slug>` deep links and by the search palette.
  const focusSlug = useCallback(
    (slug: string) => {
      if (!nodes.some((n) => n.id === slug)) return;
      setViewChoice("mapa");
      setSelectedId(slug);
      const ids = new Set<string>([slug]);
      for (const e of edges) {
        if (e.id.startsWith("spine-") || e.id.startsWith("at-")) continue;
        if (e.source === slug) ids.add(e.target);
        if (e.target === slug) ids.add(e.source);
      }
      window.setTimeout(
        () => fitView({
            nodes: [...ids].map((id) => ({ id })),
            // Leave room for the details panel on the right (wide screens).
            padding: window.innerWidth >= 640 ? { top: 0.25, bottom: 0.25, left: 0.2, right: "360px" } : 0.4,
            maxZoom: 1,
            duration: reduced ? 0 : 500,
            ease: easeOutCubic,
          }),
        50
      );
      wrapperRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    },
    [nodes, edges, fitView, reduced]
  );

  useEffect(() => {
    const onFocus = (e: Event) => {
      const d = (e as CustomEvent<{ domain: DomainId; slug: string }>).detail;
      if (d?.domain === domainId) focusSlug(d.slug);
    };
    window.addEventListener("kb:focus", onFocus);
    return () => window.removeEventListener("kb:focus", onFocus);
  }, [domainId, focusSlug]);

  // Inject domain kind metadata + activate handler into each custom node
  // renderer through closure capture. Activating a card (click or keyboard)
  // selects it and opens the details panel; the panel offers the actual link
  // to the topic page. Guarded on `ready`: when no layout is registered the
  // graph stays empty and the inner nodes are never mounted.
  const renderNodeTypes = useMemo(
    () => ({
      stage: ((props: NodeProps<StageFlowNode>) => (
        <StageNode {...props} onActivate={() => select(props.id)} />
      )) as unknown as React.ComponentType<NodeProps>,
      topic: ((props: NodeProps<ConceptFlowNode>) => (
        <ConceptNode
          {...props}
          domainMeta={domain.kindMeta as unknown as Record<TopicKind, { dot: string; label: string; text: string }>}
          onActivate={() => select(props.id)}
        />
      )) as unknown as React.ComponentType<NodeProps>,
    }),
    [domain.kindMeta, select]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => select(node.id), [select]);

  // Entrance stagger. Adds `.graph-entering` to the wrapper so the CSS
  // starts every node CARD at `opacity: 0`; then a WAAPI pass animates each
  // card (opacity 0→1 + translateY 6px→0) with a per-index delay capped at 10
  // to keep the longest node settling within ~720ms. The positioned
  // `.react-flow__node` itself is never touched, leaving React Flow's x/y
  // `transform` intact. When the user prefers reduced motion we skip the
  // entire dance — nodes stay visible from frame 0 and fitView jumps.
  const playEntrance = useCallback(() => {
    if (entranceRanRef.current) return;
    if (!wrapperRef.current || !ready) return;
    if (reduced) {
      entranceRanRef.current = true;
      return;
    }
    entranceRanRef.current = true;

    const wrapper = wrapperRef.current;
    wrapper.classList.add("graph-entering");
    // Wait two RAFs so RF's first commit lands before we query the DOM.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Animate the INNER card div (`.react-flow__node > div`), never the
        // positioned `.react-flow__node` itself: React Flow stores each node's
        // x/y in an inline `transform` on the outer element, and animating
        // `transform` there would override it and collapse every node onto a
        // single point. The inner card has no positioning transform, so a
        // `translateY` rise is safe there.
        const els = Array.from(wrapper.querySelectorAll<HTMLElement>(".react-flow__node > div"));
        const animations = els.map((el, i) => {
          const delay = Math.min(i, 10) * 36;
          return el.animate(
            [
              { opacity: 0, transform: "translateY(6px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 360,
              delay,
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              fill: "both",
            }
          );
        });
        // Once every stagger animation settles, remove the gating class AND
        // clear each card's animation + inline styles so no lingering
        // fill/override survives on any node or card. `anim.finished` rejects
        // if the animation is cancelled, so swallow that to keep the gate
        // removal deterministic.
        Promise.all(animations.map((a) => a.finished.catch(() => {}))).then(() => {
          animations.forEach((a) => a.cancel());
          els.forEach((el) => {
            el.style.opacity = "";
            el.style.transform = "";
          });
          wrapper.classList.remove("graph-entering");
        });
      });
    });
  }, [ready, reduced]);

  // Trigger entrance once the graph is mounted + ready. React Flow fires
  // `onInit` after its viewport is initialised, which is when fitView has
  // kicked in and every node is in the DOM. A `?foco=<slug>` query (set by
  // shared links and the search palette) then zooms to that card.
  const handleInit = useCallback(() => {
    fitView({ ...fitOpts, duration: reduced ? 0 : 360, ease: easeOutCubic });
    playEntrance();
    const foco = new URLSearchParams(window.location.search).get("foco");
    if (foco) window.setTimeout(() => focusSlug(foco), reduced ? 0 : 450);
  }, [fitView, fitOpts, reduced, playEntrance, focusSlug]);

  const toggleKind = (k: TopicKind) =>
    setHiddenKinds((cur) => {
      const next = new Set(cur);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const segBtn = (v: View, label: string) => (
    <button
      type="button"
      onClick={() => setViewChoice(v)}
      aria-pressed={view === v}
      className={cn(
        "px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        view === v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Modo de visualização" className="flex overflow-hidden rounded-md border border-border">
          {segBtn("mapa", "mapa")}
          {segBtn("lista", "lista")}
        </div>
        {view === "mapa" ? (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-pressed={showAll}
            className={cn(
              "rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              showAll ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            todas as relações
          </button>
        ) : null}
      </div>

      {view === "lista" ? (
        <DomainList data={data} />
      ) : (
        <>
          <div
            ref={wrapperRef}
            onFocusCapture={(e) => {
              const id = (e.target as HTMLElement).closest<HTMLElement>(".react-flow__node")?.dataset.id;
              if (id) setHoverId(id);
            }}
            onBlurCapture={() => setHoverId(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelectedId(null);
            }}
            className="relative h-[560px] w-full overflow-hidden rounded-xl border border-border bg-card/40 md:h-[640px]"
          >
            {ready ? (
              <ReactFlow
                nodes={styledNodes}
                edges={styledEdges}
                nodeTypes={renderNodeTypes}
                fitView
                fitViewOptions={{ ...fitOpts, duration: reduced ? 0 : 360, ease: easeOutCubic }}
                minZoom={0.2}
                maxZoom={1.5}
                nodesConnectable={false}
                onInit={handleInit}
                onNodeClick={onNodeClick}
                onPaneClick={() => setSelectedId(null)}
                onNodeMouseEnter={(_, node) => setHoverId(node.id)}
                onNodeMouseLeave={() => setHoverId(null)}
                onNodeDragStop={() => setHoverId(null)}
              >
                <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="oklch(0.3 0.02 260)" />
                <Controls showInteractive={false} position="bottom-left" />
              </ReactFlow>
            ) : null}
            {selectedId ? (
              <GraphPanel
                data={data}
                selectedId={selectedId}
                onSelect={(id) => focusSlug(id)}
                onClose={() => setSelectedId(null)}
              />
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {(Object.keys(domain.kindMeta) as TopicKind[]).map((k) => {
              const off = hiddenKinds.has(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleKind(k)}
                  aria-pressed={!off}
                  title={off ? "mostrar este tipo" : "esconder este tipo"}
                  className="flex items-center gap-2 rounded px-1 py-0.5 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <span className={cn("size-2 rounded-full", domain.kindMeta[k].dot, off && "opacity-30")} />
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
                      off && "line-through opacity-60"
                    )}
                  >
                    {domain.kindMeta[k].label}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              linhas animadas = fluxo da esteira · passe o mouse ou clique num card para ver as relações dele
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export function DomainGraphClient(props: DomainGraphProps) {
  return (
    <ReactFlowProvider>
      <DomainGraphInner {...props} />
    </ReactFlowProvider>
  );
}