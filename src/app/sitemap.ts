import type { MetadataRoute } from "next";

import { changelog } from "@/content/changelog";
import { profile } from "@/content/profile";
import { domains } from "@/content/registry";
import { LOCALES, localePath } from "@/i18n/config";

export const dynamic = "force-static";

// Every public route, once per locale, each with hreflang alternates.
const FIXED = ["", "/careers", "/journey", "/manifesto", "/about", "/changelog", "/sources", "/paths", "/scenarios", "/glossary", "/security"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl.replace(/\/$/, "");
  const lastModified = new Date(profile.contentUpdated);
  const paths: { path: string; priority: number; modified?: Date }[] = [
    ...FIXED.map((path) => ({ path, priority: path === "" ? 1 : 0.7, modified: path === "/changelog" ? new Date(changelog[0].date) : undefined })),
  ];
  for (const d of Object.values(domains)) {
    paths.push({ path: d.route, priority: 0.9 });
    for (const t of d.topics) paths.push({ path: `${d.route}/topic/${t.slug}`, priority: 0.6 });
  }

  return paths.flatMap(({ path, priority, modified }) =>
    LOCALES.map((locale) => ({
      url: `${base}${localePath(locale, path || "/")}`,
      lastModified: modified ?? lastModified,
      priority,
      alternates: {
        languages: Object.fromEntries([
          ...LOCALES.map((l) => [l, `${base}${localePath(l, path || "/")}`]),
          ["x-default", `${base}${localePath("en", path || "/")}`],
        ]),
      },
    })),
  );
}
