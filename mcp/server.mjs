#!/usr/bin/env node
// appsec/kb MCP server: lets a coding agent read, search, validate and extend
// the knowledge base with the same guardrails a human contributor has.
//
// Zero dependencies. Speaks MCP over stdio (newline-delimited JSON-RPC 2.0).
// stdout carries protocol messages ONLY; diagnostics go to stderr.
//
// Run from the repository root:
//   node --import ./scripts/content-alias-loader.mjs mcp/server.mjs
//
// Tools (all local; only `scaffold_topic` writes, and only a new file under
// src/content/<domain>/topics/):
//   list_domains, list_topics, get_topic, search, get_authoring_guide,
//   validate_content, scaffold_topic

import { createInterface } from "node:readline";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { domains, getTopic, relationsOf } from "@/content/registry";
import { getQuiz } from "@/content/quiz";
import { bridgesOf } from "@/content/bridges";
import { LOCALES } from "@/i18n/config";
import { localizeDomain, localizedTopic } from "@/i18n/content";

// Optional `locale` (en | pt | es) on the read tools. Untranslated text falls back to the source language.
const LOCALE_PROP = { type: "string", enum: [...LOCALES], description: "language of the returned text (en, pt or es); default: the source language" };
const localeOk = (l) => l === undefined || LOCALES.includes(l);
const topicsOf = (d, locale) => (locale ? localizeDomain(d.id, locale).domain.topics : d.topics);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));

const SUPPORTED = ["2025-06-18", "2025-03-26", "2024-11-05"];
const KINDS = ["tecnica", "pratica", "conceito"];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const INSTRUCTIONS =
  "appsec/kb: a validated, multi-domain security knowledge base. Read with list_domains/list_topics/get_topic/search. " +
  "Before writing content call get_authoring_guide. After ANY change run validate_content; the build fails if it does not pass. " +
  "scaffold_topic only creates a skeleton: you must still register the topic in the domain index, position it on the map, " +
  "add relations, a pipeline entry and a quiz (see the guide). Never invent sources: every non-obvious claim needs a primary source.";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const text = (t, isError = false) => ({ content: [{ type: "text", text: t }], ...(isError ? { isError: true } : {}) });
const fail = (t) => text(t, true);

function domainOrError(id) {
  const d = domains[id];
  return d ? { d } : { err: fail(`Unknown domain "${id}". Valid: ${Object.keys(domains).join(", ")}`) };
}

function topicToMarkdown(domainId, slug, locale) {
  const t = locale ? localizedTopic(domainId, slug, locale) : getTopic({ domain: domainId, slug });
  if (!t) return null;
  const out = [`# ${t.title}`, "", `> ${t.tagline}`, "", `- domínio: ${domainId} · tipo: ${t.kind} · etapa: ${t.stage ?? "(camada transversal)"}`, `- ferramentas: ${t.tools.join(", ")}`, ""];
  for (const s of t.sections) {
    out.push(`## ${s.heading}`, "");
    for (const p of s.body ?? []) out.push(p, "");
    for (const b of s.bullets ?? []) out.push(`- ${b}`);
    if (s.bullets?.length) out.push("");
    for (const c of s.code ?? []) out.push("```" + c.language, `// ${c.filename ?? ""}`.trim(), c.code, "```", "");
  }
  const rels = relationsOf({ domain: domainId, slug });
  if (rels.length) {
    out.push("## Relações", "");
    for (const r of rels) out.push(`- ${r.source.slug} —${r.label}→ ${r.target.slug}`);
    out.push("");
  }
  const bridges = bridgesOf({ domain: domainId, slug });
  if (bridges.length) {
    out.push("## Pontes entre domínios", "");
    for (const b of bridges) out.push(`- ${b.other.domain}/${b.other.slug}: ${b.label}`);
    out.push("");
  }
  out.push(`Quiz: ${getQuiz(domainId, slug).length} perguntas.`);
  return out.join("\n");
}

function authoringGuide() {
  const contributing = readFileSync(resolve(ROOT, "CONTRIBUTING.md"), "utf8");
  const readme = readFileSync(resolve(ROOT, "README.md"), "utf8");
  const a = readme.indexOf("## Adicionando um tópico");
  const b = readme.indexOf("## Comandos", a);
  const steps = a >= 0 ? readme.slice(a, b > a ? b : undefined) : "(seção não encontrada)";
  return `${contributing}\n\n---\n\n${steps}`;
}

function skeleton({ domain, slug, title, short, tagline, kind, stage }) {
  const ident = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  const j = (v) => JSON.stringify(v);
  return `import type { Topic } from "@/content/types";

// TODO(author): replace every placeholder below. The validator only checks
// structure (R6 floor); accuracy, sources and quality are on you.
export const ${/^[0-9]/.test(ident) ? "t" + ident : ident}: Topic = {
  domain: ${j(domain)},
  slug: ${j(slug)},
  title: ${j(title)},
  short: ${j(short)},
  tagline: ${j(tagline)},
  kind: ${j(kind)},
  stage: ${stage === null ? "null" : j(stage)},
  tools: ["TODO ferramenta 1", "TODO ferramenta 2", "TODO ferramenta 3"],
  sections: [
    { heading: "O que é", body: ["TODO: definição clara, sem jargão desnecessário."] },
    { heading: "TODO seção 2", body: ["TODO"], bullets: ["TODO", "TODO", "TODO"] },
    { heading: "TODO seção 3", body: ["TODO"] },
    { heading: "TODO seção 4", body: ["TODO"] },
  ],
};
`;
}

// ---------------------------------------------------------------------------
// tool definitions
// ---------------------------------------------------------------------------
const tools = [
  {
    name: "list_domains",
    description: "List every domain with route, status, topic count and pipeline stage ids.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: () =>
      text(
        Object.values(domains)
          .map((d) => `${d.id}  ${d.route}  ${d.status}  ${d.topics.length} tópicos  etapas: ${d.pipeline.map((s) => s.id).join(", ")}`)
          .join("\n"),
      ),
  },
  {
    name: "list_topics",
    description: "List topics (slug, title, kind, stage, one-line summary), optionally for one domain.",
    inputSchema: { type: "object", properties: { domain: { type: "string", description: "domain id, e.g. secops" }, locale: LOCALE_PROP }, additionalProperties: false },
    run: ({ domain, locale }) => {
      if (!localeOk(locale)) return fail(`Unknown locale "${locale}". Valid: ${LOCALES.join(", ")}`);
      const list = domain ? (domains[domain] ? [domains[domain]] : null) : Object.values(domains);
      if (!list) return fail(`Unknown domain "${domain}". Valid: ${Object.keys(domains).join(", ")}`);
      return text(list.flatMap((d) => topicsOf(d, locale).map((t) => `${d.id}/${t.slug} [${t.kind}${t.stage ? ", " + t.stage : ""}] ${t.title}: ${t.short}`)).join("\n"));
    },
  },
  {
    name: "get_topic",
    description: "Return a topic as Markdown: sections, code samples, relations, cross-domain bridges and quiz size.",
    inputSchema: {
      type: "object",
      properties: { domain: { type: "string" }, slug: { type: "string" }, locale: LOCALE_PROP },
      required: ["domain", "slug"],
      additionalProperties: false,
    },
    run: ({ domain, slug, locale }) => {
      if (!localeOk(locale)) return fail(`Unknown locale "${locale}". Valid: ${LOCALES.join(", ")}`);
      const { err } = domainOrError(domain);
      if (err) return err;
      const md = topicToMarkdown(domain, slug, locale);
      return md ? text(md) : fail(`No topic "${slug}" in domain "${domain}".`);
    },
  },
  {
    name: "search",
    description: "Search topics by title, summary, tools and body text. Returns the best matches.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 25, default: 8 }, locale: LOCALE_PROP },
      required: ["query"],
      additionalProperties: false,
    },
    run: ({ query, limit = 8, locale }) => {
      if (!localeOk(locale)) return fail(`Unknown locale "${locale}". Valid: ${LOCALES.join(", ")}`);
      const tokens = norm(String(query)).split(/\s+/).filter(Boolean);
      if (!tokens.length) return fail("Empty query.");
      const scored = [];
      for (const d of Object.values(domains)) {
        for (const t of topicsOf(d, locale)) {
          const title = norm(t.title), short = norm(t.short + " " + t.tagline), tools = norm(t.tools.join(" "));
          const body = norm(t.sections.map((s) => [s.heading, ...(s.body ?? []), ...(s.bullets ?? [])].join(" ")).join(" "));
          let score = 0;
          for (const k of tokens) {
            const s = title.includes(k) ? 5 : short.includes(k) ? 3 : tools.includes(k) ? 2 : body.includes(k) ? 1 : 0;
            if (!s) { score = 0; break; }
            score += s;
          }
          if (score) scored.push({ score, line: `${d.id}/${t.slug}  ${t.title}: ${t.short}` });
        }
      }
      scored.sort((a, b) => b.score - a.score);
      return text(scored.slice(0, limit).map((r) => r.line).join("\n") || "Nada encontrado.");
    },
  },
  {
    name: "get_authoring_guide",
    description: "Return CONTRIBUTING.md plus the step-by-step 'Adicionando um tópico' guide. Read this before writing content.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: () => text(authoringGuide()),
  },
  {
    name: "validate_content",
    description: "Run the content validator (rules R1-R9). Returns the report; isError is true if any rule fails. Run after every change.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: () => {
      const r = spawnSync(process.execPath, ["--import", "./scripts/content-alias-loader.mjs", "scripts/validate-content.mjs"], {
        cwd: ROOT,
        encoding: "utf8",
        timeout: 120000,
      });
      const out = strip(`${r.stdout ?? ""}${r.stderr ? "\n" + r.stderr.split("\n").filter((l) => !/ExperimentalWarning|--trace-warnings|MODULE_TYPELESS|Reparsing|overhead|"type": "module"/.test(l)).join("\n") : ""}`).trim();
      return text(out || "(sem saída)", r.status !== 0);
    },
  },
  {
    name: "scaffold_topic",
    description:
      "Create a NEW topic skeleton at src/content/<domain>/topics/<slug>.ts (refuses to overwrite). Returns the manual steps still required " +
      "(registry import, map position, relations, pipeline item, quiz). Content placeholders are marked TODO and must be written and verified.",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string" },
        slug: { type: "string", description: "kebab-case, unique inside the domain" },
        title: { type: "string" },
        short: { type: "string", description: "one-line summary" },
        tagline: { type: "string" },
        kind: { type: "string", enum: KINDS },
        stage: { type: ["string", "null"], description: "pipeline stage id of the domain, or null for a cross-cutting layer" },
      },
      required: ["domain", "slug", "title", "short", "tagline", "kind"],
      additionalProperties: false,
    },
    run: (a) => {
      const { d, err } = domainOrError(a.domain);
      if (err) return err;
      if (!SLUG_RE.test(a.slug) || a.slug.length > 60) return fail("Invalid slug: use kebab-case [a-z0-9-], up to 60 chars.");
      if (!KINDS.includes(a.kind)) return fail(`Invalid kind. Use one of: ${KINDS.join(", ")}`);
      const stage = a.stage ?? null;
      if (stage !== null && !d.pipeline.some((s) => s.id === stage)) return fail(`Unknown stage "${stage}". Valid: ${d.pipeline.map((s) => s.id).join(", ")} (or null).`);
      if (d.topics.some((t) => t.slug === a.slug)) return fail(`Topic "${a.slug}" already exists in ${a.domain}.`);
      for (const k of ["title", "short", "tagline"]) if (typeof a[k] !== "string" || !a[k].trim() || a[k].length > 400) return fail(`"${k}" must be a non-empty string (max 400 chars).`);

      const dir = resolve(ROOT, "src", "content", a.domain, "topics");
      const file = resolve(dir, `${a.slug}.ts`);
      if (!file.startsWith(dir + sep)) return fail("Refusing to write outside the topics directory.");
      if (existsSync(file)) return fail(`File already exists: src/content/${a.domain}/topics/${a.slug}.ts`);
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, skeleton({ ...a, stage }), "utf8");

      const ident = a.slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      return text(
        `Criado: src/content/${a.domain}/topics/${a.slug}.ts\n\nPróximos passos (o validador vai falhar até concluir):\n` +
          `1. Escrever o conteúdo real e verificar cada afirmação (substituir todos os TODO).\n` +
          `2. src/content/${a.domain}/index.ts: importar { ${ident} } de "./topics/${a.slug}" e adicionar a topics: [...].\n` +
          `3. src/content/${a.domain}/graph-layout.ts: posição em conceptPositions (e conceptAttachments se houver etapa).\n` +
          `4. src/content/${a.domain}/relations.ts e pipeline.ts: relações e item da esteira.\n` +
          `5. src/content/quiz/${a.domain}.ts: >= 3 perguntas com 4 opções distintas e explain.\n` +
          `6. Opcional: ícone em src/components/topic-icon.tsx, pontes, trilha, glossário.\n` +
          `7. Rodar validate_content e depois npm run build.`,
      );
    },
  },
];

const byName = new Map(tools.map((t) => [t.name, t]));

// ---------------------------------------------------------------------------
// JSON-RPC over stdio
// ---------------------------------------------------------------------------
const send = (msg) => process.stdout.write(JSON.stringify(msg) + "\n");
const reply = (id, result) => send({ jsonrpc: "2.0", id, result });
const replyError = (id, code, message) => send({ jsonrpc: "2.0", id, error: { code, message } });

function handle(msg) {
  const { id, method, params } = msg;
  const isRequest = id !== undefined && id !== null;

  if (method === "initialize") {
    const asked = params?.protocolVersion;
    return reply(id, {
      protocolVersion: SUPPORTED.includes(asked) ? asked : SUPPORTED[0],
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "appsec-kb", version: pkg.version },
      instructions: INSTRUCTIONS,
    });
  }
  if (method === "notifications/initialized" || method?.startsWith("notifications/")) return;
  if (method === "ping") return isRequest && reply(id, {});
  if (method === "tools/list") {
    return reply(id, { tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
  }
  if (method === "tools/call") {
    const tool = byName.get(params?.name);
    if (!tool) return replyError(id, -32602, `Unknown tool: ${params?.name}`);
    try {
      return reply(id, tool.run(params?.arguments ?? {}));
    } catch (e) {
      return reply(id, fail(`Tool error: ${e instanceof Error ? e.message : String(e)}`));
    }
  }
  if (isRequest) replyError(id, -32601, `Method not found: ${method}`);
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return replyError(null, -32700, "Parse error");
  }
  try {
    handle(msg);
  } catch (e) {
    console.error("[appsec-kb-mcp] internal error:", e);
    if (msg?.id !== undefined) replyError(msg.id, -32603, "Internal error");
  }
});
rl.on("close", () => process.exit(0));
console.error(`[appsec-kb-mcp] ready (${tools.length} tools)`);
