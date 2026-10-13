import type { Metadata } from "next";

import { changelog } from "@/content/changelog";
import { formatDate } from "@/content/profile";

export const metadata: Metadata = {
  title: "novidades",
  description: "O que mudou neste mapa: conteúdo novo, recursos e correções.",
};

export default function NovidadesPage() {
  return (
    <div className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">registro público</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Novidades</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          O que mudou por aqui: conteúdo novo, recursos e correções. Segurança muda rápido, e um site vivo precisa
          mostrar que está vivo.
        </p>
      </header>

      <ol className="mt-10 space-y-8 border-l border-border pl-6">
        {changelog.map((e) => (
          <li key={`${e.date}-${e.title}`} className="relative">
            <span aria-hidden className="absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full border border-primary bg-background" />
            <p className="font-mono text-xs text-muted-foreground">{formatDate(e.date)}</p>
            <h2 className="mt-1 text-lg font-semibold">{e.title}</h2>
            <ul className="mt-2 space-y-1.5">
              {e.items.map((it) => (
                <li key={it} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
