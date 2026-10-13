import type { Metadata } from "next";
import { EyeOff, FileLock2, PackageCheck, ServerOff } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "segurança deste site",
  description: "Como esta knowledge base é construída para minimizar superfície de ataque.",
};

const principles = [
  {
    icon: ServerOff,
    title: "Superfície mínima",
    body: "O site é 100% estático: sem servidor de aplicação, sem banco de dados, sem API, sem formulários. Não existe backend para explorar. O que é servido são apenas arquivos HTML, CSS e JS gerados em build.",
  },
  {
    icon: EyeOff,
    title: "Zero coleta de dados",
    body: "Sem analytics, sem telemetria, sem cookies, sem fingerprinting, sem scripts de terceiros. Nada sobre você sai do seu navegador porque nada é pedido.",
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

export default function SegurancaPage() {
  return (
    <article className="animate-page-enter mx-auto max-w-3xl px-4 pb-24 pt-10">
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
          Dependência adicionada neste ciclo
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          Antes deste ciclo a KB não tinha nenhuma dependência de animação em runtime.
          O upgrade adicionou uma única, fixada com versão exata:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                motion@14.1.0
              </code>{" "}
              (pin exato no <code className="font-mono text-xs">package.json</code> e lockfile
              versionado).
            </span>
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-foreground/85">
          A escolha foi feita depois de comparar com o caminho zero-dep em CSS puro. A
          animação de entrada do hero em cascata e os reveals acionados por scroll precisam
          de um orquestrador que conheça o ciclo de vida do componente, que respeite{" "}
          <code className="font-mono text-xs">prefers-reduced-motion</code> via{" "}
          <code className="font-mono text-xs">MotionConfig</code>, e que escreva estilos
          inline de forma previsível (sem mutar classes do Tailwind em runtime). O{" "}
          <code className="font-mono text-xs">motion/react</code> entrega isso via{" "}
          <code className="font-mono text-xs">LazyMotion(domMax, strict)</code>{" "}
          (tree-shaking das features que não usamos) e os componentes{" "}
          <code className="font-mono text-xs">m.*</code>, que escrevem estilos inline
          hidratáveis sem pisar no DOM. Reproduzir o mesmo em CSS exigiria hand-roll de
          IntersectionObserver, timeouts e um controlador de stagger por componente, com
          o mesmo orçamento de bytes e mais código para auditar.
        </p>
        <p className="mt-4 leading-relaxed text-foreground/85">
          O custo, medido no build atual:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">~115 KB raw / ~38 KB gzip</strong>{" "}
              (115.423 / 37.778 bytes) em um único chunk compartilhado, carregado uma vez
              por sessão e reusado em todas as rotas que usam o provider.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">CSP não muda</strong>: o que o motion
              escreve é <code className="font-mono text-xs">style</code> inline (já
              autorizado por{" "}
              <code className="font-mono text-xs">style-src 'unsafe-inline'</code>{" "}
              listado acima, cuja razão original era o React Flow e que continua válida).
              Nada novo foi colocado no allowlist por causa desta dependência.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Disciplina de supply chain</strong>:
              versão exata pinada, lockfile versionado, mesma política de auditoria que
              já se aplica às demais deps. Não há fallback em CDN e nada é resolvido em
              runtime.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-primary/90">
          Transições entre páginas
        </h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          A primeira tentativa deste ciclo foi usar a API nativa de View Transitions
          exposta pelo <code className="font-mono text-xs">react@19.3.0</code>, com{" "}
          <code className="font-mono text-xs">&lt;ViewTransition name="..."&gt;</code>{" "}
          envolvendo o conteúdo das rotas para nomear o snapshot no cross-fade. O export
          ainda é experimental e quebrou a hidratação quando o atributo{" "}
          <code className="font-mono text-xs">name</code> aparecia no server render: o
          cliente e o servidor discordavam sobre o DOM inicial e o Next descartava a
          árvore, voltando ao flicker padrão.
        </p>
        <p className="mt-4 leading-relaxed text-foreground/85">
          A tentativa foi revertida e o que está no ar hoje é:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Entrada de página</strong>: a classe
              utilitária <code className="font-mono text-xs">animate-page-enter</code>{" "}
              (240ms, keyframe em <code className="font-mono text-xs">globals.css</code>)
              faz fade-in + rise discreto de cada rota. Pura CSS, sem JS de animação.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Cascata do hero</strong>: o stagger dos
              blocos do hero usa <code className="font-mono text-xs">motion/react</code>{" "}
              (60ms entre filhos,{" "}
              <code className="font-mono text-xs">viewport.once</code>).
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Reveal sob scroll</strong>: blocos abaixo
              da dobra sobem 8px com fade de 400ms quando entram na viewport, também via
              motion. Tudo respeita{" "}
              <code className="font-mono text-xs">prefers-reduced-motion</code> pelo{" "}
              <code className="font-mono text-xs">MotionConfig reducedMotion="user"</code>{" "}
              no layout raiz.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Cross-fade entre rotas</strong>: o
              atributo <code className="font-mono text-xs">transitionTypes</code> nos
              <code className="font-mono text-xs">Link</code> das hubs (home, /appsec,
              /cloudsec, /agentes) está mantido como no-op declarado. Ele não causa
              efeito visível hoje, mas fica no código para quando a API estabilizar e o
              nome do snapshot voltar a fazer sentido.
            </span>
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-foreground/85">
          É o que tentamos e por que não está no ar: a regra do jogo foi tentar a
          primitiva nativa primeiro e só cair para a lib onde ela falha. Se o React
          estabilizar o export em uma release futura, o snapshot por nome volta; enquanto
          isso, o pacote fica onde estava.
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
              <strong className="font-semibold">R5 posições completas</strong>: todo
              tópico de um domínio com{" "}
              <code className="font-mono text-xs">graphLayout</code> tem posição, sem
              órfãos no layout.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">R6 piso de conteúdo live</strong>: para
              cada tópico em domínio{" "}
              <code className="font-mono text-xs">live</code>, ≥ 4 seções e{" "}
              <code className="font-mono text-xs">(code ≥ 1 OR bullets ≥ 3)</code> e
              tagline não vazia e ≥ 3 ferramentas. Hoje os três domínios (
              <code className="font-mono text-xs">appsec</code>,{" "}
              <code className="font-mono text-xs">cloudsec</code>,{" "}
              <code className="font-mono text-xs">ai-agents</code>) são live e cobrem
              33 tópicos no total, todos passando.
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
          <code className="font-mono text-xs">out/</code> inteiro e compara sete
          métricas contra caps duros. O status atual:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{`first-load assets            3.459.024 B    cap 3.500.000  OK
rsc prefetch payloads      2.980.616 B    cap 3.050.000  OK
total                      6.439.640 B    cap 6.550.000  OK
CSS raw                        57.893 B    cap    60.000  OK
JS raw                     1.133.379 B    cap 1.135.000  OK
JS gzip                      364.036 B    cap   400.000  OK
out/index.html raw            28.307 B    cap    90.000  OK`}
        </pre>
        <p className="mt-4 leading-relaxed text-foreground/85">
          Em números aproximados: ~3,4 MB de first-load, ~6,4 MB totais (incluindo RSC
          prefetch), ~58 KB de CSS e ~1,13 MB de JS raw. 42 páginas pré-renderizadas
          (3 hubs + 1 glossário + 1 segurança + 33 tópicos + rotas auxiliares). Os caps
          sobem só quando o conteúdo sobe, e a cada bump fica registrado no cabeçalho do{" "}
          <code className="font-mono text-xs">scripts/check-budget.mjs</code> para
          manter a história de números rastreável.
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
              <strong className="font-semibold">style-src com 'unsafe-inline'</strong>:
              dois consumidores escrevem estilo inline. O grafo interativo (React Flow)
              posiciona nós via atributos{" "}
              <code className="font-mono text-xs">style</code>, e as animações desta
              versão (motion) também:{" "}
              <code className="font-mono text-xs">m.*</code> aplica transformações e
              opacidade direto no atributo em runtime, não via classes. Sem isso o mapa
              não renderiza e o stagger não anima. Risco aceito e delimitado, e o
              mesmo allowlist cobre os dois.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Uma dependência de animação em runtime</strong>:
              motion 14.1.0 é a única dep adicionada neste ciclo. Pinada com versão
              exata, lockfile versionado, ~115 KB raw / ~38 KB gzip em um chunk
              compartilhado, e nada de fallback em CDN. Os trade-offs completos estão na
              seção "Dependência adicionada neste ciclo" acima.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">Três domínios, 33 tópicos</strong>: o
              catálogo cobre AppSec, CloudSec e Agentes, todos com status{" "}
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