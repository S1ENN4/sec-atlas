"use client";

// Study progress, kept entirely in the reader's browser (localStorage). No
// network, no cookies. Every read/write is wrapped in try/catch because
// storage can be blocked (private windows, strict settings); the app must
// behave as "nothing saved" in that case.
//
// Shape (v1): { seen: { "<domain>/<slug>": 1 }, quiz: { "<domain>/<slug>": { best, total } } }

import { useCallback, useSyncExternalStore } from "react";

import type { DomainId } from "@/content/types";

const KEY = "kb:progress:v1";

export interface ProgressState {
  seen: Record<string, 1>;
  quiz: Record<string, { best: number; total: number }>;
}

const EMPTY: ProgressState = { seen: {}, quiz: {} };

let cache: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): ProgressState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { seen: parsed.seen ?? {}, quiz: parsed.quiz ?? {} };
  } catch {
    return EMPTY;
  }
}

function emit() {
  for (const l of listeners) l();
}

function write(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep the in-memory copy for this session */
  }
  emit();
}

function getSnapshot(): ProgressState {
  if (!loaded) {
    cache = read();
    loaded = true;
  }
  return cache;
}

function getServerSnapshot(): ProgressState {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      cache = read();
      loaded = true;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const topicKey = (domain: DomainId, slug: string) => `${domain}/${slug}`;

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isSeen = useCallback((domain: DomainId, slug: string) => !!state.seen[topicKey(domain, slug)], [state]);

  const toggleSeen = useCallback((domain: DomainId, slug: string) => {
    const cur = getSnapshot();
    const k = topicKey(domain, slug);
    const seen = { ...cur.seen };
    if (seen[k]) delete seen[k];
    else seen[k] = 1;
    write({ ...cur, seen });
  }, []);

  const markSeen = useCallback((domain: DomainId, slug: string) => {
    const cur = getSnapshot();
    const k = topicKey(domain, slug);
    if (cur.seen[k]) return;
    write({ ...cur, seen: { ...cur.seen, [k]: 1 } });
  }, []);

  const saveQuiz = useCallback((domain: DomainId, slug: string, score: number, total: number) => {
    const cur = getSnapshot();
    const k = topicKey(domain, slug);
    const prev = cur.quiz[k];
    if (prev && prev.best >= score) return;
    write({ ...cur, quiz: { ...cur.quiz, [k]: { best: score, total } } });
  }, []);

  const reset = useCallback(() => write(EMPTY), []);

  return { state, isSeen, toggleSeen, markSeen, saveQuiz, reset };
}
