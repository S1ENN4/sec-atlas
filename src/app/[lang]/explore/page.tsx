import type { Metadata } from "next";

import { ExploreMap, type ExploreMissionData, type ExploreNodeData, type ExploreUi } from "@/components/explore-map";
import { flatten, missions, world } from "@/content/explore/world";
import { domainMeta } from "@/content/registry";
import type { DomainId } from "@/content/types";
import { localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { localizedExplore } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const { ui } = localizedExplore(locale).value;
  return { title: ui.pageTitle, description: ui.description, alternates: alternatesFor(locale, "/explore") };
}

export default async function ExplorePage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale } = await resolveLocale(params);
  const text = localizedExplore(locale).value;
  const flat = flatten(world);

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
      code: n.code,
      risky: n.risky,
      challenge: n.risky ? challenges[n.id] : undefined,
    };
  }

  const missionData: ExploreMissionData[] = missions.map((m) => ({
    id: m.id,
    steps: m.steps,
    ...(text.missions as Record<string, { title: string; intro: string }>)[m.id],
  }));

  return (
    <ExploreMap
      nodes={nodes}
      rootId={world.id}
      missions={missionData}
      ui={text.ui as unknown as ExploreUi}
      eyebrow={text.ui.eyebrow}
      heading={text.ui.heading}
      intro={text.ui.intro}
    />
  );
}
