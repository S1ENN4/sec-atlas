import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";

import { bridgesOf } from "@/content/bridges";
import { domainMeta, getTopic, type DomainId } from "@/content/registry";

// Cross-domain connections for a topic ("the same problem, in another
// domain"). Server component: nothing here ships to the client.
export function TopicBridges({ domain, slug }: { domain: DomainId; slug: string }) {
  const items = bridgesOf({ domain, slug });
  if (items.length === 0) return null;
  return (
    <section className="mt-14 border-t border-border pt-8 print:hidden">
      <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
        em outros domínios
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map(({ other, label }) => {
          const t = getTopic(other);
          if (!t) return null;
          return (
            <li key={`${other.domain}/${other.slug}`} className="flex flex-wrap items-center gap-2 text-sm">
              <ArrowRightLeft className="size-3.5 text-primary/70" aria-hidden />
              <Link
                href={`${domainMeta[other.domain].route}/topico/${other.slug}`}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {t.title}
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
