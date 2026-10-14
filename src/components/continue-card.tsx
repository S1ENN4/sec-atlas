"use client";

// "Continue where you left off" card on the hub.
//
// Renders nothing on the server (the hub is a server component) and, on
// mount, reads the last topic pointer out of localStorage. If the pointer
// is missing, or the topic is no longer in the registry, the card stays
// hidden. A `null` return value means "the card does not exist", and the
// parent simply skips it.
//
// Why a client island: localStorage is browser-only. We resolve the
// localized title server-side, ship a flat id -> {title, route} lookup to
// the client, and let the client pick the one that matches its
// `kb-last-topic` pointer. The lookup stays tiny (one entry per topic in
// the locale, < 10 KB serialized) and the island is the only place that
// touches localStorage.

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, History } from "lucide-react";

import { LAST_TOPIC_KEY, readLastTopic } from "@/lib/progress";
import { cn } from "@/lib/utils";

export interface ContinueCardStrings {
  where: string;
  read: string;
}

export interface ContinueTopicRef {
  id: string; // "<domain>/<slug>"
  title: string;
  route: string;
}

/**
 * Renders the card only when a last topic exists, the stored pointer
 * points to a topic that still ships in the registry, and the topic's
 * stored locale matches the current one (so a reader who switched
 * languages isn't taken back to a topic rendered in the wrong language).
 */
export function ContinueCard({
  topics,
  locale,
  t,
  className,
}: {
  topics: ContinueTopicRef[];
  locale: string;
  t: ContinueCardStrings;
  className?: string;
}) {
  const [ref, setRef] = useState<ContinueTopicRef | null>(null);

  useEffect(() => {
    const stored = readLastTopic();
    if (!stored) return;
    // The last-topic pointer remembers the locale it was set in. If the
    // reader switched languages since opening that topic, the localized
    // lookup wouldn't match. We accept only same-locale pointers; a
    // mismatch silently no-ops.
    if (stored.locale !== locale) return;
    const hit = topics.find((x) => x.id === `${stored.domain}/${stored.slug}`);
    if (!hit) return;
    setRef(hit);
  }, [topics, locale]);

  if (!ref) return null;

  return (
    <section
      aria-label={t.where}
      data-component="continue-card"
      className={cn(
        "rounded-xl border border-primary/30 bg-primary/5 p-5",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
        <History className="size-3.5" aria-hidden /> {t.where}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-semibold leading-tight">{ref.title}</p>
        <Link
          href={ref.route}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20"
        >
          {t.read} <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

// Re-export the localStorage key so the parent can clean it up if it ever
// needs to (e.g. a future "clear last-topic" button).
export { LAST_TOPIC_KEY };
