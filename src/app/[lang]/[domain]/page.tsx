import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Map as MapIcon } from "lucide-react";

import { ContentNotice } from "@/components/content-notice";
import { DomainGraph } from "@/components/domain-graph";
import { PipelineRail } from "@/components/pipeline-rail";
import { TopicIcon } from "@/components/topic-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { domainMaps } from "@/content/explore/domain-maps";
import { domainIdFromRoute, domainRouteSegments } from "@/content/registry";
import { LOCALES, localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { localizedExplore } from "@/i18n/globals";
import { fmt } from "@/i18n/format";
import { kindMetaFor } from "@/i18n/labels";
import { alternatesFor, resolveLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((lang) => domainRouteSegments.map((domain) => ({ lang, domain })));

type Params = Promise<{ lang: string; domain: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, domain } = await params;
  const { locale, t } = await resolveLocale(Promise.resolve({ lang }));
  const id = domainIdFromRoute(domain);
  if (!id) return {};
  const copy = t.domains[id];
  return {
    title: `${copy.title} ${copy.titleAccent}`,
    description: copy.lead,
    alternates: alternatesFor(locale, `/${domain}`),
    openGraph: { title: `${copy.title} ${copy.titleAccent}`, description: copy.lead },
  };
}

export default async function DomainHome({ params }: { params: Params }) {
  const { lang, domain: segment } = await params;
  const { locale, t } = await resolveLocale(Promise.resolve({ lang }));
  const id = domainIdFromRoute(segment);
  if (!id) notFound();

  const { domain, fallback, sourceLang } = localizeDomain(id, locale);
  const copy = t.domains[id];
  const kindMeta = kindMetaFor(id, t);
  const anim = (ms: number) => ({ animationDelay: `${ms}ms` });
  const mapsUi = localizedExplore(locale).value.ui;
  const mapTitles = localizedExplore(locale).value.nodes as Record<string, { title: string }>;
  const mapLinks = (domainMaps[id] ?? []).map((w) => ({ id: w, title: mapTitles[w].title, href: localePath(locale, `/explore/${w}`) }));

  return (
    <div data-domain={id} className="animate-page-enter">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center md:pt-24">
        <Badge variant="outline" className="animate-hero-enter font-mono text-xs font-normal text-muted-foreground" style={anim(0)}>
          {copy.badge}
        </Badge>
        <h1 className="animate-hero-enter mt-6 text-4xl font-bold tracking-tight md:text-6xl" style={anim(60)}>
          {copy.title} <span className="text-primary">{copy.titleAccent}</span>
        </h1>
        <p className="animate-hero-enter mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg" style={anim(140)}>
          {copy.lead}
        </p>
      </section>

      <div className="px-4">
        <ContentNotice fallback={fallback} sourceLang={sourceLang} t={t} />
      </div>

      {mapLinks.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
            <MapIcon className="size-4 text-primary" aria-hidden />
            <p className="text-sm font-medium">{mapsUi.domainMapsTitle}</p>
            <div className="flex flex-wrap gap-2">
              {mapLinks.map((m) => (
                <Link
                  key={m.id}
                  href={m.href}
                  className="rounded-md border border-border bg-background/70 px-2.5 py-1 text-sm transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {m.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="map" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="reveal font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.domainPage.mapTitle}</h2>
        <div className="mt-6">
          <DomainGraph domainId={id} locale={locale} t={t} />
        </div>
      </section>

      <section id="pipeline" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="reveal font-mono text-sm uppercase tracking-wider text-muted-foreground">{copy.pipelineTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{copy.pipelineIntro}</p>
        <div className="mt-6">
          <PipelineRail stages={domain.pipeline} route={domain.route} domain={id} locale={locale} gateLabel={t.pipeline.gate} loop={copy.loop || undefined} />
        </div>
      </section>

      <section id="topics" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24">
        <details className="group/list">
          <summary className="focus-ring cursor-pointer font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground">
            {t.domainPage.topicsTitle} ({domain.topics.length})
          </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domain.topics.map((tp) => (
            <Link key={tp.slug} href={localePath(locale, `${domain.route}/topic/${tp.slug}`)} className="group">
              <Card className="reveal h-full transition-colors group-hover:border-primary/60">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <TopicIcon slug={tp.slug} className="size-5 text-primary" />
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </div>
                  <CardTitle className="pt-2">{tp.title}</CardTitle>
                  <CardDescription className="leading-snug">{tp.tagline}</CardDescription>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className={cn("font-mono text-[10px] uppercase tracking-wider", kindMeta[tp.kind].text)}>{kindMeta[tp.kind].label}</span>
                    {tp.stage ? (
                      <span className="font-mono text-[10px] text-muted-foreground">· {fmt(t.domainPage.stageLabel, { stage: tp.stage })}</span>
                    ) : null}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        </details>
      </section>
    </div>
  );
}
