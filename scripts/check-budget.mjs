#!/usr/bin/env node
// Build budget gate. Zero dependencies. Walks out/ recursively and enforces
// deterministic size caps. Run after `next build` (or standalone against an
// existing out/ directory).
//
// Caps (bytes):
//   first-load assets   <= 3,600,000  (every file under out/ EXCEPT *.txt, raw)
//   rsc prefetch        <= 3,050,000  (every *.txt under out/, raw)
//   total               <= 6,650,000  (sanity cap: every file under out/)
//   CSS raw             <=    60,000
//   JS raw              <= 1,200,000
//   JS gzip             <=   400,000  (gzipSync per .js file, summed)
//   out/index.html raw  <=    50,000
//
// T26 budget calibration (post-audit): measured numbers right after T22
// were first-load 3,459,024 (cap 3,500,000, +1.17% headroom < 2% — too
// tight), JS raw 1,133,379 (cap 1,135,000, +0.14% headroom < 2% — too
// tight), and index.html 28,307 (cap 90,000, +68.55% headroom > 25% —
// too loose). Caps re-floored to defensible values that keep roughly
// the same headroom-to-content ratio as the live floor: first-load
// +100 KB (4% headroom), total +100 KB, JS raw +65 KB (5% headroom —
// matches the typical library addition), and index.html tightened by
// 40 KB (43% headroom — still ample but stops a single content
// doubling the page weight silently). No content was added in T26,
// so the measured numbers on the live floor are unchanged.
// T26_RECONCILED_BEFORE = { first_load: 3,459,024 / rsc_prefetch: 2,980,616
// / total: 6,439,640 / css: 57,893 / js: 1,133,379 / js_gz: 364,036 /
// index: 28,307 } — recorded above; the CAPS array below holds the
// post-calibration caps.
//
// T19 (RAG pipeline topics): five ai-agents topic bodies (rag, chunking,
// embeddings, vector-db, retrieval) landed. Each draft SSG topic route now
// ships its full PT-BR section prose in the RSC payload, adding ~88KB
// first-load, ~92KB rsc prefetch, ~200KB total (5 topics ≈ 380KB spread
// across the route files). JS raw crossed by ~13KB because the topic
// strings landed in the search/filter chunk. Caps raised minimally to
// clear the build (reconciliation commit finalizes): first-load to 3,500,000
// (+100KB), rsc_prefetch to 3,050,000 (+100KB), total to 6,550,000
// (+220KB), js to 1,135,000 (+15KB).
//
// History (continued):
//   - T22 ai-agents glossary (~20 PT-BR entries merged into the shared
//     /glossario RSC payload): added 237KB first-load, 293KB rsc prefetch,
//     580KB total (each statically-rendered GlossaryEntry ships its prose
//     twice in the RSC payload — once as props, once as markup). JS raw
//     crossed by 11KB because the new glossary strings landed in the
//     search/filter chunk. Caps raised minimally to clear the build
//     (reconciliation commit finalizes): first-load to 3,400,000 (+250KB),
//     rsc_prefetch to 2,950,000 (+325KB), total to 6,330,000 (+605KB),
//     js to 1,120,000 (+20KB).
//
// History:
//   - 7ff9e3f (T6): caps sized for 1 domain, 8 topics
//   - T13 cloudsec skeleton (10 more SSG routes + 1 home page) bumped
//     the first-load +9KB, rsc_prefetch +213KB, total +222KB. Caps
//     raised by ~100/300/300KB respectively to accommodate the second
//     domain while keeping the same per-page shape (RSC overhead per
//     topic route is ~26KB raw; 10 new topics ≈ 260KB which fits the
//     new 1.5MB rsc_prefetch ceiling with ~90KB of headroom for
//     future domain growth).
//   - T17 cloudsec glossary + the T14/T15 topic bodies that landed in
//     the same wave added another ~111KB first-load, ~204KB rsc
//     prefetch and ~414KB total. Caps raised by ~250/300/550KB to
//     keep roughly the same headroom-to-content ratio as before.
//   - T16 added the last two cloudsec topic bodies (logging-detection +
//     zero-trust) without crossing the first-load ceiling (~0 KB
//     headroom untouched), but pushed rsc prefetch +6KB over the
//     previous cap and total +49KB. Caps nudged up by another 25KB
//     (rsc prefetch) and 75KB (total) for headroom on the live floor.
//   - T18 ai-agents skeleton: 15 new SSG topic routes + 1 home page
//     (+ slug page shells for the draft domain). Measured ~440KB over
//     first-load, ~751KB over rsc prefetch, ~1.24MB over total (each
//     draft SSG route carries ~50KB RSC HTML; 15 topics ≈ 750KB). Caps
//     raised +500KB/+800KB/+1.3MB to 3,150,000/2,625,000/5,725,000,
//     leaving ~50-60KB headroom per capped row for T19-22 topic bodies
//     landing on the same skeleton without another immediate bump.
//
// Exit 0 when every row is within its cap; exit 1 with a clear per-cap
// message otherwise.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const OUT_DIR = resolve(process.cwd(), "out");

const CAPS = [
  { key: "first_load",  label: "first-load assets",     limit: 3_600_000, scope: "first_load" },
  { key: "rsc_prefetch",label: "rsc prefetch payloads", limit: 3_050_000, scope: "rsc_prefetch" },
  { key: "total",       label: "total",                 limit: 6_650_000, scope: "total" },
  { key: "css",         label: "CSS raw",               limit:    60_000, scope: "css" },
  { key: "js",          label: "JS raw",                limit: 1_200_000, scope: "js" },
  { key: "js_gz",       label: "JS gzip",               limit:   400_000, scope: "js_gz" },
  { key: "index",       label: "out/index.html raw",    limit:    50_000, scope: "index" },
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walk(full));
    } else if (st.isFile()) {
      out.push({ path: full, size: st.size });
    }
  }
  return out;
}

function fmtBytes(n) {
  return n.toLocaleString("en-US");
}

function pad(s, w, right = false) {
  s = String(s);
  if (s.length >= w) return s;
  const fill = " ".repeat(w - s.length);
  return right ? fill + s : s + fill;
}

function main() {
  let allFiles;
  try {
    allFiles = walk(OUT_DIR);
  } catch (e) {
    console.error(`[check-budget] cannot read out/ at ${OUT_DIR}: ${e.message}`);
    process.exit(1);
  }

  let total = 0;
  let firstLoadRaw = 0;   // every file EXCEPT *.txt (raw)
  let rscPrefetchRaw = 0; // every *.txt file (raw)
  let cssRaw = 0;
  let jsRaw = 0;
  let jsGz = 0;

  for (const f of allFiles) {
    total += f.size;
    const ext = extname(f.path).toLowerCase();
    if (ext === ".txt") {
      rscPrefetchRaw += f.size;
    } else {
      firstLoadRaw += f.size;
    }
    if (ext === ".css") {
      cssRaw += f.size;
    } else if (ext === ".js") {
      jsRaw += f.size;
      const buf = readFileSync(f.path);
      jsGz += gzipSync(buf, { level: 9 }).length;
    }
  }

  // index.html: read at out/index.html (raw, single file)
  let indexSize = 0;
  const indexPath = join(OUT_DIR, "index.html");
  try {
    indexSize = statSync(indexPath).size;
  } catch {
    // ignore; index row will fail its cap
  }

  const measured = {
    first_load:   firstLoadRaw,
    rsc_prefetch: rscPrefetchRaw,
    total:        total,
    css:          cssRaw,
    js:           jsRaw,
    js_gz:        jsGz,
    index:        indexSize,
  };

  const labelW = 24;
  const valueW = 14;
  const capW = 14;
  const statusW = 6;
  const fileCount = allFiles.length;
  const relDir = relative(process.cwd(), OUT_DIR) || "out";

  console.log(`[check-budget] measured ${fileCount} files under ${relDir}/`);
  const header =
    pad("metric", labelW) +
    pad("measured", valueW, true) +
    pad("cap", capW, true) +
    pad("status", statusW, true);
  console.log(header);
  console.log(
    pad("", labelW, true).replace(/ /g, "-") +
    pad("", valueW, true).replace(/ /g, "-") +
    pad("", capW, true).replace(/ /g, "-") +
    pad("", statusW, true).replace(/ /g, "-")
  );

  const failures = [];
  for (const cap of CAPS) {
    const m = measured[cap.key];
    const ok = m <= cap.limit;
    const line =
      pad(cap.label, labelW) +
      pad(fmtBytes(m), valueW, true) +
      pad(fmtBytes(cap.limit), capW, true) +
      pad(ok ? "OK" : "FAIL", statusW, true);
    console.log(line);
    if (!ok) {
      failures.push({ cap, measured: m });
    }
  }

  if (failures.length > 0) {
    console.error("");
    for (const f of failures) {
      const over = f.measured - f.cap.limit;
      console.error(
        `[check-budget] FAIL: ${f.cap.label} = ${fmtBytes(f.measured)} bytes, ` +
        `exceeds cap ${fmtBytes(f.cap.limit)} by ${fmtBytes(over)} bytes.`
      );
    }
    process.exit(1);
  }
  console.log("[check-budget] OK: every metric is within its cap.");
}

main();
