#!/usr/bin/env node
// Tests for the translation engine: the anti-drift guarantees, in isolation
// (no repository files are read or written).   npm run test:i18n

import { applyOverlay, checkTranslation, compare, extract, hashText, looksUntranslated } from "@/i18n/engine";

let failures = 0;
const check = (name, cond, detail = "") => {
  console.log(`${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : `  ${detail}`}`);
  if (!cond) failures++;
};
const entry = (source, t) => ({ t, h: hashText(source) });

const topic = {
  slug: "waf",
  domain: "secops",
  kind: "tecnica",
  title: "Web application firewall",
  tools: ["Cloudflare WAF", "ModSecurity"],
  sections: [
    { heading: "What it is", body: ["It filters HTTP traffic.", "It does not fix the app."], bullets: ["negative model", "positive model"] },
    { heading: "Example", code: [{ language: "text", filename: "rules", code: "# observe\nlog\n# enforce\nblock" }] },
  ],
};

// --- extraction -------------------------------------------------------------
const s = extract(topic);
check("extract: prose is translatable", s["title"] === "Web application firewall" && s["sections.0.body.1"] === "It does not fix the app.");
check("extract: ids, enums, tool names and languages are not", !("slug" in s) && !("domain" in s) && !("kind" in s) && !Object.keys(s).some((k) => k.startsWith("tools.")) && !("sections.1.code.0.language" in s));
check("extract: code and filename are translatable text", "sections.1.code.0.code" in s && "sections.1.code.0.filename" in s);

// --- fresh translation is applied, everything else falls back ---------------
const overlay = {
  title: entry(s.title, "Firewall de aplicações web"),
  "sections.0.heading": entry(s["sections.0.heading"], "O que é"),
};
const { value, report } = applyOverlay(topic, overlay);
check("apply: translated strings replace the source", value.title === "Firewall de aplicações web" && value.sections[0].heading === "O que é");
check("apply: untranslated strings fall back to the source", value.sections[0].body[0] === "It filters HTTP traffic.");
check("apply: non-text fields are untouched", value.slug === "waf" && value.tools[1] === "ModSecurity");
check("apply: the source object is not mutated", topic.title === "Web application firewall");
check("report: counts", report.ok === 2 && report.stale.length === 0 && report.missing.length === report.total - 2);

// --- DRIFT: the source changes after the translation was made ---------------
const edited = structuredClone(topic);
edited.title = "Web Application Firewall (WAF)";
const drift = applyOverlay(edited, overlay);
check("drift: a changed source string is reported stale", drift.report.stale.length === 1 && drift.report.stale[0] === "title");
check("drift: stale text is never shown, the new source is", drift.value.title === "Web Application Firewall (WAF)");
check("drift: other translations stay valid", drift.value.sections[0].heading === "O que é" && drift.report.ok === 1);

// --- structure changes ------------------------------------------------------
const removed = structuredClone(topic);
removed.sections[0].body.pop();
check("orphans: a removed source string leaves an orphan key", compare(removed, { ...overlay, "sections.0.body.1": entry("x", "y") }).orphans.includes("sections.0.body.1"));

// --- translation quality gates ----------------------------------------------
check("gate: placeholders must match", checkTranslation("t", "Hello {name}", "Hola") !== null);
check("gate: placeholders that match pass", checkTranslation("t", "Hello {name}", "Hola {name}") === null);
check("gate: html-like tags must match", checkTranslation("t", "Use <code>x</code>", "Usa x") !== null);
check("gate: empty translations are rejected", checkTranslation("t", "Hello", "  ") !== null);
check("gate: a code sample must keep its number of lines", checkTranslation("sections.1.code.0.code", "a\nb\nc", "a\nb") !== null);
check("gate: translated code comments pass", checkTranslation("sections.1.code.0.code", "# observe\nlog", "# observar\nlog") === null);
check("gate: pasted-back long prose is flagged", looksUntranslated("This sentence is long enough to count as prose, so copying it is wrong.", "This sentence is long enough to count as prose, so copying it is wrong."));
check("gate: short strings may legitimately be identical", !looksUntranslated("sec/atlas", "sec/atlas"));

// --- hashing ------------------------------------------------------------------
check("hash: stable and sensitive to a one-character change", hashText("abc") === hashText("abc") && hashText("abc") !== hashText("abd"));

console.log(failures === 0 ? "\ni18n engine tests: OK" : `\ni18n engine tests: ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
