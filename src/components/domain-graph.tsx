"use client";

// Generic per-domain knowledge-graph renderer. All domain-specific graph
// configuration (layer / concept positions, concept→stage spokes, cross
// relations, the stage-click target) lives in the content layer — see
// `DomainGraphLayout` in `src/content/types.ts` and the per-domain
// `graph-layout.ts` modules. This file contains no domain literals.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

import { TopicIcon } from "@/components/topic-icon";
import { cn } from "@/lib/utils";
import { domains, domainMeta, getTopic, type DomainGraphLayout, type DomainId, type PipelineStage, type TopicKind } from "@/content/registry";

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
}

type StageFlowNode = Node<StageNodeData, "stage">;
type ConceptFlowNode = Node<ConceptNodeData, "topic">;
type AnyFlowNode = StageFlowNode | ConceptFlowNode;

const hidden = "!opacity-0";

interface StageNodeActivate {
  onActivate: () => void;
}

function StageNode({ data, onActivate }: NodeProps<StageFlowNode> & StageNodeActivate) {
  const label = `Abrir ${data.name}`;
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
      className="w-[240px] cursor-pointer rounded-lg border border-primary/30 bg-card px-3 py-2.5 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Handle id="t-l" type="target" position={Position.Left} className={hidden} />
      <Handle id="t-b" type="target" position={Position.Bottom} className={hidden} />
      <Handle id="s-r" type="source" position={Position.Right} className={hidden} />
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[11px] text-primary/60">{data.index}</span>
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

function ConceptNode({ data, domainMeta, onActivate }: ConceptNodeProps) {
  const meta = domainMeta[data.kind];
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Abrir tópico ${data.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className={cn(
        "w-[240px] cursor-pointer rounded-xl border bg-card px-4 py-3 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        data.dashed ? "border-dashed border-border" : "border-border"
      )}
    >
      <Handle id="t-l" type="target" position={Position.Left} className={hidden} />
      <Handle id="s-t" type="source" position={Position.Top} className={hidden} />
      <Handle id="s-r" type="source" position={Position.Right} className={hidden} />
      <div className="flex items-center gap-2">
        <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {meta.label}
        </span>
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
  domainId: DomainId;
}

interface BuildResult {
  nodes: AnyFlowNode[];
  edges: Edge[];
}

// Spine edges get a primary-tinted stroke (`oklch(0.78 0.19 155 / 0.6)`) so
// the dashed flow reads as the domain accent rather than the neutral
// `--xy-edge-stroke` gray that concept↔stage spokes use.
const SPINE_STROKE = "oklch(0.78 0.19 155 / 0.6)";

function buildGraph(
  domainId: DomainId,
  pipeline: PipelineStage[],
  layout: DomainGraphLayout,
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
      const topic = getTopic({ domain: domainId, slug });
      if (!topic) return;
      const pos = layout.conceptPositions[slug] ?? { x: col * layout.columnWidth, y: 300 };
      concepts.push({
        id: slug,
        type: "topic",
        position: pos,
        data: { slug, title: topic.title, short: topic.short, kind: topic.kind, dashed: false },
      });
    });
  });
  const layers: ConceptFlowNode[] = layout.layerSlugs.map((slug) => {
    const topic = getTopic({ domain: domainId, slug });
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
      id: `at-${a.slug}`,
      source: a.slug,
      target: `stage-${a.stageId}`,
      sourceHandle: a.sourceHandle,
      targetHandle: a.targetHandle,
      style: { stroke: "oklch(0.35 0.02 260)", strokeWidth: 1.2 },
    });
  }
  for (const r of layout.crossRelations) {
    edges.push({
      id: r.id,
      source: r.source,
      target: r.target,
      sourceHandle: r.sourceHandle,
      targetHandle: r.targetHandle,
      label: r.label,
      type: "smoothstep",
      ...(r.arrow === false ? {} : { markerEnd: { type: "arrowclosed" as const } }),
      ...(r.dashed
        ? { style: { strokeDasharray: "6 4", stroke: "oklch(0.5 0.04 250)" } }
        : { style: { stroke: "oklch(0.55 0.03 260)" } }),
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

// Cubic ease-out — `t => 1 - (1 - t)^3`. Matches the `easeOutCubic` curve
// commonly used for camera/viewport transitions.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function DomainGraphInner({ domainId }: DomainGraphProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const entranceRanRef = useRef(false);
  const { fitView } = useReactFlow();
  const reduced = useReducedMotion();

  const domain: import("@/content/types").Domain = domains[domainId]!;
  const layout = domain.graphLayout;
  // The renderer is meaningless without a layout — render an empty shell
  // so the homepage keeps the same height if a future domain forgets one.
  const ready = !!layout;

  // Resize → re-fit (RAF-throttled via the observer's own batching).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      fitView({ padding: 0.15, duration: reduced ? 0 : 200 });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fitView, reduced]);

  const { nodes, edges } = useMemo<BuildResult>(() => {
    if (!layout) return { nodes: [], edges: [] };
    // Disable `animated` on edges when the user prefers reduced motion so the
    // dash-draw loop (CSS `@keyframes dashdraw`) does not run.
    return buildGraph(domainId, domain.pipeline, layout, !reduced);
  }, [domainId, domain.pipeline, layout, reduced]);

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
    () => edges.map((e) => ({ ...e, ...edgeStyles })),
    [edges, edgeStyles]
  );

  // Inject domain kind metadata + activate handler into each custom node
  // renderer through closure capture. StageNode only needs the activation
  // callback (all stage nodes share the same `stageHref`); ConceptNode also
  // receives `domain.kindMeta` so concept cards can render their kind badge
  // color/label per the active domain. Guarded on `ready`: when no layout is
  // registered the graph stays empty and the inner nodes are never mounted,
  // so the closures are inert and we don't need to dereference `layout`.
  const renderNodeTypes = useMemo(
    () => ({
      stage: ((props: NodeProps<StageFlowNode>) => (
        <StageNode
          {...props}
          onActivate={() => {
            if (!layout) return;
            router.push(layout.stageHref);
          }}
        />
      )) as unknown as React.ComponentType<NodeProps>,
      topic: ((props: NodeProps<ConceptFlowNode>) => (
        <ConceptNode
          {...props}
          domainMeta={domain.kindMeta as unknown as Record<TopicKind, { dot: string; label: string; text: string }>}
          onActivate={() => router.push(`${domainMeta[domainId].route}/topico/${props.data.slug}`)}
        />
      )) as unknown as React.ComponentType<NodeProps>,
    }),
    [domain.kindMeta, domainId, layout, router]
  );

  const onNodeClick = useMemo(
    () =>
      (_: React.MouseEvent, node: { id: string }) => {
        if (!layout) return;
        const route = domainMeta[domainId].route;
        if (node.id.startsWith("stage-")) {
          router.push(layout.stageHref);
        } else {
          router.push(`${route}/topico/${node.id}`);
        }
      },
    [router, layout, domainId]
  );

  // Entrance stagger. Adds `.graph-entering` to the wrapper so the CSS
  // starts every node at `opacity: 0`; then a WAAPI pass animates each node
  // (opacity 0→1 + translateY 6px→0) with a per-index delay capped at 10 to
  // keep the longest node settling within ~720ms. When the user prefers
  // reduced motion we skip the entire dance — nodes stay visible from frame
  // 0 and fitView jumps.
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
        const els = Array.from(wrapper.querySelectorAll<HTMLElement>(".react-flow__node"));
        els.forEach((el, i) => {
          const delay = Math.min(i, 10) * 36;
          el.animate(
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
        // Remove the gating class once the longest delay + duration elapses
        // so any subsequent node mutation is no longer forced invisible.
        const total = Math.min(els.length, 11) * 36 + 360;
        window.setTimeout(() => wrapper.classList.remove("graph-entering"), total);
      });
    });
  }, [ready, reduced]);

  // Trigger entrance once the graph is mounted + ready. React Flow fires
  // `onInit` after its viewport is initialised, which is when fitView has
  // kicked in and every node is in the DOM.
  const handleInit = useCallback(() => {
    fitView({ padding: 0.15, duration: reduced ? 0 : 360, ease: easeOutCubic });
    playEntrance();
  }, [fitView, reduced, playEntrance]);

  return (
    <div>
      <div
        ref={wrapperRef}
        className="h-[560px] w-full overflow-hidden rounded-xl border border-border bg-card/40 md:h-[640px]"
      >
        {ready ? (
          <ReactFlow
            nodes={nodes}
            edges={styledEdges}
            nodeTypes={renderNodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15, duration: reduced ? 0 : 360, ease: easeOutCubic }}
            minZoom={0.2}
            maxZoom={1.5}
            nodesConnectable={false}
            onInit={handleInit}
            onNodeClick={onNodeClick}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="oklch(0.3 0.02 260)" />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {(Object.keys(domain.kindMeta) as TopicKind[]).map((k) => (
          <div key={k} className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", domain.kindMeta[k].dot)} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {domain.kindMeta[k].label}
            </span>
          </div>
        ))}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          linhas animadas = fluxo da esteira · tracejado = relação · clique num nó
        </span>
      </div>
    </div>
  );
}

export function DomainGraph(props: DomainGraphProps) {
  return (
    <ReactFlowProvider>
      <DomainGraphInner {...props} />
    </ReactFlowProvider>
  );
}