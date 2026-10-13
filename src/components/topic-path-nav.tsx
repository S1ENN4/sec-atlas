import Link from "next/link";
import { ArrowLeft, ArrowRight, Route } from "lucide-react";

import { paths } from "@/content/paths";
import { domainMeta, getTopic, type DomainId } from "@/content/registry";

const href = (r: { domain: DomainId; slug: string }) => `${domainMeta[r.domain].route}/topico/${r.slug}`;

// "Continue a trilha": prev / next step of the first study path that
// contains this topic. Server component.
export function TopicPathNav({ domain, slug }: { domain: DomainId; slug: string }) {
  const path = paths.find((p) => p.steps.some((s) => s.ref.domain === domain && s.ref.slug === slug));
  if (!path) return null;
  const i = path.steps.findIndex((s) => s.ref.domain === domain && s.ref.slug === slug);
  const prev = path.steps[i - 1];
  const next = path.steps[i + 1];
  const prevT = prev && getTopic(prev.ref);
  const nextT = next && getTopic(next.ref);

  return (
    <nav aria-label={`Trilha: ${path.title}`} className="mt-14 border-t border-border pt-8 print:hidden">
      <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Route className="size-3.5 text-primary/80" aria-hidden />
        trilha · <Link href="/trilhas" className="text-foreground/80 hover:text-primary">{path.title}</Link>
        <span>
          ({i + 1}/{path.steps.length})
        </span>
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {prev && prevT ? (
          <Link
            href={href(prev.ref)}
            className="group rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/60"
          >
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <ArrowLeft className="size-3" aria-hidden /> anterior
            </span>
            <span className="mt-1 block text-sm font-medium">{prevT.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && nextT ? (
          <Link
            href={href(next.ref)}
            className="group rounded-lg border border-border bg-card p-3 text-right transition-colors hover:border-primary/60 sm:col-start-2"
          >
            <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              próximo <ArrowRight className="size-3" aria-hidden />
            </span>
            <span className="mt-1 block text-sm font-medium">{nextT.title}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{next.why}</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
