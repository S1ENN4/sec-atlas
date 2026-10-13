import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bot, Check, Minus } from "lucide-react";

import { profile } from "@/content/profile";
import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { alternatesFor, resolveLocale } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  const m = t.manifesto;
  return {
    title: m.pageTitle,
    description: m.description,
    alternates: alternatesFor(locale, "/manifesto"),
    openGraph: { type: "article", title: m.ogTitle, description: m.ogDescription },
  };
}

const MCP_CONFIG = `{
  "mcpServers": {
    "appsec-kb": {
      "command": "node",
      "args": ["--import", "./scripts/content-alias-loader.mjs", "mcp/server.mjs"]
    }
  }
}`;

const linkBtn =
  "inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
const primaryBtn = `${linkBtn} border-primary/50 bg-primary/10 text-primary hover:bg-primary/20`;
const quietBtn = `${linkBtn} border-border bg-muted/40 hover:border-primary/60 hover:text-primary`;

export default async function ManifestoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const m = t.manifesto;
  const lp = (p: string) => localePath(locale, p);

  const problems = [
    [m.problems.p1Title, m.problems.p1Body],
    [m.problems.p2Title, m.problems.p2Body],
    [m.problems.p3Title, m.problems.p3Body],
    [m.problems.p4Title, m.problems.p4Body],
    [m.problems.p5Title, m.problems.p5Body],
  ];
  const principles = [
    [m.principles.openTitle, m.principles.openBody],
    [m.principles.accessTitle, m.principles.accessBody],
    [m.principles.visualTitle, m.principles.visualBody],
    [m.principles.verifiableTitle, m.principles.verifiableBody],
    [m.principles.practicalTitle, m.principles.practicalBody],
    [m.principles.evolvingTitle, m.principles.evolvingBody],
  ];
  const r = m.rows;
  const rows: { row: string; notion: [boolean, string]; kb: [boolean, string] }[] = [
    { row: r.structure, notion: [false, r.structureNotes], kb: [true, r.structureKb] },
    { row: r.connections, notion: [false, r.connectionsNotes], kb: [true, r.connectionsKb] },
    { row: r.quality, notion: [false, r.qualityNotes], kb: [true, r.qualityKb] },
    { row: r.history, notion: [false, r.historyNotes], kb: [true, r.historyKb] },
    { row: r.ownership, notion: [false, r.ownershipNotes], kb: [true, r.ownershipKb] },
    { row: r.access, notion: [false, r.accessNotes], kb: [true, r.accessKb] },
    { row: r.learning, notion: [false, r.learningNotes], kb: [true, r.learningKb] },
    { row: r.realtime, notion: [true, r.realtimeNotes], kb: [false, r.realtimeKb] },
  ];
  const tools: [string, string][] = [
    ["list_domains, list_topics", m.toolMap],
    ["get_topic, search", m.toolRead],
    ["get_authoring_guide", m.toolGuide],
    ["scaffold_topic", m.toolScaffold],
    ["validate_content", m.toolValidate],
  ];
  const [fresh2Before, fresh2After] = fmt(m.freshBody2, { code: "\u0000" }).split("\u0000");

  return (
    <div className="animate-page-enter">
      <header className="mx-auto max-w-4xl px-4 pb-10 pt-16 md:pt-24">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{m.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {m.titleA} <span className="text-primary">{m.titleB}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{m.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={lp("/paths")} className={primaryBtn}>
            {m.ctaStudy} <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <a href={profile.links.repo} target="_blank" rel="noopener noreferrer" className={quietBtn}>
            {m.ctaCode} <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="problem">
        <h2 id="problem" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          {m.problemEyebrow}
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{m.problemTitle}</p>
        <p className="mt-3 max-w-2xl text-muted-foreground">{m.problemIntro}</p>
        <ol className="mt-8 space-y-4">
          {problems.map(([title, body], i) => (
            <li key={title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <span className="font-mono text-sm text-primary/80" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="principles">
        <h2 id="principles" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          {m.principlesEyebrow}
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{m.principlesTitle}</p>
        <p className="mt-3 max-w-2xl text-muted-foreground">{m.principlesIntro}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {principles.map(([title, body]) => (
            <li key={title} className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold text-primary">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="notion">
        <h2 id="notion" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          {m.notionEyebrow}
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{m.notionTitle}</p>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {m.notionIntroA} <strong className="font-semibold text-foreground">{m.notionIntroStrong}</strong>
          {m.notionIntroB}
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">{m.tableCaption}</caption>
            <thead>
              <tr className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-normal">
                  {m.colCriterion}
                </th>
                <th scope="col" className="px-4 py-3 font-normal">
                  {m.colNotes}
                </th>
                <th scope="col" className="px-4 py-3 font-normal text-primary">
                  {m.colKb}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.row} className="border-b border-border/60 align-top last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {row.row}
                  </th>
                  {[row.notion, row.kb].map(([ok, text], i) => (
                    <td key={i} className="px-4 py-3">
                      <span className="flex gap-2 leading-snug text-foreground/85">
                        {ok ? (
                          <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-label={m.advantage} />
                        ) : (
                          <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label={m.limitation} />
                        )}
                        <span>{text}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="agents">
        <h2 id="agents" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          {m.agentsEyebrow}
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{m.agentsTitle}</p>
        <p className="mt-3 max-w-2xl text-muted-foreground">{m.agentsIntro}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Bot className="size-4 text-primary" aria-hidden /> {m.agentsCanTitle}
            </p>
            <ul className="mt-3 space-y-2">
              {tools.map(([name, what]) => (
                <li key={name} className="text-sm leading-snug">
                  <code className="font-mono text-xs text-primary">{name}</code>
                  <span className="text-muted-foreground"> · {what}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="font-semibold">{m.freshTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.freshBody1}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {fresh2Before}
              <code className="font-mono text-xs">scaffold_topic</code>
              {fresh2After}
            </p>
          </div>
        </div>

        <figure className="mt-6 overflow-hidden rounded-lg border border-border">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
            <span>{m.configCaption}</span>
            <span className="uppercase tracking-wider">json</span>
          </figcaption>
          <pre className="overflow-x-auto bg-card p-4 font-mono text-xs leading-relaxed text-foreground/90">
            <code>{MCP_CONFIG}</code>
          </pre>
        </figure>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-foreground">{m.agentsNoteStrong}</strong> {m.agentsNote}
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24" aria-labelledby="start">
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 md:p-10">
          <h2 id="start" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {m.finalTitle}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-foreground/85">{m.finalBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={lp("/paths")} className={primaryBtn}>
              {m.ctaPaths}
            </Link>
            <Link href={lp("/scenarios")} className={quietBtn}>
              {m.ctaScenarios}
            </Link>
            <a href={`${profile.links.repo}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className={quietBtn}>
              {m.ctaContribute} <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
          <p className="mt-8 font-mono text-xs text-muted-foreground">
            {fmt(m.signature, { name: profile.name })}{" "}
            <Link href={lp("/about")} className="text-primary/90 hover:text-primary">
              {m.aboutMe}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
