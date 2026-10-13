"use client";

import { useState } from "react";
import { Check, Link2, Printer } from "lucide-react";

import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { DomainId } from "@/content/types";

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors duration-[120ms] hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Per-topic actions: mark as studied, copy a link, print / save as PDF.
// Hidden when printing so the printed page is only the content.
export function TopicToolbar({ domain, slug }: { domain: DomainId; slug: string }) {
  const { isSeen, toggleSeen } = useProgress();
  const [copied, setCopied] = useState(false);
  const seen = isSeen(domain, slug);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={() => toggleSeen(domain, slug)}
        aria-pressed={seen}
        className={cn(btn, seen && "border-primary/60 bg-primary/10 text-primary")}
      >
        <Check className="size-3.5" aria-hidden />
        {seen ? "estudado" : "marcar como estudado"}
      </button>
      <button type="button" onClick={copy} className={btn}>
        <Link2 className="size-3.5" aria-hidden />
        <span aria-live="polite">{copied ? "link copiado" : "copiar link"}</span>
      </button>
      <button type="button" onClick={() => window.print()} className={btn}>
        <Printer className="size-3.5" aria-hidden />
        imprimir / PDF
      </button>
    </div>
  );
}
