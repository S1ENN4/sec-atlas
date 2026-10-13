import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MoveRight } from "lucide-react";

import { TopicIcon } from "@/components/topic-icon";
import { Quiz } from "@/components/quiz";
import { TopicBridges } from "@/components/topic-bridges";
import { TopicPathNav } from "@/components/topic-path-nav";
import { TopicSources } from "@/components/topic-sources";
import { TopicToolbar } from "@/components/topic-toolbar";
import { Badge } from "@/components/ui/badge";
import { seceng } from "@/content/seceng";
import { getTopic, relationsOf } from "@/content/registry";

export function generateStaticParams() {
  return seceng.topics.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

const ROUTE_BASE = "/engenharia";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic({ domain: "seceng", slug });
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.tagline,
    openGraph: { type: "article", title: topic.title, description: topic.tagline },
    twitter: { card: "summary_large_image", title: topic.title, description: topic.tagline },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic({ domain: "seceng", slug });
  if (!topic) notFound();

  const rels = relationsOf({ domain: "seceng", slug });
  const kindMeta = seceng.kindMeta;
  const meta = kindMeta[topic.kind];

  return (
    <article
      data-domain="seceng"
      className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10"
    >
      <Link
        href={ROUTE_BASE}
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> voltar ao mapa
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 font-mono text-xs font-normal">
            <span className={`size-2 rounded-full ${meta.dot}`} />
            {meta.label}
          </Badge>
          {topic.stage ? (
            <Badge variant="secondary" className="font-mono text-xs font-normal">
              stage: {topic.stage}
            </Badge>
          ) : null}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <TopicIcon slug={topic.slug} className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{topic.title}</h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">{topic.tagline}</p>
      </header>

      <TopicToolbar domain="seceng" slug={slug} />

      <div className="mt-6 flex flex-wrap gap-2">
        {topic.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground"
          >
            {tool}
          </span>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {topic.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold tracking-tight text-primary/90">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-foreground/85">
              {section.body?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {section.bullets ? (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-foreground/85">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.code?.map((sample, i) => (
              <figure key={i} className="mt-4 overflow-hidden rounded-lg border border-border">
                <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                  <span>{sample.filename ?? ""}</span>
                  <span className="uppercase tracking-wider">{sample.language}</span>
                </figcaption>
                <pre className="overflow-x-auto bg-card p-4 font-mono text-xs leading-relaxed text-foreground/90">
                  <code>{sample.code}</code>
                </pre>
              </figure>
            ))}
          </section>
        ))}
      </div>

      {rels.length > 0 ? (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
            conexões no mapa
          </h2>
          <ul className="mt-4 space-y-2.5">
            {rels.map((r) => {
              const source = getTopic(r.source);
              const target = getTopic(r.target);
              if (!source || !target) return null;
              // When a relation endpoint IS the current topic, render it as
              // plain text (not a Link) so the connections list never points
              // back at the page the user is already reading. Keeping the
              // label and the rest of the row intact.
              const sourceIsCurrent = source.slug === slug;
              const targetIsCurrent = target.slug === slug;
              const sourceNode = sourceIsCurrent ? (
                <span className="font-medium text-foreground">{source.title}</span>
              ) : (
                <Link
                  href={`${ROUTE_BASE}/topico/${source.slug}`}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  {source.title}
                </Link>
              );
              const targetNode = targetIsCurrent ? (
                <span className="font-medium text-foreground">{target.title}</span>
              ) : (
                <Link
                  href={`${ROUTE_BASE}/topico/${target.slug}`}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  {target.title}
                </Link>
              );
              return (
                <li
                  key={`${r.source.domain}/${r.source.slug}->${r.target.domain}/${r.target.slug}`}
                  className="flex flex-wrap items-center gap-2 text-sm"
                >
                  {sourceNode}
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <MoveRight className="size-3.5 text-primary/70" />
                    {r.label}
                  </span>
                  {targetNode}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <TopicSources domain="seceng" />
      <TopicPathNav domain="seceng" slug={slug} />
      <TopicBridges domain="seceng" slug={slug} />
      <Quiz domain="seceng" slug={slug} />
    </article>
  );
}
