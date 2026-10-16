import { MapPreview } from "@/components/map-preview";
import { ProgressLine } from "@/components/explore-progress-line";
import { atlasWorld } from "@/content/explore/atlas";
import { allExercises } from "@/content/explore/lab-more";
import { flatten } from "@/content/explore/world";
import { localizedExplore } from "@/i18n/globals";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FlaskConical, Map as MapIcon, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContinueCard, type ContinueTopicRef } from "@/components/continue-card";
import { ProgressSummary } from "@/components/progress-summary";
import { domainMeta, domains } from "@/content/registry";
import { localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { plural } from "@/i18n/format";
import { alternatesFor, resolveLocale } from "@/i18n/server";
import { estimateReadingMinutes, topicBodyText } from "@/lib/reading-time";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { alternates: alternatesFor(locale, "/"), openGraph: { title: t.meta.title, description: t.meta.description } };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const lp = (path: string) => localePath(locale, path);
  // Entry points first: the web top 10 and AppSec are where most people should start.
  const ORDER = ["owasp", "appsec", "devops", "seceng", "cloudsec", "secops", "response", "offsec", "grc", "ai-agents", "vibecoding"];
  const domainList = Object.values(domains).sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  const nav = t.nav as unknown as Record<string, string>;
  const startUi = localizedExplore(locale).value.ui;
  const atlasText = localizedExplore(locale).value.nodes as Record<string, { title: string }>;
  const atlasIds = Object.keys(flatten(atlasWorld)).filter((id) => id !== atlasWorld.id);
  const labIds = allExercises.map((e) => e.id);

  // "Continue where you left off" (P3.7): pre-compute the localized
  // title + route for every topic in the locale so the client island
  // can look its id up after reading localStorage. The list stays tiny
  // (< 10 KB) because every entry is just three short strings.
  const continueTopics: ContinueTopicRef[] = (Object.values(domains) as Array<typeof domains[keyof typeof domains]>).flatMap((d) => {
    const loc = localizeDomain(d.id, locale);
    return loc.domain.topics.map((tp) => ({
      id: `${tp.domain}/${tp.slug}`,
      title: tp.title,
      route: localePath(locale, `${domainMeta[tp.domain].route}/topic/${tp.slug}`),
    }));
  });

  return (
    <div className="animate-page-enter mx-auto max-w-6xl px-4 pb-10 pt-12 md:pt-20">
      <header className="hero-glow">
        <div>
          <Badge variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
            {t.hub.badge}
          </Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            {t.hub.title} <span className="accent-draw text-primary">{t.hub.titleAccent}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">{t.hub.lead}</p>
          <p className="mt-5">
            <Link
              href={lp("/manifesto")}
              className="group inline-flex items-center gap-1.5 font-mono text-sm text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t.hub.manifestoLink}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </p>
        </div>
      </header>

      <hr className="mt-10 border-border/60" />

      {/* "Continue where you left off" (P3.7). The client island renders
          nothing when there is no last-topic pointer or it points to a
          topic that no longer ships; the hub stays clean either way. */}
      <div className="mt-10">
        <ContinueCard
          topics={continueTopics}
          locale={locale}
          t={{ where: t.hub.continueWhere, read: t.hub.continueRead }}
        />
      </div>

      <section className="mt-10 grid items-center gap-6 rounded-2xl border border-primary/40 bg-primary/5 p-6 md:grid-cols-[1.2fr_1fr]">
        <div>
        <h2 className="text-xl font-bold tracking-tight">{startUi.startTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{startUi.startBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={lp("/explore/atlas")}
            className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <MapIcon className="size-4" aria-hidden /> {startUi.startAtlas}
          </Link>
          <Link
            href={lp("/lab")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FlaskConical className="size-4" aria-hidden /> {startUi.startLab}
          </Link>
          <Link
            href={lp("/explore/owasp10")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ShieldCheck className="size-4" aria-hidden /> {atlasText.owasp10.title}
          </Link>
          <Link
            href={lp("/explore")}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {startUi.startMaps} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ProgressLine ids={atlasIds} labIds={labIds} labels={{ explored: startUi.explored, lab: startUi.labProgress }} />
        </div>
        <Link href={lp("/explore/atlas")} aria-label={startUi.startAtlas} className="block rounded-xl border border-border bg-background/60 p-3 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <MapPreview center={atlasText.atlas.title} items={["a-site", "a-api", "a-data", "a-repo", "a-pipeline", "a-cloud"].map((id) => atlasText[id].title)} />
        </Link>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {domainList.map((d, i) => {
          const copy = t.domains[d.id];
          const isLive = d.status === "live";
          const totalMinutes = d.topics.reduce(
            (sum, tp) => sum + estimateReadingMinutes(topicBodyText(tp)),
            0,
          );
          return (
            <Link
              key={d.id}
              href={lp(d.route)}
              className="animate-hero-enter group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ animationDelay: `${120 + Math.min(i, 6) * 80}ms` }}
            >
              <div data-domain={d.id} className="h-full">
                <Card className="relative h-full overflow-hidden transition-[transform,border-color,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:shadow-[0_8px_30px_-12px_var(--primary)]">
                  {/* Soft accent glow that fades in on hover. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{d.id}</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {`${plural(nav, "topicsCount", d.topics.length)} · ${totalMinutes} ${t.topicPage.minRead}`}
                      </span>
                    </div>
                    <CardTitle className="pt-2 text-2xl">{copy.name}</CardTitle>
                    <CardDescription className="line-clamp-3 leading-snug">{copy.pitch}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mt-10">
        <ProgressSummary
          t={t.progress}
          domains={domainList.map((d) => ({ id: d.id, name: t.domains[d.id].name, slugs: d.topics.map((tp) => tp.slug) }))}
        />
      </section>
    </div>
  );
}
