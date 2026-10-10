"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { domainMeta, getTopic } from "@/content/registry";
import type { GlossaryGroup } from "@/lib/glossary";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function GlossaryExplorer({ groups }: { groups: GlossaryGroup[] }) {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());

  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) =>
          normalize(`${entry.term} ${entry.aka ?? ""} ${entry.meaning}`).includes(q)
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [groups, q]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="filtrar termos... (ex.: cve, injecao, sbom, gate)"
        aria-label="filtrar termos do glossário"
        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none"
      />

      {filtered.length === 0 ? (
        <p className="mt-8 font-mono text-sm text-muted-foreground">
          nada encontrado para &quot;{query}&quot;.
        </p>
      ) : null}

      <div className="mt-10 space-y-12">
        {filtered.map((group) => (
          <section key={group.id}>
            <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h2>
            <dl className="mt-4 space-y-3">
              {group.entries.map((entry) => {
                const topic = entry.topic ? getTopic(entry.topic) : undefined;
                return (
                  <div
                    key={`${group.id}-${entry.term}`}
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
                        <Link
                          href={`${domainMeta[topic.domain].route}/topico/${topic.slug}`}
                          className="ml-2 whitespace-nowrap font-mono text-xs text-primary/90 transition-colors hover:text-primary"
                        >
                          → {topic.title}
                        </Link>
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
  );
}
