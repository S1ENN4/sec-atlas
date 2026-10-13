import type { Metadata } from "next";

import { ContentNotice } from "@/components/content-notice";
import { GlossaryExplorer } from "@/components/glossary-explorer";
import { domains } from "@/content/registry";
import type { DomainId } from "@/content/types";
import { getAllGlossaries } from "@/lib/glossary";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.glossary.pageTitle, description: t.glossary.description, alternates: alternatesFor(locale, "/glossary") };
}

export default async function GlossaryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const { groups, fallback } = getAllGlossaries(locale);
  const domainNames = Object.fromEntries((Object.keys(domains) as DomainId[]).map((id) => [id, t.domains[id].name]));
  // Glossary content is authored per domain; the notice refers to the legacy source language.
  const sourceLang = domains.appsec.contentLang ?? "en";

  return (
    <article className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.glossary.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.glossary.heading}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t.glossary.intro}</p>
      </header>

      <div className="mt-6">
        <ContentNotice fallback={fallback} sourceLang={sourceLang} t={t} />
      </div>

      <div className="mt-8">
        <GlossaryExplorer groups={groups} domainNames={domainNames} t={t.glossary} />
      </div>
    </article>
  );
}
