"use client";

// Primary navigation: four entries (Explore, Careers, Learn, Project) instead of
// a flat list, so it scales as domains and pages are added. Desktop: disclosure
// panels (click or keyboard; Escape closes and returns focus). Mobile: a full
// screen sheet with the same groups. All text arrives as props (localised on
// the server); the only client state is which panel is open and local progress.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

import { DomainIcon } from "@/components/domain-icon";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { DomainId } from "@/content/types";

export interface NavDomain {
  id: DomainId;
  name: string;
  pitch: string;
  count: string;
  total: number;
  href: string;
}
export interface NavLink {
  href: string;
  label: string;
  desc?: string;
  external?: boolean;
}
export interface NavData {
  explore: { label: string; allDomains: string; groups: { id: string; label: string; domains: NavDomain[] }[] };
  careers: NavLink;
  learn: { label: string; items: NavLink[] };
  project: { label: string; items: NavLink[] };
  labels: { menu: string; openMenu: string; closeMenu: string; mainNav: string };
}

type PanelId = "explore" | "learn" | "project";

function DomainCard({ d, studied, onNavigate }: { d: NavDomain; studied: number; onNavigate?: () => void }) {
  const pct = d.total ? Math.round((studied / d.total) * 100) : 0;
  return (
    <Link
      href={d.href}
      onClick={onNavigate}
      data-domain={d.id}
      className="group flex gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
        <DomainIcon id={d.id} className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-semibold leading-tight group-hover:text-primary">{d.name}</span>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{d.count}</span>
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted-foreground">{d.pitch}</span>
        <span
          className="mt-2 block h-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={d.name}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <span className="block h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </span>
      </span>
    </Link>
  );
}

function LinkItem({ l, onNavigate }: { l: NavLink; onNavigate?: () => void }) {
  const inner = (
    <>
      <span className="flex items-center gap-1.5 font-medium leading-tight group-hover:text-primary">
        {l.label}
        {l.external ? <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden /> : null}
      </span>
      {l.desc ? <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{l.desc}</span> : null}
    </>
  );
  const cls =
    "group block rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  return l.external ? (
    <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onNavigate}>
      {inner}
    </a>
  ) : (
    <Link href={l.href} className={cls} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

export function SiteNav({ data }: { data: NavData }) {
  const pathname = usePathname();
  const { state } = useProgress();
  const [open, setOpen] = useState<PanelId | null>(null);
  const [sheet, setSheet] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const triggers = useRef<Partial<Record<PanelId, HTMLButtonElement | null>>>({});

  const close = useCallback(() => {
    setOpen(null);
    setSheet(false);
  }, []);

  // Close on navigation.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Outside click + Escape.
  useEffect(() => {
    if (!open && !sheet) return;
    const onDown = (e: PointerEvent) => {
      if (open && rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const was = open;
      close();
      if (was) triggers.current[was]?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, sheet, close]);

  // Mobile sheet: move focus in on open, keep Tab inside it, hand focus back on close.
  useEffect(() => {
    if (!sheet) return;
    closeBtn.current?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = [...sheetRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")];
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    const btn = sheetBtn.current;
    return () => {
      document.removeEventListener("keydown", trap);
      btn?.focus();
    };
  }, [sheet]);

  // Lock page scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const studiedIn = (id: DomainId) => Object.keys(state.seen).filter((k) => k.startsWith(`${id}/`)).length;
  const section = pathname.split("/")[2] ?? "";
  const careersActive = section === "careers";
  // Which route segments belong to Explore: derived from the groups, so a new domain lights it up.
  const exploreSections = data.explore.groups.flatMap((g) => g.domains.map((d) => d.href.split("/")[2] ?? ""));

  const trigger = (id: PanelId, label: string, active: boolean) => (
    <button
      ref={(el) => {
        triggers.current[id] = el;
      }}
      type="button"
      aria-expanded={open === id}
      aria-controls={`nav-panel-${id}`}
      onClick={() => setOpen((cur) => (cur === id ? null : id))}
      className={cn(
        "flex items-center gap-1 rounded-md px-3 py-1.5 font-mono text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        open === id || active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <ChevronDown className={cn("size-3.5 transition-transform duration-200", open === id && "rotate-180")} aria-hidden />
    </button>
  );

  const panel = "animate-pop-in absolute inset-x-0 top-full z-50 border-b border-border bg-background shadow-2xl";

  return (
    <div ref={rootRef} className="flex min-w-0 flex-1 items-center">
      {/* desktop */}
      <nav aria-label={data.labels.mainNav} className="hidden items-center gap-1 md:flex">
        {trigger("explore", data.explore.label, exploreSections.includes(section))}
        <Link
          href={data.careers.href}
          className={cn(
            "rounded-md px-3 py-1.5 font-mono text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            careersActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {data.careers.label}
        </Link>
        {trigger("learn", data.learn.label, ["journey", "paths", "scenarios", "glossary"].includes(section))}
        {trigger("project", data.project.label, ["manifesto", "about", "changelog", "sources", "security"].includes(section))}
      </nav>

      {open ? (
        <div
          aria-hidden
          className="fixed inset-x-0 bottom-0 top-14 z-40 hidden bg-background/60 backdrop-blur-[2px] md:block"
          onClick={() => setOpen(null)}
        />
      ) : null}

      {open === "explore" ? (
        <div id="nav-panel-explore" className={panel}>
          <div className="mx-auto max-h-[calc(100svh-3.5rem)] max-w-7xl overflow-y-auto px-4 py-6 sm:columns-2 sm:gap-x-8 lg:columns-4">
            {data.explore.groups.map((g) => (
              <div key={g.id} className="mb-6 break-inside-avoid">
                <p className="px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{g.label}</p>
                <div className="mt-2 space-y-1">
                  {g.domains.map((d) => (
                    <DomainCard key={d.id} d={d} studied={studiedIn(d.id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {open === "learn" || open === "project" ? (
        <div id={`nav-panel-${open}`} className={panel}>
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
            {(open === "learn" ? data.learn.items : data.project.items).map((l) => (
              <LinkItem key={l.href} l={l} />
            ))}
          </div>
        </div>
      ) : null}

      {/* mobile trigger lives next to the logo area: rendered by the header */}
      <button
        ref={sheetBtn}
        type="button"
        onClick={() => setSheet(true)}
        aria-label={data.labels.openMenu}
        aria-expanded={sheet}
        className="ml-auto rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:hidden"
      >
        <Menu className="size-4" aria-hidden />
      </button>

      {sheet ? (
        <div ref={sheetRef} role="dialog" aria-modal="true" aria-label={data.labels.menu} className="fixed inset-0 z-[60] overflow-y-auto bg-background md:hidden">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="font-mono text-sm font-semibold">{data.labels.menu}</span>
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              aria-label={data.labels.closeMenu}
              className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="space-y-6 px-4 py-5">
            <section>
              <h2 className="px-3 font-mono text-xs uppercase tracking-wider text-primary">{data.explore.label}</h2>
              {data.explore.groups.map((g) => (
                <div key={g.id} className="mt-3">
                  <p className="px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{g.label}</p>
                  <div className="mt-1 space-y-1">
                    {g.domains.map((d) => (
                      <DomainCard key={d.id} d={d} studied={studiedIn(d.id)} onNavigate={close} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
            <section>
              <LinkItem l={data.careers} onNavigate={close} />
            </section>
            {[data.learn, data.project].map((g) => (
              <section key={g.label}>
                <h2 className="px-3 font-mono text-xs uppercase tracking-wider text-primary">{g.label}</h2>
                <div className="mt-2 space-y-1">
                  {g.items.map((l) => (
                    <LinkItem key={l.href} l={l} onNavigate={close} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
