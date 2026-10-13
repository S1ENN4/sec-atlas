import Link from "next/link";
import { ArrowLeft, ArrowRight, Route } from "lucide-react";

import { domainMeta, type DomainId } from "@/content/registry";
import { localePath, type Locale } from "@/i18n/config";
import { localizedTopic } from "@/i18n/content";
import { fmt } from "@/i18n/format";
import { localizedPaths } from "@/i18n/globals";
import type { Ui } from "@/i18n/ui";

// "Continue the trail": prev / next step of the first study path that
// contains this topic. Server component.
export function TopicPathNav({ domain, slug, locale, t }: { domain: DomainId; slug: string; locale: Locale; t: Ui }) {
  const href = (r: { domain: DomainId; slug: string }) => localePath(locale, `${domainMeta[r.domain].route}/topic/${r.slug}`);
  const paths = localizedPaths(locale).value;
  const path = paths.find((p) => p.steps.some((s) => s.ref.domain === domain && s.ref.slug === slug));
  if (!path) return null;
  const i = path.steps.findIndex((s) => s.ref.domain === domain && s.ref.slug === slug);
  const prev = path.steps[i - 1];
  const next = path.steps[i + 1];
  const prevT = prev && localizedTopic(prev.ref.domain, prev.ref.slug, locale);
  const nextT = next && localizedTopic(next.ref.domain, next.ref.slug, locale);

  return (
    <nav aria-label={fmt(t.pathNav.trailAria, { title: path.title })} className="mt-14 border-t border-border pt-8 print:hidden">
      <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Route className="size-3.5 text-primary/80" aria-hidden />
        {t.pathNav.trail} ·{" "}
        <Link href={localePath(locale, "/paths")} className="text-foreground/80 hover:text-primary">
          {path.title}
        </Link>
        <span>
          ({i + 1}/{path.steps.length})
        </span>
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {prev && prevT ? (
          <Link href={href(prev.ref)} className="group rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/60">
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <ArrowLeft className="size-3" aria-hidden /> {t.pathNav.previous}
            </span>
            <span className="mt-1 block text-sm font-medium">{prevT.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && nextT ? (
          <Link href={href(next.ref)} className="group rounded-lg border border-border bg-card p-3 text-right transition-colors hover:border-primary/60 sm:col-start-2">
            <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {t.pathNav.next} <ArrowRight className="size-3" aria-hidden />
            </span>
            <span className="mt-1 block text-sm font-medium">{nextT.title}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{next.why}</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
