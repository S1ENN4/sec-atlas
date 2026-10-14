// Tests for src/lib/learning.ts. Plain node, no framework:
//   npm run test:learning
import assert from "node:assert/strict";

import { buildLevelGraph, missingPrereqs, pickNext, summariseGraph, topicState, unlocksOf } from "@/lib/learning";

let failed = 0;
const test = (name, fn) => {
  try {
    fn();
    console.log(`ok    ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${name}\n      ${e.message}`);
  }
};

const nodes = [
  { id: "a/iam", level: 1, requires: [] },
  { id: "a/net", level: 1, requires: ["a/iam"] },
  { id: "a/sast", level: 2, requires: ["a/net"] },
  { id: "b/dast", level: 2, requires: ["a/sast", "a/net", "ghost/none"] },
];
const byId = new Map(nodes.map((n) => [n.id, n]));
const done = (set) => (id) => set.has(id);

test("a root topic is ready with no progress", () => assert.equal(topicState(nodes[0], byId, done(new Set())), "ready"));
test("a topic with unfinished prerequisites is locked", () => assert.equal(topicState(nodes[1], byId, done(new Set())), "locked"));
test("done wins over everything else", () => assert.equal(topicState(nodes[1], byId, done(new Set(["a/net"]))), "done"));
test("unknown prerequisites are ignored", () => assert.deepEqual(missingPrereqs(nodes[3], byId, done(new Set(["a/sast", "a/net"]))), []));
test("missing prerequisites are listed", () => assert.deepEqual(missingPrereqs(nodes[3], byId, done(new Set(["a/net"]))), ["a/sast"]));
test("next with no progress is the first root", () => assert.equal(pickNext(nodes, done(new Set()))?.id, "a/iam"));
test("next advances along the prerequisites", () => assert.equal(pickNext(nodes, done(new Set(["a/iam"])))?.id, "a/net"));
test("next respects the scope filter", () => assert.equal(pickNext(nodes, done(new Set()), (n) => n.id.startsWith("b/")), null));
test("next is null when everything is done", () => assert.equal(pickNext(nodes, done(new Set(nodes.map((n) => n.id)))), null));
test("unlocks lists the dependents", () => assert.deepEqual(unlocksOf("a/net", nodes).map((n) => n.id), ["a/sast", "b/dast"]));
test("level graph is deterministic and complete", () => {
  const input = { topics: nodes.map((n) => ({ id: n.id, level: n.level, prerequisites: n.requires })) };
  const g = buildLevelGraph(input);
  assert.deepEqual(buildLevelGraph(input), g);
  assert.equal(g.nodes.length, 4);
  assert.deepEqual(summariseGraph(g).perLevel, { 1: 2, 2: 2 });
});

if (failed) {
  console.log(`\nlearning tests: ${failed} failure(s)`);
  process.exit(1);
}
console.log("\nlearning tests: OK");
