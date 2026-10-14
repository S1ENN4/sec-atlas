import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SearchButton } from "@/components/search-button";
import { SiteNav, type NavData } from "@/components/site-nav";
import { exploreGroups } from "@/content/nav";
import { profile } from "@/content/profile";
import { domains } from "@/content/registry";
import { localePath, type Locale } from "@/i18n/config";
import { plural } from "@/i18n/format";
import type { Ui } from "@/i18n/ui";

// Global header. Builds the (localised) navigation data on the server and hands
// plain strings to the client components; nothing here knows a language.
export function SiteHeader({ locale, t }: { locale: Locale; t: Ui }) {
  const lp = (path: string) => localePath(locale, path);
  const n = t.nav;

  const nav: NavData = {
    labels: { menu: n.menu, openMenu: n.openMenu, closeMenu: n.closeMenu, mainNav: t.a11y.mainNav },
    explore: {
      label: n.explore,
      allDomains: n.allDomains,
      groups: exploreGroups.map((g) => ({
        id: g.id,
        label: n.groups[g.id],
        domains: g.domains.map((id) => ({
          id,
          name: t.domains[id].name,
          pitch: t.domains[id].pitch,
          count: plural(n as unknown as Record<string, string>, "topicsCount", domains[id].topics.length),
          total: domains[id].topics.length,
          href: lp(domains[id].route),
        })),
      })),
    },
    careers: { href: lp("/careers"), label: n.careers },
    learn: {
      label: n.learn,
      items: [
        { href: lp("/journey"), label: n.learnItems.journey, desc: n.learnItems.journeyDesc },
        { href: lp("/paths"), label: n.learnItems.paths, desc: n.learnItems.pathsDesc },
        { href: lp("/scenarios"), label: n.learnItems.scenarios, desc: n.learnItems.scenariosDesc },
        { href: lp("/glossary"), label: n.learnItems.glossary, desc: n.learnItems.glossaryDesc },
      ],
    },
    project: {
      label: n.project,
      items: [
        { href: lp("/manifesto"), label: n.projectItems.manifesto, desc: n.projectItems.manifestoDesc },
        { href: lp("/about"), label: n.projectItems.about, desc: n.projectItems.aboutDesc },
        { href: lp("/changelog"), label: n.projectItems.changelog, desc: n.projectItems.changelogDesc },
        { href: lp("/sources"), label: n.projectItems.sources, desc: n.projectItems.sourcesDesc },
        { href: lp("/security"), label: n.projectItems.security, desc: n.projectItems.securityDesc },
        { href: profile.links.repo, label: n.projectItems.repo, desc: n.projectItems.repoDesc, external: true },
      ],
    },
  };

  return (
    <header className="site-header sticky top-0 z-40 print:hidden">
      {/* The blur lives on a sibling layer: a backdrop-filter on the header itself would
          make it the containing block of the fixed menu veil and sheet inside it. */}
      <div aria-hidden className="absolute inset-0 -z-10 border-b border-border/60 bg-background/80 backdrop-blur" />
      <div className="relative mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <Link
          href={lp("/")}
          className="flex shrink-0 items-center gap-2 rounded-sm font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ShieldCheck className="size-5 text-primary" aria-hidden />
          appsec<span className="text-primary">/</span>kb
        </Link>
        <SiteNav data={nav} />
        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <SearchButton label={t.search.button} aria={t.search.buttonAria} />
          <LanguageSwitcher label={t.lang.switchTo} />
        </div>
      </div>
    </header>
  );
}
