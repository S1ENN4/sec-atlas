import type { Metadata } from "next";

import { ContentNotice } from "@/components/content-notice";
import { JourneyMap, type JourneyLane, type JourneyNode } from "@/components/journey-map";
import { domains, domainMeta } from "@/content/registry";
import { levels } from "@/content/levels";
import type { DomainId } from "@/content/types";
import { localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { localizedRoles } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.journey.pageTitle, description: t.journey.description, alternates: alternatesFor(locale, "/journey") };
}

export default async function JourneyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const ids = Object.keys(domains) as DomainId[];

  let fallback = false;
  let sourceLang: "en" | "pt" = "en";
  const nodes: JourneyNode[] = [];
  for (const id of ids) {
    const loc = localizeDomain(id, locale);
    if (loc.fallback) {
      fallback = true;
      sourceLang = loc.sourceLang;
    }
    for (const tp of loc.domain.topics) {
      const info = levels[`${id}/${tp.slug}`];
      nodes.push({
        id: `${id}/${tp.slug}`,
        domain: id,
        slug: tp.slug,
        title: tp.title,
        short: tp.short,
        tagline: tp.tagline,
        level: info?.level ?? 1,
        requires: info?.requires ?? [],
        href: localePath(locale, `${domainMeta[id].route}/topic/${tp.slug}`),
      });
    }
  }
  // Reading order: level first, then domain order, then the domain's own topic order.
  nodes.sort((a, b) => a.level - b.level || ids.indexOf(a.domain) - ids.indexOf(b.domain));
  const lanes: JourneyLane[] = ids.map((id) => ({ id, name: t.domains[id].name }));

  return (
    <div className="animate-page-enter mx-auto max-w-7xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.journey.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.journey.heading}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t.journey.intro}</p>
      </header>

      <div className="mt-6">
        <ContentNotice fallback={fallback} sourceLang={sourceLang} t={t} />
      </div>

      <div className="mt-8">
        <JourneyMap
          nodes={nodes}
          lanes={lanes}
          t={t.journey}
          roles={localizedRoles(locale).value.map((r) => ({ id: r.id, label: r.title, topics: r.stages.flatMap((s) => s.topics) }))}
        />
      </div>
    </div>
  );
}
