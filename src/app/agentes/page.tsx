import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const NEXT_TOPICS = [
  "Prompt injection & jailbreaks",
  "Tool sandboxing & capability gating",
  "Tracing & audit de ações",
  "Data exfiltration via contexto",
  "Supply chain de modelos e pesos",
];

export default function AgentsPlaceholder() {
  return (
    <div data-domain="ai-agents" className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-12 md:pt-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> voltar ao hub
      </Link>

      <section className="mt-10">
        <Badge variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
          ai-agents · em construção
        </Badge>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          Agents, <span className="text-primary">em breve.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Segurança para agentes e workloads de IA — prompt injection, tool sandboxing, tracing
          de ações. Conteúdo entra nas ondas 3/4.
        </p>
        <p className="mt-6 font-mono text-xs text-primary/80">
          $ a interface, o glossário e a pipeline estão reservados
        </p>
      </section>

      <section className="mt-14 rounded-xl border border-border bg-card/40 p-8">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          próximos tópicos
        </h2>
        <ul className="mt-4 space-y-2 font-mono text-sm text-foreground/85">
          {NEXT_TOPICS.map((t) => (
            <li key={t}>· {t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}