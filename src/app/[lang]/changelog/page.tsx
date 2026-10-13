import type { Metadata } from "next";

import { ContentNotice } from "@/components/content-notice";
import { formatDate } from "@/content/profile";
import { localizedChangelog } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.changelog.pageTitle, description: t.changelog.description, alternates: alternatesFor(locale, "/changelog") };
}

export default async function ChangelogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const loc = localizedChangelog(locale);

  return (
    <div className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.changelog.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.changelog.heading}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t.changelog.intro}</p>
      </header>

      <div className="mt-6">
        <ContentNotice fallback={loc.fallback} sourceLang={loc.sourceLang} t={t} />
      </div>

      <ol className="mt-10 space-y-8 border-l border-border pl-6">
        {loc.value.map((e) => (
          <li key={`${e.date}-${e.title}`} className="relative">
            <span aria-hidden className="absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full border border-primary bg-background" />
            <p className="font-mono text-xs text-muted-foreground">{formatDate(e.date)}</p>
            <h2 className="mt-1 text-lg font-semibold">{e.title}</h2>
            <ul className="mt-2 space-y-1.5">
              {e.items.map((it) => (
                <li key={it} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
