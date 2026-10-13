import type { Metadata } from "next";

import { PathCard, type PathCardData } from "@/components/path-card";
import { ProgressSummary, type DomainTotals } from "@/components/progress-summary";
import { domains, domainMeta, getTopic, type Domain } from "@/content/registry";
import { paths } from "@/content/paths";

export const metadata: Metadata = {
  title: "trilhas de estudo",
  description: "Ordens sugeridas para estudar AppSec, CloudSec e agentes de IA, com progresso salvo no seu navegador.",
};

const NAMES: Record<string, string> = { appsec: "AppSec", cloudsec: "CloudSec", "ai-agents": "Agents", secops: "SecOps", seceng: "Engenharia" };

export default function TrilhasPage() {
  const totals: DomainTotals[] = (Object.values(domains) as Domain[]).map((d) => ({
    id: d.id,
    name: NAMES[d.id] ?? d.id,
    slugs: d.topics.map((t) => t.slug),
  }));

  const cards: PathCardData[] = paths.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    level: p.level,
    steps: p.steps.flatMap((s) => {
      const t = getTopic(s.ref);
      if (!t) return [];
      return [
        {
          domain: s.ref.domain,
          slug: s.ref.slug,
          title: t.title,
          why: s.why,
          href: `${domainMeta[s.ref.domain].route}/topico/${s.ref.slug}`,
        },
      ];
    }),
  }));

  return (
    <div className="animate-page-enter mx-auto max-w-4xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">estudo guiado</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Trilhas de estudo</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Não sabe por onde começar? Cada trilha é uma ordem pensada: um tópico prepara o próximo. Marque o que já
          estudou (ou acerte o quiz do tópico) e o progresso aparece aqui e nos mapas.
        </p>
      </header>

      <div className="mt-8">
        <ProgressSummary domains={totals} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {cards.map((c) => (
          <PathCard key={c.id} path={c} />
        ))}
      </div>
    </div>
  );
}
