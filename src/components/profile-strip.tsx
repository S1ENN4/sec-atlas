import Link from "next/link";
import { ArrowUpRight, Briefcase, Code, Globe, Mail } from "lucide-react";

import { contactLinks, profile as baseProfile } from "@/content/profile";
import { localePath, type Locale } from "@/i18n/config";
import { localizedProfile } from "@/i18n/globals";
import type { Ui } from "@/i18n/ui";

const ICONS: Record<string, typeof Mail> = { LinkedIn: Briefcase, Site: Globe, GitHub: Code, "E-mail": Mail };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

// Personal strip at the top of the hub: who built this, what it is, and where
// to reach out. All text comes from `src/content/profile.ts` (localised).
export function ProfileStrip({ locale, t }: { locale: Locale; t: Ui }) {
  const profile = localizedProfile(locale).value;
  return (
    <aside
      aria-label={t.profileStrip.aria}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-sm font-semibold text-primary"
        >
          {initials(baseProfile.name)}
        </span>
        <div className="min-w-0">
          <p className="font-semibold leading-tight">{profile.name}</p>
          <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{profile.headline}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {contactLinks().map((l) => {
          const Icon = ICONS[l.label] ?? ArrowUpRight;
          return (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer me"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Icon className="size-3.5" aria-hidden /> {l.label === "Site" ? t.profileStrip.site : l.label}
            </a>
          );
        })}
        <Link
          href={localePath(locale, "/about")}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {t.profileStrip.about} <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
