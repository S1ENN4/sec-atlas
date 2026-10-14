#!/usr/bin/env node
// Editorial audit of the content. Unlike validate-content (structure, a build gate),
// this looks for quality problems a reviewer should read: broken code samples,
// placeholder text, secret-looking strings, weak quiz questions, inconsistent
// naming, untranslated or English-leaking translations, and dead source links.
//
//   npm run audit            offline checks
//   npm run audit -- --net   also checks every source URL
//   npm run audit -- --json  machine-readable output
//
// Exit code is 1 only when an "error" finding exists; warnings are for humans.

import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { domains } from "@/content/registry";
import { quizzes } from "@/content/quiz";
import { sources } from "@/content/sources";

const args = new Set(process.argv.slice(2));
const TMP = mkdtempSync(join(tmpdir(), "atlas-audit-"));
let counter = 0;
const findings = [];
const add = (level, area, where, message) => findings.push({ level, area, where, message });

const allTopics = Object.values(domains).flatMap((d) => d.topics.map((t) => ({ d, t })));

// --- topics --------------------------------------------------------------------
// Case-sensitive on purpose: "todo" is an ordinary Portuguese word.
const PLACEHOLDER = /\b(TODO|TBD|FIXME|XXX)\b|lorem ipsum|\[citation needed\]|\bcoming soon\b/;
const NAMING = [
  [/\bGithub\b/, "GitHub"],
  [/\bGitlab\b/, "GitLab"],
  [/\bJavascript\b/, "JavaScript"],
  [/\bTypescript\b/, "TypeScript"],
  [/\bOwasp\b/, "OWASP"],
  [/\bKubernets\b|\bKuberentes\b/, "Kubernetes"],
  [/\bDocker-compose\b/, "Docker Compose"],
  [/\bPostgresql\b/, "PostgreSQL"],
  [/\bMitre\b/, "MITRE"],
  [/\bOauth\b/, "OAuth"],
  [/\bsql injection\b/, "SQL injection"],
  [/\bci\/cd\b/, "CI/CD"],
];
const FAKE_OK = /EXAMPLE|example|xxxx|XXXX|\.\.\.|<[^>]+>|changeme|change-me|your[-_ ]|dummy|fake|redacted|not-a-real|1234567890|hunter2/i;
const SECRET = [
  [/AKIA[0-9A-Z]{16}/g, "AWS access key id"],
  [/ghp_[A-Za-z0-9]{30,}/g, "GitHub token"],
  [/sk_live_[A-Za-z0-9]{10,}/g, "Stripe live key"],
  [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g, "private key block"],
  [/xox[abp]-[A-Za-z0-9-]{10,}/g, "Slack token"],
];

function checkCode(where, sample) {
  const { language: lang = "", code } = sample;
  if (!lang) add("warning", "code", where, "code sample has no language");
  if (!code.trim()) add("error", "code", where, "empty code sample");
  if (/\t/.test(code) && /^ya?ml$/i.test(lang)) add("error", "code", where, "tab in YAML (YAML forbids tabs)");
  for (const [re, label] of SECRET) {
    for (const m of code.matchAll(re)) if (!FAKE_OK.test(m[0]) && !FAKE_OK.test(code.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30))) add("error", "secret", where, `${label}-shaped string: ${m[0].slice(0, 12)}...`);
  }
  if (/\bcurl\b[^\n|]*\|\s*(sudo\s+)?(ba)?sh\b/.test(code) || /\bchmod\s+(-R\s+)?777\b/.test(code)) add("warning", "code", where, "risky command in a sample (curl|sh or chmod 777): make sure it is framed as an anti-pattern");

  const l = lang.toLowerCase();
  if (l === "json") {
    try {
      JSON.parse(code);
    } catch (e) {
      add("warning", "code", where, `JSON does not parse (${String(e.message).slice(0, 50)}); fine if it is a fragment, otherwise fix`);
    }
  } else if (["js", "javascript", "mjs"].includes(l)) {
    // Syntax only, through Node itself. TypeScript and JSX are not checked (node --check cannot parse them).
    const isTs = l.startsWith("t");
    const ok = (ext) => {
      const file = join(TMP, `sample-${++counter}.${ext}`);
      writeFileSync(file, code);
      return spawnSync(process.execPath, ["--experimental-strip-types", "--check", file], { encoding: "utf8" });
    };
    const variants = isTs ? ["mts", "cts"] : ["mjs", "cjs"];
    const results = variants.map(ok);
    if (results.every((r) => r.status !== 0)) {
      const msg = (results[0].stderr || "").split("\n").find((x) => /Error/.test(x)) ?? "syntax error";
      add("warning", "code", where, `${lang} syntax: ${msg.slice(0, 90)}`);
    }
  } else if (l === "python" || l === "py") {
    const r = spawnSync("python", ["-I", "-c", "import ast,sys; ast.parse(sys.stdin.read())"], { input: code, encoding: "utf8" });
    if (r.status !== 0) add("warning", "code", where, `python syntax: ${(r.stderr || "").trim().split("\n").pop()?.slice(0, 80)}`);
  } else if (["bash", "sh", "shell"].includes(l)) {
    const r = spawnSync("bash", ["-n"], { input: code, encoding: "utf8" });
    if (r.status !== 0) add("warning", "code", where, `bash syntax: ${(r.stderr || "").trim().split("\n")[0]?.slice(0, 80)}`);
  }
}

for (const { d, t } of allTopics) {
  const id = `${d.id}/${t.slug}`;
  const seen = new Map();
  const text = (s, where) => {
    if (!s) return;
    if (PLACEHOLDER.test(s)) add("error", "placeholder", `${id} ${where}`, `placeholder text: "${s.match(PLACEHOLDER)[0]}"`);
    if (/ {2,}|\s$|^\s/.test(s)) add("warning", "style", `${id} ${where}`, "extra whitespace");
    for (const [re, good] of NAMING) if (re.test(s)) add("warning", "naming", `${id} ${where}`, `write "${good}"`);
  };
  text(t.title, "title");
  text(t.tagline, "tagline");
  text(t.short, "short");
  if (t.tagline.length > 320) add("warning", "style", id, `tagline is long (${t.tagline.length} characters)`);
  t.sections.forEach((s, i) => {
    text(s.heading, `section ${i}`);
    (s.body ?? []).forEach((p, j) => text(p, `section ${i} body ${j}`));
    (s.bullets ?? []).forEach((b, j) => {
      text(b, `section ${i} bullet ${j}`);
      const key = b.trim().toLowerCase();
      if (seen.has(key)) add("warning", "style", id, `duplicate bullet: "${b.slice(0, 50)}..."`);
      seen.set(key, 1);
      if (b.length > 420) add("warning", "style", `${id} section ${i} bullet ${j}`, `very long bullet (${b.length} characters): split it`);
    });
    (s.code ?? []).forEach((c, j) => checkCode(`${id} section ${i} code ${j}`, c));
  });
}

// --- quizzes -------------------------------------------------------------------
const byDomain = {};
for (const [domainId, bank] of Object.entries(quizzes)) {
  for (const [slug, qs] of Object.entries(bank)) {
    qs.forEach((q, i) => {
      const where = `quiz ${domainId}/${slug} #${i + 1}`;
      if (q.answer < 0 || q.answer >= q.options.length) add("error", "quiz", where, "answer index is out of range");
      if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== q.options.length) add("error", "quiz", where, "duplicate options");
      if (q.options.length < 3) add("warning", "quiz", where, "fewer than 3 options");
      if (!q.explain?.trim()) add("error", "quiz", where, "no explanation");
      if (PLACEHOLDER.test(q.q + q.explain + q.options.join(" "))) add("error", "placeholder", where, "placeholder text");
      const longest = q.options.reduce((m, o, k) => (o.length > q.options[m].length ? k : m), 0);
      const b = (byDomain[domainId] ??= { n: 0, longest: 0, first: 0 });
      b.n++;
      if (longest === q.answer && q.options[q.answer].length > 1.4 * (q.options.reduce((s, o) => s + o.length, 0) / q.options.length)) b.longest++;
      if (q.answer === 0) b.first++;
    });
  }
}
for (const [dom, b] of Object.entries(byDomain)) {
  if (b.n >= 8 && b.longest / b.n > 0.45) add("warning", "quiz", dom, `${Math.round((100 * b.longest) / b.n)}% of correct answers are clearly the longest option (a giveaway)`);
}

// --- glossary ------------------------------------------------------------------
const terms = new Map();
for (const d of Object.values(domains)) {
  for (const g of d.glossary) {
    for (const e of g.entries) {
      if (!e.meaning?.trim()) add("error", "glossary", `${d.id}: ${e.term}`, "empty meaning");
      const k = e.term.trim().toLowerCase();
      if (terms.has(k) && terms.get(k).meaning !== e.meaning) add("warning", "glossary", `${d.id}: ${e.term}`, `also defined in ${terms.get(k).dom} with different wording; keep them consistent`);
      else terms.set(k, { dom: d.id, meaning: e.meaning });
    }
  }
}

// --- translations --------------------------------------------------------------
const EN_STOP = /\b(the|and|with|your|you|that|this|from|which|when|are|for)\b/gi;
function overlayFiles(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...overlayFiles(p));
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}
for (const loc of ["pt", "es"]) {
  let leaks = 0;
  for (const f of overlayFiles(join(process.cwd(), "src/content/i18n", loc))) {
    const data = JSON.parse(readFileSync(f, "utf8"));
    for (const [key, v] of Object.entries(data)) {
      const tt = v?.t;
      if (typeof tt !== "string" || tt.length < 40) continue;
      const stops = (tt.match(EN_STOP) ?? []).length;
      const words = tt.split(/\s+/).length;
      if (stops >= 4 && stops / words > 0.12 && !/[{}();=]/.test(tt)) {
        leaks++;
        if (leaks <= 25) add("warning", "i18n", `${loc} ${f.split(/[\\/]i18n[\\/]/)[1]} ${key}`, `looks untranslated (English words: ${stops}/${words})`);
      }
    }
  }
  if (leaks > 25) add("warning", "i18n", loc, `${leaks - 25} more translations look untranslated`);
}

// --- source links --------------------------------------------------------------
const urls = [];
for (const [dom, list] of Object.entries(sources)) for (const s of list) urls.push({ dom, label: s.label, url: s.href });
for (const u of urls) {
  try {
    const parsed = new URL(u.url);
    if (parsed.protocol !== "https:") add("warning", "source", `${u.dom}: ${u.label}`, `not https: ${u.url}`);
  } catch {
    add("error", "source", `${u.dom}: ${u.label}`, `invalid URL: ${u.url}`);
  }
}
if (args.has("--net")) {
  const probe = async (u) => {
    for (const method of ["HEAD", "GET"]) {
      try {
        const res = await fetch(u.url, { method, redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "sec-atlas-audit/1.0 (+https://atlas.rinngs.com)" } });
        if (res.status < 400) return null;
        if (method === "GET" || ![403, 405, 501].includes(res.status)) return `HTTP ${res.status}`;
      } catch (e) {
        if (method === "GET") return String(e.cause?.code ?? e.message).slice(0, 40);
      }
    }
    return null;
  };
  const queue = [...urls];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (let u = queue.shift(); u; u = queue.shift()) {
        const bad = await probe(u);
        if (bad) add(bad.startsWith("HTTP 4") && bad !== "HTTP 403" && bad !== "HTTP 429" ? "error" : "warning", "source", `${u.dom}: ${u.label}`, `${bad} ${u.url}`);
      }
    }),
  );
}

// --- report --------------------------------------------------------------------
const order = { error: 0, warning: 1 };
findings.sort((a, b) => order[a.level] - order[b.level] || a.area.localeCompare(b.area));
if (args.has("--json")) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  const counts = {};
  for (const f of findings) counts[`${f.level}/${f.area}`] = (counts[`${f.level}/${f.area}`] ?? 0) + 1;
  for (const f of findings) console.log(`${f.level === "error" ? "ERROR" : "warn "} [${f.area}] ${f.where}: ${f.message}`);
  console.log(`\n${allTopics.length} topics, ${Object.values(quizzes).reduce((n, b) => n + Object.values(b).reduce((m, q) => m + q.length, 0), 0)} quiz questions, ${urls.length} sources audited.`);
  console.log(Object.keys(counts).length ? `Findings: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}` : "No findings.");
}
process.exit(findings.some((f) => f.level === "error") ? 1 : 0);
