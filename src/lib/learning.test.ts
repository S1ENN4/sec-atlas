// Unit tests for src/lib/learning.ts. Pure, no I/O — bun:test's built-in
// runner is enough; no fixtures or framework setup required.
//
// `bun:test` ships only at runtime (the project has no `@types/bun` and
// the pathspec for Phase 4.1 forbids adding one). The `@ts-expect-error`
// silences the TS2307 for the import line; bun itself resolves the module
// when `bun test` runs. The directive errors out if TS ever stops
// complaining, so we won't accidentally mask a real regression.

// @ts-expect-error -- bun:test is provided by the test runner, not by @types/*.
import { describe, expect, test } from "bun:test";

import { buildLevelGraph, summariseGraph } from "./learning";

// Two level-1 topics, two level-2 topics, with realistic prerequisite edges
// (a level-2 depends on a level-1; one level-2 depends on two topics).
const fixture = {
  topics: [
    { id: "appsec/iam", level: 1 },
    { id: "appsec/network", level: 1, prerequisites: ["appsec/iam"] },
    {
      id: "appsec/sast",
      level: 2,
      prerequisites: ["appsec/network"],
    },
    {
      id: "appsec/dast",
      level: 2,
      prerequisites: ["appsec/sast", "appsec/network"],
    },
  ],
};

describe("buildLevelGraph", () => {
  test("returns empty arrays on empty input", () => {
    const g = buildLevelGraph({ topics: [] });
    expect(g.nodes).toEqual([]);
    expect(g.edges).toEqual([]);
    expect(summariseGraph(g)).toEqual({ total: 0, perLevel: {} });
  });

  test("clusters nodes by level and links every prereq as from→to", () => {
    const g = buildLevelGraph(fixture);

    expect(g.nodes).toHaveLength(4);
    expect(g.edges).toHaveLength(4);

    // per-level layout: two level-1 (Y=0), two level-2 (Y=120).
    const lvl1 = g.nodes.filter((n) => n.level === 1);
    const lvl2 = g.nodes.filter((n) => n.level === 2);
    expect(lvl1).toHaveLength(2);
    expect(lvl2).toHaveLength(2);
    for (const n of lvl1) expect(n.y).toBe(0);
    for (const n of lvl2) expect(n.y).toBe(120);

    // Within a level, sort by id → iam before network, dast before sast.
    expect(lvl1.map((n) => n.id)).toEqual(["appsec/iam", "appsec/network"]);
    expect(lvl1.map((n) => n.x)).toEqual([0, 180]);
    expect(lvl2.map((n) => n.id)).toEqual(["appsec/dast", "appsec/sast"]);
    expect(lvl2.map((n) => n.x)).toEqual([0, 180]);

    // Edges mirror prereqs exactly: prereq is `from`, current is `to`.
    // 1 edge for `network`, 1 for `sast`, 2 for `dast` → 4 edges total.
    const edgeKeys = g.edges.map((e) => `${e.from}->${e.to}`).sort();
    expect(edgeKeys).toEqual([
      "appsec/iam->appsec/network",
      "appsec/network->appsec/dast",
      "appsec/network->appsec/sast",
      "appsec/sast->appsec/dast",
    ]);
  });

  test("summariseGraph counts nodes and buckets by level", () => {
    const s = summariseGraph(buildLevelGraph(fixture));
    expect(s.total).toBe(4);
    expect(s.perLevel).toEqual({ 1: 2, 2: 2 });
  });

  test("is deterministic — same input produces byte-equal output", () => {
    const a = buildLevelGraph(fixture);
    const b = buildLevelGraph(fixture);
    // structural equality (covers ids, levels, x/y, edges)
    expect(a).toEqual(b);
    // byte-equal: serialize both and compare strings, so a one-bit
    // difference in any numeric position would fail.
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    // summaries are also byte-equal
    expect(summariseGraph(a)).toEqual(summariseGraph(b));

    // Calling on a copy of the fixture (different array, same content)
    // also matches — the engine depends on content, not identity.
    const copy = {
      topics: fixture.topics.map((t) => ({
        ...t,
        prerequisites: t.prerequisites ? [...t.prerequisites] : undefined,
      })),
    };
    const c = buildLevelGraph(copy);
    expect(JSON.stringify(c)).toBe(JSON.stringify(a));
  });
});