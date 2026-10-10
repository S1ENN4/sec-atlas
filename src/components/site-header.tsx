import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { domainMeta } from "@/content/registry";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-mono text-sm font-semibold">
          <ShieldCheck className="size-5 text-primary" />
          appsec<span className="text-primary">/</span>kb
        </Link>
        <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto text-[13px] text-muted-foreground sm:gap-1 sm:text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Object.values(domainMeta).map((d) => (
            <Link
              key={d.id}
              href={d.route}
              className="shrink-0 rounded-md px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors hover:text-foreground sm:px-3 sm:text-[13px]"
            >
              {d.id}
            </Link>
          ))}
          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border/70" />
          <Link
            href="/appsec#mapa"
            className="shrink-0 rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:px-3"
          >
            mapa
          </Link>
          <Link
            href="/appsec#pipeline"
            className="shrink-0 rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:px-3"
          >
            pipeline
          </Link>
          <Link
            href="/appsec#topicos"
            className="shrink-0 rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:px-3"
          >
            tópicos
          </Link>
          <Link
            href="/glossario"
            className="shrink-0 rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:px-3"
          >
            glossário
          </Link>
          <Link
            href="/seguranca"
            className="shrink-0 rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:px-3"
          >
            segurança
          </Link>
        </nav>
      </div>
    </header>
  );
}