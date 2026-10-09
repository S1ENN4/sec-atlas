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
    body: "O site é 100% estático: sem servidor de aplicação, sem banco de dados, sem API, sem formulários. Não existe backend para explorar — o que é servido são apenas arquivos HTML, CSS e JS gerados em build.",
  },
  {
    icon: EyeOff,
    title: "Zero coleta de dados",
    body: "Sem analytics, sem telemetria, sem cookies, sem fingerprinting, sem scripts de terceiros. Nada sobre você sai do seu navegador porque nada é pedido.",
  },
  {
    icon: PackageCheck,
    title: "Cadeia de suprimentos controlada",
    body: "Dependências com versões exatas e lockfile versionado (o próprio SCA desta KB). Fontes e assets são self-hosted — nenhum recurso é buscado de CDN em runtime.",
  },
  {
    icon: FileLock2,
    title: "Cabeçalhos HTTP restritivos",
    body: "O arquivo public/_headers define Content-Security-Policy, frame-ancestors 'none', nosniff, Permissions-Policy e políticas de isolamento para os hosts que o suportam (Netlify, Cloudflare Pages).",
  },
];

export default function SegurancaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">dogfooding</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          A segurança desta própria página
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Uma knowledge base sobre segurança precisa praticar o que publica. Este é o checklist que
          ela mesma segue — e que você pode cobrar de qualquer site estático.
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
        <h2 className="text-xl font-semibold tracking-tight text-primary/90">Trade-offs honestos</h2>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">script-src com 'unsafe-inline'</strong>: o export
              estático do Next injeta pequenos scripts inline de hidratação. O caminho de
              endurecimento é migrar para CSP por hash ou nonce no deploy — documentado como
              próximo passo, não escondido.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">style-src com 'unsafe-inline'</strong>: o grafo
              interativo (React Flow) posiciona nós via atributos de estilo inline. Sem isso o
              mapa não renderiza — risco aceito e delimitado.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed text-foreground/85">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold">_headers depende do host</strong>: aberto via
              file:// ou servido por um servidor genérico, os cabeçalhos não se aplicam. A
              proteção entra em vigor no deploy, em host que respeite o arquivo.
            </span>
          </li>
        </ul>
      </section>
    </article>
  );
}
