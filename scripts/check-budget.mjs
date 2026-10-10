#!/usr/bin/env node
// Build budget gate. Zero dependencies. Walks out/ recursively and enforces
// deterministic size caps. Run after `next build` (or standalone against an
// existing out/ directory).
//
// Caps (bytes):
//   total export raw <= 2,600,000
//   CSS raw          <=    60,000
//   JS raw           <= 1,100,000
//   JS gzip          <=   400,000  (gzipSync per .js file, summed)
//   out/index.html   <=    90,000
//
// Exit 0 when every row is within its cap; exit 1 with a clear per-cap
// message otherwise.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const OUT_DIR = resolve(process.cwd(), "out");

const CAPS = [
  { key: "total",   label: "total export raw", limit: 2_600_000, scope: "total"   },
  { key: "css",     label: "CSS raw",          limit:    60_000, scope: "css"     },
  { key: "js",      label: "JS raw",           limit: 1_100_000, scope: "js"      },
  { key: "js_gz",   label: "JS gzip",          limit:   400_000, scope: "js_gz"   },
  { key: "index",   label: "out/index.html raw", limit:    90_000, scope: "index"  },
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
  let cssRaw = 0;
  let jsRaw = 0;
  let jsGz = 0;
  let indexHtmlRaw = 0;

  for (const f of allFiles) {
    total += f.size;
    const ext = extname(f.path).toLowerCase();
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
  indexHtmlRaw = indexSize;

  const measured = {
    total:  total,
    css:    cssRaw,
    js:     jsRaw,
    js_gz:  jsGz,
    index:  indexHtmlRaw,
  };

  const labelW = 22;
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
