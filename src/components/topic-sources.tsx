import Link from "next/link";

import { formatDate, profile } from "@/content/profile";
import type { DomainId } from "@/content/types";

// End-of-topic note. Kept to one short line on purpose: the full list of
// primary sources lives on /fontes, so it is not repeated in every topic page.
export function TopicSources({ domain }: { domain: DomainId }) {
  return (
    <p className="mt-14 border-t border-border pt-6 font-mono text-[11px] leading-relaxed text-muted-foreground">
      atualizado em {formatDate(profile.contentUpdated)} · conteúdo com apoio de IA, em revisão ·{" "}
      <Link href={`/fontes#${domain}`} className="text-primary/90 hover:text-primary">
        fontes para aprofundar
      </Link>{" "}
      ·{" "}
      <Link href="/sobre#conteudo" className="text-primary/90 hover:text-primary">
        reportar erro
      </Link>
    </p>
  );
}
