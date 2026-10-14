"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { fmt } from "@/i18n/format";
import { cn } from "@/lib/utils";
import type { DomainGlossaryGroup } from "@/lib/glossary";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export interface GlossaryStrings {
  placeholder: string;
  filterAria: string;
  domainAria: string;
  all: string;
  nothing: string;
  nothingIn: string;
}

type DomainFilter = "all" | string;

export function GlossaryExplorer({
  groups,
  domainNames,
  t,
}: {
  groups: DomainGlossaryGroup[];
  /** domain id -> localised display name */
  domainNames: Record<string, string>;
  t: GlossaryStrings;
}) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<DomainFilter>("all");
  const q = normalize(query.trim());
  const nameOf = (id: string) => domainNames[id] ?? id;

  // Domain chips are derived from the data itself, in first-seen order.
  const domainOptions = useMemo(() => {
    const seen: string[] = [];
    for (const g of groups) if (!seen.includes(g.domain)) seen.push(g.domain);
    return ["all", ...seen] as const;
  }, [groups]);

  const filtered = useMemo(() => {
    const byDomain = domain === "all" ? groups : groups.filter((g) => g.domain === domain);
    if (!q) return byDomain;
    return byDomain
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) => normalize(`${entry.term} ${entry.aka ?? ""} ${entry.meaning}`).includes(q)),
      }))
      .filter((group) => group.entries.length > 0);
  }, [groups, q, domain]);

  // Composite key restarts the `animate-chip-in` reveal animation when either filter changes.
  const animKey = `${q}|${domain}`;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.placeholder}
        aria-label={t.filterAria}
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
      />

      <div role="group" aria-label={t.domainAria} className="mt-3 flex flex-wrap gap-2">
        {domainOptions.map((opt) => {
          const active = domain === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setDomain(opt)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active ? "border-primary/60 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {opt === "all" ? t.all : nameOf(opt)}
            </button>
          );
        })}
      </div>

      <div key={animKey} className="animate-chip-in">
        {filtered.length === 0 ? (
          <p className="mt-8 font-mono text-sm text-muted-foreground">
            {domain === "all" ? fmt(t.nothing, { query }) : fmt(t.nothingIn, { query, domain: nameOf(domain) })}
          </p>
        ) : null}

        <div className="mt-10 space-y-12">
          {filtered.map((group) => (
            <section key={`${group.domain}-${group.id}`}>
              <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                <span>{group.title}</span>
                {domain === "all" ? (
                  <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] normal-case tracking-normal text-foreground/70">
                    {nameOf(group.domain)}
                  </span>
                ) : null}
              </h2>
              <dl className="mt-4 space-y-3">
                {group.entries.map((entry) => {
                  const topic = entry.resolved;
                  // An entry may reference a topic from a different domain (rule R4
                  // allows it): surface a small chip so the destination is clear.
                  const isCrossDomain = topic !== undefined && topic.domain !== group.domain;
                  return (
                    <div key={`${group.domain}-${group.id}-${entry.term}`} className="rounded-lg border border-border bg-card px-4 py-3">
                      <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="font-mono text-sm font-semibold text-foreground">{entry.term}</span>
                        {entry.aka ? (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{entry.aka}</span>
                        ) : null}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-foreground/85">
                        {entry.meaning}
                        {topic ? (
                          <span className="ml-2 inline-flex flex-wrap items-center gap-2 align-baseline">
                            {isCrossDomain ? (
                              <span
                                data-cross-domain={topic.domain}
                                className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] normal-case tracking-normal text-foreground/70"
                              >
                                {nameOf(topic.domain).toLowerCase()}
                              </span>
                            ) : null}
                            <Link
                              href={topic.href}
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
