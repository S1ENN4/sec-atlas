"use client";

// Exploration progress for the explorable map, kept only in this browser
// (localStorage "kb:explore:v1"): which places were opened, which challenges
// were solved and the mission currently being followed.

import { useCallback, useSyncExternalStore } from "react";

const KEY = "kb:explore:v1";

export interface ExploreState {
  visited: Record<string, 1>;
  solved: Record<string, 1>;
  mission: string | null;
  /** The last node opened, to continue from. */
  last: string | null;
}

const EMPTY: ExploreState = { visited: {}, solved: {}, mission: null, last: null };

let cache: ExploreState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): ExploreState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<ExploreState>;
    const rec = (v: unknown): Record<string, 1> =>
      v && typeof v === "object" ? Object.fromEntries(Object.keys(v).map((k) => [k, 1 as const])) : {};
    return { visited: rec(p.visited), solved: rec(p.solved), mission: typeof p.mission === "string" ? p.mission : null, last: typeof p.last === "string" ? p.last : null };
  } catch {
    return EMPTY;
  }
}

function write(next: ExploreState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep it in memory for this session */
  }
  listeners.forEach((l) => l());
}

function getSnapshot(): ExploreState {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    cache = read();
  }
  return cache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useExploreProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const visit = useCallback((id: string) => {
    const cur = getSnapshot();
    if (cur.visited[id] && cur.last === id) return;
    write({ ...cur, visited: { ...cur.visited, [id]: 1 }, last: id });
  }, []);

  const solve = useCallback((id: string) => {
    const cur = getSnapshot();
    if (cur.solved[id]) return;
    write({ ...cur, solved: { ...cur.solved, [id]: 1 } });
  }, []);

  // `clear` forgets those places first, so a finished mission can be played again.
  const setMission = useCallback((mission: string | null, clear: string[] = []) => {
    const cur = getSnapshot();
    const drop = (r: Record<string, 1>) => Object.fromEntries(Object.entries(r).filter(([k]) => !clear.includes(k))) as Record<string, 1>;
    write({ visited: drop(cur.visited), solved: drop(cur.solved), mission, last: cur.last });
  }, []);

  const reset = useCallback(() => write(EMPTY), []);

  return { state, visit, solve, setMission, reset };
}
