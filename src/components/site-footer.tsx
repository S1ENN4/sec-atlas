import Link from "next/link";

import { profile } from "@/content/profile";
import { domains } from "@/content/registry";
import { localePath, type Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import type { Ui } from "@/i18n/ui";

export function SiteFooter({ locale, t }: { locale: Locale; t: Ui }) {
  const lp = (path: string) => localePath(locale, path);
  // Counts are derived from the registry every render; nothing is hardcoded.
  const counts = Object.values(domains)
    .map((d) => `${t.domains[d.id].name.toLowerCase()} ${d.topics.length}`)
    .join(" · ");
  const link = "rounded-sm transition-colors hover:text-foreground focus-ring";

  return (
    <footer className="border-t border-border/60 print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 font-mono text-xs text-muted-foreground md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <span>
            sec<span className="text-primary">/</span>atlas — {fmt(t.footer.tagline, { name: profile.name })}
          </span>
          <span className="flex flex-wrap gap-x-4">
            <Link href={lp("/manifesto")} className={link}>{t.footer.manifesto}</Link>
            <Link href={lp("/about")} className={link}>{t.footer.about}</Link>
            <Link href={lp("/changelog")} className={link}>{t.footer.changelog}</Link>
            <Link href={lp("/sources")} className={link}>{t.footer.sources}</Link>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer me" className={link}>{t.footer.linkedin}</a>
            <a href={profile.links.repo} target="_blank" rel="noopener noreferrer" className={link}>{t.footer.sourceCode}</a>
          </span>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <span>{counts}</span>
          <span>{t.footer.privacy}</span>
          <span>{t.footer.localOnly}</span>
        </div>
      </div>
    </footer>
  );
}
