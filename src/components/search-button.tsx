"use client";

import { Search } from "lucide-react";

// Header trigger for the search palette (which also opens with Ctrl/Cmd+K
// or "/"). Communicates through a window event so the header can stay a
// server component.
export function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("kb:search"))}
      aria-label="Buscar (Ctrl+K)"
      className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors duration-[120ms] hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Search className="size-3.5" aria-hidden />
      <span className="hidden sm:inline">buscar</span>
      <kbd className="hidden rounded border border-border px-1 text-[10px] md:inline">Ctrl K</kbd>
    </button>
  );
}
