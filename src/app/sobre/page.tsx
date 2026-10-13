import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Code, Globe, Languages, MapPin, Mail } from "lucide-react";

import { contactLinks, profile, type ProfileItem } from "@/content/profile";

export const metadata: Metadata = {
  title: "sobre",
  description: `${profile.name}: ${profile.headline}. Quem fez este mapa, por que existe e como ele foi construído.`,
};

const ICONS: Record<string, typeof Mail> = { LinkedIn: Briefcase, Site: Globe, GitHub: Code, "E-mail": Mail };

function ItemList({ title, items }: { title: string; items: ProfileItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it.title} className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium">{it.title}</span>
              {it.period ? <span className="font-mono text-xs text-muted-foreground">{it.period}</span> : null}
            </p>
            {it.detail ? <p className="mt-1 text-sm leading-snug text-muted-foreground">{it.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

const BEHIND_THE_SCENES = [
  {
    title: "Superfície mínima",
    body: "Site 100% estático: sem backend, banco, formulários ou cookies. A CSP restritiva e os demais cabeçalhos estão versionados no repositório.",
  },
  {
    title: "Conteúdo validado em build",
    body: "Um validador roda antes do build e quebra se um tópico perde posição no mapa, um quiz fica incompleto ou uma trilha aponta para tópico inexistente.",
  },
  {
    title: "Orçamento de desempenho",
    body: "O build falha se o tamanho do bundle passar dos limites. O JS do cliente foi reduzido ao manter o conteúdo dos tópicos no servidor e carregar quiz e busca sob demanda.",
  },
  {
    title: "Acessibilidade e movimento",
    body: "Navegação por teclado no mapa, rótulos para leitores de tela, foco visível e respeito a prefers-reduced-motion.",
  },
  {
    title: "Privacidade por padrão",
    body: "Sem rastreamento. O único dado guardado é o progresso de estudo, no navegador de quem estuda, e dá para apagar quando quiser.",
  },
];

export default function SobrePage() {
  const links = contactLinks();
  return (
    <div className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">sobre</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{profile.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{profile.headline}</p>
        <p className="mt-4 leading-relaxed text-foreground/85">{profile.summary}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden /> {profile.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Languages className="size-3.5" aria-hidden /> {profile.languages.join(" · ")}
          </span>
        </p>
        <ul aria-label="Competências" className="mt-4 flex flex-wrap gap-2">
          {profile.skills.map((sk) => (
            <li key={sk} className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground">
              {sk}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((l) => {
            const Icon = ICONS[l.label] ?? ArrowUpRight;
            return (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Icon className="size-4" aria-hidden /> {l.label}
              </a>
            );
          })}
        </div>
      </header>

      <ItemList title="experiência" items={profile.experience} />
      <ItemList title="formação" items={profile.education} />
      <ItemList title="certificações" items={profile.certifications} />

      <section className="mt-12">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">por que este projeto existe</h2>
        <div className="mt-4 space-y-3 leading-relaxed text-foreground/85">
          <p>
            Ferramentas de segurança costumam ser apresentadas isoladas: SAST aqui, SCA ali, IAM em outro lugar. O que
            falta é o mapa: onde cada controle entra, o que ele cobre, o que deixa passar e como as peças se completam.
          </p>
          <p>
            Por isso cada domínio é um grafo navegável, com trilhas de estudo, cenários de ataque que mostram as camadas
            em ação e quizzes para fixar. É uma forma mais visual de aprender e, ao mesmo tempo, uma amostra de como o
            projeto foi pensado e construído.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">bastidores técnicos</h2>
        <ul className="mt-4 space-y-3">
          {BEHIND_THE_SCENES.map((b) => (
            <li key={b.title} className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="font-medium">{b.title}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{b.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          O checklist completo, com a CSP real e os trade-offs, está em{" "}
          <Link href="/seguranca" className="text-primary underline-offset-2 hover:underline">
            /seguranca
          </Link>
          .
        </p>
      </section>

      <section id="conteudo" className="mt-12 scroll-mt-20">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">sobre o conteúdo</h2>
        <p className="mt-4 leading-relaxed text-foreground/85">{profile.contentNote}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Mudanças e correções ficam registradas em{" "}
          <Link href="/novidades" className="text-primary underline-offset-2 hover:underline">
            /novidades
          </Link>
          .
        </p>
      </section>

      <section lang="en" className="mt-12 rounded-xl border border-border bg-card p-5">
        <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">in english</h2>
        <p className="mt-3 leading-relaxed text-foreground/85">{profile.summaryEn}</p>
      </section>

      <section className="mt-12 rounded-xl border border-primary/40 bg-primary/5 p-5">
        <h2 className="text-lg font-semibold">Vamos conversar?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Se este mapa foi útil, ou se você quer falar sobre segurança de software, a melhor forma de me achar é o
          LinkedIn.
        </p>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer me"
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Briefcase className="size-4" aria-hidden /> abrir meu LinkedIn
        </a>
      </section>
    </div>
  );
}
