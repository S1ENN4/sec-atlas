"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, CornerDownLeft, FileText, LayoutPanelTop, Map as MapIcon, Search } from "lucide-react";

import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useLocale } from "@/i18n/locale-context";
import { cn } from "@/lib/utils";

interface Item {
  k: "t" | "g" | "p";
  d: "appsec" | "cloudsec" | "ai-agents" | "secops" | "seceng" | "owasp" | "";
  t: string;
  s: string;
  u: string;
  m?: string;
  x?: string;
}

export interface PaletteStrings {
  dialog: string;
  placeholder: string;
  loading: string;
  failed: string;
  empty: string;
  results: string;
  open: string;
  onMapHint: string;
  navigate: string;
  viewOnMap: string;
}

// Domain id -> route segment (kept in sync with `route` in each domain index).
const DOMAIN_ROUTE: Record<string, string> = {
  appsec: "/appsec",
  cloudsec: "/cloudsec",
  "ai-agents": "/agents",
  secops: "/secops",
  seceng: "/engineering",
  owasp: "/owasp",
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Tiny scorer: every query token must appear somewhere; title hits weigh
// more than description hits, prefix hits more than substring hits, and
// pages and topics rank above glossary terms on ties.
function score(item: Item, tokens: string[]): number {
  const title = norm(item.t);
  const desc = norm(item.s);
  const extra = item.x ? norm(item.x) : "";
  let total = 0;
  for (const tok of tokens) {
    let s = 0;
    if (title.startsWith(tok)) s = 6;
    else if (title.includes(` ${tok}`)) s = 5;
    else if (title.includes(tok)) s = 4;
    else if (desc.includes(tok)) s = 2;
    else if (extra.includes(tok)) s = 1;
    if (s === 0) return 0;
    total += s;
  }
  return total + (item.k === "g" ? 0 : 0.5);
}

// Global search + quick navigation (Ctrl/Cmd+K, or "/" outside inputs). The
// index is fetched on first open from the static, per-locale
// /<locale>/search-index.json. Enter opens the result; Shift+Enter (or the map
// button) jumps to the card on its domain map.
export function SearchPalette({ t }: { t: PaletteStrings }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Item[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const listId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        returnFocus.current = document.activeElement as HTMLElement | null;
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        returnFocus.current = document.activeElement as HTMLElement | null;
        setOpen(true);
      }
    };
    const onOpen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("kb:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("kb:search", onOpen);
    };
  }, []);

  // The index is per locale: drop it if the language changes.
  useEffect(() => {
    setIndex(null);
    setFailed(false);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (index || failed) return;
    fetch(`/${locale}/search-index.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Item[]>) : Promise.reject(new Error(String(r.status)))))
      .then(setIndex)
      .catch(() => setFailed(true));
  }, [open, index, failed, locale]);

  const results = useMemo(() => {
    if (!index) return [];
    const tokens = norm(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return index.filter((i) => i.k === "p").concat(index.filter((i) => i.k === "t")).slice(0, 9);
    return index
      .map((item) => ({ item, s: score(item, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.item);
  }, [index, query]);

  const go = useCallback(
    (item: Item, onMap: boolean) => {
      close();
      if (onMap && item.m && item.d) {
        const route = localePath(locale, DOMAIN_ROUTE[item.d]);
        if (pathname === route) {
          window.history.replaceState(null, "", `${route}?focus=${item.m}#map`);
          window.dispatchEvent(new CustomEvent("kb:focus", { detail: { domain: item.d, slug: item.m } }));
        } else {
          router.push(`${route}?focus=${item.m}#map`);
        }
        return;
      }
      router.push(item.u);
    },
    [close, pathname, router, locale],
  );

  if (!open) return null;

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      const item = results[cursor];
      if (item) {
        e.preventDefault();
        go(item, e.shiftKey);
      }
    }
  };

  const Icon = (k: Item["k"]) =>
    k === "t" ? (
      <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
    ) : k === "p" ? (
      <LayoutPanelTop className="mt-0.5 size-4 shrink-0 text-primary/80" aria-hidden />
    ) : (
      <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
    );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-background/70 px-4 pt-[12vh] backdrop-blur-sm print:hidden"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.dialog}
        className="animate-page-enter w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onInputKey}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[cursor] ? `${listId}-${cursor}` : undefined}
            placeholder={t.placeholder}
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">esc</kbd>
        </div>

        <ul id={listId} role="listbox" aria-label={t.results} className="max-h-[50vh] overflow-y-auto p-2">
          {failed ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">{t.failed}</li>
          ) : !index ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">{t.loading}</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">{fmt(t.empty, { query })}</li>
          ) : (
            results.map((item, i) => (
              <li
                key={`${item.k}-${item.d}-${item.u}-${item.t}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === cursor}
                onMouseMove={() => setCursor(i)}
                onClick={() => go(item, false)}
                className={cn("flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2", i === cursor ? "bg-primary/10" : "hover:bg-muted/50")}
              >
                {Icon(item.k)}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{item.t}</span>
                    {item.d ? (
                      <span className="shrink-0 rounded border border-border px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        {item.d}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">{item.s}</span>
                </span>
                {item.m ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      go(item, true);
                    }}
                    aria-label={fmt(t.viewOnMap, { title: item.t })}
                    className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <MapIcon className="size-3.5" aria-hidden />
                  </button>
                ) : null}
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" aria-hidden /> {t.open}
          </span>
          <span>{t.onMapHint}</span>
          <span className="ml-auto">{t.navigate}</span>
        </div>
      </div>
    </div>
  );
}
