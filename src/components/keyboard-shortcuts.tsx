"use client";

// Topic-page keyboard shortcuts (Phase 3 / P3.6).
//
//   j / k   scroll between <h2 id="section-N"> sections of the current article
//   g h     "go to hub": navigate to the locale's hub (within 1500 ms)
//   c       copy the first visible <pre><code> to the clipboard
//
// Behaviour rules:
//   - The listener is attached to `document` and is torn down on unmount.
//   - Skipped when focus is in an input / textarea / contenteditable, so
//     search, the quiz and the toolbar text fields are not hijacked.
//   - Skip when a modifier (Ctrl/Alt/Meta) is held: those are reserved for
//     the browser, the editor and the OS.
//   - A polite live region announces the available shortcuts exactly once
//     per browser (sessionStorage["kb-kbd-hint-seen"]). The hint never
//     re-appears on the same tab.
//
// Locale: the component is mounted on a topic page and the locale is passed
// in from the server component (the locale layout is out of pathspec for
// this unit, so we don't read it from <html data-locale>). The `g h`
// shortcut pushes the user to /${locale}.

import { useEffect, useState } from "react";

const G_HUB_WINDOW_MS = 1500;
const HINT_FLAG = "kb-kbd-hint-seen";

interface KeyboardShortcutsProps {
  /** BCP-47-ish locale segment used to build the hub URL ("/pt", "/es", "/en"). */
  locale: string;
  /** Localized hint announced once on first mount. */
  hint: string;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target.isContentEditable) return true;
  return false;
}

// All h2 elements that mark a topic body section. Matches the ids the page
// renders via the topic-side-summary / section headings (id="section-N").
function getArticleSections(): HTMLElement[] {
  const article = document.querySelector("article");
  if (!article) return [];
  return Array.from(article.querySelectorAll<HTMLElement>("h2[id^='section-']"));
}

// All <pre><code> blocks on the page. A3 owns the copy-code wrapper that
// rides on every <pre>, so this set is the same one the buttons cover.
function getCodeBlocks(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("pre > code"));
}

// Pick the code block the reader most likely wants to copy: the one whose
// top is nearest the top-third of the viewport. The top-third line is
// the reading focus; a block sitting right on it is "the section's code".
// When the closest match sits above that line (the reader scrolled past it)
// we still return it as the "last seen" — the alternative (refusing to
// copy) would be a worse experience.
function pickCodeBlock(blocks: HTMLElement[]): HTMLElement | null {
  if (blocks.length === 0) return null;
  if (blocks.length === 1) return blocks[0];
  const topThird = window.innerHeight / 3;
  let best: HTMLElement | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;
  for (const el of blocks) {
    const top = el.getBoundingClientRect().top;
    const delta = Math.abs(top - topThird);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = el;
    }
  }
  return best;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the legacy path
    }
  }
  if (typeof document === "undefined") return false;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  ta.style.left = "0";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  const previousSelection = document.getSelection();
  const previousRange =
    previousSelection && previousSelection.rangeCount > 0 ? previousSelection.getRangeAt(0) : null;
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  if (previousRange && previousSelection) {
    previousSelection.removeAllRanges();
    previousSelection.addRange(previousRange);
  }
  return ok;
}

function nextSectionId(sections: HTMLElement[], currentTop: number, direction: 1 | -1): HTMLElement | null {
  if (sections.length === 0) return null;
  if (direction === 1) {
    // first section whose top sits at or below the next viewport line
    const target = currentTop + 40;
    for (const s of sections) {
      const top = s.getBoundingClientRect().top;
      if (top > target) return s;
    }
    return null;
  }
  // last section whose top sits above the current scroll line
  let best: HTMLElement | null = null;
  for (const s of sections) {
    const top = s.getBoundingClientRect().top;
    if (top < currentTop - 8) best = s;
  }
  return best;
}

export function KeyboardShortcuts({ locale, hint }: KeyboardShortcutsProps) {
  // Whether to render the polite-live hint on this mount. Decided once,
  // before the effect registers the keydown listener, so the user hears
  // the hint and the listener in the same paint.
  const [announced, setAnnounced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      if (window.sessionStorage.getItem(HINT_FLAG) !== "1") {
        window.sessionStorage.setItem(HINT_FLAG, "1");
        return true;
      }
    } catch {
      // private mode / storage blocked: still tell the reader once
      return true;
    }
    return false;
  });

  useEffect(() => {
    let pendingG: number | null = null;
    const clearPendingG = () => {
      if (pendingG !== null) {
        window.clearTimeout(pendingG);
        pendingG = null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't hijack typing, modifier combos or system gestures.
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;

      const key = e.key;
      if (key === "j" || key === "k") {
        const sections = getArticleSections();
        const target = nextSectionId(sections, window.scrollY, key === "j" ? 1 : -1);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      if (key === "g") {
        // `g` opens a 1.5s window. The next key decides.
        clearPendingG();
        pendingG = window.setTimeout(() => {
          pendingG = null;
        }, G_HUB_WINDOW_MS);
        return;
      }

      if (pendingG !== null && key === "h") {
        e.preventDefault();
        clearPendingG();
        const hub = `/${locale}`;
        // Use a normal push to keep the back button working.
        window.location.assign(hub);
        return;
      }

      if (key === "c") {
        const blocks = getCodeBlocks();
        const block = pickCodeBlock(blocks);
        if (!block) return;
        e.preventDefault();
        const code = block.textContent ?? "";
        // Fire and forget; the user feedback is the topic's own copy button
        // (A3 owns that wrapper) which this shortcut mirrors for keyboard
        // users. No toast: keyboard feedback is the absence of error.
        void copyToClipboard(code);
        return;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearPendingG();
    };
  }, [locale]);

  // Render: an invisible live region that announces the hint once per tab.
  // Kept screen-reader-only: the user already sees the page chrome.
  return (
    <span
      role="status"
      aria-live="polite"
      className="sr-only"
      data-keyboard-hint="shown"
      data-announced={announced ? "1" : "0"}
    >
      {announced ? hint : ""}
    </span>
  );
}
