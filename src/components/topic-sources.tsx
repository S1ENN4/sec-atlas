import Link from "next/link";

import { formatDate, profile } from "@/content/profile";
import type { DomainId } from "@/content/types";
import { localePath, type Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import type { Ui } from "@/i18n/ui";

// End-of-topic note. Kept to one short line on purpose: the full list of
// primary sources lives on /sources, so it is not repeated in every topic page.
export function TopicSources({ domain, locale, t }: { domain: DomainId; locale: Locale; t: Ui }) {
  const n = t.sourcesNote;
  return (
    <p className="mt-14 border-t border-border pt-6 font-mono text-[11px] leading-relaxed text-muted-foreground">
      {fmt(n.updated, { date: formatDate(profile.contentUpdated) })} · {n.aiNote} ·{" "}
      <Link href={`${localePath(locale, "/sources")}#${domain}`} className="text-primary/90 hover:text-primary">
        {n.sources}
      </Link>{" "}
      ·{" "}
      <Link href={`${localePath(locale, "/about")}#content`} className="text-primary/90 hover:text-primary">
        {n.report}
      </Link>
    </p>
  );
}
