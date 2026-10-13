import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Code, Globe, Languages, MapPin, Mail } from "lucide-react";

import { ContentNotice } from "@/components/content-notice";
import { contactLinks, profile as baseProfile, type ProfileItem } from "@/content/profile";
import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { localizedProfile } from "@/i18n/globals";
import { alternatesFor, resolveLocale } from "@/i18n/server";

const ICONS: Record<string, typeof Mail> = { LinkedIn: Briefcase, Site: Globe, GitHub: Code, "E-mail": Mail };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  const p = localizedProfile(locale).value;
  return {
    title: t.about.pageTitle,
    description: fmt(t.about.description, { name: p.name, headline: p.headline }),
    alternates: alternatesFor(locale, "/about"),
  };
}

function ItemList({ title, items }: { title: string; items: ProfileItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it.title} className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium">{it.title}</span>
              {it.period ? <span className="font-mono text-xs text-muted-foreground">{it.period}</span> : null}
            </p>
            {it.detail ? <p className="mt-1 text-sm leading-snug text-muted-foreground">{it.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const loc = localizedProfile(locale);
  const profile = loc.value;
  const links = contactLinks();
  const b = t.about.behind;
  const behind = [
    [b.minimalTitle, b.minimalBody],
    [b.validatedTitle, b.validatedBody],
    [b.budgetTitle, b.budgetBody],
    [b.a11yTitle, b.a11yBody],
    [b.privacyTitle, b.privacyBody],
    [b.i18nTitle, b.i18nBody],
  ];

  return (
    <div className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.about.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{profile.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{profile.headline}</p>
        <p className="mt-4 leading-relaxed text-foreground/85">{profile.summary}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden /> {profile.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Languages className="size-3.5" aria-hidden /> {profile.languages.join(" · ")}
          </span>
        </p>
        <ul aria-label={t.about.skillsAria} className="mt-4 flex flex-wrap gap-2">
          {baseProfile.skills.map((sk) => (
            <li key={sk} className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              {sk}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((l) => {
            const Icon = ICONS[l.label] ?? ArrowUpRight;
            return (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Icon className="size-4" aria-hidden /> {l.label === "Site" ? t.profileStrip.site : l.label}
              </a>
            );
          })}
        </div>
      </header>

      <div className="mt-8">
        <ContentNotice fallback={loc.fallback} sourceLang={loc.sourceLang} t={t} />
      </div>

      <ItemList title={t.about.experience} items={profile.experience} />
      <ItemList title={t.about.education} items={profile.education} />
      <ItemList title={t.about.certifications} items={profile.certifications} />

      <section className="mt-12">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.about.whyTitle}</h2>
        <div className="mt-4 space-y-3 leading-relaxed text-foreground/85">
          <p>{t.about.why1}</p>
          <p>{t.about.why2}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.about.behindTitle}</h2>
        <ul className="mt-4 space-y-3">
          {behind.map(([title, body]) => (
            <li key={title} className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="font-medium">{title}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          {t.about.securityLead}{" "}
          <Link href={localePath(locale, "/security")} className="text-primary underline-offset-2 hover:underline">
            /security
          </Link>
          .
        </p>
      </section>

      <section id="content" className="mt-12 scroll-mt-20">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.about.contentTitle}</h2>
        <p className="mt-4 leading-relaxed text-foreground/85">{profile.contentNote}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.about.contentMore}{" "}
          <Link href={localePath(locale, "/changelog")} className="text-primary underline-offset-2 hover:underline">
            /changelog
          </Link>
          .
        </p>
      </section>

      <section className="mt-12 rounded-xl border border-primary/40 bg-primary/5 p-5">
        <h2 className="text-lg font-semibold">{t.about.ctaTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.about.ctaBody}</p>
        <a
          href={baseProfile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer me"
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Briefcase className="size-4" aria-hidden /> {t.about.ctaButton}
        </a>
      </section>
    </div>
  );
}
