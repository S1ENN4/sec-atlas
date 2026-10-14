#!/usr/bin/env node
// Minimal static server for the exported site (out/), for the end-to-end tests.
// It mirrors the production nginx rules: try the exact file, then <path>.html,
// then <path>/index.html. No dependencies, bound to 127.0.0.1 only.

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const OUT = resolve(process.cwd(), "out");
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const isFile = (p) => existsSync(p) && statSync(p).isFile();

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const rel = normalize(url).replace(/^([/\\])+/, "");
  const base = join(OUT, rel);
  if (!base.startsWith(OUT)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  const candidates = [base, `${base}.html`, join(base, "index.html")];
  const file = candidates.find(isFile);
  if (!file) {
    const notFound = join(OUT, "404.html");
    res.writeHead(404, { "content-type": TYPES[".html"] }).end(isFile(notFound) ? readFileSync(notFound) : "not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
}).listen(PORT, "127.0.0.1", () => console.log(`serving out/ on http://127.0.0.1:${PORT}`));
