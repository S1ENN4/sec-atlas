import { exploreGroups } from "@/content/nav";
import { domains, getTopic } from "@/content/registry";
import type { DomainId } from "@/content/types";
import { LOCALES, isLocale, localePath, type Locale } from "@/i18n/config";
import { localizeDomain } from "@/i18n/content";
import { flatten } from "@/content/explore/world";
import { worlds } from "@/content/explore/worlds";
import { localizedExplore, localizedRoles } from "@/i18n/globals";
import { getUi } from "@/i18n/ui";

// Static search index per locale, emitted at build time as
// /<locale>/search-index.json and fetched lazily the first time the search
// palette opens, so it never adds to the page bundles. Short keys keep it small.
//   k: "t" topic | "g" glossary term | "p" page   d: domain id ("" for pages)
//   t: title / term   s: one-line description   u: destination
//   m: slug to focus on the map (topics)   x: extra searchable text, never displayed
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

interface Item {
  k: "t" | "g" | "p";
  d: DomainId | "";
  t: string;
  s: string;
  u: string;
  m?: string;
  x?: string;
}

const clip = (text: string, n = 140) => (text.length > n ? `${text.slice(0, n - 1).trimEnd()}…` : text);

function pages(locale: Locale): Item[] {
  const t = getUi(locale);
  const n = t.nav;
  const lp = (p: string) => localePath(locale, p);
  const page = (title: string, desc: string, path: string): Item => ({ k: "p", d: "", t: title, s: desc, u: lp(path) });
  const out: Item[] = [];
  for (const g of exploreGroups) {
    for (const id of g.domains) out.push({ k: "p", d: id, t: t.domains[id].name, s: t.domains[id].pitch, u: lp(domains[id].route) });
  }
  out.push(
    page(n.careers, n.careers, "/careers"),
    page(n.learnItems.explore, n.learnItems.exploreDesc, "/explore"),
    page(n.learnItems.lab, n.learnItems.labDesc, "/lab"),
    page(n.learnItems.journey, n.learnItems.journeyDesc, "/journey"),
    page(n.learnItems.paths, n.learnItems.pathsDesc, "/paths"),
    page(n.learnItems.scenarios, n.learnItems.scenariosDesc, "/scenarios"),
    page(n.learnItems.glossary, n.learnItems.glossaryDesc, "/glossary"),
    page(n.projectItems.manifesto, n.projectItems.manifestoDesc, "/manifesto"),
    page(n.projectItems.about, n.projectItems.aboutDesc, "/about"),
    page(n.projectItems.changelog, n.projectItems.changelogDesc, "/changelog"),
    page(n.projectItems.sources, n.projectItems.sourcesDesc, "/sources"),
    page(n.projectItems.security, n.projectItems.securityDesc, "/security"),
  );
  return out;
}

export async function GET(_req: Request, ctx: { params: Promise<{ lang: string }> }) {
  const { lang } = await ctx.params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });
  const items: Item[] = pages(lang);
  const ex = localizedExplore(lang).value.nodes as Record<string, { title: string; summary: string }>;
  for (const w of worlds) items.push({ k: "p", d: "", t: ex[w.id].title, s: clip(ex[w.id].summary), u: localePath(lang, `/explore/${w.id}`) });
  // Every place on the explorable maps is searchable, and opens that node.
  for (const w of worlds) {
    for (const id of Object.keys(flatten(w.root))) {
      if (id === w.id) continue;
      const nt = (localizedExplore(lang).value.nodes as Record<string, { title: string; summary: string; points: string[] }>)[id];
      items.push({ k: "p", d: "", t: nt.title, s: clip(nt.summary), u: `${localePath(lang, `/explore/${w.id}`)}#${id}`, x: nt.points.join(" ") });
    }
  }
  for (const r of localizedRoles(lang).value) {
    items.push({ k: "p", d: "", t: r.title, s: clip(r.tagline), u: localePath(lang, `/careers/${r.id}`), x: r.summary });
  }
  for (const id of Object.keys(domains) as DomainId[]) {
    const { domain } = localizeDomain(id, lang);
    const route = domain.route;
    for (const tp of domain.topics) {
      items.push({
        k: "t",
        d: id,
        t: tp.title,
        s: tp.short,
        u: localePath(lang, `${route}/topic/${tp.slug}`),
        m: tp.slug,
        x: `${tp.tagline} ${tp.tools.join(" ")}`,
      });
    }
    for (const group of domain.glossary) {
      for (const e of group.entries) {
        const target = e.topic ? getTopic(e.topic) : undefined;
        items.push({
          k: "g",
          d: id,
          t: e.aka ? `${e.term} (${e.aka})` : e.term,
          s: clip(e.meaning),
          u: target ? localePath(lang, `${domains[target.domain].route}/topic/${target.slug}`) : localePath(lang, "/glossary"),
        });
      }
    }
  }
  return Response.json(items);
}
