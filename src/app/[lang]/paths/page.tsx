import type { Metadata } from "next";

import { PathCard, type PathCardData } from "@/components/path-card";
import { ProgressSummary, type DomainTotals } from "@/components/progress-summary";
import { ContentNotice } from "@/components/content-notice";
import { domains, domainMeta, type Domain } from "@/content/registry";
import { localePath } from "@/i18n/config";
import { localizedTopic } from "@/i18n/content";
import { localizedPaths } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.paths.pageTitle, description: t.paths.description, alternates: alternatesFor(locale, "/paths") };
}

export default async function PathsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const totals: DomainTotals[] = (Object.values(domains) as Domain[]).map((d) => ({
    id: d.id,
    name: t.domains[d.id].name,
    slugs: d.topics.map((tp) => tp.slug),
  }));

  const loc = localizedPaths(locale);
  const cards: PathCardData[] = loc.value.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    level: p.level === "beginner" ? t.paths.levelBeginner : t.paths.levelIntermediate,
    steps: p.steps.flatMap((s) => {
      const topic = localizedTopic(s.ref.domain, s.ref.slug, locale);
      if (!topic) return [];
      return [
        {
          domain: s.ref.domain,
          slug: s.ref.slug,
          title: topic.title,
          why: s.why,
          href: localePath(locale, `${domainMeta[s.ref.domain].route}/topic/${s.ref.slug}`),
        },
      ];
    }),
  }));

  return (
    <div className="animate-page-enter mx-auto max-w-4xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.paths.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.paths.heading}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t.paths.intro}</p>
      </header>

      <div className="mt-6">
        <ContentNotice fallback={loc.fallback} sourceLang={loc.sourceLang} t={t} />
      </div>

      <div className="mt-8">
        <ProgressSummary domains={totals} t={t.progress} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {cards.map((c) => (
          <PathCard key={c.id} path={c} t={t.paths} />
        ))}
      </div>
    </div>
  );
}
