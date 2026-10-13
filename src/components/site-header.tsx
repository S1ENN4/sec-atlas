import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { SearchButton } from "@/components/search-button";
import { domainMeta } from "@/content/registry";

// Global nav. Lists every domain route (driven by `domainMeta`, so the row
// stays in lock-step with the registry as new domains are added) plus the
// two reference routes — `/glossario` and `/seguranca` — which are
// domain-agnostic by design. AppSec-specific in-page anchors
// (#mapa/#pipeline/#topicos) live on the AppSec home page itself; with
// three live domains, surfacing them in the global nav would duplicate
// the same anchors available on every domain page, so they are kept out
// of the switcher for consistency.

const REFERENCE_LINKS = [
  { href: "/trilhas", label: "trilhas" },
  { href: "/cenarios", label: "cenários" },
  { href: "/glossario", label: "glossário" },
  { href: "/seguranca", label: "segurança" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b print:hidden border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-mono text-sm font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
          <ShieldCheck className="size-5 text-primary" />
          appsec<span className="text-primary">/</span>kb
        </Link>
        <nav
          aria-label="Principal"
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto text-[13px] text-muted-foreground sm:gap-1 sm:text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {Object.values(domainMeta).map((d) => (
            <Link
              key={d.id}
              href={d.route}
              className="shrink-0 rounded-md px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors duration-[120ms] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3 sm:text-[13px]"
            >
              {d.id}
            </Link>
          ))}
          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border/70" />
          {REFERENCE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-md px-2 py-1.5 transition-colors duration-[120ms] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <SearchButton />
      </div>
    </header>
  );
}