import type { Metadata } from "next";

import { AtlasLab } from "@/components/atlas-lab";
import { allExercises } from "@/content/explore/lab-more";
import { localePath } from "@/i18n/config";
import { localizedExplore } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const { ui } = localizedExplore(locale).value.lab;
  return { title: ui.pageTitle, description: ui.description, alternates: alternatesFor(locale, "/lab") };
}

export default async function LabPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale } = await resolveLocale(params);
  const { lab } = localizedExplore(locale).value;
  const nodeHrefs = Object.fromEntries(allExercises.map((e) => [e.id, `${localePath(locale, "/explore/atlas")}#${e.node}`]));

  return (
    <div className="animate-page-enter mx-auto max-w-7xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{lab.ui.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{lab.ui.heading}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{lab.ui.intro}</p>
      </header>
      <div className="mt-8">
        <AtlasLab exercises={allExercises} ui={lab.ui} texts={lab.exercises} nodeHrefs={nodeHrefs} />
      </div>
    </div>
  );
}
