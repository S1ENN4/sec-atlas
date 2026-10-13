#!/usr/bin/env node
// Smoke test for the MCP server (mcp/server.mjs). Spawns it over stdio and
// checks the handshake, the tool list, read/search/validate behaviour and the
// safety refusals of scaffold_topic. Writes nothing to the repository.
//
//   node scripts/mcp-smoke.mjs        (run from the repo root)

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const child = spawn(process.execPath, ["--import", "./scripts/content-alias-loader.mjs", "mcp/server.mjs"], {
  cwd: ROOT,
  stdio: ["pipe", "pipe", "ignore"],
});

const pending = new Map();
let strayStdout = 0;
createInterface({ input: child.stdout }).on("line", (line) => {
  try {
    const m = JSON.parse(line);
    pending.get(m.id)?.(m);
  } catch {
    strayStdout++;
  }
});

let nextId = 0;
const rpc = (method, params) =>
  new Promise((res, rej) => {
    const id = ++nextId;
    const t = setTimeout(() => rej(new Error(`timeout: ${method}`)), 120000);
    pending.set(id, (m) => {
      clearTimeout(t);
      res(m);
    });
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
const tool = (name, args) => rpc("tools/call", { name, arguments: args });

let failures = 0;
const check = (name, cond, detail = "") => {
  console.log(`${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : `  ${detail}`}`);
  if (!cond) failures++;
};
const txt = (r) => r.result?.content?.[0]?.text ?? "";

try {
  const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "smoke", version: "0" } });
  check("initialize echoes the protocol version", init.result?.protocolVersion === "2025-06-18");
  check("initialize advertises tools", !!init.result?.capabilities?.tools);
  check("initialize ships instructions", (init.result?.instructions ?? "").includes("validate_content"));
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  const list = await rpc("tools/list", {});
  const names = (list.result?.tools ?? []).map((t) => t.name).sort();
  const expected = ["get_authoring_guide", "get_topic", "list_domains", "list_topics", "scaffold_topic", "search", "validate_content"];
  check("tools/list exposes the 7 tools", JSON.stringify(names) === JSON.stringify(expected), names.join(","));

  const domainsText = txt(await tool("list_domains", {}));
  check("list_domains lists every domain", ["appsec", "cloudsec", "ai-agents", "secops", "seceng"].every((d) => domainsText.includes(d)));
  check("get_topic returns Markdown", txt(await tool("get_topic", { domain: "secops", slug: "waf" })).startsWith("# "));
  check("get_topic unknown slug is an error", (await tool("get_topic", { domain: "secops", slug: "nope" })).result?.isError === true);
  check("search finds a topic", txt(await tool("search", { query: "rate limiting" })).includes("secops/rate-limiting"));
  check("authoring guide is returned", txt(await tool("get_authoring_guide", {})).includes("Como contribuir"));

  const v = await tool("validate_content", {});
  check("validate_content passes on a clean tree", !v.result?.isError && txt(v).includes("content integrity OK"), txt(v).slice(-200));

  const base = { title: "t", short: "s", tagline: "g", kind: "tecnica" };
  const refused = async (label, args) => {
    const r = await tool("scaffold_topic", { ...base, ...args });
    check(`scaffold_topic refuses: ${label}`, r.result?.isError === true, txt(r).slice(0, 120));
  };
  await refused("unknown domain / path traversal in domain", { domain: "../etc", slug: "x" });
  await refused("path traversal in slug", { domain: "secops", slug: "../../../evil" });
  await refused("uppercase slug", { domain: "secops", slug: "Evil" });
  await refused("existing topic", { domain: "secops", slug: "waf" });
  await refused("unknown stage", { domain: "secops", slug: "novo-ok", stage: "xxx" });
  await refused("invalid kind", { domain: "secops", slug: "novo-ok", kind: "x" });

  check("unknown method returns -32601", (await rpc("foo/bar", {})).error?.code === -32601);
  check("stdout carries protocol messages only", strayStdout === 0, `${strayStdout} stray lines`);
} catch (e) {
  console.error("smoke test crashed:", e instanceof Error ? e.message : e);
  failures++;
} finally {
  child.stdin.end();
}

console.log(failures === 0 ? "\nMCP smoke test: OK" : `\nMCP smoke test: ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
