#!/usr/bin/env node
// Build budget gate. Zero dependencies. Walks out/ recursively and enforces
// deterministic size caps. Run after `next build` (or standalone against an
// existing out/ directory).
//
// Caps (bytes):
//   first-load assets   <= 12,000,000   (shared + heaviest locale)  (every file under out/ EXCEPT *.txt, raw)
//   rsc prefetch        <= 14,700,000   (shared + heaviest locale)  (every *.txt under out/, raw)
//   total               <= 26,700,000   (shared + heaviest locale)
//   all locales         <= 75,000,000   (sanity: en + pt + es together)  (sanity cap: every file under out/)
//   CSS raw             <=    98,000   (see Phase 2+3+4 bump block below)
//   JS raw              <= 1,070,000
//   JS gzip             <=   330,000  (gzipSync per .js file, summed)
//   hub html (<locale>.html) <= 105,000
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
// Journey + Careers recalibration: the guided journey (1 page) and careers
// (index + 6 role roadmaps) add 7 statically rendered pages per locale, each
// with its RSC payload, plus the careers/journey UI strings. Measured after
// the change: first-load 7,202,886 / rsc 7,846,988 / total 15,049,874 /
// all locales 40,955,211 / css 75,547. Caps set ~3% above that.
//
// OWASP Top 10 domain: 10 code-heavy topics x 3 locales. A topic page costs
// about the same as an existing one (html + three copies of its RSC payload),
// so the budget grows with page count. Measured: first-load 8,263,937 / rsc
// 9,339,968 / total 17,603,905 / all locales 48,470,602 / hub html 78,805.
// Caps set ~3% above that. Reducing the RSC duplication is a tracked follow-up.
//
// Vibecoding domain: 9 more topics x 3 locales. Measured: first-load 9,130,782 /
// rsc 10,576,347 / total 19,707,129 / all locales 54,634,724 / hub html 84,299.
// Each domain adds ~8-10% because every topic page ships html + three RSC
// copies; caps stay ~3% above measured so a regression is still caught.
//
// DevOps domain: 10 more topics x 3 locales. Measured: first-load 10,064,870 /
// rsc 11,894,342 / total 21,959,212 / all locales 61,241,186 / hub html 89,612.
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
// Study-features wave (search, side panel, quizzes, paths, scenarios,
// cross-domain bridges, 2 new topics + CI/CD on the AppSec map): baseline
// before the wave was first-load 3,465,224 / rsc 2,985,188 / total
// 6,450,412 / css 59,414 / js 1,134,920 / js_gz 364,488 / index 31,349.
// After: first-load 4,119,839 / rsc 3,884,506 / total 8,004,345 / css
// 68,779 / js 986,929 / js_gz 310,858 / index 43,568. The growth is page
// weight (4 new routes, 2 topics, a trail nav + bridges block on all 37
// topic pages, the map's data now travelling in the RSC payload). Client
// JS went DOWN 13%: the map, list and glossary no longer import the full
// content registry (topic bodies stay on the server) and the quiz bank and
// search index are static JSON fetched on demand. Caps re-floored to ~4%
// headroom over the new measurements; JS caps were tightened, not raised.
//
// Landing-page wave (hero with profile, /sobre, /fontes, /novidades, link
// preview image, sitemap/robots, OG metadata): measured first-load 4,547,767
// / rsc 4,457,121 / total 9,004,888 / css 69,740 / js 974,507 / js_gz 308,313
// / index 55,193. Every new static route costs ~35KB of framework scaffolding
// (chunk list + RSC bootstrap) before any content; three routes plus the
// 56KB opengraph-image explain the delta. Topic pages barely moved (the
// shared sources list lives on /fontes instead of being repeated in all 37
// topics, which would have added ~1.4MB). Caps re-floored to ~3% headroom;
// JS caps untouched.
//
// SecOps domain (4th live domain: 10 topics, home, quiz, glossary, path,
// scenario): measured first-load 5,333,821 / rsc 5,578,049 / total
// 10,911,870 / css 70,072 / js 976,221 / js_gz 308,885 / index 61,011. Same
// shape as earlier domain waves: each topic route ships ~63KB of HTML plus
// ~32KB of RSC payload (the payload is embedded in the HTML and emitted as
// separate .txt files), so 10 topics + a home ≈ +0.8MB first-load, +1.1MB
// rsc, +1.7MB total. Client JS is unchanged (the registry never reaches it).
// Caps re-floored to ~3% headroom.
//
// Security-engineering domain (5th live domain: 10 topics, home, quiz,
// glossary, path, scenario): measured first-load 6,160,820 / rsc 6,761,892 /
// total 12,922,712 / css 70,305 / js 979,919 / js_gz 310,187 / index 66,957.
// Same per-domain cost as SecOps (~+0.8MB first-load, +1.2MB rsc); client JS
// is flat (+3KB). Caps re-floored to ~3% headroom. The per-topic payload is
// emitted both inside the HTML and as separate .txt files, which is why the
// totals scale this way; if the catalogue keeps growing, revisit that
// duplication before raising these again.
//
// Go/Kafka topics dropped from the security-engineering domain (8 topics
// left): measured first-load 6,011,135 / rsc 6,547,594 / total 12,558,729 /
// css 70,305 / js 978,865 / js_gz 309,873 / index 66,920. Caps pulled back
// down to ~3% headroom over those numbers.
//
// Manifesto page + hub link + wider header: measured first-load 6,202,640 /
// rsc 6,841,580 / total 13,044,220 / css 71,417 / js 978,865 / js_gz 309,873
// / index 71,022. One new static route (~45KB of scaffolding and content)
// plus the hub gaining a line. Caps re-floored to ~3% headroom.
//
// i18n (en/pt/es): the export now contains the whole site three times
// (out/en, out/pt, out/es). A reader downloads ONE locale plus the shared
// assets, so the page-weight caps are measured as shared + the heaviest locale
// (first-load 6,621,021 / rsc 7,191,917 / total 13,812,938 / hub 73,311) and a
// separate sanity cap covers all locales together (37,364,411 measured). Caps
// re-floored to ~3% headroom over the per-locale numbers; css 71,874, js
// 986,876 and js_gz 311,694 are global and were already within their caps.
//
// Post-Offensive-Security + i18n recalibration: 7 new domains were layered onto
// the original 3 (careers/journey, OWASP, vibecoding, devops, response, offsec)
// plus the i18n (en/pt/es) routing — the export now ships the whole site three
// times (out/en, out/pt, out/es) and a separate all-locales sanity row covers
// every locale's output together. Each new domain added ~8-10% of bytes (every
// statically-rendered topic page ships html + three copies of its RSC payload:
// en, pt, es), and the all-locales row multiplies the page count by the
// number of locales, so a single 3-locale site roughly triples the
// all-locales measurement versus the per-locale total. Measured after the
// wave: first-load 11,634,112 / rsc 14,173,754 / total 25,807,866 / all
// locales 72,513,770 / js raw 1,031,145 / hub 100,593. CSS raw 76,963 and
// js_gz 325,805 were already within their caps and were left untouched.
// Caps recalibrated to ~3% headroom over the new measurements (rounded up to
// clean numbers so the next rebuild is green); CSS raw's 37-byte margin is
// kept tight on purpose to preserve the byte ceiling on that row.
//
// Phase 2+3+4 CSS-cap bump (deliberate): Phase 1 already saturated the prior
// 82,800 CSS cap. Phase 2 added a real light theme - a :root[data-theme]
// mirror of every dark token, ten dark/light domain-accent pairs, the
// color-scheme property and a focus utility - which the theme toggle and the
// dropdown menus actually read. Phase 3 will add the topic-side summary
// panel, the copy-code buttons, the reading-time stamp, the keyboard
// shortcuts bar and the hub continue-card. Phase 4 adds the inline-SVG
// learning panel. 98,000 is the deliberate ceiling for the close of
// Phases 2+3+4; recalibrate again at the end of Phase 4 if a later wave
// (off-plan) needs more.
//
// Phase 3 reconciliation: A1+A2+A3+A4 added the topic side summary (P3.2),
// copy-code button (P3.3), reading-time on hero + hub (P3.1), study-before/
// unlocks/next-topic/end-of-path (P3.4+P3.5), j/k + g h + c keyboard
// shortcuts (P3.6), and the hub continue-card (P3.7). The continue-card
// itself lives on the hub HTML (the +12% on out/index.html), and the rest
// of the growth is the per-topic-page RSC payload. After Phase 3 the caps
// are stable until Phase 4 deletes the React Flow graph and the inline-SVG
// panel replaces it (slightly smaller). Recalibrate again at the end of
// Phase 4 if a later wave (off-plan) needs more.
//
// Exit 0 when every row is within its cap; exit 1 with a clear per-cap
// message otherwise.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

// Offensive security + GRC domains and 9 more career roadmaps (all x 3 locales).
// Measured: first-load 13,035,544 / rsc 16,209,194 / total 29,244,738 / all locales
// 82,647,284 / css 77,247 / hub html 106,135. Caps ~3% above measured.

// Payload diet: topic body styled through structural CSS (.topic-prose) instead of
// per-element utility classes. Measured: first-load 12,371,731 / rsc 15,186,607 /
// total 27,558,338 / all locales 77,605,112 (-5% vs 29,060,761) / css 80,405 (+3 KB).
// Caps tightened to ~3% above these numbers.

// Phase 0 of the UI pass: the unused motion provider was removed. JS raw 1,031,953 ->
// 917,862, JS gzip 326,132 -> 288,186. JS caps tightened to ~3% above that.

// Phase 4: React Flow removed (own learning map). JS raw 917,862 -> 747,778,
// JS gzip 288,186 -> 233,722. JS caps tightened to ~3% above that.

// Glossary term popups: up to 8 linked terms per topic page, each with a small popover
// (about 1.5 KB per page). Measured: first-load 14,218,709 / rsc 17,702,104 / total
// 31,920,813 / all locales 91,027,183. Caps ~3% above that.

const OUT_DIR = resolve(process.cwd(), "out");

// Phase 3.A3 reconciliation (copy-code button on every <pre>): the new
// CopyCodeButton is a client component rendered once per code sample. Each
// instance ships the code text in its serialized `code` prop (kept narrow
// via `t={{topicPage:{copy,copied}}}` so only those two strings travel,
// not the full Ui dictionary), plus ~580 bytes of HTML and ~50 bytes of
// RSC markup overhead. Measured on the post-change floor: first-load
// 12,958,010 (+636K), rsc 15,865,463 (+637K), total 28,823,473 (+1.27M),
// all locales 81,565,824 (+3.77M). Caps nudged to keep the same ~3%
// headroom-to-content ratio as the live floor.

const CAPS = [
  { key: "first_load",  label: "first-load assets",     limit: 14_650_000, scope: "first_load" },
  { key: "rsc_prefetch",label: "rsc prefetch payloads", limit: 18_250_000, scope: "rsc_prefetch" },
  { key: "total",       label: "total",                 limit: 32_900_000, scope: "total" },
  { key: "all_locales", label: "all locales (sanity)", limit: 93_800_000, scope: "all_locales" },
  { key: "css",         label: "CSS raw",               limit:    98_000, scope: "css" },
  { key: "js",          label: "JS raw",                limit:   770_000, scope: "js" },
  { key: "js_gz",       label: "JS gzip",               limit:   241_000, scope: "js_gz" },
  { key: "index",       label: "out/index.html raw",    limit:   130_000, scope: "index" },
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

  // The site ships once per locale (out/en, out/pt, out/es). A reader only ever
  // downloads ONE locale plus the shared assets (out/_next, icons...), so the
  // page-weight caps are measured per locale: shared + the heaviest locale. A
  // separate sanity cap covers all locales together.
  const LOCALES = ["en", "pt", "es"];
  const localeOf = (p) => {
    const seg = relative(OUT_DIR, p).split(/[/\\]/)[0];
    return LOCALES.includes(seg) ? seg : null;
  };
  const shared = { total: 0, first: 0, rsc: 0 };
  const per = Object.fromEntries(LOCALES.map((l) => [l, { total: 0, first: 0, rsc: 0, index: 0 }]));
  let total = 0;
  let cssRaw = 0;
  let jsRaw = 0;
  let jsGz = 0;

  for (const f of allFiles) {
    total += f.size;
    const ext = extname(f.path).toLowerCase();
    const bucket = localeOf(f.path) ? per[localeOf(f.path)] : shared;
    bucket.total += f.size;
    if (ext === ".txt") bucket.rsc += f.size;
    else bucket.first += f.size;
    // The hub of a locale is exported as out/<locale>.html (or out/<locale>/index.html).
    const rel = relative(OUT_DIR, f.path).split("\\").join("/");
    if (LOCALES.some((l) => rel === `${l}.html` || rel === `${l}/index.html`)) per[rel.split(/[./]/)[0]].index = f.size;
    if (ext === ".css") {
      cssRaw += f.size;
    } else if (ext === ".js") {
      jsRaw += f.size;
      const buf = readFileSync(f.path);
      jsGz += gzipSync(buf, { level: 9 }).length;
    }
  }

  const worst = (k) => Math.max(...LOCALES.map((l) => shared[k] + per[l][k]));
  const indexSize = Math.max(...LOCALES.map((l) => per[l].index));

  const measured = {
    first_load:   worst("first"),
    rsc_prefetch: worst("rsc"),
    total:        worst("total"),
    all_locales:  total,
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
