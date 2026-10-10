import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const NEXT_TOPICS = [
  "IAM & privilege boundaries",
  "Network segmentation & zero-trust",
  "Supply chain na nuvem",
  "Runtime protection (CWPP)",
  "Posture & drift detection",
];

export default function CloudsecPlaceholder() {
  return (
    <div data-domain="cloudsec" className="mx-auto max-w-3xl px-4 pb-24 pt-12 md:pt-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> voltar ao hub
      </Link>

      <section className="mt-10">
        <Badge variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
          cloudsec · em construção
        </Badge>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          Cloud Security, <span className="text-primary">em breve.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Postura em cloud, IAM, segmentação e supply chain na nuvem — um mapa próprio, no mesmo
          estilo do AppSec. Conteúdo entra nas ondas 3/4.
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