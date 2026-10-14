#!/usr/bin/env node
// Maintenance tool for the quiz banks (editorial work, not part of the build).
//
//   dump  <domain> <dir>            write <dir>/<domain>.json with every question
//   apply <domain> <dir>            read <dir>/<domain>.new.json, check it, rewrite src/content/quiz/<domain>.ts
//                                   and write <dir>/<domain>.i18n.<locale>.json batches for the translations
//
// <domain>.new.json: { "<slug>": [ [opt0, opt1, opt2, opt3], ... ] } in the domain's source language, with
// `null` where an option stays as it is (the correct answer is never changed). Translations go in
// <dir>/<domain>.<locale>.json with the same shape, `null` for unchanged options.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { quizzes } from "@/content/quiz";
import { domains } from "@/content/registry";

const [cmd, domain, dir] = process.argv.slice(2);
if (!cmd || !domain || !dir) {
  console.error("usage: quiz-tool.mjs dump|apply <domain> <dir>");
  process.exit(2);
}
const bank = quizzes[domain];
if (!bank) throw new Error(`unknown domain ${domain}`);

const VAR = { appsec: "appsecQuiz", cloudsec: "cloudsecQuiz", "ai-agents": "aiAgentsQuiz", secops: "secopsQuiz", seceng: "secengQuiz", owasp: "owaspQuiz", vibecoding: "vibecodingQuiz", devops: "devopsQuiz", response: "responseQuiz", offsec: "offsecQuiz", grc: "grcQuiz" };
const sourceLang = domains[domain].contentLang === "pt" ? "pt" : "en";
const others = ["en", "pt", "es"].filter((l) => l !== sourceLang);

if (cmd === "dump") {
  const out = {};
  for (const [slug, qs] of Object.entries(bank)) out[slug] = qs.map((q) => ({ q: q.q, options: q.options, answer: q.answer, explain: q.explain }));
  writeFileSync(join(dir, `${domain}.json`), JSON.stringify(out, null, 1));
  console.log(`dumped ${Object.values(out).reduce((n, a) => n + a.length, 0)} questions (source language: ${sourceLang})`);
}

if (cmd === "apply") {
  const next = JSON.parse(readFileSync(join(dir, `${domain}.new.json`), "utf8"));
  const problems = [];
  const merged = {};
  for (const [slug, qs] of Object.entries(bank)) {
    const edits = next[slug];
    if (!edits || edits.length !== qs.length) {
      problems.push(`${slug}: expected ${qs.length} questions, got ${edits?.length}`);
      continue;
    }
    merged[slug] = qs.map((q, i) => {
      const e = edits[i];
      if (e.length !== q.options.length) problems.push(`${slug} #${i + 1}: ${e.length} options instead of ${q.options.length}`);
      if (e[q.answer] !== null) problems.push(`${slug} #${i + 1}: the correct option (index ${q.answer}) must stay null/unchanged`);
      const options = q.options.map((o, k) => (e[k] === null || e[k] === undefined ? o : e[k]));
      if (new Set(options.map((o) => o.trim().toLowerCase())).size !== options.length) problems.push(`${slug} #${i + 1}: duplicate options`);
      return { ...q, options };
    });
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }

  // rewrite the TypeScript bank
  const lines = [`import type { QuizBank } from "@/content/types";`, "", `export const ${VAR[domain]}: QuizBank = ${JSON.stringify(merged, null, 2)};`, ""];
  writeFileSync(join(process.cwd(), "src/content/quiz", `${domain}.ts`), lines.join("\n"));

  // translation batches for the changed distractors
  for (const loc of others) {
    const file = join(dir, `${domain}.${loc}.json`);
    if (!existsSync(file)) {
      console.log(`(no ${loc} translations yet: ${file})`);
      continue;
    }
    const tr = JSON.parse(readFileSync(file, "utf8"));
    const batch = [];
    for (const [slug, qs] of Object.entries(bank)) {
      const entries = {};
      qs.forEach((q, i) => {
        q.options.forEach((_, k) => {
          const changed = next[slug][i][k] !== null && next[slug][i][k] !== undefined;
          if (!changed) return;
          const t = tr[slug]?.[i]?.[k];
          if (typeof t !== "string") problems.push(`${loc} ${slug} #${i + 1} option ${k}: missing translation`);
          else entries[`questions.${i}.options.${k}`] = t;
        });
      });
      if (Object.keys(entries).length) batch.push({ locale: loc, unit: `quiz:${domain}/${slug}`, entries });
    }
    writeFileSync(join(dir, `${domain}.i18n.${loc}.json`), JSON.stringify(batch));
    console.log(`${loc}: ${batch.reduce((n, b) => n + Object.keys(b.entries).length, 0)} translations written`);
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log("quiz rewritten");
}
