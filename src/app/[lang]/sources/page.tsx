import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { ContentNotice } from "@/components/content-notice";
import { formatDate } from "@/content/profile";
import { sources } from "@/content/sources";
import type { DomainId } from "@/content/types";
import { fmt } from "@/i18n/format";
import { localizedProfile, localizedSourceNotes } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.sourcesPage.pageTitle, description: t.sourcesPage.description, alternates: alternatesFor(locale, "/sources") };
}

export default async function SourcesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const notes = localizedSourceNotes(locale);
  const profile = localizedProfile(locale);
  const ids = Object.keys(sources) as DomainId[];

  return (
    <div className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.sourcesPage.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.sourcesPage.heading}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t.sourcesPage.intro}</p>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {fmt(t.sourcesNote.updated, { date: formatDate(profile.value.contentUpdated) })} · {profile.value.contentNote}
        </p>
      </header>

      <div className="mt-6">
        <ContentNotice fallback={profile.fallback} sourceLang={profile.sourceLang} t={t} />
      </div>

      {ids.map((d) => (
        <section key={d} id={d} data-domain={d} className="mt-10 scroll-mt-20">
          <h2 className="font-mono text-sm uppercase tracking-wider text-primary">{t.domains[d].name}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {sources[d].map((s, i) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight group-hover:text-primary">{s.label}</span>
                    <span className="block text-xs leading-snug text-muted-foreground">{notes[d]?.[i]?.note ?? s.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
