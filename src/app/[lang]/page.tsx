import { ProgressLine } from "@/components/explore-progress-line";
import { atlasWorld } from "@/content/explore/atlas";
import { allExercises } from "@/content/explore/lab-more";
import { flatten } from "@/content/explore/world";
import { localizedExplore } from "@/i18n/globals";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, FlaskConical, Map as MapIcon, Route, Swords, Briefcase } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContinueCard, type ContinueTopicRef } from "@/components/continue-card";
import { ProfileStrip } from "@/components/profile-strip";
import { ProgressSummary } from "@/components/progress-summary";
import { domainMeta, domains } from "@/content/registry";
import { localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { fmt, plural } from "@/i18n/format";
import { alternatesFor, resolveLocale } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { estimateReadingMinutes, topicBodyText } from "@/lib/reading-time";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { alternates: alternatesFor(locale, "/"), openGraph: { title: t.meta.title, description: t.meta.description } };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const lp = (path: string) => localePath(locale, path);
  const domainList = Object.values(domains);
  const liveCount = domainList.filter((d) => d.status === "live").length;
  const draftCount = domainList.length - liveCount;
  const explore = [
    { href: lp("/explore"), icon: MapIcon, ...t.hub.explore.map },
    { href: lp("/journey"), icon: Compass, ...t.hub.explore.journey },
    { href: lp("/careers"), icon: Briefcase, ...t.hub.explore.careers },
    { href: lp("/paths"), icon: Route, ...t.hub.explore.paths },
    { href: lp("/scenarios"), icon: Swords, ...t.hub.explore.scenarios },
  ];
  const nav = t.nav as unknown as Record<string, string>;
  const startUi = localizedExplore(locale).value.ui;
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
      <ProfileStrip locale={locale} t={t} />

      <header className="mt-10 grid gap-6 md:grid-cols-[2fr_1fr] md:items-end">
        <div>
          <Badge variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
            {t.hub.badge}
          </Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            {t.hub.title} <span className="text-primary">{t.hub.titleAccent}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">{fmt(t.hub.lead, { n: domainList.length })}</p>
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
        <dl className="font-mono text-xs text-muted-foreground md:text-right">
          <div className="flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt>{t.hub.statDomains}</dt>
            <dd className="text-base text-foreground">{String(domainList.length).padStart(2, "0")}</dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt>{t.hub.statLive}</dt>
            <dd className="text-base text-primary">{String(liveCount).padStart(2, "0")}</dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3 md:justify-end md:gap-6">
            <dt>{t.hub.statDraft}</dt>
            <dd className={cn("text-base", draftCount > 0 ? "text-amber-400/90" : "text-muted-foreground")}>
              {String(draftCount).padStart(2, "0")}
            </dd>
          </div>
        </dl>
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

      <section className="mt-10 rounded-2xl border border-primary/40 bg-primary/5 p-6">
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
            href={lp("/explore")}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {startUi.startMaps} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ProgressLine ids={atlasIds} labIds={labIds} labels={{ explored: startUi.explored, lab: startUi.labProgress }} />
      </section>

      <section className="mt-10">
        <ProgressSummary
          t={t.progress}
          domains={domainList.map((d) => ({ id: d.id, name: t.domains[d.id].name, slugs: d.topics.map((tp) => tp.slug) }))}
        />
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
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{d.id}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {`${plural(nav, "topicsCount", d.topics.length)} · ${totalMinutes} ${t.topicPage.minRead}`}
                      </span>
                    </div>
                    <CardTitle className="pt-2 text-2xl">{copy.name}</CardTitle>
                    <CardDescription className="leading-snug">{copy.pitch}</CardDescription>
                    <div className={cn("flex items-center gap-1.5 pt-3 font-mono text-xs", isLive ? "text-primary/80" : "text-muted-foreground")}>
                      {isLive ? t.hub.openMap : t.hub.notify}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </Link>
          );
        })}
      </section>

      <section aria-labelledby="explore-title" className="mt-14">
        <h2 id="explore-title" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          {t.hub.exploreTitle}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {explore.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group rounded-xl border border-border bg-card p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <e.icon className="size-5 text-primary" aria-hidden />
              <p className="mt-3 font-semibold">{e.title}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{e.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
