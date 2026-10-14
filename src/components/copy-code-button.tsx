"use client";

// Floating button anchored to the top-right of every <pre> block on a topic
// page. Uses the same chip look-and-feel as the header buttons (TopicToolbar):
// mono, border-border, bg-muted/40, hover border + text, focus-visible ring.
//
// Behaviour:
//   1. On click, try the async Clipboard API (`navigator.clipboard.writeText`).
//   2. If it throws (insecure context, blocked permission, missing user
//      activation), fall back to a hidden <textarea> + the deprecated
//      `document.execCommand("copy")`.
//   3. If both fail, surface a short error via the polite live region below.
// On success the live region announces the localized "Copied!" string in the
// active language. The visible button label and the live-region message both
// reset to idle after 2s so a subsequent copy is announced again.

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import type { Ui } from "@/i18n/ui";
import { cn } from "@/lib/utils";

// Same chip combo as TopicToolbar — the rest of the page's chip buttons.
const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors duration-[120ms] hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

async function copyToClipboard(code: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch {
      // fall through to the legacy fallback
    }
  }
  if (typeof document === "undefined") return false;
  const ta = document.createElement("textarea");
  ta.value = code;
  ta.setAttribute("readonly", "");
  // Park it off-screen but still selectable; opacity 0 + fixed positioning
  // keeps it out of any visible layout flow.
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

type Status = "idle" | "copied" | "error";

export function CopyCodeButton({
  code,
  filename,
  t,
  className,
}: {
  code: string;
  filename?: string;
  t: { topicPage: { copy: string; copied: string } };
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  // Track the active timeout so a fast re-click cancels the previous reset
  // instead of letting stale state changes leak in after unmount.
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  const handleClick = async () => {
    const ok = await copyToClipboard(code);
    setStatus(ok ? "copied" : "error");
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus("idle"), 2000);
  };

  const visibleLabel = status === "copied" ? t.topicPage.copied : t.topicPage.copy;
  // Live region: localized "Copied!" on success, a generic English fallback
  // when both copy paths fail (kept terse so it is not a third translatable
  // string; rare path).
  const liveMessage =
    status === "copied" ? t.topicPage.copied : status === "error" ? "Copy failed" : "";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={filename ? `${t.topicPage.copy}: ${filename}` : t.topicPage.copy}
        className={cn(
          btn,
          status === "copied" && "border-primary/60 bg-primary/10 text-primary",
          className,
        )}
      >
        {status === "copied" ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
        <span aria-hidden>{visibleLabel}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {liveMessage}
      </span>
    </>
  );
}