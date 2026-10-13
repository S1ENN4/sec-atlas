import type { Metadata } from "next";

import { ContentNotice } from "@/components/content-notice";
import { ScenarioPlayer, type ScenarioData } from "@/components/scenario-player";
import { domainMeta } from "@/content/registry";
import { localePath } from "@/i18n/config";
import { localizeDomain, localizedTopic } from "@/i18n/content";
import { localizedScenarios } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.scenarios.pageTitle, description: t.scenarios.description, alternates: alternatesFor(locale, "/scenarios") };
}

export default async function ScenariosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const loc = localizedScenarios(locale);

  const data: ScenarioData[] = loc.value.map((sc) => ({
    id: sc.id,
    domain: sc.domain,
    domainName: t.domains[sc.domain].name,
    title: sc.title,
    summary: sc.summary,
    stages: localizeDomain(sc.domain, locale).domain.pipeline.map((s) => ({ id: s.id, index: s.index, name: s.name })),
    steps: sc.steps.map((st) => ({
      stageId: st.stageId,
      happens: st.happens,
      stops: st.stops,
      controlTitle: localizedTopic(st.control.domain, st.control.slug, locale)?.title ?? st.control.slug,
      controlHref: localePath(locale, `${domainMeta[st.control.domain].route}/topic/${st.control.slug}`),
    })),
  }));

  return (
    <div className="animate-page-enter mx-auto max-w-4xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.scenarios.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.scenarios.heading}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t.scenarios.intro}</p>
      </header>

      <div className="mt-6">
        <ContentNotice fallback={loc.fallback} sourceLang={loc.sourceLang} t={t} />
      </div>

      <div className="mt-8">
        <ScenarioPlayer scenarios={data} t={t.scenarios} />
      </div>
    </div>
  );
}
