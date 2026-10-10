#!/usr/bin/env node
// Build budget gate. Zero dependencies. Walks out/ recursively and enforces
// deterministic size caps. Run after `next build` (or standalone against an
// existing out/ directory).
//
// Caps (bytes):
//   first-load assets   <= 2,650,000  (every file under out/ EXCEPT *.txt, raw)
//   rsc prefetch        <= 1,800,000  (every *.txt under out/, raw)
//   total               <= 4,350,000  (sanity cap: every file under out/)
//   CSS raw             <=    60,000
//   JS raw              <= 1,100,000
//   JS gzip             <=   400,000  (gzipSync per .js file, summed)
//   out/index.html raw  <=    90,000
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
//
// Exit 0 when every row is within its cap; exit 1 with a clear per-cap
// message otherwise.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const OUT_DIR = resolve(process.cwd(), "out");

const CAPS = [
  { key: "first_load",  label: "first-load assets",     limit: 2_650_000, scope: "first_load" },
  { key: "rsc_prefetch",label: "rsc prefetch payloads", limit: 1_825_000, scope: "rsc_prefetch" },
  { key: "total",       label: "total",                 limit: 4_425_000, scope: "total" },
  { key: "css",         label: "CSS raw",               limit:    60_000, scope: "css" },
  { key: "js",          label: "JS raw",                limit: 1_100_000, scope: "js" },
  { key: "js_gz",       label: "JS gzip",               limit:   400_000, scope: "js_gz" },
  { key: "index",       label: "out/index.html raw",    limit:    90_000, scope: "index" },
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
