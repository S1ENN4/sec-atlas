#!/usr/bin/env node
// Internal link checker for the static export. Zero dependencies. Run after
// `next build`:   npm run check:links
//
// For every .html page under out/ it checks each same-site link
//   - /path        resolves to out/path.html or out/path/index.html (or a file)
//   - /path#hash   the target page has an element with that id
//   - #hash        the current page has that id
// External links, mailto: and tel: are ignored. Exits 1 with a list on failure.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve(process.cwd(), "out");
if (!existsSync(OUT)) {
  console.error("[check-links] out/ not found: run `npm run build` first");
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) pages.push(p);
  }
})(OUT);

const toUrl = (file) => "/" + file.slice(OUT.length + 1).replace(/\\/g, "/").replace(/\.html$/, "").replace(/\/index$/, "").replace(/^index$/, "");
const html = new Map(pages.map((p) => [toUrl(p), readFileSync(p, "utf8")]));
html.set("", html.get("/") ?? "");
const idsOf = new Map();
const ids = (url) => {
  if (!idsOf.has(url)) {
    const set = new Set();
    for (const m of (html.get(url) ?? "").matchAll(/\sid="([^"]+)"/g)) set.add(m[1]);
    // Explorable maps draw their nodes on the client; the ids they accept as #fragment are listed here.
    for (const m of (html.get(url) ?? "").matchAll(/\sdata-node-ids="([^"]+)"/g)) for (const id of m[1].split(" ")) set.add(id);
    idsOf.set(url, set);
  }
  return idsOf.get(url);
};

// Pages that are redirect-only at the host (nginx / _redirects), not files in out/.
const HOST_ROUTES = new Set(["/"]);

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const broken = [];
let checked = 0;
for (const [url, body] of html) {
  if (url === "") continue;
  for (const m of body.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) continue;
    if (href.startsWith("/_next") ) continue;
    let [path, hash] = href.split("#");
    path = path.split("?")[0];
    if (path === "") path = url; // "#hash" on the same page
    path = path.replace(/\/$/, "") || "/";
    checked++;
    if (!HOST_ROUTES.has(path) && !html.has(path) && !existsSync(join(OUT, path))) {
      broken.push(`${url}  ->  ${href}  (no such page)`);
      continue;
    }
    if (hash && html.has(path) && !ids(path).has(decodeURIComponent(hash))) {
      broken.push(`${url}  ->  ${href}  (no element id "${hash}")`);
    }
  }
}

if (broken.length) {
  const uniq = [...new Set(broken)];
  console.log(`[check-links] ${uniq.length} broken link(s) in ${pages.length} pages:`);
  for (const b of uniq.slice(0, 60)) console.log("  " + b);
  if (uniq.length > 60) console.log(`  ... and ${uniq.length - 60} more`);
  process.exit(1);
}
console.log(`[check-links] OK: ${checked} internal links across ${pages.length} pages`);
