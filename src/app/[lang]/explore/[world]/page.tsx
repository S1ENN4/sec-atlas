import type { Metadata } from "next";

import { ExploreMap, type ExploreMissionData, type ExploreNodeData, type ExploreUi } from "@/components/explore-map";
import { worldById, worlds } from "@/content/explore/worlds";
import { flatten } from "@/content/explore/world";
import { notFound } from "next/navigation";
import { domainMeta } from "@/content/registry";
import type { DomainId } from "@/content/types";
import { LOCALES, localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { localizedExplore } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((lang) => worlds.map((w) => ({ lang, world: w.id })));

type Params = Promise<{ lang: string; world: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, world: id } = await params;
  const { locale } = await resolveLocale(Promise.resolve({ lang }));
  const w = worldById(id);
  if (!w) return {};
  const t = (localizedExplore(locale).value.nodes as Record<string, { title: string; summary: string }>)[w.id];
  return { title: t.title, description: t.summary, alternates: alternatesFor(locale, `/explore/${w.id}`) };
}

export default async function ExploreWorldPage({ params }: { params: Params }) {
  const { lang, world: id } = await params;
  const { locale } = await resolveLocale(Promise.resolve({ lang }));
  const w = worldById(id);
  if (!w) notFound();
  const text = localizedExplore(locale).value;
  const flat = flatten(w.root);

  const topicTitles = new Map<string, string>();
  const loaded = new Set<DomainId>();
  const topicLabel = (ref: string) => {
    const [domain, slug] = ref.split("/") as [DomainId, string];
    if (!loaded.has(domain)) {
      loaded.add(domain);
      for (const t of localizeDomain(domain, locale).domain.topics) topicTitles.set(`${domain}/${t.slug}`, t.title);
    }
    return { href: localePath(locale, `${domainMeta[domain].route}/topic/${slug}`), label: topicTitles.get(ref) ?? slug };
  };

  // Which map each node lives on, for "the same idea, in general" links.
  const homeOf: Record<string, string> = {};
  for (const other of worlds) for (const id2 of Object.keys(flatten(other.root))) homeOf[id2] = other.id;
  const nodeText = text.nodes as Record<string, { title: string }>;
  const labs = (text.lab.exercises as Record<string, { title: string }>);

  const challenges = text.challenges as Record<string, { prompt: string; why: string; hint: string }>;
  const nodes: Record<string, ExploreNodeData> = {};
  for (const n of Object.values(flat)) {
    const t = (text.nodes as Record<string, { title: string; summary: string; points: string[]; where?: string }>)[n.id];
    nodes[n.id] = {
      id: n.id,
      kind: n.kind,
      parent: n.parent,
      children: n.children,
      depth: n.depth,
      title: t.title,
      summary: t.summary,
      points: t.points,
      where: t.where,
      path: n.path,
      topics: (n.topics ?? []).map(topicLabel),
      see: (n.see ?? []).map((sid) => ({ href: `${localePath(locale, `/explore/${homeOf[sid]}`)}#${sid}`, label: nodeText[sid].title })),
      lab: n.lab ? { href: `${localePath(locale, "/lab")}#${n.lab}`, label: labs[n.lab].title } : undefined,
      code: n.code,
      risky: n.risky,
      challenge: n.risky ? challenges[n.id] : undefined,
    };
  }

  const missionData: ExploreMissionData[] = w.missions.map((m) => ({
    id: m.id,
    steps: m.steps,
    ...(text.missions as Record<string, { title: string; intro: string }>)[m.id],
  }));

  return (
    <ExploreMap
      nodes={nodes}
      rootId={w.id}
      missions={missionData}
      ui={text.ui as unknown as ExploreUi}
      eyebrow={text.ui.eyebrow}
      heading={nodes[w.id].title}
      intro={nodes[w.id].summary}
      indexHref={localePath(locale, "/explore")}
    />
  );
}
