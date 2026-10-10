#!/usr/bin/env node
// Build budget gate. Zero dependencies. Walks out/ recursively and enforces
// deterministic size caps. Run after `next build` (or standalone against an
// existing out/ directory).
//
// Caps (bytes):
//   first-load assets   <= 2,300,000  (every file under out/ EXCEPT *.txt, raw)
//   rsc prefetch        <= 1,200,000  (every *.txt under out/, raw)
//   total               <= 3,500,000  (sanity cap: every file under out/)
//   CSS raw             <=    60,000
//   JS raw              <= 1,100,000
//   JS gzip             <=   400,000  (gzipSync per .js file, summed)
//   out/index.html raw  <=    90,000
//
// Exit 0 when every row is within its cap; exit 1 with a clear per-cap
// message otherwise.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const OUT_DIR = resolve(process.cwd(), "out");

const CAPS = [
  { key: "first_load",  label: "first-load assets",     limit: 2_300_000, scope: "first_load" },
  { key: "rsc_prefetch",label: "rsc prefetch payloads", limit: 1_200_000, scope: "rsc_prefetch" },
  { key: "total",       label: "total",                 limit: 3_500_000, scope: "total" },
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
