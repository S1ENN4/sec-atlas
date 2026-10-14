# appsec/kb

[![CI](https://github.com/S1ENN4/appsec-kb/actions/workflows/ci.yml/badge.svg)](https://github.com/S1ENN4/appsec-kb/actions/workflows/ci.yml)
[![CodeQL](https://github.com/S1ENN4/appsec-kb/actions/workflows/codeql.yml/badge.svg)](https://github.com/S1ENN4/appsec-kb/actions/workflows/codeql.yml)
[![Código: MIT](https://img.shields.io/badge/código-MIT-blue.svg)](LICENSE)
[![Conteúdo: CC BY-SA 4.0](https://img.shields.io/badge/conteúdo-CC%20BY--SA%204.0-lightgrey.svg)](LICENSE-CONTENT.md)

**Base de conhecimento de segurança de software e de carreira**, em três idiomas (en, pt, es): o que cada verificação faz, onde ela entra na esteira, como as peças se conectam e como chegar a cada cargo. Cada domínio é um grafo independente, com conceitos, esteira, conexões, glossário, quizzes e trilhas de estudo. Dois guias por cima deles: a **Jornada** (mapa guiado do básico ao avançado, com pré-requisitos e progresso salvo no navegador) e **Carreiras** (roadmaps por cargo, com o que estudar aqui, o que aprender fora e o que construir).

| Domínio | Rota | Foco |
|---|---|---|
| AppSec | `/appsec` | SAST, DAST, SCA, secrets, SBOM, threat modeling e a esteira de CI/CD |
| OWASP Top 10 | `/owasp` | os 10 riscos de 2025, com código vulnerável e corrigido em várias linguagens e o teste que prova a correção |
| Engenharia | `/engineering` | IaC seguro, policy as code, hardening de CI/CD, confiabilidade, automação e IA |
| DevOps | `/devops` | Linux, Git, containers, pipelines, releases, IaC, Kubernetes, observabilidade e SRE |
| CloudSec | `/cloudsec` | IAM, rede, Kubernetes, containers, postura, runtime e resposta a incidentes |
| SecOps | `/secops` | defesa de borda L7: WAF, rate limiting, bots, detecção e SLOs de SOC |
| Resposta a incidentes | `/response` | ciclo de vida, threat hunting e inteligência, ransomware, forense e malware |
| Segurança ofensiva | `/offensive` | autorização e método, recon, testes web e de API, caminhos de ataque, red/purple team e relatórios |
| GRC e liderança | `/grc` | risco, frameworks, terceiros, arquitetura, conformidade, métricas, estratégia e comunicação de crise |
| Agentes de IA | `/agents` | RAG, tool calling, MCP, guardrails e avaliação |
| Vibecoding | `/vibecoding` | ferramentas de código com IA: camadas, comparação, contexto, agentes em paralelo, verificação e segurança |

Onze mapas prontos. Os domínios novos (owasp, devops, response, offsec, grc, vibecoding) são escritos em inglês (idioma-fonte) e traduzidos por camadas; os cinco primeiros ainda estão em português e são migrados em lotes (veja a seção de i18n).

## Obsidian (e qualquer leitor de Markdown)

O conteúdo continua em TypeScript (tipos, validação, detecção de drift de tradução), mas pode ser exportado como um **vault de notas `.md`**: uma nota por tópico, com frontmatter YAML, wikilinks para relações, pré-requisitos e pontes entre domínios, quizzes como callouts e notas de carreiras, trilhas e glossário.

```bash
npm run export:obsidian                      # vault/<en|pt|es>/
npm run export:obsidian -- --locale pt --out ~/Notas/appsec-kb
```

O vault é saída gerada e somente leitura: edite as fontes e exporte de novo. Aponte o Obsidian para a pasta do idioma que quiser.

## Contribua

O projeto é aberto e **a ajuda mais valiosa é achar e corrigir erros**: segurança com informação imprecisa é pior que segurança ausente.

- Encontrou um erro? Abra uma issue com o modelo **Erro de conteúdo**.
- Quer escrever um tópico? Veja o [CONTRIBUTING](CONTRIBUTING.md) e a seção [Adicionando um tópico](#adicionando-um-tópico).
- Achou uma vulnerabilidade no site? Siga a [política de segurança](SECURITY.md) (relato privado).

## Transparência sobre IA

Parte do texto foi produzida com apoio de IA (Claude) e está em **revisão técnica contínua**. Não trate o conteúdo como fonte única: confira as referências em `/fontes`. Contribuições assistidas por IA são bem-vindas, desde que verificadas e declaradas (veja o [CONTRIBUTING](CONTRIBUTING.md)).

## Licenças

- **Código**: [MIT](LICENSE).
- **Conteúdo** (`src/content/**` e textos longos da documentação): [CC BY-SA 4.0](LICENSE-CONTENT.md). Dados pessoais do mantenedor (`src/content/profile.ts`, página `/sobre`) **não** são licenciados para reuso: substitua-os se fizer um fork.

## Visão geral

- **11 domínios, 106 tópicos**, 15 cargos em Carreiras, em en/pt/es
- **Next.js 16** (App Router) com `output: "export"`, site 100% estático, sem servidor
- **Tailwind CSS 4** + componentes no estilo shadcn/ui
- Mapa de aprendizado próprio (DOM + SVG, sem biblioteca de grafos): colunas por nível, setas de pré-requisito, estados feito/pronto/bloqueado e painel de prévia
- Conteúdo tipado em TypeScript (`src/content/`), sem CMS, sem banco

Domínios e rotas (a única fonte é `domainMeta` em `src/content/registry.ts`):

| DomainId     | route         | status |
|--------------|---------------|--------|
| `appsec`     | `/appsec`     | live   |
| `owasp`      | `/owasp`      | live   |
| `seceng`     | `/engineering`| live   |
| `devops`     | `/devops`     | live   |
| `cloudsec`   | `/cloudsec`   | live   |
| `secops`     | `/secops`     | live   |
| `response`   | `/response`   | live   |
| `offsec`     | `/offensive`  | live   |
| `grc`        | `/grc`        | live   |
| `ai-agents`  | `/agents`     | live   |
| `vibecoding` | `/vibecoding` | live   |

Para criar um domínio novo: escreva os arquivos do domínio (`src/content/<dir>/` e `src/content/quiz/<dir>.ts`) e rode `python scripts/wire-domain.py <spec.json>`, que registra o domínio no tipo, no registro, no quiz, no menu, nas cores, nos ícones, na busca, nas fontes, nos níveis da Jornada e no dicionário de UI. Depois traduza as strings de UI com `npm run i18n -- apply`.

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
      index.ts               pacote do domínio (Domain = topics + relations + pipeline + glossary)
      pipeline.ts            estágios da esteira (PipelineStage[])
      relations.ts           arestas concept-to-concept (Relation[])
      glossary.ts            agrupamentos de termos (GlossaryGroup[])
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
  learning-map.tsx           mapa de aprendizado: níveis, pré-requisitos, próximo passo, painel, deep link ?focus=<slug>
  graph-panel.tsx            painel de detalhes do nó selecionado
  domain-list.tsx            visão em lista por etapa (padrão no celular)
  search-palette.tsx         busca global (Ctrl/Cmd+K ou "/")
  quiz.tsx, path-card.tsx    quiz por tópico e trilhas, com progresso
src/lib/progress.ts          progresso de estudo em localStorage (nenhum dado sai do navegador)
scripts/
  i18n.mjs, i18n-test.mjs   CLI e testes do sistema de traduções (npm run i18n / test:i18n)
  mcp-smoke.mjs              teste de fumaça do servidor MCP (npm run test:mcp)
  validate-content.mjs       prebuild: regras R1 a R9
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

Identidade de tópico é composta (`{domain, slug}`), não só o slug. Por isso dois domínios podem usar `secrets` (AppSec) e `secrets-cloud` (CloudSec) sem colidir.

## Adicionando um tópico

O caminho canônico, do começo ao fim:

1. **Crie o arquivo do tópico** em `src/content/<domain>/topics/<slug>.ts`:

   ```ts
   import type { Topic } from "@/content/types";

   export const <slug>: Topic = {
     domain: "<domain>",            // "appsec" | "cloudsec" | "ai-agents" | "secops" | "seceng" | "owasp" | "devops" | "response" | "offsec" | "grc" | "vibecoding"
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

3. **Dê um nível e pré-requisitos** em `src/content/levels.ts` (`"<domain>/<slug>": { level: 1 | 2 | 3, requires: [...] }`). Não há coordenadas para posicionar: o mapa organiza os tópicos por nível e desenha as setas de pré-requisito (R10 exige uma entrada por tópico, sem ciclos).

4. **Costure o lado textual**. Em `src/content/<domain>/relations.ts` entram as conexões mostradas na página do tópico; se o tópico fizer parte da esteira, adicione `{ label, slug: "<slug>" }` no item do stage correspondente em `pipeline.ts`.

5. **Escreva o quiz** em `src/content/quiz/<domain>.ts` (`QuizBank`, chaveado pelo slug): no mínimo 3 perguntas com exatamente 4 opções distintas, `answer` entre 0 e 3 e `explain` não vazio (R7). A ordem das opções é embaralhada na tela, então a resposta certa pode ficar em qualquer posição no arquivo.

6. **Opcional, mas recomendado**: ligue o tópico a outros domínios em `src/content/bridges.ts`, inclua-o numa trilha em `src/content/paths.ts` ou num passo de cenário em `src/content/scenarios.ts` (R8 garante que nada aponte para tópico inexistente), e adicione um ícone em `src/components/topic-icon.tsx`.

7. **Valide** rodando `npm run build`. O `prebuild` (`scripts/validate-content.mjs`) executa R1 a R9 e quebra o build antes do `next build` se algo falhar.

### Regras do validador

| Regra | O que confere                                                                                   |
|-------|-------------------------------------------------------------------------------------------------|
| R1    | IDs compostos `(domain, slug)` são únicos entre todos os domínios                              |
| R2    | Toda `Relation.source` e `Relation.target` resolve para um tópico existente                    |
| R3    | Todo `PipelineStage.items[].slug` (quando presente) resolve para um tópico no mesmo domínio    |
| R4    | Toda `GlossaryEntry.topic` (campo opcional) resolve; cross-domain é permitido                  |
| R5    | A etapa (`stage`) de cada tópico é uma etapa da esteira do domínio (appsec é legado)           |
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

## Idiomas (en / pt / es) e como evitamos o drift

O site existe em **inglês, português e espanhol** (`/en`, `/pt`, `/es`). O **inglês é a fonte da verdade**: conteúdo novo nasce em inglês e as outras línguas são traduções que acompanham o original. `/` escolhe o idioma pelo navegador (ou pela última escolha) e redireciona.

### Como funciona

- Cada trecho traduzível tem um **endereço estável** (`sections.2.body.0`). Ids, slugs, enums e nomes de ferramentas nunca são traduzidos.
- Cada tradução guarda o **hash do texto de origem** em `src/content/i18n/<idioma>/...json`.
- Mudou o original → o hash não bate → a tradução vira **desatualizada**: ela nunca é exibida (aparece o original) e a **regra R9 quebra o build** até alguém resolver.
- **Traduzir é opcional, desatualizar não é.** Faltar tradução é permitido (a página mostra o idioma-fonte com um aviso). Uma tradução *velha* não é.
- **A interface é estrita:** todo texto de `src/i18n/ui-source.ts` precisa existir e estar atualizado nos 3 idiomas.
- Verificações extras: placeholders e tags iguais, mesmo número de linhas em exemplos de código, "tradução" idêntica ao original é rejeitada, e chaves do dicionário não podem colidir com nomes reservados.

### Fluxo (o que fazer quando o build reclama)

```bash
npm run i18n -- status                       # cobertura e drift por domínio/idioma
npm run i18n -- pending es --group secops    # o que falta traduzir (JSON com o texto-fonte)
npm run i18n -- apply lote.json              # grava traduções; os hashes são calculados aqui
npm run i18n -- prune                        # remove traduções desatualizadas (aparece no diff)
npm run i18n -- keep --unit ui --locale es   # confirma que o sentido não mudou (typo)
npm run test:i18n                            # testes das garantias anti-drift
```

Formato do `apply`: `{ "locale": "es", "unit": "topic:secops/waf", "entries": { "title": "..." } }`.

### Conteúdo legado (em português)

Os domínios atuais ainda têm o texto-fonte em português (`contentLang: "pt"` no índice do domínio). Eles funcionam em todos os idiomas: em `/en` e `/es` aparece o português com um aviso, até a tradução entrar por lote. Domínios novos devem ser escritos **em inglês** (omita `contentLang`).

## Servidor MCP para agentes

O repositório inclui um servidor [MCP](https://modelcontextprotocol.io/) local, **sem dependências**, para que agentes de código leiam, busquem, validem e estendam o conteúdo com os mesmos guardrails de uma pessoa. Ele fala MCP por stdio e roda a partir da raiz do repositório:

```bash
npm run mcp        # equivale a: node --import ./scripts/content-alias-loader.mjs mcp/server.mjs
```

O `.mcp.json` na raiz já registra o servidor (Claude Code pede aprovação na primeira vez). Em outros clientes, use o mesmo comando. Com o Claude Code:

```bash
claude mcp add appsec-kb -- node --import ./scripts/content-alias-loader.mjs mcp/server.mjs
```

| Ferramenta | Para quê |
|---|---|
| `list_domains`, `list_topics` | mapear domínios, etapas e tópicos existentes |
| `get_topic`, `search` | ler um tópico em Markdown e buscar conteúdo |
| `get_authoring_guide` | carregar o CONTRIBUTING e o passo a passo de autoria |
| `scaffold_topic` | criar o esqueleto de um tópico novo (só um arquivo novo; nunca sobrescreve) |
| `validate_content` | rodar o validador R1 a R9 |

Segurança do servidor: é local (stdio), não abre portas, **só escreve** em `src/content/<domínio>/topics/<slug>.ts` e recusa domínios, etapas ou slugs inválidos e caminhos fora dessa pasta. O `scaffold_topic` cria só o esqueleto com marcadores `TODO`: registrar o tópico, posicionar no mapa, escrever o quiz e **verificar o conteúdo** continua sendo trabalho de quem contribui. O teste `npm run test:mcp` cobre o protocolo e essas recusas, e roda no CI.

## Comandos

```bash
npm install        # uma vez; o lockfile é versionado
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # prebuild (R1 a R9) + next build (gera out/) + check-budget
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
| first-load assets  | 6.820.000    |
| rsc prefetch       | 7.400.000    |
| total              | 14.230.000   |
| all locales (sanity) | 40.000.000 |
| CSS raw            | 74.000       |
| JS raw             | 1.030.000    |
| JS gzip            | 330.000      |
| hub html (por idioma) | 75.500    |

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