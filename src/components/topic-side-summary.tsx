"use client";

// Vertical list of section headings for a topic page, with the currently
// scrolled-into-view section marked active.
//
// Render shape:
//   <nav aria-label="On this page">  <-- localized via t.topicPage.summary
//     <p>On this page</p>            <-- visible label, mono caps
//     <ol>
//       <li><a href="#section-0">…</a></li>
//       <li><a href="#section-1">…</a></li>
//       …
//
// The list itself is server-rendered. The active state is a CSS-only
// affordance driven by a single `data-active="true"` attribute on the
// matching <a>. We do not store it in React state and we do not re-render on
// scroll: a small client-only IntersectionObserver finds the h2 whose top
// sits inside the active zone and flips the attribute via setAttribute on
// the matching link ref.
//
// `rootMargin: "-30% 0px -60% 0px"` shrinks the IO root to the top third of
// the viewport (between 30% and 40% from the top), so only the section the
// reader is currently reading is considered "active". When the page is at
// the very top (above the first section), no h2 is intersecting and the
// strip simply has no highlight — a deliberate, honest default.
//
// Smooth-scroll on click is provided by the colocated CSS, scoped to topic
// pages via `:has(.topic-side-summary)`. The global globals.css reduced-
// motion policy overrides it for users who opted out.
//
// Accessibility:
//   - The <nav> carries the localized summary label as aria-label.
//   - Each item is an <a href="#section-id"> so keyboard activation, anchor
//     navigation and no-JS readers stay functional out of the box.
//   - Focus is signalled via the standard :focus-visible ring.
//   - The active indicator is purely a visual hint; it does not move focus
//     and screen readers get no extra noise.

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import "./topic-side-summary.css";

export interface TopicSideSummaryItem {
  id: string;
  label: string;
  /** Heading level this entry mirrors. Defaults to 2 (topic body sections). */
  level?: 2 | 3;
}

/** Localized label for the strip. Kept narrow so we never ship the full Ui
 *  dictionary across the RSC boundary into a client component. */
export interface TopicSideSummaryStrings {
  summary: string;
}

export function TopicSideSummary({
  items,
  t,
}: {
  items: TopicSideSummaryItem[];
  t: TopicSideSummaryStrings;
}) {
  // Map section id → its <a> in the strip. Populated by the ref callback.
  // Kept in a ref (not state) so the IO callback never re-renders.
  const linkMap = useRef(new Map<string, HTMLAnchorElement>());
  // The id we last marked active. Used to clear the previous highlight when
  // the active section changes; null when no section is currently in view.
  const activeId = useRef<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (items.length === 0) return;

    // The task says the article is the scroll container. The whole document
    // scrolls as one viewport on this site today, so we let IO observe
    // against the viewport (root: null) and the article's ids happen to be
    // siblings in the same scrollable surface. The rootMargin below defines
    // the "active" zone inside that viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        // Collect every entry whose intersection state changed; pick the
        // one whose h2 top sits highest inside the active zone. On entry
        // leaves (isIntersecting === false) we keep the current highlight;
        // the next member-level is the cleanest way to handle that, but
        // doing it inside the same callback keeps the IO single-purpose.
        let bestId: string | null = null;
        let bestTop = Number.POSITIVE_INFINITY;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const top = entry.boundingClientRect.top;
          if (top < bestTop) {
            bestTop = top;
            bestId = entry.target.id;
          }
        }
        if (!bestId) return;
        if (bestId === activeId.current) return;
        // Clear the previous highlight and apply the new one. Direct DOM
        // writes, no React state — the strip does not re-render.
        if (activeId.current) {
          linkMap.current.get(activeId.current)?.removeAttribute("data-active");
        }
        linkMap.current.get(bestId)?.setAttribute("data-active", "true");
        activeId.current = bestId;
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    const observed: HTMLElement[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      observer.observe(el);
      observed.push(el);
    }

    return () => {
      for (const el of observed) observer.unobserve(el);
      observer.disconnect();
      // Drop any leftover active state so a soft re-mount starts clean.
      if (activeId.current) {
        linkMap.current.get(activeId.current)?.removeAttribute("data-active");
        activeId.current = null;
      }
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={t.summary}
      className="topic-side-summary"
      data-component="topic-side-summary"
    >
      <p className="topic-side-summary-label">{t.summary}</p>
      <ol className="topic-side-summary-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "topic-side-summary-list-item",
              item.level === 3 && "topic-side-summary-list-item--level-3",
            )}
          >
            <a
              ref={(el) => {
                if (el) linkMap.current.set(item.id, el);
                else linkMap.current.delete(item.id);
              }}
              href={`#${item.id}`}
              className="topic-side-summary-link"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}