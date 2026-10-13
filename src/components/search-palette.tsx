"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, CornerDownLeft, FileText, Map as MapIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface Item {
  k: "t" | "g";
  d: "appsec" | "cloudsec" | "ai-agents";
  t: string;
  s: string;
  u: string;
  m?: string;
  x?: string;
}

const ROUTES: Record<Item["d"], string> = { appsec: "/appsec", cloudsec: "/cloudsec", "ai-agents": "/agentes" };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Tiny scorer: every query token must appear somewhere; title hits weigh
// more than description hits, prefix hits more than substring hits, and
// topics rank above glossary terms on ties.
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
  return total + (item.k === "t" ? 0.5 : 0);
}

// Global search (Ctrl/Cmd+K, or "/" outside inputs). The index is fetched on
// first open from the static /search-index.json. Enter opens the result;
// Shift+Enter (or the map button) jumps to the card on its domain map.
export function SearchPalette() {
  const router = useRouter();
  const pathname = usePathname();
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

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (index || failed) return;
    fetch("/search-index.json")
      .then((r) => (r.ok ? (r.json() as Promise<Item[]>) : Promise.reject(new Error(String(r.status)))))
      .then(setIndex)
      .catch(() => setFailed(true));
  }, [open, index, failed]);

  const results = useMemo(() => {
    if (!index) return [];
    const tokens = norm(query).split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return index.filter((i) => i.k === "t").slice(0, 8);
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
      if (onMap && item.m) {
        const route = ROUTES[item.d];
        if (pathname === route) {
          window.history.replaceState(null, "", `${route}?foco=${item.m}#mapa`);
          window.dispatchEvent(new CustomEvent("kb:focus", { detail: { domain: item.d, slug: item.m } }));
        } else {
          router.push(`${route}?foco=${item.m}#mapa`);
        }
        return;
      }
      router.push(item.u);
    },
    [close, pathname, router],
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 px-4 pt-[12vh] backdrop-blur-sm print:hidden"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar na base"
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
            placeholder="Buscar tópicos e termos…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">esc</kbd>
        </div>

        <ul id={listId} role="listbox" aria-label="Resultados" className="max-h-[50vh] overflow-y-auto p-2">
          {failed ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">Não foi possível carregar o índice de busca.</li>
          ) : !index ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">Carregando…</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">Nada encontrado para “{query}”.</li>
          ) : (
            results.map((item, i) => (
              <li
                key={`${item.d}-${item.k}-${item.t}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === cursor}
                onMouseMove={() => setCursor(i)}
                onClick={() => go(item, false)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2",
                  i === cursor ? "bg-primary/10" : "hover:bg-muted/50",
                )}
              >
                {item.k === "t" ? (
                  <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                ) : (
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{item.t}</span>
                    <span className="shrink-0 rounded border border-border px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      {item.d}
                    </span>
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
                    aria-label={`Ver ${item.t} no mapa`}
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
            <CornerDownLeft className="size-3" aria-hidden /> abrir
          </span>
          <span>shift+enter no mapa</span>
          <span className="ml-auto">↑↓ navegar</span>
        </div>
      </div>
    </div>
  );
}
