"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { domainMeta, getTopic } from "@/content/registry";
import { cn } from "@/lib/utils";
import type { DomainGlossaryGroup } from "@/lib/glossary";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Domain label shown on the chip and on the per-group badge. Kept in sync
// with the canonical `route` and `accent` metadata via `domainMeta` — the
// chip itself only needs the human name.
const DOMAIN_LABEL: Record<string, string> = {
  appsec: "AppSec",
  cloudsec: "CloudSec",
  "ai-agents": "AI Agents",
};

// Cross-domain link badge — small mono chip rendered next to the topic link
// when an entry's `topic` lives in a domain DIFFERENT from the group that
// owns the entry. Keeps the reader oriented across the multi-domain
// glossary: a "RAG" entry under the appsec group can link to the agents
// topic and the chip will read "agentes". Uses the lowercase route name
// (matching `domainMeta[id].route` semantics: "/agentes" → "agentes") so
// the badge is visually distinct from the full DOMAIN_LABEL seen on the
// chip row.
const DOMAIN_BADGE_LABEL: Record<string, string> = {
  appsec: "appsec",
  cloudsec: "cloudsec",
  "ai-agents": "agentes",
};

type DomainFilter = "all" | string;

export function GlossaryExplorer({ groups }: { groups: DomainGlossaryGroup[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainFilter>("all");
  const q = normalize(query.trim());

  // Domain chips are derived from the data itself, in first-seen order, so
  // the chip row tracks whatever set of domains actually contributed
  // glossary content. An extra "todos" chip sits on the left as the
  // default (and only) no-filter state.
  const domainOptions = useMemo(() => {
    const seen: string[] = [];
    for (const g of groups) {
      if (!seen.includes(g.domain)) seen.push(g.domain);
    }
    return ["all", ...seen] as const;
  }, [groups]);

  const filtered = useMemo(() => {
    const byDomain = domain === "all" ? groups : groups.filter((g) => g.domain === domain);
    if (!q) return byDomain;
    return byDomain
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) =>
          normalize(`${entry.term} ${entry.aka ?? ""} ${entry.meaning}`).includes(q),
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [groups, q, domain]);

  // Composite key restarts the `animate-chip-in` reveal animation when
  // either filter dimension changes. The T6 keyframe is the same one used
  // by the text-only version (150ms fade + 3px translateY).
  const animKey = `${q}|${domain}`;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="filtrar termos... (ex.: cve, iam, cspm, sbom)"
        aria-label="filtrar termos do glossário"
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
      />

      <div
        role="group"
        aria-label="filtrar por domínio"
        className="mt-3 flex flex-wrap gap-2"
      >
        {domainOptions.map((opt) => {
          const active = domain === opt;
          const label = opt === "all" ? "todos" : DOMAIN_LABEL[opt] ?? opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setDomain(opt)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div key={animKey} className="animate-chip-in">
        {filtered.length === 0 ? (
          <p className="mt-8 font-mono text-sm text-muted-foreground">
            nada encontrado para &quot;{query}&quot;
            {domain === "all" ? "" : ` em ${DOMAIN_LABEL[domain] ?? domain}`}.
          </p>
        ) : null}

        <div className="mt-10 space-y-12">
          {filtered.map((group) => (
            <section key={`${group.domain}-${group.id}`}>
              <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                <span>{group.title}</span>
                {domain === "all" ? (
                  <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] normal-case tracking-normal text-foreground/70">
                    {DOMAIN_LABEL[group.domain] ?? group.domain}
                  </span>
                ) : null}
              </h2>
              <dl className="mt-4 space-y-3">
                {group.entries.map((entry) => {
                  const topic = entry.topic ? getTopic(entry.topic) : undefined;
                  // A glossary entry may reference a topic from a different
                  // domain (the validator's R4 rule explicitly allows
                  // cross-domain refs). When it does, we surface a small
                  // domain chip so the destination isn't ambiguous. Same-
                  // domain refs stay unbadged — the link reads as "→ RAG"
                  // and the reader already knows it's in this glossary's
                  // domain from the section header.
                  const isCrossDomain =
                    topic !== undefined && topic.domain !== group.domain;
                  return (
                    <div
                      key={`${group.domain}-${group.id}-${entry.term}`}
                      className="rounded-lg border border-border bg-card px-4 py-3"
                    >
                      <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {entry.term}
                        </span>
                        {entry.aka ? (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {entry.aka}
                          </span>
                        ) : null}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-foreground/85">
                        {entry.meaning}
                        {topic ? (
                          <span className="ml-2 inline-flex flex-wrap items-center gap-2 whitespace-nowrap align-baseline">
                                {isCrossDomain ? (
                                  <span
                                    data-cross-domain={topic.domain}
                                    className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] normal-case tracking-normal text-foreground/70"
                                  >
                                    {DOMAIN_BADGE_LABEL[topic.domain] ?? topic.domain}
                                  </span>
                                ) : null}
                                <Link
                                  href={`${domainMeta[topic.domain].route}/topico/${topic.slug}`}
                                  className="font-mono text-xs text-primary/90 transition-colors duration-[120ms] hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                >
                                  → {topic.title}
                                </Link>
                              </span>
                        ) : null}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}