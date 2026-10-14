// Server wrapper for the learning map. It reduces a (localised) domain to the
// lean `GraphData` the client renderer needs: titles, taglines, level and
// prerequisites from `levels.ts`, reading time and key points derived from the
// topic body. Topic bodies and code samples stay out of the client bundle.
// There is no per-domain layout: the renderer lays topics out by level.

import { LearningMap } from "@/components/learning-map";
import type { GraphData, MapExternal } from "@/components/graph-data";
import { domainMeta, domains, type DomainId } from "@/content/registry";
import { levels } from "@/content/levels";
import { localePath, type Locale } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { kindMetaFor } from "@/i18n/labels";
import type { Ui } from "@/i18n/ui";
import { keyPoints } from "@/lib/key-points";
import { estimateReadingMinutes, topicBodyText } from "@/lib/reading-time";

export function buildGraphData(domainId: DomainId, locale: Locale, t: Ui): GraphData {
  const { domain } = localizeDomain(domainId, locale);
  const external: Record<string, MapExternal> = {};
  const topics = domain.topics.map((tp) => {
    const id = `${domainId}/${tp.slug}`;
    const info = levels[id];
    const requires = info?.requires ?? [];
    for (const r of requires) {
      const [d, slug] = r.split("/") as [DomainId, string];
      if (d === domainId || external[r] || !domains[d]) continue;
      const other = localizeDomain(d, locale).domain.topics.find((x) => x.slug === slug);
      if (other) external[r] = { title: other.title, href: localePath(locale, `${domainMeta[d].route}/topic/${slug}`), domainName: t.domains[d].name };
    }
    return {
      id,
      slug: tp.slug,
      title: tp.title,
      short: tp.short,
      tagline: tp.tagline,
      kind: tp.kind,
      stage: tp.stage,
      level: (info?.level ?? 1) as 1 | 2 | 3,
      requires,
      minutes: estimateReadingMinutes(topicBodyText(tp)),
      keyPoints: keyPoints(tp),
      href: localePath(locale, `${domain.route}/topic/${tp.slug}`),
    };
  });
  return {
    domainId,
    locale,
    strings: t.graph,
    journey: t.journey,
    minRead: t.topicPage.minRead,
    kindMeta: kindMetaFor(domainId, t),
    stages: domain.pipeline.map((s) => ({ id: s.id, index: s.index, name: s.name, gate: s.gate })),
    topics,
    external,
    relations: domain.relations
      .filter((r) => r.source.domain === domainId && r.target.domain === domainId)
      .map((r) => ({ source: `${domainId}/${r.source.slug}`, target: `${domainId}/${r.target.slug}`, label: r.label })),
  };
}

export function DomainGraph({ domainId, locale, t }: { domainId: DomainId; locale: Locale; t: Ui }) {
  return <LearningMap data={buildGraphData(domainId, locale, t)} />;
}
