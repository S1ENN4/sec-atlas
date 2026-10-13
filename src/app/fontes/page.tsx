import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { formatDate, profile } from "@/content/profile";
import { sources } from "@/content/sources";
import type { DomainId } from "@/content/types";

export const metadata: Metadata = {
  title: "fontes",
  description: "Referências primárias por domínio para aprofundar cada assunto: OWASP, NIST, CIS, documentação oficial.",
};

const TITLES: Record<DomainId, string> = {
  appsec: "AppSec",
  cloudsec: "CloudSec",
  "ai-agents": "Agentes de IA",
  secops: "SecOps e defesa L7",
};

export default function FontesPage() {
  return (
    <div className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">referências</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Fontes</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          O mapa resume e conecta ideias; as fontes primárias abaixo são onde aprofundar e onde conferir qualquer
          afirmação.
        </p>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          atualizado em {formatDate(profile.contentUpdated)} · {profile.contentNote}
        </p>
      </header>

      {(Object.keys(sources) as DomainId[]).map((d) => (
        <section key={d} id={d} data-domain={d} className="mt-10 scroll-mt-20">
          <h2 className="font-mono text-sm uppercase tracking-wider text-primary">{TITLES[d]}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {sources[d].map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight group-hover:text-primary">{s.label}</span>
                    <span className="block text-xs leading-snug text-muted-foreground">{s.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
