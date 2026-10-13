import type { MetadataRoute } from "next";

import { changelog } from "@/content/changelog";
import { profile } from "@/content/profile";
import { domains, domainMeta } from "@/content/registry";

export const dynamic = "force-static";

// Every public route: hub, reference pages, each domain home and each topic.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl.replace(/\/$/, "");
  const lastModified = new Date(profile.contentUpdated);
  const fixed = ["", "/sobre", "/novidades", "/fontes", "/trilhas", "/cenarios", "/glossario", "/seguranca"];
  const entries: MetadataRoute.Sitemap = fixed.map((path) => ({
    url: `${base}${path}`,
    lastModified: path === "/novidades" ? new Date(changelog[0].date) : lastModified,
    priority: path === "" ? 1 : 0.7,
  }));
  for (const d of Object.values(domains)) {
    const route = domainMeta[d.id].route;
    entries.push({ url: `${base}${route}`, lastModified, priority: 0.9 });
    for (const t of d.topics) entries.push({ url: `${base}${route}/topico/${t.slug}`, lastModified, priority: 0.6 });
  }
  return entries;
}
