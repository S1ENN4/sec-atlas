import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MoveRight } from "lucide-react";

import { ContentNotice } from "@/components/content-notice";
import { CopyCodeButton } from "@/components/copy-code-button";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { Quiz } from "@/components/quiz";
import { TopicBridges } from "@/components/topic-bridges";
import { TopicIcon } from "@/components/topic-icon";
import { TopicPathNav } from "@/components/topic-path-nav";
import { TopicSideSummary } from "@/components/topic-side-summary";
import { TopicSources } from "@/components/topic-sources";
import { TopicToolbar } from "@/components/topic-toolbar";
import { createTermLinker } from "@/components/glossary-text";
import { TopicVisitRecorder } from "@/components/topic-visit-recorder";
import { Badge } from "@/components/ui/badge";
import { levels } from "@/content/levels";
import { domains, domainIdFromRoute, domainMeta, domainRouteSegments, getTopic } from "@/content/registry";
import type { DomainId } from "@/content/types";
import { LOCALES, localePath } from "@/i18n/config";
import { localizeDomain, localizedTopic } from "@/i18n/content";
import { fmt } from "@/i18n/format";
import { kindMetaFor } from "@/i18n/labels";
import { alternatesFor, resolveLocale } from "@/i18n/server";
import { estimateReadingMinutes, topicBodyText } from "@/lib/reading-time";

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
  const minutes = estimateReadingMinutes(topicBodyText(topic));

  // --- study-before / unlocks / next-topic (Phase 3 A4) -------------------
  // Prereqs and unlocks can be in another domain (e.g. seceng.iac-seguro
  // requires cloudsec.iam). The localized title comes from
  // localizedTopic (a fallback to the source-language title for
  // untranslated units); the link uses the prereq's own domain route so
  // the URL stays correct.
  const topicKey = `${id}/${slug}`;
  const resolvePrereq = (key: string): { key: string; title: string; route: string } | null => {
    const [pdom, pslug] = key.split("/");
    if (!pdom || !pslug) return null;
    // Validate the entry is well-formed against the registry (R10 keeps
    // this honest; a missing prereq means the levels map is stale).
    if (!getTopic({ domain: pdom as keyof typeof domains, slug: pslug })) return null;
    const pt = localizedTopic(pdom as DomainId, pslug, locale);
    if (!pt) return null;
    return { key, title: pt.title, route: localePath(locale, domainMeta[pt.domain].route) };
  };
  const prereqs = (levels[topicKey]?.requires ?? []).map(resolvePrereq).filter((x): x is { key: string; title: string; route: string } => x !== null);
  // Inverse: every topic whose `requires` list includes this one. Same
  // shape as `prereqs` so both lists share the same list layout.
  const unlocks = Object.entries(levels)
    .filter(([, info]) => (info.requires ?? []).includes(topicKey))
    .map(([key]) => resolvePrereq(key))
    .filter((x): x is { key: string; title: string; route: string } => x !== null);

  // Next topic: walk the domain's pipeline in order. The first item that
  // sits AFTER the current topic and carries a slug wins. Items without a
  // slug are skipped (they are plain stage labels, not real topics).
  const flat = domain.pipeline.flatMap((stage) => stage.items);
  const currentIdx = flat.findIndex((it) => it.slug === slug);
  let nextTopic: { title: string; route: string } | null = null;
  if (currentIdx >= 0) {
    for (let i = currentIdx + 1; i < flat.length; i++) {
      const cand = flat[i];
      if (!cand.slug) continue;
      const nt = byslug.get(cand.slug);
      if (!nt) continue;
      nextTopic = { title: nt.title, route: `${base}/topic/${cand.slug}` };
      break;
    }
  }
  const endOfPath = currentIdx >= 0 && !nextTopic;

  const linker = createTermLinker(locale, t.glossary.seeInGlossary);

  return (
    <article data-domain={id} className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <div className="reading-progress print:hidden" aria-hidden />
      <Link
        href={`${base}#map`}
        className="focus-ring inline-flex items-center gap-2 rounded-sm font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
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
          <Badge variant="outline" className="font-mono text-xs font-normal" aria-label={`${minutes} ${t.topicPage.minRead}`}>
            {`${minutes} ${t.topicPage.minRead}`}
          </Badge>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <TopicIcon slug={topic.slug} className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{topic.title}</h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">{topic.tagline}</p>
        <TopicVisitRecorder locale={locale} domain={id} slug={slug} />
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
        <TopicSideSummary
          items={topic.sections.map((s, i) => ({
            id: `section-${i}`,
            label: s.heading,
            level: 2 as const,
          }))}
          t={{ summary: t.topicPage.summary }}
        />
        {topic.sections.map((section, i) => (
          <section key={section.heading}>
            <h2 id={`section-${i}`}>{section.heading}</h2>
            {section.body ? (
              <div className="t-body">
                {section.body.map((p, i) => (
                  <p key={i}>{linker.text(p)}</p>
                ))}
              </div>
            ) : null}
            {section.bullets ? (
              <ul className="t-list">
                {section.bullets.map((b, i) => (
                  <li key={i}><span>{linker.text(b)}</span></li>
                ))}
              </ul>
            ) : null}
            {section.code?.map((sample, i) => (
              <figure key={i} className="t-code">
                <figcaption>
                  <span>{sample.filename ?? ""}</span>
                  <span className="uppercase tracking-wider">{sample.language}</span>
                </figcaption>
                <div className="relative">
                  <pre tabIndex={0} aria-label={sample.filename ?? sample.language}>
                    <code>{sample.code}</code>
                  </pre>
                  <CopyCodeButton
                    code={sample.code}
                    filename={sample.filename}
                    t={{ topicPage: { copy: t.topicPage.copy, copied: t.topicPage.copied } }}
                    className="absolute top-2 right-2 z-10"
                  />
                </div>
              </figure>
            ))}
          </section>
        ))}
        {linker.popovers()}
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
                  <Link href={`${base}/topic/${x.slug}`} className="focus-ring rounded-sm font-medium text-foreground transition-colors hover:text-primary">
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

      {/* study-before (P3.4): a list of prerequisite topics, in the
          order they appear in the levels map. Rendered when the topic
          has at least one requirement. */}
      {prereqs.length > 0 ? (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.topicPage.studyBefore}</h2>
          <ul className="mt-4 space-y-2.5">
            {prereqs.map((p) => (
              <li key={p.key} className="text-sm">
                <Link
                  href={`${p.route}/topic/${p.key.split("/")[1]}`}
                  className="focus-ring rounded-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* unlocks (P3.4): the inverse of the requires map: every topic
          whose prereq list includes the current one. */}
      {unlocks.length > 0 ? (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.topicPage.unlocks}</h2>
          <ul className="mt-4 space-y-2.5">
            {unlocks.map((u) => (
              <li key={u.key} className="text-sm">
                <Link
                  href={`${u.route}/topic/${u.key.split("/")[1]}`}
                  className="focus-ring rounded-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  {u.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* next topic (P3.5): either a footer with the next topic in the
          domain's pipeline, or an "end of the path" footer that links
          back to the hub. */}
      {nextTopic ? (
        <footer className="mt-14 border-t border-border pt-8">
          <Link
            href={nextTopic.route}
            className="focus-ring group inline-flex items-center gap-2 rounded-md font-medium text-primary transition-colors hover:text-primary/80"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {fmt(t.topicPage.nextTopic, { title: nextTopic.title })}
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </footer>
      ) : endOfPath ? (
        <footer className="mt-14 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">{t.topicPage.endOfPath}</p>
          <Link
            href={localePath(locale)}
            className="focus-ring mt-2 inline-flex items-center gap-2 rounded-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> {t.topicPage.back}
          </Link>
        </footer>
      ) : null}

      <Quiz domain={id} slug={slug} t={t.quiz} />

      {/* keyboard shortcuts (P3.6): j/k, g h, c. Renders a polite-live
          hint once per tab. Mounted last so its listener is bound when
          the page is interactive. */}
      <KeyboardShortcuts locale={locale} hint={t.topicPage.shortcuts} />
    </article>
  );
}
