import { Languages } from "lucide-react";

import { fmt } from "@/i18n/format";
import type { SourceLang } from "@/i18n/content";
import type { Ui } from "@/i18n/ui";

// Shown when part of a page is still in the source language because it has not
// been translated yet (or its translation went stale). Honest, not alarming.
export function ContentNotice({ fallback, sourceLang, t }: { fallback: boolean; sourceLang: SourceLang; t: Ui }) {
  if (!fallback) return null;
  const language = sourceLang === "pt" ? t.notice.languagePt : t.notice.languageEn;
  return (
    <p
      role="note"
      className="mx-auto mb-2 flex max-w-3xl items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs leading-snug text-muted-foreground"
    >
      <Languages className="mt-0.5 size-3.5 shrink-0 text-primary/80" aria-hidden />
      <span>{fmt(t.notice.partial, { language })}</span>
    </p>
  );
}
