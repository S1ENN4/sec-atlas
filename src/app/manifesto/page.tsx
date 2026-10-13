import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bot, Check, Minus } from "lucide-react";

import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "manifesto",
  description:
    "Por que este projeto existe: conhecimento de segurança aberto, visual, verificável e fácil de acessar, feito para pessoas e para agentes.",
  openGraph: {
    type: "article",
    title: "Manifesto: conhecimento de segurança deveria ser aberto e fácil de achar",
    description: "Por que o jeito como aprendemos segurança precisa mudar, e o que este projeto faz diferente.",
  },
};

const PROBLEMS = [
  {
    title: "Decorar listas em vez de entender conexões",
    body: "SAST, DAST, WAF, IAM, cada um num capítulo. Ninguém mostra onde um controle entra, o que ele deixa passar e qual outro cobre esse buraco.",
  },
  {
    title: "Conhecimento atrás de paredes",
    body: "Curso caro, PDF solto, vídeo de três horas sem busca. Quem mais precisa aprender costuma ser quem menos acessa.",
  },
  {
    title: "Material que envelhece em silêncio",
    body: "Sem data, sem fonte, sem canal para corrigir. Em segurança, informação antiga e errada é um risco, não só um incômodo.",
  },
  {
    title: "Teoria sem cenário",
    body: "Aprende-se o nome do controle, não o momento em que ele falha. O atacante não segue o capítulo do livro.",
  },
  {
    title: "Avaliação que mede memória",
    body: "Decorar a sigla é fácil e não prova nada. O que importa é raciocinar sobre um incidente que você nunca viu.",
  },
];

const PRINCIPLES = [
  {
    title: "Aberto",
    body: "Código em MIT, conteúdo em CC BY-SA 4.0. Qualquer pessoa pode ler, copiar, adaptar, traduzir e corrigir. Sem login, sem assinatura.",
  },
  {
    title: "Fácil de acessar",
    body: "Site estático, rápido, sem cookies e sem rastreamento, que funciona no celular. Busca em um atalho (Ctrl+K), lista por etapa e navegação por teclado.",
  },
  {
    title: "Visual",
    body: "Cada domínio é um mapa: o que existe, onde entra na esteira e como se conecta. A estrutura é parte da explicação.",
  },
  {
    title: "Verificável",
    body: "Fontes primárias, data de atualização, registro público de correções e um validador que quebra o build quando algo está incompleto ou aponta para o nada.",
  },
  {
    title: "Prático",
    body: "Cenários de ataque passo a passo e quizzes que pedem raciocínio. Você descobre qual camada barra cada movimento do atacante.",
  },
  {
    title: "Feito para evoluir",
    body: "Pessoas e agentes de código contribuem pelo mesmo caminho, com os mesmos guardrails e revisão humana no final.",
  },
];

type Cell = { ok: boolean; text: string };
const COMPARISON: { row: string; notion: Cell; kb: Cell }[] = [
  {
    row: "Estrutura",
    notion: { ok: false, text: "Estrutura por convenção: templates ajudam, mas nada obriga a segui-los" },
    kb: { ok: true, text: "Tópicos tipados: seções, fontes, quiz e posição no mapa são exigidos" },
  },
  {
    row: "Conexões",
    notion: { ok: false, text: "Links e relações flexíveis, sem garantia de consistência entre páginas" },
    kb: { ok: true, text: "Grafo com relações tipadas; o build falha se uma conexão aponta para o vazio" },
  },
  {
    row: "Qualidade",
    notion: { ok: false, text: "Sem verificação automática de conteúdo" },
    kb: { ok: true, text: "Validador (8 regras) e CI em todo PR, mais orçamento de tamanho" },
  },
  {
    row: "Histórico e revisão",
    notion: { ok: false, text: "Histórico por página; revisão por pares depende de processo manual" },
    kb: { ok: true, text: "Git: cada mudança é um commit revisável, com autoria e motivo" },
  },
  {
    row: "Propriedade",
    notion: { ok: false, text: "Os dados vivem na plataforma (dá para exportar, mas ela é a fonte da verdade)" },
    kb: { ok: true, text: "Arquivos no seu repositório, licença aberta, fork em um clique" },
  },
  {
    row: "Acesso",
    notion: { ok: false, text: "Leitura pública é possível; colaborar depende de workspace e permissões" },
    kb: { ok: true, text: "Público e estático: abre em qualquer lugar, sem conta" },
  },
  {
    row: "Aprender",
    notion: { ok: false, text: "Foco em leitura e anotação; sem trilhas, cenários ou quiz nativos" },
    kb: { ok: true, text: "Trilhas, cenários, quizzes e progresso salvo só no seu navegador" },
  },
  {
    row: "Edição colaborativa em tempo real",
    notion: { ok: true, text: "Excelente: é o ponto forte dele" },
    kb: { ok: false, text: "Não é o objetivo: aqui a colaboração é por pull request" },
  },
];

const MCP_TOOLS = [
  ["list_domains, list_topics", "mapear o que já existe"],
  ["get_topic, search", "ler e achar conteúdo"],
  ["get_authoring_guide", "carregar as regras do projeto"],
  ["scaffold_topic", "criar o esqueleto de um tópico novo"],
  ["validate_content", "rodar o validador (R1 a R8)"],
];

const MCP_CONFIG = `{
  "mcpServers": {
    "appsec-kb": {
      "command": "node",
      "args": ["--import", "./scripts/content-alias-loader.mjs", "mcp/server.mjs"]
    }
  }
}`;

export default function ManifestoPage() {
  return (
    <div className="animate-page-enter">
      <header className="mx-auto max-w-4xl px-4 pb-10 pt-16 md:pt-24">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">manifesto</p>
        <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Conhecimento de segurança deveria ser{" "}
          <span className="text-primary">aberto, visual e fácil de achar.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          O jeito dominante de ensinar segurança está falhando com quem aprende. Este projeto é uma aposta
          concreta em outro caminho, e vale mais mostrar do que prometer: tudo que está nesta página já
          existe e dá para conferir no código.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/trilhas"
            className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            começar a estudar <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <a
            href={profile.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-2 font-mono text-sm transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            ver o código <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="problema">
        <h2 id="problema" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          01 · o problema
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          A forma como aprendemos segurança está quebrada.
        </p>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Isto é uma opinião, formada por quem aprendeu, trabalha e ensina na área. Cinco falhas que se repetem:
        </p>
        <ol className="mt-8 space-y-4">
          {PROBLEMS.map((p, i) => (
            <li key={p.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <span className="font-mono text-sm text-primary/80" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="principios">
        <h2 id="principios" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          02 · o que eu defendo
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Conhecimento é melhor quando circula.
        </p>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Segurança é um esporte coletivo: quanto mais gente entende, mais difícil é atacar. Por isso, seis princípios
          guiam o projeto:
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold text-primary">{p.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="notion">
        <h2 id="notion" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          03 · por que não só um Notion
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Notas são um começo. Conhecimento estruturado é outra categoria.
        </p>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          O Notion é ótimo no que foi feito para fazer: anotar, organizar e colaborar. A comparação abaixo é sobre
          outra tarefa: <strong className="font-semibold text-foreground">publicar conhecimento estruturado e verificável</strong>,
          em que a ferramenta ajuda a manter a qualidade, em vez de depender só da disciplina de quem escreve.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Comparação entre um workspace de notas genérico e este projeto</caption>
            <thead>
              <tr className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-normal">
                  critério
                </th>
                <th scope="col" className="px-4 py-3 font-normal">
                  workspace de notas (ex.: Notion)
                </th>
                <th scope="col" className="px-4 py-3 font-normal text-primary">
                  appsec/kb
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((r) => (
                <tr key={r.row} className="border-b border-border/60 last:border-0 align-top">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {r.row}
                  </th>
                  {[r.notion, r.kb].map((c, i) => (
                    <td key={i} className="px-4 py-3">
                      <span className="flex gap-2 leading-snug text-foreground/85">
                        {c.ok ? (
                          <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-label="vantagem" />
                        ) : (
                          <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label="limitação" />
                        )}
                        <span>{c.text}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16" aria-labelledby="agentes">
        <h2 id="agentes" className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          04 · feito para pessoas e para agentes
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Um servidor MCP para agentes de código evoluírem o projeto.
        </p>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          O repositório traz um servidor{" "}
          <abbr title="Model Context Protocol" className="no-underline">
            MCP
          </abbr>{" "}
          local, sem dependências. Um agente conecta, aprende as regras, lê o que já existe, cria o esqueleto de um
          tópico e roda o mesmo validador que o CI roda, com os mesmos limites de qualidade que uma pessoa teria.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Bot className="size-4 text-primary" aria-hidden /> O que o agente consegue fazer
            </p>
            <ul className="mt-3 space-y-2">
              {MCP_TOOLS.map(([name, what]) => (
                <li key={name} className="text-sm leading-snug">
                  <code className="font-mono text-xs text-primary">{name}</code>
                  <span className="text-muted-foreground"> · {what}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="font-semibold">Toda sessão nova começa do mesmo ponto</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              As regras do projeto vêm do próprio servidor (instruções e guia de contribuição), então uma sessão nova
              não depende de contexto antigo: ela se conecta, lê o guia e sabe o que fazer e o que o build exige.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Os guardrails ficam do lado do projeto: o <code className="font-mono text-xs">scaffold_topic</code> só cria
              um arquivo novo, recusa caminhos suspeitos e nunca sobrescreve, e o build não passa com conteúdo incompleto.
            </p>
          </div>
        </div>

        <figure className="mt-6 overflow-hidden rounded-lg border border-border">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
            <span>.mcp.json (já incluído no repositório)</span>
            <span className="uppercase tracking-wider">json</span>
          </figcaption>
          <pre className="overflow-x-auto bg-card p-4 font-mono text-xs leading-relaxed text-foreground/90">
            <code>{MCP_CONFIG}</code>
          </pre>
        </figure>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-foreground">Agentes propõem, pessoas revisam.</strong> Contribuições
          assistidas por IA são bem-vindas, desde que o autor verifique cada afirmação e declare o uso no pull request.
          O objetivo é acelerar a escrita sem abrir mão da precisão.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24" aria-labelledby="comeco">
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 md:p-10">
          <h2 id="comeco" className="text-2xl font-semibold tracking-tight md:text-3xl">
            Aprenda, corrija, melhore.
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-foreground/85">
            Se você estuda segurança, comece por uma trilha. Se você trabalha com isso, o jeito mais valioso de ajudar é
            achar o que está errado e dizer. Se você constrói com agentes, conecte o servidor e proponha um tópico.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/trilhas"
              className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              trilhas de estudo
            </Link>
            <Link
              href="/cenarios"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-2 font-mono text-sm transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              siga um ataque
            </Link>
            <a
              href={`${profile.links.repo}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-4 py-2 font-mono text-sm transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              como contribuir <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
          <p className="mt-8 font-mono text-xs text-muted-foreground">
            — {profile.name}.{" "}
            <Link href="/sobre" className="text-primary/90 hover:text-primary">
              sobre mim
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
