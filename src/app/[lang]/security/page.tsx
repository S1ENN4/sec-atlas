import type { Metadata } from "next";
import { EyeOff, FileLock2, PackageCheck, ServerOff } from "lucide-react";

import { ContentNotice } from "@/components/content-notice";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alternatesFor, resolveLocale } from "@/i18n/server";

// LEGACY PAGE: long Portuguese prose that has not been moved into translatable
// units yet. It is shown as-is in every locale, with an explicit notice.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return {
    title: "segurança deste site",
    description: "Como esta knowledge base é construída para minimizar superfície de ataque.",
    alternates: alternatesFor(locale, "/security"),
  };
}

const principles = [
  {
    icon: ServerOff,
    title: "Superfície mínima",
    body: "O site é 100% estático: sem servidor de aplicação, sem banco de dados, sem API, sem formulários. Não existe backend para explorar. O que é servido são apenas arquivos HTML, CSS e JS gerados em build.",
  },
  {
    icon: EyeOff,
    title: "Zero coleta de dados",
    body: "Sem analytics, sem telemetria, sem cookies, sem fingerprinting, sem scripts de terceiros. Nada sobre você sai do seu navegador porque nada é pedido. O único dado guardado é o seu progresso de estudo (tópicos marcados e notas de quiz), em localStorage, só neste navegador e apagável a qualquer momento em /trilhas.",
  },
  {
    icon: PackageCheck,
    title: "Cadeia de suprimentos controlada",
    body: "Dependências com versões exatas e lockfile versionado (o próprio SCA desta KB). Fontes e assets são self-hosted; nenhum recurso é buscado de CDN em runtime. Detalhes do que entrou neste ciclo logo abaixo.",
  },
  {
    icon: FileLock2,
    title: "Cabeçalhos HTTP restritivos",
    body: "O arquivo public/_headers define Content-Security-Policy, frame-ancestors 'none', nosniff, Permissions-Policy e políticas de isolamento para os hosts que o suportam (Netlify, Cloudflare Pages).",
  },
];

export default async function SegurancaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <article className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
      <div className="mb-6">
        <ContentNotice fallback={locale !== "pt"} sourceLang="pt" t={t} />
      </div>
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">dogfooding</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          A segurança desta própria página
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Uma knowledge base sobre segurança precisa praticar o que publica. Este é o checklist que
          ela mesma segue, e que você pode cobrar de qualquer site estático.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <p.icon className="size-5 text-primary" />
              <CardTitle className="pt-2 text-base">{p.title}</CardTitle>
              <CardDescription className="leading-relaxed">{p.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-primary/90">
          Content-Security-Policy
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          A CSP aplicada em produção, exposta de forma transparente:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{`default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
object-src 'none';
base-uri 'none';
frame-ancestors 'none';
form-action 'none';
upgrade-insecure-requests`}
        </pre>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-primary/90">
          Animações sem dependência de runtime
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          O site não carrega nenhuma biblioteca de animação. Uma versão anterior incluía
          uma (motion), mas ela nunca chegou a ser usada pelos componentes e custava cerca
          de 43 KB de gzip em toda página, então foi removida. Hoje todo o movimento é CSS
          puro em <code className="font-mono text-xs">globals.css</code>:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Entrada de página e do hero</strong>: keyframes curtos (240 a 400ms) com fade e deslocamento discreto.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Reveal sob scroll</strong>: <code className="font-mono text-xs">animation-timeline: view()</code>, só onde o navegador suporta, e desligado com <code className="font-mono text-xs">prefers-reduced-motion</code>.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Transição entre páginas</strong>: a API nativa de view transitions entre documentos (<code className="font-mono text-xs">@view-transition</code>), sem JavaScript e com fallback silencioso.
            </span>
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-foreground/85">
          Menos dependências significam menos superfície de supply chain e nenhum
          acréscimo ao allowlist da CSP.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-primary/90">
          Portões automatizados de build
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          Toda promoção para <code className="font-mono text-xs">out/</code> passa por
          dois scripts zero-dep, plugados direto no ciclo de vida do npm script:
          qualquer regra que falhe derruba o build antes do artefato ser publicado. Os
          números abaixo são do último build limpo.
        </p>

        <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-primary/80">
          prebuild
        </h3>
        <p className="mt-2 leading-relaxed text-foreground/85">
          <code className="font-mono text-xs">
            node --import ./scripts/content-alias-loader.mjs scripts/validate-content.mjs
          </code>
          . Importa o conteúdo direto pelo Node 24 com type-stripping e aplica seis
          checagens de integridade:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">R1 ids compostos únicos</strong>: cada{" "}
              <code className="font-mono text-xs">domain/slug</code> aparece uma vez só,
              em todos os domínios.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">R2 relations resolvem</strong>: cada{" "}
              <code className="font-mono text-xs">source</code> e{" "}
              <code className="font-mono text-xs">target</code> de relação aponta para
              um tópico existente.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">R3 itens de pipeline resolvem</strong>:
              cada <code className="font-mono text-xs">pipelineStages[].items[].slug</code>{" "}
              casa com um tópico do mesmo domínio.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">R4 refs do glossário resolvem</strong>:
              cada entrada aponta para um tópico, com cross-domain permitido.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">R5 etapas existentes</strong>: a etapa
              de cada tópico é uma etapa da esteira do seu domínio (o mapa de
              aprendizado posiciona os tópicos por nível e pré-requisitos, sem
              coordenadas manuais).
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">R6 piso de conteúdo live</strong>: para
              cada tópico em domínio{" "}
              <code className="font-mono text-xs">live</code>, ≥ 4 seções e{" "}
              <code className="font-mono text-xs">(code ≥ 1 OR bullets ≥ 3)</code> e
              tagline não vazia e ≥ 3 ferramentas. Todos os domínios são live e passam
              por esta régua.
            </span>
          </li>
        </ul>

        <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-primary/80">
          postbuild
        </h3>
        <p className="mt-2 leading-relaxed text-foreground/85">
          <code className="font-mono text-xs">
            next build &amp;&amp; node scripts/check-budget.mjs
          </code>
          . O segundo script caminha{" "}
          <code className="font-mono text-xs">out/</code> inteiro e compara as
          métricas (first-load, RSC prefetch, total, todos os idiomas, CSS, JS bruto e
          gzip, e a página inicial) contra tetos duros. Os tetos só sobem quando o
          conteúdo sobe, e cada mudança fica registrada, com os números medidos, no
          cabeçalho do <code className="font-mono text-xs">scripts/check-budget.mjs</code>
          . O status atual aparece no log de cada build e do CI.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-primary/90">Trade-offs honestos</h2>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">script-src com 'unsafe-inline'</strong>:
              o export estático do Next injeta pequenos scripts inline de hidratação. O
              caminho de endurecimento é migrar para CSP por hash ou nonce no deploy,
              documentado como próximo passo, não escondido.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">style-src com 'unsafe-inline'</strong>: o mapa de aprendizado posiciona setas e cartões com atributos <code className="font-mono text-xs">style</code> calculados no navegador. Sem isso o mapa não renderiza. Risco aceito e delimitado.
            </span>
          </li>

          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Onze domínios, 106 tópicos</strong>: o
              catálogo cobre AppSec, OWASP, Engenharia, DevOps, CloudSec, SecOps, resposta a incidentes, segurança ofensiva, GRC, Agentes e Vibecoding, todos com status{" "}
              <code className="font-mono text-xs">live</code> e passando no validador. A
              superfície de conteúdo cresceu desde a primeira publicação desta página,
              e o R6 (piso de conteúdo live) é o que segura a régua.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">_headers depende do host</strong>:
              aberto via file:// ou servido por um servidor genérico, os cabeçalhos não
              se aplicam. A proteção entra em vigor no deploy, em host que respeite o
              arquivo.
            </span>
          </li>
        </ul>
      </section>
    </article>
  );
}