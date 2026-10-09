import type { Metadata } from "next";

import { GlossaryExplorer } from "@/components/glossary-explorer";
import { glossary } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "glossário",
  description:
    "Todas as terminologias de AppSec em um lugar: OWASP Top 10, CVE, CWE, CVSS, EPSS, SBOM, SLSA e o resto.",
};

export default function GlossarioPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">referência</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Glossário</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Toda a sopa de letrinhas em um lugar: siglas, identificadores, frameworks e conceitos — o
          que cada um significa e onde se conecta com o resto.
        </p>
      </header>

      <div className="mt-8">
        <GlossaryExplorer groups={glossary} />
      </div>
    </article>
  );
}
