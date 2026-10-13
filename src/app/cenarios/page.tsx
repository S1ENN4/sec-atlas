import type { Metadata } from "next";

import { ScenarioPlayer, type ScenarioData } from "@/components/scenario-player";
import { domains, domainMeta, getTopic } from "@/content/registry";
import { scenarios } from "@/content/scenarios";

export const metadata: Metadata = {
  title: "cenários de ataque",
  description: "Siga um incidente passo a passo e descubra qual controle barra cada movimento do atacante.",
};

const NAMES: Record<string, string> = { appsec: "AppSec", cloudsec: "CloudSec", "ai-agents": "Agents" };

export default function CenariosPage() {
  const data: ScenarioData[] = scenarios.map((sc) => ({
    id: sc.id,
    domain: sc.domain,
    domainName: NAMES[sc.domain] ?? sc.domain,
    title: sc.title,
    summary: sc.summary,
    stages: domains[sc.domain].pipeline.map((s) => ({ id: s.id, index: s.index, name: s.name })),
    steps: sc.steps.map((st) => ({
      stageId: st.stageId,
      happens: st.happens,
      stops: st.stops,
      controlTitle: getTopic(st.control)?.title ?? st.control.slug,
      controlHref: `${domainMeta[st.control.domain].route}/topico/${st.control.slug}`,
    })),
  }));

  return (
    <div className="animate-page-enter mx-auto max-w-4xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">siga o ataque</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Cenários de ataque</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Em vez de ver cada controle isolado, acompanhe um incidente do início ao fim. A cada passo, tente adivinhar
          qual controle entra em ação antes de revelar a resposta.
        </p>
      </header>

      <div className="mt-8">
        <ScenarioPlayer scenarios={data} />
      </div>
    </div>
  );
}
