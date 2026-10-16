import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical, Map as MapIcon } from "lucide-react";

import { allExercises } from "@/content/explore/lab-more";
import { flatten } from "@/content/explore/world";
import { worlds } from "@/content/explore/worlds";
import { localePath } from "@/i18n/config";
import { fmt, plural } from "@/i18n/format";
import { MapPreview } from "@/components/map-preview";
import { ContinueMap, ProgressLine } from "@/components/explore-progress-line";
import { localizedExplore } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const { ui } = localizedExplore(locale).value;
  return { title: ui.pageTitle, description: ui.description, alternates: alternatesFor(locale, "/explore") };
}

export default async function ExploreIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale } = await resolveLocale(params);
  const text = localizedExplore(locale).value;
  const nodeText = text.nodes as Record<string, { title: string; summary: string }>;
  const short = (x: string, n: number) => (x.length > n ? `${x.slice(0, n - 1).trimEnd()}…` : x);
  const lookup: Record<string, { world: string; title: string }> = {};
  for (const w of worlds) for (const id of Object.keys(flatten(w.root))) lookup[id] = { world: w.id, title: nodeText[id].title };

  return (
    <div className="animate-page-enter mx-auto max-w-7xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{text.ui.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{text.ui.indexHeading}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{text.ui.indexIntro}</p>
      </header>

      <ContinueMap nodes={lookup} label={text.ui.continueMap} base={localePath(locale, "/explore")} />

      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
        {worlds.map((w) => {
          const flat = flatten(w.root);
          const places = Object.keys(flat).length - 1;
          const challenges = Object.values(flat).filter((n) => n.risky).length;
          const t = nodeText[w.id];
          return (
            <li key={w.id}>
              <Link
                href={localePath(locale, `/explore/${w.id}`)}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-2">
                  <MapIcon className="size-5 text-primary" aria-hidden />
                  {w.id === "atlas" ? (
                    <span className="rounded-md border border-primary/50 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                      {text.ui.caseStudy}
                    </span>
                  ) : null}
                </span>
                <div className="mt-4 flex aspect-[2.4/1] items-center rounded-xl border border-border bg-background/60 p-2 transition-colors group-hover:border-primary/40">
                  <MapPreview
                    center={short(t.title, 24)}
                    items={(w.root.children ?? []).slice(0, 6).map((c) => short(nodeText[c.id].title, 22))}
                  />
                </div>
                <h2 className="mt-3 text-xl font-semibold">{t.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.summary}</p>
                <p className="mt-4 font-mono text-xs text-muted-foreground">
                  {fmt(text.ui.placesCount, { n: places })} · {plural(text.ui as unknown as Record<string, string>, "challengesCount", challenges)}
                </p>
                <ProgressLine
                  ids={Object.keys(flat).filter((id) => id !== w.id)}
                  labIds={w.id === "atlas" ? allExercises.map((e) => e.id) : undefined}
                  labels={{ explored: text.ui.explored, lab: text.ui.labProgress }}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href={localePath(locale, "/lab")}
        className="mt-6 flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-5 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <FlaskConical className="size-6 shrink-0 text-primary" aria-hidden />
        <span>
          <span className="block font-semibold">{text.lab.ui.pageTitle}</span>
          <span className="block text-sm text-muted-foreground">{text.lab.ui.description}</span>
        </span>
        <ArrowRight className="ml-auto size-4 shrink-0 text-primary" aria-hidden />
      </Link>
    </div>
  );
}
