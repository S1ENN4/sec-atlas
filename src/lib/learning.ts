// Shared engine for the Phase 4 inline-SVG "learning graph" panel.
//
// The engine is intentionally a pure util: it takes a topic list + level map
// as input and returns a per-level + per-prerequisite graph plus a summary.
// It does NOT import from `src/content/*` — the caller (P4.3) builds the
// input from the registry at the call site, so this file stays independent
// of the content layer and survives the planned `graphLayout` removal.
//
// Determinism contract (the unit brief is explicit):
//   * No I/O, no Date.now(), no Math.random().
//   * Within a level, topics are sorted by `id` (alphabetical) so the X order
//     is stable regardless of input ordering. The sort comparator never
//     leaves ties (string compare on unique ids), so V8 sort instability is
//     not a risk here.
//   * Edges mirror input iteration order (topic order × prereq order) — same
//     input produces byte-equal output.
//
// Layout:
//   * Cluster nodes by `level` (1 → 2 → 3 → …); level controls Y.
//   * Within a level, distribute nodes evenly along X starting at 0.

export interface BuildLevelGraphInput {
  topics: { id: string; level?: number; prerequisites?: string[] }[];
}

export interface LevelGraphNode {
  id: string;
  level: number;
  x: number;
  y: number;
}

export interface LevelGraphEdge {
  from: string;
  to: string;
}

export interface LevelGraph {
  nodes: LevelGraphNode[];
  edges: LevelGraphEdge[];
}

// Spacing constants — kept as named exports so the renderer (P4.3) can read
// the same numbers and lay out arrows / labels against the same grid.
export const X_SPACING = 180;
export const Y_PER_LEVEL = 120;

export function buildLevelGraph(input: BuildLevelGraphInput): LevelGraph {
  const topics = input?.topics ?? [];
  if (topics.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Default missing level to 1 — mirrors `levelOf()` in src/content/levels.ts.
  // We carry only the fields the layout needs into a per-level bucket so the
  // rest of the function is purely arithmetic.
  const byLevel = new Map<number, { id: string; prereqs: string[] }[]>();
  for (const t of topics) {
    const lvl = t.level ?? 1;
    const bucket = byLevel.get(lvl);
    if (bucket) bucket.push({ id: t.id, prereqs: t.prerequisites ?? [] });
    else byLevel.set(lvl, [{ id: t.id, prereqs: t.prerequisites ?? [] }]);
  }

  const nodes: LevelGraphNode[] = [];
  const levelKeys = [...byLevel.keys()].sort((a, b) => a - b);
  for (const lvl of levelKeys) {
    // Sort by id (alphabetical). The comparator never leaves ties because
    // ids within a level are distinct; if two are equal the `0` branch keeps
    // the existing order, which is the documented fallback.
    const items = byLevel
      .get(lvl)!
      .slice()
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    items.forEach((it, i) => {
      nodes.push({
        id: it.id,
        level: lvl,
        x: i * X_SPACING,
        y: (lvl - 1) * Y_PER_LEVEL,
      });
    });
  }

  // Edges: for every prereq on every topic, emit `{ from: prereq, to: id }`.
  // We do NOT dedupe — the prereqs list is the single source of truth and
  // the consumer (P4.3) decides whether to fold duplicates.
  const edges: LevelGraphEdge[] = [];
  for (const t of topics) {
    const prereqs = t.prerequisites ?? [];
    for (const prereq of prereqs) {
      edges.push({ from: prereq, to: t.id });
    }
  }

  return { nodes, edges };
}

export interface GraphSummary {
  total: number;
  perLevel: Record<number, number>;
}

export function summariseGraph(g: LevelGraph): GraphSummary {
  const perLevel: Record<number, number> = {};
  for (const n of g.nodes) {
    perLevel[n.level] = (perLevel[n.level] ?? 0) + 1;
  }
  return { total: g.nodes.length, perLevel };
}

// ---------------------------------------------------------------------------
// Learner state on top of the level graph. One definition of "ready" and
// "next" for the domain map, the Journey and any future "continue" surface.
// A topic is READY when every prerequisite that exists is done; nothing is ever
// locked out, the state only orders the recommendation.
// ---------------------------------------------------------------------------

export type TopicState = "done" | "ready" | "locked";

export interface StateNode {
  id: string; // "<domain>/<slug>"
  level: number;
  requires: string[];
}

export type IsDone = (id: string) => boolean;

/** Prerequisites (that exist in `byId`) the learner has not finished yet. */
export function missingPrereqs(node: StateNode, byId: ReadonlyMap<string, StateNode>, isDone: IsDone): string[] {
  return node.requires.filter((r) => byId.has(r) && !isDone(r));
}

export function topicState(node: StateNode, byId: ReadonlyMap<string, StateNode>, isDone: IsDone): TopicState {
  if (isDone(node.id)) return "done";
  return missingPrereqs(node, byId, isDone).length === 0 ? "ready" : "locked";
}

/**
 * The recommended next topic: the first ready, unfinished one, scanning by
 * level and then in the given order. Returns null when everything in scope is
 * done (or nothing is ready, which cannot happen in an acyclic graph).
 */
export function pickNext<T extends StateNode>(nodes: readonly T[], isDone: IsDone, inScope: (n: T) => boolean = () => true): T | null {
  const byId = new Map(nodes.map((n) => [n.id, n as StateNode]));
  const ordered = nodes.map((n, i) => ({ n, i })).sort((a, b) => a.n.level - b.n.level || a.i - b.i);
  for (const { n } of ordered) {
    if (inScope(n) && !isDone(n.id) && missingPrereqs(n, byId, isDone).length === 0) return n;
  }
  return null;
}

/** Topics that list `id` as a prerequisite, in input order. */
export function unlocksOf<T extends StateNode>(id: string, nodes: readonly T[]): T[] {
  return nodes.filter((n) => n.requires.includes(id));
}
