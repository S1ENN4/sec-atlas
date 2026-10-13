import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DomainGraph } from "@/components/domain-graph";
import { PipelineRail } from "@/components/pipeline-rail";
import { TopicIcon } from "@/components/topic-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aiAgents } from "@/content/ai-agents";
import { cn } from "@/lib/utils";

export default function AgentsHome() {
  const kindMeta = aiAgents.kindMeta;
  return (
    <div data-domain="ai-agents" className="animate-page-enter">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center md:pt-24">
        <Badge
          variant="outline"
          className="animate-hero-enter font-mono text-xs font-normal text-muted-foreground"
          style={{ animationDelay: "0ms" }}
        >
          knowledge base · agents
        </Badge>
        <h1
          className="animate-hero-enter mt-6 text-4xl font-bold tracking-tight md:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          AI Agents, <span className="text-primary">mapeados</span>.
        </h1>
        <p
          className="animate-hero-enter mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg"
          style={{ animationDelay: "140ms" }}
        >
          Do chunking ao guardrail: como um agente moderno é montado — o pipeline de dados (RAG),
          o loop de ação (frameworks, tool calling, MCP), e a malha de avaliação que decide se ele
          pode ser enviado.
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
          Cada conceito fica na coluna da fase em que atua. Linhas animadas são o fluxo do pipeline
          de IA; tracejados são camadas que informam várias fases (RAG, LLM, MCP, guardrails).
        </p>
        <div className="mt-6">
          <DomainGraph domainId="ai-agents" />
        </div>
      </section>

      <section id="pipeline" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="reveal font-mono text-sm uppercase tracking-wider text-muted-foreground">
          pipeline de IA
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Do documento bruto à métrica do guardrail — o caminho do dado e da qualidade. Cada chip
          abre o tópico correspondente.
        </p>
        <div className="mt-6">
          <PipelineRail domain="ai-agents" />
        </div>
      </section>

      <section id="topicos" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24">
        <h2 className="reveal font-mono text-sm uppercase tracking-wider text-muted-foreground">
          tópicos
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiAgents.topics.map((t) => (
            <Link
              key={t.slug}
              href={`/agentes/topico/${t.slug}`}
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
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        · layer
                      </span>
                    )}
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