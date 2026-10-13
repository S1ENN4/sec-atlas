# appsec/kb

Knowledge base visual de segurança de software, organizada por domínios. Cada domínio é um grafo independente: conceitos, esteira, conexões e glossário, renderizados do mesmo jeito. Três mapas prontos (`appsec`, `cloudsec`, `ai-agents`), todos com a mesma profundidade.

## Visão geral

- **3 domínios, 33 tópicos** (8 appsec + 10 cloudsec + 15 ai-agents)
- **Next.js 16** (App Router) com `output: "export"`, site 100% estático, sem servidor
- **Tailwind CSS 4** + componentes no estilo shadcn/ui
- **React Flow** (`@xyflow/react`) para o grafo de estudos
- Conteúdo tipado em TypeScript (`src/content/`), sem CMS, sem banco

Domínios e rotas (a única fonte é `domainMeta` em `src/content/registry.ts`):

| DomainId     | route       | status | accent   |
|--------------|-------------|--------|----------|
| `appsec`     | `/appsec`   | live   | emerald  |
| `cloudsec`   | `/cloudsec` | live   | sky      |
| `ai-agents`  | `/agentes`  | live   | violet   |

A postura dogfooding (CSP, headers, scripts) está documentada em [/seguranca](/seguranca).

## Estrutura do repositório

```
src/
  content/
    types.ts                 tipos compartilhados (Domain, Relation, PipelineStage, ...)
    registry.ts              agrega domínios e expõe o contrato público
    profile.ts               seus dados pessoais (hero, /sobre, rodapé): edite só este arquivo
    sources.ts               fontes primárias por domínio (/fontes)
    changelog.ts             registro público de mudanças e correções (/novidades)
    quiz/                    banco de perguntas por domínio (QuizBank, 3+ perguntas por tópico)
    bridges.ts               pontes entre domínios ("o mesmo problema, em outro domínio")
    paths.ts                 trilhas de estudo (ordem sugerida de tópicos)
    scenarios.ts             cenários de ataque passo a passo (/cenarios)
    <domain>/
      index.ts               pacote do domínio (Domain = topics + relations + pipeline + glossary + graphLayout)
      pipeline.ts            estágios da esteira (PipelineStage[])
      relations.ts           arestas concept-to-concept (Relation[])
      glossary.ts            agrupamentos de termos (GlossaryGroup[])
      graph-layout.ts        posições e arestas do React Flow (DomainGraphLayout)
      topics/
        <slug>.ts            um arquivo por tópico (Topic), export const <slug>: Topic
src/app/
  page.tsx                   hub (/)
  seguranca/page.tsx         /seguranca, postura dogfooding
  glossario/page.tsx         /glossario
  sobre/ fontes/ novidades/  /sobre (perfil, bastidores), /fontes, /novidades
  sitemap.ts robots.ts       sitemap.xml e robots.txt estáticos
  opengraph-image.tsx        imagem de pré-visualização de link (LinkedIn etc.)
  trilhas/page.tsx           /trilhas (trilhas de estudo + progresso)
  cenarios/page.tsx          /cenarios (siga o ataque)
  search-index.json/         índice de busca estático (buscado sob demanda pela paleta Ctrl+K)
  quiz.json/                 banco de quiz estático (buscado quando o quiz chega perto da tela)
  appsec/                    /appsec (home + topico/[slug] dinâmico)
  cloudsec/                  /cloudsec (home + topico/[slug] dinâmico)
  agentes/                   /agentes (home + topico/[slug] dinâmico)
src/components/              UI compartilhada (cards, badges, header, footer, motion/)
  domain-graph.tsx           wrapper de servidor: reduz o domínio a GraphData enxuto
  domain-graph-client.tsx    renderer do mapa (React Flow): foco, filtros, painel, deep link ?foco=<slug>
  graph-panel.tsx            painel de detalhes do nó selecionado
  domain-list.tsx            visão em lista por etapa (padrão no celular)
  search-palette.tsx         busca global (Ctrl/Cmd+K ou "/")
  quiz.tsx, path-card.tsx    quiz por tópico e trilhas, com progresso
src/lib/progress.ts          progresso de estudo em localStorage (nenhum dado sai do navegador)
scripts/
  validate-content.mjs       prebuild: regras R1 a R8
  check-budget.mjs           pós-build: caps de tamanho
  content-alias-loader.mjs   loader de alias `@/*` para Node
  resolve-alias.mjs          helper
public/
  _headers                   cabeçalhos de segurança (Netlify/CF)
  _redirects                 redirects (Netlify/CF)
```

A rota de cada domínio é montada pelo Next a partir dos arquivos em `src/app/<route>/`, mas a única fonte canônica do mapeamento DomainId → route está em `src/content/registry.ts` (`domainMeta`). Mexer só em `src/app/` sem mexer em `domainMeta` (ou vice-versa) quebra os cards do hub.

### Contrato público do registry

`src/content/registry.ts` é o único ponto de entrada do conteúdo. Re-exporta tipos e expõe:

| Export                | Forma                                            | O que faz                                                                  |
|-----------------------|--------------------------------------------------|----------------------------------------------------------------------------|
| `domains`             | `Record<DomainId, Domain>`                       | acesso direto por DomainId                                                 |
| `allTopics`           | `Topic[]`                                        | lista achatada de todos os tópicos, em ordem determinística                |
| `domainMeta`          | `Record<DomainId, DomainMeta>`                   | mapa DomainId → `{id, route, status, accent}`; única fonte da rota         |
| `getTopic(ref)`       | `(TopicRef \| string) => Topic \| undefined`      | aceita slug puro (legado) ou `{domain, slug}` (canônico)                   |
| `relationsOf(ref)`    | `(TopicRef \| string) => Relation[]`             | arestas em que o ref entra como source ou target                           |
| `getPipeline(id)`     | `(DomainId) => PipelineStage[]`                  | estágios da esteira do domínio                                             |
| `getGlossary(id)`     | `(DomainId) => GlossaryGroup[]`                  | agrupamentos de glossário                                                  |
| `getGraphLayout(id)`  | `(DomainId) => DomainGraphLayout \| undefined`   | layout do grafo; presente em domínios com `graphLayout`                     |

Identidade de tópico é composta (`{domain, slug}`), não só o slug. Por isso dois domínios podem usar `secrets` (AppSec) e `secrets-cloud` (CloudSec) sem colidir.

## Adicionando um tópico

O caminho canônico, do começo ao fim:

1. **Crie o arquivo do tópico** em `src/content/<domain>/topics/<slug>.ts`:

   ```ts
   import type { Topic } from "@/content/types";

   export const <slug>: Topic = {
     domain: "<domain>",            // "appsec" | "cloudsec" | "ai-agents"
     slug: "<slug>",                // único dentro do domínio
     title: "...",
     short: "...",
     tagline: "...",                // >= 1 caractere não-vazio (R6)
     kind: "tecnica" | "pratica" | "conceito",
     stage: "<id-do-stage>" | null,
     tools: ["...", "...", "..."], // >= 3 quando o domínio está live (R6)
     sections: [
       { heading: "...", body: ["..."], bullets: ["..."], code: [{ language, filename?, code }] },
       // >= 4 seções quando o domínio está live (R6)
     ],
   };
   ```

2. **Adicione o import e a entrada** em `src/content/<domain>/index.ts`:

   ```ts
   import { <slug> } from "./topics/<slug>";
   // ...
   topics: [/* ..., */ <slug>],
   ```

3. **Posicione o nó** em `src/content/<domain>/graph-layout.ts`:

   - tópico comum → entrada em `conceptPositions` com `{ x, y }`;
   - tópico que age como camada/overlay (ex.: `zero-trust` no cloudsec) → adicione o slug em `layerSlugs` e em `layerPositions`;
   - se o tópico se prende a um stage da esteira, registre em `conceptAttachments` com `sourceHandle` e `targetHandle`;
   - arestas visíveis no canvas vão em `crossRelations`.

4. **Costure o lado textual**. Em `src/content/<domain>/relations.ts` entram as conexões mostradas na página do tópico; se o tópico fizer parte da esteira, adicione `{ label, slug: "<slug>" }` no item do stage correspondente em `pipeline.ts`.

5. **Escreva o quiz** em `src/content/quiz/<domain>.ts` (`QuizBank`, chaveado pelo slug): no mínimo 3 perguntas com exatamente 4 opções distintas, `answer` entre 0 e 3 e `explain` não vazio (R7). A ordem das opções é embaralhada na tela, então a resposta certa pode ficar em qualquer posição no arquivo.

6. **Opcional, mas recomendado**: ligue o tópico a outros domínios em `src/content/bridges.ts`, inclua-o numa trilha em `src/content/paths.ts` ou num passo de cenário em `src/content/scenarios.ts` (R8 garante que nada aponte para tópico inexistente), e adicione um ícone em `src/components/topic-icon.tsx`.

7. **Valide** rodando `npm run build`. O `prebuild` (`scripts/validate-content.mjs`) executa R1 a R8 e quebra o build antes do `next build` se algo falhar.

### Regras do validador

| Regra | O que confere                                                                                   |
|-------|-------------------------------------------------------------------------------------------------|
| R1    | IDs compostos `(domain, slug)` são únicos entre todos os domínios                              |
| R2    | Toda `Relation.source` e `Relation.target` resolve para um tópico existente                    |
| R3    | Todo `PipelineStage.items[].slug` (quando presente) resolve para um tópico no mesmo domínio    |
| R4    | Toda `GlossaryEntry.topic` (campo opcional) resolve; cross-domain é permitido                  |
| R5    | Em domínios com `graphLayout`, todo tópico tem posição e não há posições órfãs                  |
| R6    | Floor de conteúdo por tópico, em domínios com `status: "live"`: `sections.length >= 4` E (`code >= 1` OU `bullets >= 3`) E `tagline` não vazia E `tools.length >= 3`. Em `status: "draft"`, R6 é pulado e só R1 a R5 rodam |
| R7    | Todo tópico tem quiz válido (>= 3 perguntas, 4 opções distintas, `answer` em 0..3, `explain` não vazio) e não há quiz órfão |
| R8    | Pontes, trilhas e cenários só apontam para tópicos existentes; pontes cruzam domínios; todo `stageId` de cenário existe na esteira do domínio |

Os limiares de R6 espelham os 8 tópicos de referência do AppSec. Não suba os caps por conteúdo novo sem necessidade: ajuste o conteúdo até caber.

## Publicação e link preview

Defina a URL pública no build para o sitemap e as imagens de preview saírem com o domínio certo:

```bash
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com npm run build
```

Sem a variável, o build usa `http://localhost:3000`. Depois de publicar, force o LinkedIn a reler o preview em https://www.linkedin.com/post-inspector/.

## Comandos

```bash
npm install        # uma vez; o lockfile é versionado
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # prebuild (R1 a R8) + next build (gera out/) + check-budget
```

`npm run build` é, na ordem: `prebuild` (validator) → `next build` (gera `out/`) → `check-budget.mjs` (confere os caps). Se o validator falhar, `next build` nem roda. Se o budget falhar, o build retorna código 1 com a linha que estourou.

Para servir o `out/` local, qualquer servidor estático serve:

```bash
npx serve out
```

### Caps do check-budget

Os limites ficam em `scripts/check-budget.mjs` (bytes):

| métrica            | cap atual    |
|--------------------|--------------|
| first-load assets  | 4.700.000    |
| rsc prefetch       | 4.600.000    |
| total              | 9.300.000    |
| CSS raw            | 72.000       |
| JS raw             | 1.030.000    |
| JS gzip            | 330.000      |
| `out/index.html`   | 57.000       |

Cada bump nesses números tem commit de reconciliação e motivo no header do script. Se o conteúdo novo pedir mais, siga o mesmo padrão: bump mínimo + parágrafo explicando qual conteúdo forçou.

## Deploy

`out/` é auto-suficiente. Faça upload para qualquer host estático (Netlify, Cloudflare Pages, Vercel, GitHub Pages, S3).

Dois arquivos de configuração já vêm prontos para hosts no formato Netlify/Cloudflare Pages:

- `public/_headers` aplica `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`.
- `public/_redirects` traz os redirecionamentos permanentes. Hoje só redireciona `/topico/* → /appsec/topico/:splat 301` para cobrir URLs antigas.

Em Vercel, traduza `public/_headers` para entradas `headers` em `vercel.json`. A lógica e os trade-offs estão documentados em [/seguranca](/seguranca).

## Sistema de motion

Pequeno, intencional, e respeitando `prefers-reduced-motion` em três camadas.

- **Tokens**: `--animate-page-enter`, `--animate-hero-enter`, `--animate-chip-in` e os easings `--ease-out-cubic` / `--ease-out-quart` ficam em `src/app/globals.css` dentro de `@theme inline`. `page-enter` corre em 240ms, `hero-enter` em 400ms, `chip-in` em 150ms.
- **Primitivos**: a árvore React entra no `MotionProvider` (`src/components/motion/provider.tsx`) com `LazyMotion(..., strict)` + `domMax` e `reducedMotion="user"`. Os primitivos expostos são `Reveal`, `Stagger` e `StaggerItem` em `src/components/motion/{reveal,stagger,item}.tsx`. Todos usam `m.*`, não `motion.*`, então o bundle de gestos só carrega sob demanda.
- **CSS**: classes `animate-page-enter`, `animate-hero-enter`, `animate-chip-in` (consumidas via `animate-*` do Tailwind) e o keyframe `reveal` para entradas scroll-driven. O stagger do grafo (`.graph-entering .react-flow__node > div`) usa Web Animations API a partir de `onInit` do React Flow.
- **Reduced motion, três caminhos**. (1) `<MotionConfig reducedMotion="user">` no provider corta transforms não-essenciais. (2) `@media (prefers-reduced-motion: reduce)` em `globals.css` clampa `animation-duration` e `transition-duration` para `0.01ms` e força `scroll-behavior: auto`. (3) `.reveal` usa `animation-timeline: view()`, gated em `@supports`, então em navegadores sem suporte o reveal simplesmente não roda e o conteúdo segue visível.

Dependência fixa em `motion@14.1.0` (vide `package.json`).

## Postura de segurança

Sem backend, sem banco, sem formulários, sem analytics, sem cookies, sem scripts de terceiros. O único dado guardado é o progresso de estudo, em `localStorage`, apenas no navegador do leitor. Dependências com versões exatas e lockfile versionado. Fontes e assets self-hosted. A KB pratica o que publica: o checklist inteiro está em [/seguranca](/seguranca), com a CSP real e os trade-offs honestos.