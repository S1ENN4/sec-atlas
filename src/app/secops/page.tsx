import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DomainGraph } from "@/components/domain-graph";
import { PipelineRail } from "@/components/pipeline-rail";
import { TopicIcon } from "@/components/topic-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { secops } from "@/content/secops";
import { cn } from "@/lib/utils";

export default function SecopsHome() {
  const kindMeta = secops.kindMeta;
  return (
    <div data-domain="secops" className="animate-page-enter">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center md:pt-24">
        <Badge
          variant="outline"
          className="animate-hero-enter font-mono text-xs font-normal text-muted-foreground"
          style={{ animationDelay: "0ms" }}
        >
          knowledge base · secops
        </Badge>
        <h1
          className="animate-hero-enter mt-6 text-4xl font-bold tracking-tight md:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          Defesa L7 e SecOps, <span className="text-primary">mapeadas</span>.
        </h1>
        <p
          className="animate-hero-enter mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg"
          style={{ animationDelay: "140ms" }}
        >
          Um mapa interativo da operação de segurança na borda: telemetria, detecção, WAF, rate
          limiting, bots e a métrica que prova que funciona — do log ao bloqueio.
        </p>
        <p
          className="animate-hero-enter mt-6 font-mono text-xs text-primary/80"
          style={{ animationDelay: "220ms" }}
        >
          $ clique num card para ver os detalhes · ctrl+k para buscar
        </p>
      </section>

      <section id="mapa" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="reveal font-mono text-sm uppercase tracking-wider text-muted-foreground">
          mapa de conceitos
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Cada controle fica na coluna da fase em que atua. Linhas animadas são o fluxo do
          ciclo de defesa; tracejados são relações entre conceitos.
        </p>
        <div className="mt-6">
          <DomainGraph domainId="secops" />
        </div>
      </section>

      <section id="pipeline" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="reveal font-mono text-sm uppercase tracking-wider text-muted-foreground">
          ciclo de defesa
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Do dado bruto à métrica — o controle mora em cada fase. Cada chip abre o tópico
          correspondente.
        </p>
        <div className="mt-6">
          <PipelineRail domain="secops" />
        </div>
      </section>

      <section id="topicos" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24">
        <h2 className="reveal font-mono text-sm uppercase tracking-wider text-muted-foreground">
          tópicos
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secops.topics.map((t) => (
            <Link
              key={t.slug}
              href={`/secops/topico/${t.slug}`}
              transitionTypes={["nav-forward"]}
              className="group"
            >
              <Card className="reveal h-full transition-colors group-hover:border-primary/60">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <TopicIcon slug={t.slug} className="size-5 text-primary" />
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <CardTitle className="pt-2">{t.title}</CardTitle>
                  <CardDescription className="leading-snug">{t.tagline}</CardDescription>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-wider",
                        kindMeta[t.kind].text,
                      )}
                    >
                      {kindMeta[t.kind].label}
                    </span>
                    {t.stage ? (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        · stage: {t.stage}
                      </span>
                    ) : null}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
