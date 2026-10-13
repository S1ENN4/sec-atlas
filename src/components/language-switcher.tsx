"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";

import { LOCALES, LOCALE_LABEL, switchLocalePath, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";
import { cn } from "@/lib/utils";

// Language menu. Switching keeps the reader on the same page (only the locale
// segment of the URL changes) and remembers the choice for the root redirect.
export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const remember = (l: Locale) => {
    try {
      window.localStorage.setItem("kb:lang", l);
    } catch {
      /* storage blocked: the switch still works */
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] uppercase text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Globe className="size-3.5" aria-hidden />
        {locale}
      </button>
      {open ? (
        <ul role="menu" className="animate-page-enter absolute right-0 top-full z-50 mt-2 min-w-36 rounded-lg border border-border bg-card p-1 shadow-xl">
          {LOCALES.map((l) => (
            <li key={l} role="none">
              <Link
                role="menuitem"
                href={switchLocalePath(pathname, l)}
                hrefLang={l}
                lang={l}
                onClick={() => remember(l)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  l === locale && "text-primary",
                )}
              >
                {LOCALE_LABEL[l]}
                {l === locale ? <Check className="size-3.5" aria-hidden /> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
