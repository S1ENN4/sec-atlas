# appsec/kb

Knowledge base interativa de segurança de aplicações: SAST, DAST, SCA, secrets scanning, SBOM, CI/CD e DevSecOps — explicados em um grafo navegável.

## Stack

- **Next.js 16** (App Router) com `output: "export"` — site 100% estático, sem servidor
- **Tailwind CSS 4** + componentes no estilo shadcn/ui
- **React Flow** (`@xyflow/react`) para o grafo de estudos
- Conteúdo tipado em TypeScript (`src/lib/topics.ts`) — sem CMS, sem banco

## Rodando local

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # gera o site estático em out/
```

Para servir o resultado de `out/` localmente, qualquer servidor estático funciona
(ex.: `npx serve out`).

## Editando o conteúdo

Todo o conteúdo vive em `src/lib/topics.ts`:

- `topics` — cada tópico: slug, título, tagline, tipo (`tecnica` | `pratica` | `conceito`),
  stage da pipeline, ferramentas e seções (parágrafos + bullets)
- `relations` — as arestas do grafo (origem, destino, rótulo e handles de conexão)
- posições dos nós no canvas: `positions` em `src/components/study-graph.tsx`

Adicionar um tópico novo = adicionar um objeto em `topics`, uma posição e as relações.
A rota `/topico/<slug>` é gerada estaticamente para cada um.

## Deploy

O diretório `out/` é auto-suficiente: suba para qualquer host estático
(Netlify, Cloudflare Pages, Vercel, GitHub Pages, S3...).

`public/_headers` traz cabeçalhos de segurança (CSP, frame-ancestors, nosniff,
Permissions-Policy) no formato Netlify/Cloudflare Pages. Na Vercel, traduza para
entradas `headers` no `vercel.json`. A lógica e os trade-offs estão documentados
na rota `/seguranca` do próprio site.

## Postura de segurança

Sem backend, sem banco, sem formulários, sem analytics, sem cookies, sem scripts
de terceiros. Dependências com versões exatas e lockfile versionado. Fontes e
assets self-hosted. Detalhes e trade-offs honestos em `/seguranca`.
