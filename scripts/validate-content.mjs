#!/usr/bin/env node
// Content integrity validator. Runs in `prebuild` (and on demand) to assert
// that the per-domain content layer is internally consistent. The script is
// intentionally zero-dependency: it imports the TypeScript content modules
// directly through Node's built-in type-stripping (Node 24+) plus the
// `@/…`-alias / extensionless-specifier custom loader registered via
// `--import ./scripts/content-alias-loader.mjs` (see package.json).
//
// Per-rule checks (see README / task spec):
//   R1 composite ids unique across all domains
//   R2 every Relation.source/target resolves to an existing topic
//   R3 every pipelineStages[].items[].slug resolves
//   R4 every glossary entry's `topic` ref resolves (cross-domain allowed)
//   R5 every topic in a domain with a graphLayout has a position, no orphans
//   R6 status-aware content floor:
//        status: "draft" → rules R1–R5 only
//        status: "live"  → also enforce, per topic:
//            - sections.length >= 4
//            - (totalCodeSamples >= 1 OR totalBullets >= 3)
//            - tagline non-empty
//            - tools.length >= 3
//   (the live floor mirrors the verified reference thresholds for the 8
//    AppSec topics today; do NOT raise them.)

import { domains, getTopic } from "@/content/registry";
import { quizzes } from "@/content/quiz";
import { bridges } from "@/content/bridges";
import { paths } from "@/content/paths";
import { scenarios } from "@/content/scenarios";
import { allUnits, auditAll } from "@/i18n/audit";

// ---------------------------------------------------------------------------
// Tiny reporting helpers — no external deps.
// ---------------------------------------------------------------------------
const RED = (s) => `\x1b[31m${s}\x1b[0m`;
const GRN = (s) => `\x1b[32m${s}\x1b[0m`;
const YLW = (s) => `\x1b[33m${s}\x1b[0m`;
const DIM = (s) => `\x1b[2m${s}\x1b[0m`;

const failures = []; // { rule, message }

function record(rule, ok, summary, detail) {
  const status = ok ? GRN("OK ") : RED("FAIL");
  const tag = `${status}  ${rule.padEnd(34)} ${summary}`;
  console.log(tag);
  if (!ok) {
    failures.push({ rule, message: summary });
    for (const line of detail) console.log(`       ${RED("•")} ${line}`);
  } else if (detail && detail.length) {
    for (const line of detail) console.log(`       ${DIM("·")} ${DIM(line)}`);
  }
}

const allDomainIds = Object.keys(domains);
const liveDomainIds = allDomainIds.filter((id) => domains[id].status === "live");

// ---------------------------------------------------------------------------
// R1: composite ids (domain/slug) are unique across all domains.
// ---------------------------------------------------------------------------
{
  const seen = new Map();
  const dupes = [];
  for (const id of allDomainIds) {
    for (const t of domains[id].topics) {
      const key = `${t.domain}/${t.slug}`;
      if (seen.has(key)) {
        dupes.push(`${key} (also in ${seen.get(key)})`);
      } else {
        seen.set(key, t.domain);
      }
    }
  }
  record(
    "R1 composite ids unique",
    dupes.length === 0,
    `${seen.size} unique across ${allDomainIds.length} domain(s)`,
    dupes,
  );
}

// ---------------------------------------------------------------------------
// R2: every Relation.source / Relation.target resolves to an existing topic.
// ---------------------------------------------------------------------------
{
  let total = 0;
  const broken = [];
  for (const id of allDomainIds) {
    for (const r of domains[id].relations) {
      total++;
      const src = getTopic(r.source);
      const dst = getTopic(r.target);
      if (!src) broken.push(`${id} relation "${r.label}" → source ${r.source.domain}/${r.source.slug} not found`);
      if (!dst) broken.push(`${id} relation "${r.label}" → target ${r.target.domain}/${r.target.slug} not found`);
    }
  }
  record(
    "R2 relations resolve",
    broken.length === 0,
    `${total - broken.length}/${total} relation endpoints`,
    broken,
  );
}

// ---------------------------------------------------------------------------
// R3: every pipelineStages[].items[].slug (when present) resolves to a topic
// in the same domain.
// ---------------------------------------------------------------------------
{
  let total = 0;
  const broken = [];
  for (const id of allDomainIds) {
    for (const stage of domains[id].pipeline) {
      for (const item of stage.items) {
        if (!item.slug) continue;
        total++;
        const t = getTopic({ domain: id, slug: item.slug });
        if (!t) {
          broken.push(`${id} pipeline.${stage.id} item "${item.label}" → slug "${item.slug}" not found in domain`);
        }
      }
    }
  }
  record(
    "R3 pipeline stage items resolve",
    broken.length === 0,
    `${total - broken.length}/${total} item slugs`,
    broken,
  );
}

// ---------------------------------------------------------------------------
// R4: every glossary entry's `topic` ref resolves (CROSS-DOMAIN allowed).
// ---------------------------------------------------------------------------
{
  let total = 0;
  const broken = [];
  for (const id of allDomainIds) {
    for (const group of domains[id].glossary) {
      for (const entry of group.entries) {
        if (!entry.topic) continue;
        total++;
        const t = getTopic(entry.topic);
        if (!t) {
          broken.push(`${id} glossary.${group.id} "${entry.term}" → topic slug "${entry.topic}" not found in any domain`);
        }
      }
    }
  }
  record(
    "R4 glossary topic refs resolve",
    broken.length === 0,
    `${total - broken.length}/${total} cross-domain refs`,
    broken,
  );
}

// ---------------------------------------------------------------------------
// R5: every topic in a domain with a graphLayout has a position; no orphan
// positions for missing topics. (Draft domains without a graphLayout skip.)
// ---------------------------------------------------------------------------
{
  let total = 0;
  const broken = [];
  for (const id of allDomainIds) {
    const layout = domains[id].graphLayout;
    if (!layout) continue;
    const topicSlugs = new Set(domains[id].topics.map((t) => t.slug));
    const layerSlugs = new Set(layout.layerSlugs);
    const positioned = new Set([
      ...Object.keys(layout.layerPositions),
      ...Object.keys(layout.conceptPositions),
    ]);
    // Every topic must be positioned exactly once.
    for (const t of domains[id].topics) {
      total++;
      if (!positioned.has(t.slug)) {
        broken.push(`${id} topic "${t.slug}" has no position in graphLayout`);
      } else if (layerSlugs.has(t.slug) && !layout.layerPositions[t.slug]) {
        broken.push(`${id} layer topic "${t.slug}" is in layerSlugs but missing layerPositions entry`);
      } else if (!layerSlugs.has(t.slug) && !layout.conceptPositions[t.slug]) {
        broken.push(`${id} concept topic "${t.slug}" has no entry in conceptPositions`);
      }
    }
    // No orphan positions.
    for (const slug of positioned) {
      if (!topicSlugs.has(slug)) {
        broken.push(`${id} graphLayout has orphan position for unknown topic "${slug}"`);
      }
    }
  }
  record(
    "R5 graphLayout positions complete",
    broken.length === 0,
    `${total - broken.length}/${total} topics positioned`,
    broken,
  );
}

// ---------------------------------------------------------------------------
// R6: status-aware content floor.
//   draft: skipped (integrity rules only).
//   live : per topic — sections>=4 AND (code>=1 OR bullets>=3) AND
//          tagline non-empty AND tools>=3.
// ---------------------------------------------------------------------------
{
  if (liveDomainIds.length === 0) {
    record("R6 live content floor", true, "no live domains", []);
  } else {
    let total = 0;
    const broken = [];
    for (const id of liveDomainIds) {
      const dom = domains[id];
      for (const t of dom.topics) {
        total++;
        const sections = t.sections.length;
        const totalCode = t.sections.reduce((n, s) => n + (s.code?.length ?? 0), 0);
        const totalBullets = t.sections.reduce((n, s) => n + (s.bullets?.length ?? 0), 0);
        const tagline = (t.tagline ?? "").trim();
        const tools = t.tools?.length ?? 0;
        const reasons = [];
        if (sections < 4) reasons.push(`sections=${sections} (need >=4)`);
        if (!(totalCode >= 1 || totalBullets >= 3))
          reasons.push(`code=${totalCode}, bullets=${totalBullets} (need code>=1 OR bullets>=3)`);
        if (!tagline) reasons.push("tagline empty");
        if (tools < 3) reasons.push(`tools=${tools} (need >=3)`);
        if (reasons.length) {
          broken.push(`${id}/${t.slug}: ${reasons.join("; ")}`);
        }
      }
    }
    record(
      `R6 live content floor (${liveDomainIds.join(",")})`,
      broken.length === 0,
      `${total - broken.length}/${total} topics pass`,
      broken,
    );
  }
}

// ---------------------------------------------------------------------------
// R7: every topic of a live domain has a quiz of >=3 well-formed questions
// (4 options, `answer` in range, non-empty explanation) and no quiz entry is
// orphaned.
// ---------------------------------------------------------------------------
{
  let total = 0;
  const broken = [];
  for (const id of allDomainIds) {
    const bank = quizzes[id] ?? {};
    const slugs = new Set(domains[id].topics.map((t) => t.slug));
    for (const slug of Object.keys(bank)) {
      if (!slugs.has(slug)) broken.push(`${id}: quiz for unknown topic "${slug}"`);
    }
    for (const t of domains[id].topics) {
      total++;
      const qs = bank[t.slug] ?? [];
      if (qs.length < 3) broken.push(`${id}/${t.slug}: ${qs.length} questions (need >=3)`);
      qs.forEach((q, i) => {
        if (!q.q?.trim()) broken.push(`${id}/${t.slug}#${i}: empty question`);
        if (!Array.isArray(q.options) || q.options.length !== 4)
          broken.push(`${id}/${t.slug}#${i}: needs exactly 4 options`);
        else if (new Set(q.options).size !== 4)
          broken.push(`${id}/${t.slug}#${i}: duplicate options`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3)
          broken.push(`${id}/${t.slug}#${i}: answer out of range`);
        if (!q.explain?.trim()) broken.push(`${id}/${t.slug}#${i}: empty explanation`);
      });
    }
  }
  record("R7 quiz coverage", broken.length === 0, `${total - broken.length}/${total} topics have a valid quiz`, broken);
}

// ---------------------------------------------------------------------------
// R8: bridges, study paths and scenarios only point at existing topics, and
// scenario stage ids exist in their domain's pipeline.
// ---------------------------------------------------------------------------
{
  const broken = [];
  const ok = (ref) => !!getTopic(ref);
  bridges.forEach((b, i) => {
    if (!ok(b.a)) broken.push(`bridge #${i}: unknown ${b.a.domain}/${b.a.slug}`);
    if (!ok(b.b)) broken.push(`bridge #${i}: unknown ${b.b.domain}/${b.b.slug}`);
    if (b.a.domain === b.b.domain) broken.push(`bridge #${i}: must cross domains`);
  });
  for (const p of paths) {
    if (p.steps.length < 3) broken.push(`path ${p.id}: needs >=3 steps`);
    for (const st of p.steps)
      if (!ok(st.ref)) broken.push(`path ${p.id}: unknown ${st.ref.domain}/${st.ref.slug}`);
  }
  for (const sc of scenarios) {
    const stageIds = new Set((domains[sc.domain]?.pipeline ?? []).map((s) => s.id));
    for (const st of sc.steps) {
      if (!ok(st.control)) broken.push(`scenario ${sc.id}: unknown ${st.control.domain}/${st.control.slug}`);
      if (!stageIds.has(st.stageId)) broken.push(`scenario ${sc.id}: unknown stage "${st.stageId}"`);
    }
  }
  record(
    "R8 bridges/paths/scenarios resolve",
    broken.length === 0,
    `${bridges.length} bridges, ${paths.length} paths, ${scenarios.length} scenarios`,
    broken,
  );
}

// ---------------------------------------------------------------------------
// R9: translation drift. English is the source of truth; every translation
// stores the hash of the source string it was made from.
//   - a STALE translation (source changed after it) fails the build
//   - orphan keys, broken placeholders, code samples that changed shape and
//     "translations" identical to the source fail the build
//   - MISSING translations are allowed (the site falls back to the source
//     language with a notice), except in STRICT units (the UI), which must be
//     100% translated and fresh in every locale
// Fix a stale entry by re-translating (npm run i18n -- pending/apply), by
// pruning it (prune), or by confirming the meaning did not change (keep).
// ---------------------------------------------------------------------------
{
  const audits = auditAll();
  const broken = [];
  let total = 0;
  let ok = 0;
  for (const a of audits) {
    total += a.report.total;
    ok += a.report.ok;
    for (const e of a.errors) broken.push(`${a.locale} ${a.unit.id}: ${e}`);
  }
  const units = allUnits().length;
  record(
    "R9 translation drift",
    broken.length === 0,
    `${units} units, ${ok}/${total} strings translated across locales, 0 stale`,
    broken.slice(0, 40).concat(broken.length > 40 ? [`... and ${broken.length - 40} more (npm run i18n -- status)`] : []),
  );
}

// ---------------------------------------------------------------------------
// Final summary.
// ---------------------------------------------------------------------------
console.log("");
if (failures.length === 0) {
  console.log(GRN(`✔ content integrity OK (${liveDomainIds.length} live, ${allDomainIds.length - liveDomainIds.length} draft)`));
  process.exit(0);
} else {
  console.log(RED(`✖ ${failures.length} rule(s) failed:`));
  for (const f of failures) console.log(`  - ${YLW(f.rule)}: ${f.message}`);
  process.exit(1);
}
