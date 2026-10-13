import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";

import { bridgesOf } from "@/content/bridges";
import { domainMeta, type DomainId } from "@/content/registry";
import { localePath, type Locale } from "@/i18n/config";
import { localizedTopic } from "@/i18n/content";
import { localizedBridges } from "@/i18n/globals";
import type { Ui } from "@/i18n/ui";

// Cross-domain connections for a topic ("the same problem, in another
// domain"). Server component: nothing here ships to the client.
export function TopicBridges({ domain, slug, locale, t }: { domain: DomainId; slug: string; locale: Locale; t: Ui }) {
  const items = bridgesOf({ domain, slug }, localizedBridges(locale).value);
  if (items.length === 0) return null;
  return (
    <section className="mt-14 border-t border-border pt-8 print:hidden">
      <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{t.bridges.title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map(({ other, label }) => {
          const topic = localizedTopic(other.domain as DomainId, other.slug, locale);
          if (!topic) return null;
          return (
            <li key={`${other.domain}/${other.slug}`} className="flex flex-wrap items-center gap-2 text-sm">
              <ArrowRightLeft className="size-3.5 text-primary/70" aria-hidden />
              <Link
                href={localePath(locale, `${domainMeta[other.domain as DomainId].route}/topic/${other.slug}`)}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {topic.title}
              </Link>
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {other.domain}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
