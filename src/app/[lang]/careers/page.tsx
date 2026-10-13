import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CareerProgress } from "@/components/career-roadmap";
import { domains, domainMeta } from "@/content/registry";
import type { DomainId } from "@/content/types";
import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { localizedRoles } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.careers.pageTitle, description: t.careers.description, alternates: alternatesFor(locale, "/careers") };
}

export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const roles = localizedRoles(locale).value;
  const known = new Set(Object.keys(domains));

  return (
    <div className="animate-page-enter mx-auto max-w-6xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.careers.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.careers.heading}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t.careers.intro}</p>
      </header>

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {roles.map((r) => {
          const topics = r.stages
            .flatMap((s) => s.topics)
            .map((id) => {
              const [domain, slug] = id.split("/");
              return { domain: domain as DomainId, slug };
            })
            .filter((tp) => known.has(tp.domain));
          return (
            <li key={r.id}>
              <Link
                href={localePath(locale, `/careers/${r.id}`)}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50"
              >
                <h2 className="text-xl font-semibold">{r.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.tagline}</p>
                <p className="mt-4 font-mono text-xs text-muted-foreground">{fmt(t.careers.topicCount, { n: topics.length })}</p>
                <div className="mt-3">
                  <CareerProgress topics={topics} label={t.careers.progress} />
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t.careers.openRoadmap}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
