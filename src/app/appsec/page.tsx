import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StudyGraph } from "@/components/study-graph";
import { PipelineRail } from "@/components/pipeline-rail";
import { TopicIcon } from "@/components/topic-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { kindMeta, topics } from "@/lib/topics";
import { cn } from "@/lib/utils";

export default function AppsecHome() {
  return (
    <div data-domain="appsec" className="animate-page-enter">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 text-center md:pt-24">
        <Badge
          variant="outline"
          className="animate-hero-enter font-mono text-xs font-normal text-muted-foreground"
          style={{ animationDelay: "0ms" }}
        >
          knowledge base · devsecops
        </Badge>
        <h1
          className="animate-hero-enter mt-6 text-4xl font-bold tracking-tight md:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          Segurança de software, <span className="text-primary">mapeada</span>.
        </h1>
        <p
          className="animate-hero-enter mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg"
          style={{ animationDelay: "140ms" }}
        >
          Um mapa interativo dos conceitos que protegem uma pipeline: SAST, DAST, SCA, secrets
          scanning, SBOM e CI/CD — o que cada um faz, onde entra e como se conectam.
        </p>
        <p
          className="animate-hero-enter mt-6 font-mono text-xs text-primary/80"
          style={{ animationDelay: "220ms" }}
        >
          $ clique em um nó para abrir o tópico
        </p>
      </section>

      <section id="mapa" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          mapa de conceitos
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Organizado pela esteira: cada verificação fica na coluna do seu estágio. Linhas animadas
          são o fluxo da CI/CD; tracejados são relações entre conceitos.
        </p>
        <div className="mt-6">
          <StudyGraph />
        </div>
      </section>

      <section id="pipeline" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          pipeline e2e
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          O caminho de um commit até produção — e a verificação que mora em cada etapa. Cada chip
          abre o tópico correspondente.
        </p>
        <div className="mt-6">
          <PipelineRail />
        </div>
      </section>

      <section id="topicos" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">tópicos</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/appsec/topico/${t.slug}`}
              transitionTypes={["nav-forward"]}
              className="group"
            >
              <Card className="h-full transition-colors group-hover:border-primary/60">
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
                        kindMeta[t.kind].text
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