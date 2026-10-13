"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Link2, X } from "lucide-react";

import { TopicIcon } from "@/components/topic-icon";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { GraphData } from "@/components/graph-data";

interface GraphPanelProps {
  data: GraphData;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

const chip =
  "rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[11px] transition-colors duration-[120ms] hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

// Details for the selected map node. Stage nodes show the stage summary and
// its items; concept nodes show the topic summary, its relations (each one
// selects the neighbour) and quick actions.
export function GraphPanel({ data, selectedId, onSelect, onClose }: GraphPanelProps) {
  const domain = data;
  const domainId = data.domainId;
  const route = data.route;
  const { isSeen, toggleSeen } = useProgress();
  const [copied, setCopied] = useState(false);

  const shell =
    "animate-page-enter absolute inset-x-2 bottom-2 z-10 max-h-[60%] overflow-auto rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:bottom-3 sm:right-3 sm:top-3 sm:max-h-none sm:w-80";

  const closeBtn = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Fechar detalhes"
      className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <X className="size-4" aria-hidden />
    </button>
  );

  if (selectedId.startsWith("stage-")) {
    const stage = domain.pipeline.find((s) => `stage-${s.id}` === selectedId);
    if (!stage) return null;
    const seenSlugs = new Set<string>();
    return (
      <aside className={shell} aria-label={`Etapa ${stage.name}`}>
        {closeBtn}
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">etapa {stage.index}</p>
        <h3 className="mt-1 pr-6 font-mono text-lg font-semibold">{stage.name}</h3>
        <p className="mt-1 text-sm leading-snug text-muted-foreground">{stage.description}</p>
        <p className="mt-3 font-mono text-[11px] text-amber-400/90">gate: {stage.gate}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {stage.items.map((item) => {
            if (item.slug && domain.topics[item.slug]) {
              const dup = seenSlugs.has(item.slug);
              seenSlugs.add(item.slug);
              return (
                <button key={item.label} type="button" onClick={() => onSelect(item.slug!)} className={chip} title={dup ? "também aparece em outra etapa" : undefined}>
                  {item.label}
                </button>
              );
            }
            return (
              <span key={item.label} className="rounded-md border border-border/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                {item.label}
              </span>
            );
          })}
        </div>
      </aside>
    );
  }

  const found = domain.topics[selectedId];
  if (!found) return null;
  const topic = { ...found, slug: selectedId };
  const meta = domain.kindMeta[topic.kind];
  const rels = domain.relations.filter((r) => r.source === selectedId || r.target === selectedId);
  const seen = isSeen(domainId, topic.slug);

  const copy = async () => {
    try {
      const url = `${window.location.origin}${route}?foco=${topic.slug}#mapa`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <aside className={shell} aria-label={`Detalhes: ${topic.title}`}>
      {closeBtn}
      <div className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", meta.dot)} aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{meta.label}</span>
        {topic.stage ? (
          <span className="font-mono text-[10px] text-muted-foreground">· {topic.stage}</span>
        ) : null}
      </div>
      <h3 className="mt-2 flex items-start gap-2 pr-6 text-base font-semibold leading-tight">
        <TopicIcon slug={topic.slug} className="mt-0.5 size-4 shrink-0 text-primary" />
        {topic.title}
      </h3>
      <p className="mt-2 text-sm leading-snug text-muted-foreground">{topic.tagline}</p>

      {rels.length > 0 ? (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">relações</p>
          <ul className="mt-2 space-y-1.5">
            {rels.map((r) => {
              const outgoing = r.source === selectedId;
              const otherSlug = outgoing ? r.target : r.source;
              const ot = domain.topics[otherSlug];
              if (!ot) return null;
              return (
                <li key={`${r.source}>${r.target}`} className="text-xs leading-snug">
                  <span className="font-mono text-muted-foreground">
                    {outgoing ? "→" : "←"} {r.label}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => onSelect(otherSlug)}
                    className="font-medium text-foreground underline-offset-2 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {ot.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`${route}/topico/${topic.slug}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          abrir tópico <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={() => toggleSeen(domainId, topic.slug)}
          aria-pressed={seen}
          className={cn(chip, "inline-flex items-center gap-1.5 py-1.5 text-xs", seen && "border-primary/60 bg-primary/10 text-primary")}
        >
          <Check className="size-3.5" aria-hidden /> {seen ? "estudado" : "marcar"}
        </button>
        <button type="button" onClick={copy} className={cn(chip, "inline-flex items-center gap-1.5 py-1.5 text-xs")}>
          <Link2 className="size-3.5" aria-hidden />
          <span aria-live="polite">{copied ? "copiado" : "link"}</span>
        </button>
      </div>
    </aside>
  );
}
