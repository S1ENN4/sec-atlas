import { domains, domainMeta, type DomainId } from "@/content/registry";

// Static search index, emitted at build time as /search-index.json and
// fetched lazily the first time the search palette opens, so it never adds to
// the page bundles. Short keys keep the payload small.
//   k: "t" topic | "g" glossary term   d: domain id   t: title / term
//   s: one-line description            u: destination  m: slug to focus on the map (topics)
//   x: extra searchable text (tagline + tools), never displayed
export const dynamic = "force-static";

interface Item {
  k: "t" | "g";
  d: DomainId;
  t: string;
  s: string;
  u: string;
  m?: string;
  x?: string;
}

const clip = (text: string, n = 140) => (text.length > n ? `${text.slice(0, n - 1).trimEnd()}…` : text);

export function GET() {
  const items: Item[] = [];
  for (const domain of Object.values(domains)) {
    const route = domainMeta[domain.id].route;
    for (const t of domain.topics) {
      items.push({ k: "t", d: domain.id, t: t.title, s: t.short, u: `${route}/topico/${t.slug}`, m: t.slug, x: `${t.tagline} ${t.tools.join(" ")}` });
    }
    for (const group of domain.glossary) {
      for (const e of group.entries) {
        items.push({
          k: "g",
          d: domain.id,
          t: e.aka ? `${e.term} (${e.aka})` : e.term,
          s: clip(e.meaning),
          u: e.topic ? `${route}/topico/${e.topic}` : "/glossario",
        });
      }
    }
  }
  return Response.json(items);
}
