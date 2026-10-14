"use client";

// Header control that flips the visual theme. The colour tokens themselves
// live in src/app/globals.css ([data-theme="dark"] | [data-theme="light"]);
// this component only owns the user choice — it sets
// `document.documentElement.dataset.theme` and persists it to localStorage so the
// next hard reload picks it up (P2.3 will add the anti-flash script in <head>
// that reads the same key before paint; this toggle works with or without it
// because every click writes the dataset immediately).
//
// Render rules:
//   - SSR + first client paint use the dark default, so React hydration
//     never sees a mismatch.
//   - useEffect then upgrades the state from localStorage /
//     prefers-color-scheme; until that happens the button is opacity-0 so the
//     visible icon and label can never disagree with the painted theme.
//   - The visible icon + label advertise the ACTION (switch to the other
//     mode); aria-pressed reports the current state for assistive tech.

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Theme = "dark" | "light";
const STORAGE_KEY = "kb-theme";

export interface ThemeToggleLabels {
  dark: string;
  light: string;
  aria: string;
}

export function ThemeToggle({ labels }: { labels: ThemeToggleLabels }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Theme = "dark";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
        initial = "light";
      }
    } catch {
      /* storage blocked: keep the dark default */
    }
    // Idempotent: P2.3 may have set this before React mounts; we re-write so
    // the very first user click still has the right base state to flip.
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
    setMounted(true);
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked: the toggle still works for the current page */
    }
    setTheme(next);
  };

  const isLight = theme === "light";
  // Visible content advertises the action: in dark mode we show the sun icon
  // and the "Light theme" label (the mode you would switch to); in light
  // mode we show the moon icon and "Dark theme". aria-pressed reports the
  // current state for assistive tech.
  const Icon = isLight ? Moon : Sun;
  const label = isLight ? labels.dark : labels.light;

  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={isLight}
      aria-label={labels.aria}
      title={label}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] uppercase text-muted-foreground transition-[opacity,colors] duration-[120ms] hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !mounted && "opacity-0",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}