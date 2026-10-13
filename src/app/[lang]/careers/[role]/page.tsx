import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Map as MapIcon } from "lucide-react";

import { CareerRoadmap, type RoadmapStage } from "@/components/career-roadmap";
import { roles as sourceRoles } from "@/content/careers";
import { domainMeta } from "@/content/registry";
import type { DomainId } from "@/content/types";
import { LOCALES, localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { localizedRoles } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((lang) => sourceRoles.map((r) => ({ lang, role: r.id })));

export async function generateMetadata({ params }: { params: Promise<{ lang: string; role: string }> }): Promise<Metadata> {
  const { role: id } = await params;
  const { locale } = await resolveLocale(params);
  const role = localizedRoles(locale).value.find((r) => r.id === id);
  if (!role) return {};
  return { title: role.title, description: role.tagline, alternates: alternatesFor(locale, `/careers/${id}`) };
}

export default async function RolePage({ params }: { params: Promise<{ lang: string; role: string }> }) {
  const { role: id } = await params;
  const { locale, t } = await resolveLocale(params);
  const roles = localizedRoles(locale).value;
  const role = roles.find((r) => r.id === id);
  if (!role) notFound();

  const titleOf = new Map<string, string>();
  const loaded = new Set<string>();
  const stages: RoadmapStage[] = role.stages.map((s) => ({
    level: s.level,
    levelName: s.level === 1 ? t.journey.level1 : s.level === 2 ? t.journey.level2 : t.journey.level3,
    goal: s.goal,
    outside: s.outside,
    project: s.project,
    topics: s.topics.flatMap((tid) => {
      const [domain, slug] = tid.split("/") as [DomainId, string];
      if (!domainMeta[domain]) return [];
      if (!loaded.has(domain)) {
        loaded.add(domain);
        for (const tp of localizeDomain(domain, locale).domain.topics) titleOf.set(`${domain}/${tp.slug}`, tp.title);
      }
      return [{ domain, slug, title: titleOf.get(tid) ?? slug, href: localePath(locale, `${domainMeta[domain].route}/topic/${slug}`) }];
    }),
  }));
  const adjacent = role.adjacent.map((a) => roles.find((r) => r.id === a)).filter((r): r is NonNullable<typeof r> => !!r);

  return (
    <div className="animate-page-enter mx-auto max-w-4xl px-4 pb-24 pt-10">
      <Link href={localePath(locale, "/careers")} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> {t.careers.allCareers}
      </Link>

      <header className="mt-4">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.careers.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{role.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{role.tagline}</p>
        <p className="mt-4 leading-relaxed">{role.summary}</p>
        <Link
          href={`${localePath(locale, "/journey")}?role=${role.id}`}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/50 hover:text-primary"
        >
          <MapIcon className="size-4" aria-hidden /> {t.careers.viewJourney}
        </Link>
      </header>

      <section className="mt-10">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.careers.dayToDay}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          {role.dayToDay.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <CareerRoadmap
          stages={stages}
          t={{
            stageN: t.careers.stageN,
            goal: t.careers.goal,
            inKb: t.careers.inKb,
            outside: t.careers.outside,
            project: t.careers.project,
            progress: t.careers.progress,
            nextStep: t.careers.nextStep,
            roadmapComplete: t.careers.roadmapComplete,
            stageComplete: t.careers.stageComplete,
          }}
        />
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.careers.portfolio}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          {role.portfolio.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.careers.certsTitle}</h2>
        {role.certs.length ? (
          <>
            <ul className="mt-3 flex flex-wrap gap-2">
              {role.certs.map((c) => (
                <li key={c} className="rounded-md border border-border px-2.5 py-1 text-sm">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">{t.careers.certsDisclaimer}</p>
          </>
        ) : null}
        {role.certsNote ? <p className="mt-3 text-sm text-muted-foreground">{role.certsNote}</p> : null}
      </section>

      {adjacent.length ? (
        <section className="mt-10">
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.careers.relatedRoles}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {adjacent.map((a) => (
              <li key={a.id}>
                <Link href={localePath(locale, `/careers/${a.id}`)} className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/50 hover:text-primary">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
