"use client";

import { useEffect, useMemo, useRef } from "react";
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

import { kindMeta, topics, type TopicKind } from "@/lib/topics";
import { pipelineStages } from "@/lib/pipeline";
import { TopicIcon } from "@/components/topic-icon";
import { cn } from "@/lib/utils";

const COLUMN_WIDTH = 280;
const LAYER_SLUGS = new Set(["shift-left", "devsecops"]);
const LAYER_POSITIONS: Record<string, { x: number; y: number }> = {
  "shift-left": { x: -320, y: 520 },
  devsecops: { x: 620, y: 640 },
};

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

function StageNode({ data }: NodeProps<StageFlowNode>) {
  return (
    <div className="w-[240px] cursor-pointer rounded-lg border border-primary/30 bg-card px-3 py-2.5 shadow transition-colors hover:border-primary/70">
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

function ConceptNode({ data }: NodeProps<ConceptFlowNode>) {
  const meta = kindMeta[data.kind];
  return (
    <div
      className={cn(
        "w-[240px] cursor-pointer rounded-xl border bg-card px-4 py-3 shadow transition-colors hover:border-primary/70",
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

const nodeTypes = { stage: StageNode, topic: ConceptNode };

function buildGraph() {
  const seen = new Set<string>();
  const concepts: ConceptFlowNode[] = [];
  pipelineStages.forEach((stage, col) => {
    const slugs = stage.items
      .map((item) => item.slug)
      .filter((slug): slug is string => !!slug && !LAYER_SLUGS.has(slug) && !seen.has(slug));
    slugs.forEach((slug) => seen.add(slug));
    slugs.forEach((slug, idx) => {
      const topic = topics.find((t) => t.slug === slug);
      if (!topic) return;
      const y = slug === "sbom" ? 520 : slugs.length === 1 ? 300 : 170 + idx * 180;
      concepts.push({
        id: slug,
        type: "topic",
        position: { x: col * COLUMN_WIDTH, y },
        data: { slug, title: topic.title, short: topic.short, kind: topic.kind, dashed: false },
      });
    });
  });
  const layers: ConceptFlowNode[] = [...LAYER_SLUGS].map((slug) => {
    const topic = topics.find((t) => t.slug === slug);
    return {
      id: slug,
      type: "topic",
      position: LAYER_POSITIONS[slug],
      data: {
        slug,
        title: topic?.title ?? slug,
        short: topic?.short ?? "",
        kind: topic?.kind ?? "conceito",
        dashed: true,
      },
    };
  });
  const stageNodes: StageFlowNode[] = pipelineStages.map((stage, col) => ({
    id: `stage-${stage.id}`,
    type: "stage",
    position: { x: col * COLUMN_WIDTH, y: 20 },
    data: { index: stage.index, name: stage.name, description: stage.description },
  }));
  return { nodes: [...stageNodes, ...concepts, ...layers], concepts, layers };
}

function buildEdges(concepts: ConceptFlowNode[], layers: ConceptFlowNode[]) {
  const edges: Edge[] = [];
  pipelineStages.forEach((stage, i) => {
    if (i === pipelineStages.length - 1) return;
    edges.push({
      id: `spine-${stage.id}`,
      source: `stage-${stage.id}`,
      target: `stage-${pipelineStages[i + 1].id}`,
      sourceHandle: "s-r",
      targetHandle: "t-l",
      animated: true,
    });
  });
  const conceptEdges: [string, string, string, string][] = [
    ["secrets", "source", "s-t", "t-b"],
    ["sast", "build", "s-t", "t-b"],
    ["sca", "package", "s-r", "t-b"],
    ["sbom", "package", "s-t", "t-b"],
    ["dast", "deploy", "s-t", "t-b"],
  ];
  for (const [slug, stageId, sh, th] of conceptEdges) {
    edges.push({
      id: `at-${slug}`,
      source: slug,
      target: `stage-${stageId}`,
      sourceHandle: sh,
      targetHandle: th,
      style: { stroke: "oklch(0.35 0.02 260)", strokeWidth: 1.2 },
    });
  }
  const relation = (
    id: string,
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string,
    label: string,
    opts: { dashed?: boolean; arrow?: boolean } = {}
  ): Edge => ({
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    label,
    type: "smoothstep",
    ...(opts.arrow === false ? {} : { markerEnd: { type: "arrowclosed" as const } }),
    ...(opts.dashed
      ? { style: { strokeDasharray: "6 4", stroke: "oklch(0.5 0.04 250)" } }
      : { style: { stroke: "oklch(0.55 0.03 260)" } }),
  });
  edges.push(
    relation("gera", "sca", "sbom", "s-r", "t-l", "gera"),
    relation("complementa", "sast", "dast", "s-r", "t-l", "complementa", { dashed: true, arrow: false }),
    relation("antecipa", "shift-left", "stage-source", "s-r", "t-l", "antecipa", { dashed: true }),
    relation("gates", "devsecops", "stage-test", "s-t", "t-b", "gates & políticas", { dashed: true })
  );
  return edges;
}

function StudyGraphInner() {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => fitView({ padding: 0.15, duration: 200 }));
    observer.observe(el);
    return () => observer.disconnect();
  }, [fitView]);

  const { nodes, edges } = useMemo(() => {
    const { nodes, concepts, layers } = buildGraph();
    return { nodes, edges: buildEdges(concepts, layers) };
  }, []);

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

  return (
    <div>
      <div
        ref={wrapperRef}
        className="h-[560px] w-full overflow-hidden rounded-xl border border-border bg-card/40 md:h-[640px]"
      >
        <ReactFlow
          nodes={nodes}
          edges={styledEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.5}
          nodesConnectable={false}
          onNodeClick={(_, node) => router.push(`/topico/${node.id.startsWith("stage-") ? "cicd" : node.id}`)}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="oklch(0.3 0.02 260)" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {(Object.keys(kindMeta) as TopicKind[]).map((k) => (
          <div key={k} className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", kindMeta[k].dot)} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {kindMeta[k].label}
            </span>
          </div>
        ))}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">
          linhas animadas = fluxo da esteira · tracejado = relação · clique num nó
        </span>
      </div>
    </div>
  );
}

export function StudyGraph() {
  return (
    <ReactFlowProvider>
      <StudyGraphInner />
    </ReactFlowProvider>
  );
}
