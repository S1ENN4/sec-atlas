import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MoveRight } from "lucide-react";

import { ContentNotice } from "@/components/content-notice";
import { Quiz } from "@/components/quiz";
import { TopicBridges } from "@/components/topic-bridges";
import { TopicIcon } from "@/components/topic-icon";
import { TopicPathNav } from "@/components/topic-path-nav";
import { TopicSources } from "@/components/topic-sources";
import { TopicToolbar } from "@/components/topic-toolbar";
import { Badge } from "@/components/ui/badge";
import { domains, domainIdFromRoute, domainRouteSegments } from "@/content/registry";
import { LOCALES, localePath } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { fmt } from "@/i18n/format";
import { kindMetaFor } from "@/i18n/labels";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export const dynamicParams = false;
export const generateStaticParams = () =>
  LOCALES.flatMap((lang) =>
    domainRouteSegments.flatMap((domain) => {
      const id = domainIdFromRoute(domain)!;
      return domains[id].topics.map((t) => ({ lang, domain, slug: t.slug }));
    }),
  );

type Params = Promise<{ lang: string; domain: string; slug: string }>;

async function load(params: Params) {
  const { lang, domain: segment, slug } = await params;
  const { locale, t } = await resolveLocale(Promise.resolve({ lang }));
  const id = domainIdFromRoute(segment);
  if (!id) notFound();
  const localized = localizeDomain(id, locale);
  const topic = localized.domain.topics.find((x) => x.slug === slug);
  if (!topic) notFound();
  return { locale, t, id, segment, slug, topic, ...localized };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, segment, slug, topic } = await load(params);
  return {
    title: topic.title,
    description: topic.tagline,
    alternates: alternatesFor(locale, `/${segment}/topic/${slug}`),
    openGraph: { type: "article", title: topic.title, description: topic.tagline },
    twitter: { card: "summary_large_image", title: topic.title, description: topic.tagline },
  };
}

export default async function TopicPage({ params }: { params: Params }) {
  const { locale, t, id, slug, topic, domain, fallback, sourceLang } = await load(params);
  const base = localePath(locale, domain.route);
  const meta = kindMetaFor(id, t)[topic.kind];
  const rels = domain.relations.filter((r) => r.source.slug === slug || r.target.slug === slug);
  const byslug = new Map(domain.topics.map((x) => [x.slug, x]));

  return (
    <article data-domain={id} className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <Link
        href={`${base}#map`}
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> {t.topicPage.back}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 font-mono text-xs font-normal">
            <span className={`size-2 rounded-full ${meta.dot}`} />
            {meta.label}
          </Badge>
          {topic.stage ? (
            <Badge variant="secondary" className="font-mono text-xs font-normal">
              {fmt(t.topicPage.stageBadge, { stage: topic.stage })}
            </Badge>
          ) : null}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <TopicIcon slug={topic.slug} className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{topic.title}</h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">{topic.tagline}</p>
      </header>

      <TopicToolbar domain={id} slug={slug} t={t.toolbar} />

      <div className="mt-6 flex flex-wrap gap-2">
        {topic.tools.map((tool) => (
          <span key={tool} className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground">
            {tool}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <ContentNotice fallback={fallback} sourceLang={sourceLang} t={t} />
      </div>

      <div className="topic-prose mt-10 space-y-10">
        {topic.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body ? (
              <div className="t-body">
                {section.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            {section.bullets ? (
              <ul className="t-list">
                {section.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : null}
            {section.code?.map((sample, i) => (
              <figure key={i} className="t-code">
                <figcaption>
                  <span>{sample.filename ?? ""}</span>
                  <span className="uppercase tracking-wider">{sample.language}</span>
                </figcaption>
                <pre tabIndex={0} aria-label={sample.filename ?? sample.language}>
                  <code>{sample.code}</code>
                </pre>
              </figure>
            ))}
          </section>
        ))}
      </div>

      {rels.length > 0 ? (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.topicPage.connections}</h2>
          <ul className="mt-4 space-y-2.5">
            {rels.map((r) => {
              const source = byslug.get(r.source.slug);
              const target = byslug.get(r.target.slug);
              if (!source || !target) return null;
              // The current topic renders as plain text so the list never links back to the page being read.
              const node = (x: typeof source) =>
                x.slug === slug ? (
                  <span className="font-medium text-foreground">{x.title}</span>
                ) : (
                  <Link href={`${base}/topic/${x.slug}`} className="font-medium text-foreground transition-colors hover:text-primary">
                    {x.title}
                  </Link>
                );
              return (
                <li key={`${r.source.slug}->${r.target.slug}`} className="flex flex-wrap items-center gap-2 text-sm">
                  {node(source)}
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <MoveRight className="size-3.5 text-primary/70" aria-hidden />
                    {r.label}
                  </span>
                  {node(target)}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <TopicSources domain={id} locale={locale} t={t} />
      <TopicPathNav domain={id} slug={slug} locale={locale} t={t} />
      <TopicBridges domain={id} slug={slug} locale={locale} t={t} />
      <Quiz domain={id} slug={slug} t={t.quiz} />
    </article>
  );
}
