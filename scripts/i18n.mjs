#!/usr/bin/env node
// i18n tooling. Run through npm:   npm run i18n -- <command> [options]
//
//   status [--locale es] [--group appsec]     coverage and drift per group/locale
//   pending <locale> [--unit ID] [--group G] [--limit N]
//                                             strings that still need a translation (JSON)
//   apply <file.json>                         write translations (hashes are computed here)
//   prune [--locale L] [--unit ID]            delete stale + orphan entries (explicit in the diff)
//   keep  --unit ID --locale L [--keys a,b]   confirm stale entries still mean the same
//                                             (typo fixes). Without --keys: every stale key.
//
// `apply` input:  { "locale": "es", "unit": "topic:secops/waf", "entries": { "title": "..." } }
// (or an array of those). Keys must exist in the unit's source; placeholders and
// code-line counts must match; a translation equal to the source is rejected.

import { readFileSync } from "node:fs";

import { LOCALES } from "@/i18n/config";
import { allUnits, auditUnit } from "@/i18n/audit";
import { checkTranslation, extract, hashText, isCodeKey, looksUntranslated } from "@/i18n/engine";
import { readOverlay, writeOverlay } from "@/i18n/store";

const [cmd, ...rest] = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith("--")) {
    const k = rest[i].slice(2);
    const v = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : true;
    flags[k] = v;
  } else positional.push(rest[i]);
}

const units = allUnits();
const byId = new Map(units.map((u) => [u.id, u]));
const pct = (a, b) => (b === 0 ? "100%" : `${Math.round((a / b) * 100)}%`.padStart(4));
const die = (m) => {
  console.error(m);
  process.exit(1);
};
const needLocale = (l) => (LOCALES.includes(l) ? l : die(`Unknown locale "${l}". Use: ${LOCALES.join(", ")}`));

function status() {
  const locales = flags.locale ? [needLocale(flags.locale)] : LOCALES;
  for (const locale of locales) {
    const groups = new Map();
    for (const u of units) {
      if (u.lang === locale) continue;
      if (flags.group && u.group !== flags.group) continue;
      const a = auditUnit(u, locale);
      const g = groups.get(u.group) ?? { total: 0, ok: 0, stale: 0, missing: 0, errors: 0 };
      g.total += a.report.total;
      g.ok += a.report.ok;
      g.stale += a.report.stale.length;
      g.missing += a.report.missing.length;
      g.errors += a.errors.length;
      groups.set(u.group, g);
    }
    console.log(`\n${locale.toUpperCase()}  (units authored in ${locale} are skipped)`);
    console.log("  group       translated   stale  missing  problems");
    let T = 0, O = 0;
    for (const [name, g] of groups) {
      T += g.total;
      O += g.ok;
      console.log(`  ${name.padEnd(11)} ${pct(g.ok, g.total)} ${String(g.ok).padStart(6)}/${String(g.total).padEnd(6)} ${String(g.stale).padStart(5)} ${String(g.missing).padStart(8)} ${String(g.errors).padStart(9)}`);
    }
    console.log(`  ${"TOTAL".padEnd(11)} ${pct(O, T)} ${String(O).padStart(6)}/${String(T).padEnd(6)}`);
  }
}

function pending() {
  const locale = needLocale(positional[0] ?? die("usage: pending <locale> [--unit ID] [--group G] [--limit N]"));
  const limit = Number(flags.limit ?? 40);
  const items = [];
  for (const u of units) {
    if (u.lang === locale) continue;
    if (flags.unit && u.id !== flags.unit) continue;
    if (flags.group && u.group !== flags.group) continue;
    const a = auditUnit(u, locale);
    const src = extract(u.source);
    for (const key of [...a.report.stale, ...a.report.missing]) {
      items.push({ unit: u.id, key, kind: a.report.stale.includes(key) ? "stale" : "missing", sourceLang: u.lang, source: src[key] });
      if (items.length >= limit) break;
    }
    if (items.length >= limit) break;
  }
  console.log(JSON.stringify({ locale, count: items.length, items }, null, 2));
}

function apply() {
  const file = positional[0] ?? die("usage: apply <file.json>");
  const input = JSON.parse(readFileSync(file, "utf8"));
  let written = 0;
  for (const batch of Array.isArray(input) ? input : [input]) {
    const locale = needLocale(batch.locale);
    const unit = byId.get(batch.unit) ?? die(`Unknown unit "${batch.unit}"`);
    if (unit.lang === locale) die(`${unit.id} is authored in ${locale}: it cannot be translated into itself`);
    const src = extract(unit.source);
    const overlay = { ...(readOverlay(locale, unit.id) ?? {}) };
    for (const [key, text] of Object.entries(batch.entries ?? {})) {
      if (!(key in src)) die(`${unit.id}: key "${key}" is not in the source`);
      const problem = checkTranslation(key, src[key], text);
      if (problem) die(`${unit.id} ${locale} ${key}: ${problem}`);
      if (!isCodeKey(key) && looksUntranslated(src[key], text)) die(`${unit.id} ${locale} ${key}: identical to the source: translate it`);
      overlay[key] = { t: text, h: hashText(src[key]) };
      written++;
    }
    writeOverlay(locale, unit.id, overlay);
  }
  console.log(`wrote ${written} translation(s)`);
}

function prune() {
  let removed = 0;
  for (const locale of flags.locale ? [needLocale(flags.locale)] : LOCALES) {
    for (const u of units) {
      if (u.lang === locale || (flags.unit && u.id !== flags.unit)) continue;
      const a = auditUnit(u, locale);
      const drop = new Set([...a.report.stale, ...a.report.orphans]);
      if (!drop.size || !a.overlay) continue;
      const kept = Object.fromEntries(Object.entries(a.overlay).filter(([k]) => !drop.has(k)));
      writeOverlay(locale, u.id, kept);
      removed += drop.size;
      console.log(`pruned ${drop.size} from ${locale} ${u.id}`);
    }
  }
  console.log(`removed ${removed} stale/orphan entr${removed === 1 ? "y" : "ies"}`);
}

function keep() {
  const unit = byId.get(flags.unit) ?? die("usage: keep --unit ID --locale L [--keys a,b]");
  const locale = needLocale(flags.locale);
  const a = auditUnit(unit, locale);
  const src = extract(unit.source);
  const keys = flags.keys ? String(flags.keys).split(",") : a.report.stale;
  const overlay = { ...(a.overlay ?? {}) };
  for (const k of keys) {
    if (!a.report.stale.includes(k)) die(`"${k}" is not stale in ${unit.id} (${locale})`);
    overlay[k] = { ...overlay[k], h: hashText(src[k]) };
  }
  writeOverlay(locale, unit.id, overlay);
  console.log(`confirmed ${keys.length} entr${keys.length === 1 ? "y" : "ies"} in ${locale} ${unit.id}: only do this when the meaning did not change`);
}

const commands = { status, pending, apply, prune, keep };
(commands[cmd] ?? (() => die(`usage: npm run i18n -- <${Object.keys(commands).join("|")}> [options]`)))();
