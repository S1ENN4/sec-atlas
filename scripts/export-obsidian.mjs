#!/usr/bin/env node
// Export the knowledge base as an Obsidian vault of plain Markdown notes.
//
//   npm run export:obsidian                 -> vault/<locale>/ for every locale
//   npm run export:obsidian -- --locale pt  -> only one locale
//   npm run export:obsidian -- --out ~/Notes/sec-atlas
//
// The TypeScript sources stay the single source of truth (types, validation,
// translation drift checks). The vault is generated, read-only output: edit the
// sources, then export again. One note per topic, with YAML frontmatter,
// wikilinks for relations, prerequisites and cross-domain bridges, quiz
// questions as collapsed callouts, plus notes for careers, study paths and the
// glossary. Untranslated text falls back to the source language, as on the site.

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { domains } from "@/content/registry";
import { levels } from "@/content/levels";
import { sources } from "@/content/sources";
import { LOCALES } from "@/i18n/config";
import { domainLang, localizeDomain, localizeUnit, quizUnitSource } from "@/i18n/content";
import { localizedBridges, localizedPaths, localizedRoles } from "@/i18n/globals";
import { getUi } from "@/i18n/ui";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const only = flag("locale");
const outRoot = resolve(flag("out") ?? "vault");
const locales = only ? [only] : LOCALES;
if (only && !LOCALES.includes(only)) {
  console.error(`unknown locale "${only}" (use ${LOCALES.join(", ")})`);
  process.exit(1);
}

const LABELS = {
  en: { related: "Related", bridges: "Same problem, other domain", prereq: "Study first", unlocks: "Unlocks", quiz: "Quiz", answer: "Answer", sources: "Sources", map: "Map", glossary: "Glossary", careers: "Careers", paths: "Study paths", stage: "Stage", home: "Home", topics: "Topics", pipeline: "Pipeline", tools: "Tools", day: "A day in the job", study: "Study here", outside: "Learn elsewhere", build: "Build this", show: "What to show", certs: "Certifications (examples)", level: ["", "Foundations", "Practitioner", "Advanced"], generated: "Generated from sec/atlas. Edit the sources, not this note." },
  pt: { related: "Relacionados", bridges: "Mesmo problema, outro domínio", prereq: "Estude antes", unlocks: "Abre caminho para", quiz: "Quiz", answer: "Resposta", sources: "Fontes", map: "Mapa", glossary: "Glossário", careers: "Carreiras", paths: "Trilhas de estudo", stage: "Etapa", home: "Início", topics: "Tópicos", pipeline: "Esteira", tools: "Ferramentas", day: "Um dia no cargo", study: "Estude aqui", outside: "Aprenda fora", build: "Construa isto", show: "O que mostrar", certs: "Certificações (exemplos)", level: ["", "Fundamentos", "Prática", "Avançado"], generated: "Gerado a partir do sec/atlas. Edite as fontes, não esta nota." },
  es: { related: "Relacionados", bridges: "Mismo problema, otro dominio", prereq: "Estudia antes", unlocks: "Abre el camino a", quiz: "Quiz", answer: "Respuesta", sources: "Fuentes", map: "Mapa", glossary: "Glosario", careers: "Carreras", paths: "Rutas de estudio", stage: "Etapa", home: "Inicio", topics: "Temas", pipeline: "Pipeline", tools: "Herramientas", day: "Un día en el cargo", study: "Estudia aquí", outside: "Aprende fuera", build: "Construye esto", show: "Qué mostrar", certs: "Certificaciones (ejemplos)", level: ["", "Fundamentos", "Práctica", "Avanzado"], generated: "Generado desde sec/atlas. Edita las fuentes, no esta nota." },
};

const safe = (s) => s.replace(/[\\/:*?"<>|#^[\]]/g, "").replace(/\s+/g, " ").trim();
const q = (s) => JSON.stringify(s);
const yamlList = (xs) => `[${xs.map(q).join(", ")}]`;
const write = (file, text) => {
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, text.endsWith("\n") ? text : text + "\n", "utf8");
};

for (const locale of locales) {
  const L = LABELS[locale];
  const ui = getUi(locale);
  const root = join(outRoot, locale);
  rmSync(root, { recursive: true, force: true });

  // 1. localized domains, and a unique note name for every topic.
  const loc = Object.fromEntries(Object.keys(domains).map((id) => [id, localizeDomain(id, locale)]));
  const names = new Map(); // "<domain>/<slug>" -> note name
  const used = new Set();
  for (const [id, ld] of Object.entries(loc)) {
    for (const t of ld.domain.topics) {
      let name = safe(t.title);
      if (used.has(name.toLowerCase())) name = `${name} (${ui.domains[id].name})`;
      used.add(name.toLowerCase());
      names.set(`${id}/${t.slug}`, name);
    }
  }
  const link = (ref) => {
    const key = typeof ref === "string" ? ref : `${ref.domain}/${ref.slug}`;
    const n = names.get(key);
    return n ? `[[${n}]]` : key;
  };
  const folderOf = (id) => safe(ui.domains[id].name);
  const bridges = localizedBridges(locale).value;

  // 2. topic notes
  for (const [id, ld] of Object.entries(loc)) {
    const d = ld.domain;
    const dq = (slug) => localizeUnit(`quiz:${id}/${slug}`, quizUnitSource(id, slug), domainLang(domains[id]), locale).value.questions;
    for (const t of d.topics) {
      const key = `${id}/${t.slug}`;
      const lv = levels[key];
      const requires = lv?.requires ?? [];
      const unlocks = Object.entries(levels).filter(([, v]) => v.requires?.includes(key)).map(([k]) => k);
      const out = [];
      out.push("---");
      out.push(`title: ${q(t.title)}`);
      out.push(`aliases: ${yamlList([t.short])}`);
      out.push(`domain: ${id}`);
      out.push(`slug: ${t.slug}`);
      out.push(`kind: ${t.kind}`);
      if (lv) out.push(`level: ${lv.level}`);
      if (t.stage) out.push(`stage: ${t.stage}`);
      out.push(`tools: ${yamlList(t.tools)}`);
      out.push(`tags: [${["domain/" + id, "kind/" + t.kind, lv ? "level/" + lv.level : null].filter(Boolean).join(", ")}]`);
      out.push("---", "", `# ${t.title}`, "", `> ${t.tagline}`, "", `*${t.short}*`, "");
      for (const s of t.sections) {
        out.push(`## ${s.heading}`, "");
        for (const p of s.body ?? []) out.push(p, "");
        for (const b of s.bullets ?? []) out.push(`- ${b}`);
        if (s.bullets) out.push("");
        for (const c of s.code ?? []) {
          if (c.filename) out.push(`**${c.filename}**`, "");
          out.push("```" + c.language, c.code, "```", "");
        }
      }
      const rel = d.relations.filter((r) => r.source.slug === t.slug || r.target.slug === t.slug);
      if (rel.length) {
        out.push(`## ${L.related}`, "");
        for (const r of rel) {
          out.push(r.source.slug === t.slug ? `- ${r.label} → ${link(r.target)}` : `- ${link(r.source)} → ${r.label}`);
        }
        out.push("");
      }
      const br = bridges.filter((b) => key === `${b.a.domain}/${b.a.slug}` || key === `${b.b.domain}/${b.b.slug}`);
      if (br.length) {
        out.push(`## ${L.bridges}`, "");
        for (const b of br) out.push(`- ${key === `${b.a.domain}/${b.a.slug}` ? link(b.b) : link(b.a)}: ${b.label}`);
        out.push("");
      }
      if (requires.length) out.push(`## ${L.prereq}`, "", ...requires.map((r) => `- ${link(r)}`), "");
      if (unlocks.length) out.push(`## ${L.unlocks}`, "", ...unlocks.map((r) => `- ${link(r)}`), "");
      const qs = dq(t.slug);
      if (qs.length) {
        out.push(`## ${L.quiz}`, "");
        qs.forEach((x, i) => {
          out.push(`> [!question]- ${i + 1}. ${x.q}`);
          x.options.forEach((o, j) => out.push(`> - ${j === x.answer ? "**" + o + "**" : o}`));
          out.push(`> `, `> **${L.answer}:** ${x.options[x.answer]}. ${x.explain}`, "");
        });
      }
      const src = sources[id] ?? [];
      if (src.length) {
        out.push(`## ${L.sources}`, "", ...src.map((s) => `- [${s.label}](${s.href}): ${s.note}`), "");
      }
      out.push(`*${L.generated}*`);
      write(join(root, folderOf(id), `${names.get(key)}.md`), out.join("\n"));
    }

    // domain map note: pipeline with wikilinks
    const m = ui.domains[id];
    const out = ["---", `title: ${q(m.name)}`, `domain: ${id}`, "tags: [map]", "---", "", `# ${m.name}`, "", `> ${m.pitch}`, ""];
    out.push(`## ${L.pipeline}: ${m.pipelineTitle}`, "");
    for (const s of d.pipeline) {
      out.push(`### ${s.index} ${s.name}`, "", `*${s.description}*`, "");
      for (const it of s.items) out.push(`- ${it.slug ? link({ domain: id, slug: it.slug }) : it.label}`);
      out.push("", `**Gate:** ${s.gate}`, "");
    }
    out.push(`## ${L.topics}`, "", ...d.topics.map((t) => `- ${link({ domain: id, slug: t.slug })}: ${t.short}`), "");
    if (d.glossary.length) {
      out.push(`## ${L.glossary}`, "");
      for (const g of d.glossary) {
        out.push(`### ${g.title}`, "");
        for (const e of g.entries) out.push(`- **${e.term}**${e.aka ? ` (${e.aka})` : ""}: ${e.meaning}${e.topic ? ` ${link({ domain: id, slug: e.topic })}` : ""}`);
        out.push("");
      }
    }
    out.push(`*${L.generated}*`);
    write(join(root, folderOf(id), `00 ${safe(m.name)} (${L.map}).md`), out.join("\n"));
  }

  // 3. careers
  const roles = localizedRoles(locale).value;
  for (const r of roles) {
    const out = ["---", `title: ${q(r.title)}`, `aliases: ${yamlList([r.tagline])}`, "tags: [career]", "---", "", `# ${r.title}`, "", `> ${r.tagline}`, "", r.summary, "", `## ${L.day}`, "", ...r.dayToDay.map((x) => `- ${x}`), ""];
    r.stages.forEach((s, i) => {
      out.push(`## ${L.stage} ${i + 1}: ${L.level[s.level]}`, "", `**${s.goal}**`, "", `### ${L.study}`, "", ...s.topics.map((x) => `- ${link(x)}`), "", `### ${L.outside}`, "", ...s.outside.map((x) => `- ${x}`), "", `### ${L.build}`, "", s.project, "");
    });
    out.push(`## ${L.show}`, "", ...r.portfolio.map((x) => `- ${x}`), "");
    if (r.certs.length) out.push(`## ${L.certs}`, "", ...r.certs.map((x) => `- ${x}`), "");
    if (r.certsNote) out.push(r.certsNote, "");
    out.push(`*${L.generated}*`);
    write(join(root, L.careers, `${safe(r.title)}.md`), out.join("\n"));
  }

  // 4. study paths
  for (const p of localizedPaths(locale).value) {
    const out = ["---", `title: ${q(p.title)}`, "tags: [path]", "---", "", `# ${p.title}`, "", p.description, ""];
    p.steps.forEach((s, i) => out.push(`${i + 1}. ${link(s.ref)}: ${s.why}`));
    out.push("", `*${L.generated}*`);
    write(join(root, L.paths, `${safe(p.title)}.md`), out.join("\n"));
  }

  // 5. home (map of content)
  const home = ["---", `title: ${q("sec/atlas")}`, "tags: [home]", "---", "", "# sec/atlas", ""];
  for (const id of Object.keys(domains)) {
    home.push(`- [[00 ${safe(ui.domains[id].name)} (${L.map})|${ui.domains[id].name}]]: ${ui.domains[id].pitch}`);
  }
  home.push("", `## ${L.careers}`, "", ...roles.map((r) => `- [[${safe(r.title)}]]`), "", `## ${L.paths}`, "", ...localizedPaths(locale).value.map((p) => `- [[${safe(p.title)}]]`), "", `*${L.generated}*`);
  write(join(root, `${L.home}.md`), home.join("\n"));

  console.log(`${locale}: ${names.size} topic notes, ${roles.length} careers -> ${root}`);
}
