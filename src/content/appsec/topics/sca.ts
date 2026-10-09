import type { Topic } from "@/content/types";

export const sca: Topic = {
  domain: "appsec",
  slug: "sca",
  title: "SCA",
  short: "Inventário e CVEs das dependências",
  tagline:
    "Vigia o código que você não escreveu: bibliotecas de terceiros, versões e vulnerabilidades conhecidas.",
  kind: "tecnica",
  stage: "build",
  tools: ["Dependabot", "Snyk", "Trivy", "OWASP Dependency-Check"],
  sections: [
    {
      heading: "O que é",
      body: [
        "SCA (Software Composition Analysis) inventaria as dependências do projeto — diretas e transitivas — e cruza cada versão com bancos públicos de vulnerabilidades (NVD, GitHub Advisory, OSV) e com bases de licenças.",
        "A premissa: a maior parte do código de uma aplicação moderna (frequentemente 70–90%) vem de terceiros. Sua superfície de risco inclui tudo isso, mesmo que ninguém do time tenha escrito uma linha dessas bibliotecas.",
      ],
    },
    {
      heading: "Um CVE de verdade: do lockfile ao alerta",
      body: [
        "O ponto de partida é sempre um manifesto ou lockfile. Digamos que o projeto dependa de uma versão antiga do lodash:",
      ],
      code: [
        {
          language: "json",
          filename: "package.json",
          code: "{ \"dependencies\": { \"lodash\": \"4.17.15\" } }",
        },
      ],
    },
    {
      heading: "O cruzamento com os advisories",
      body: [
        "O SCA pega cada componente+versão do lockfile e consulta os bancos de vulnerabilidades. Para o lodash 4.17.15, existe um advisory real e conhecido:",
      ],
      code: [
        {
          language: "json",
          filename: "advisory (OSV / GitHub Advisory)",
          code: "{\n  \"id\": \"CVE-2020-8203\",\n  \"package\": \"lodash\",\n  \"title\": \"Prototype pollution em zipObjectDeep\",\n  \"affected\": \"< 4.17.19\",\n  \"patched\": \"4.17.19\",\n  \"severity\": \"HIGH\"\n}",
        },
      ],
    },
    {
      heading: "Por que a versão transitiva é o pesadelo",
      body: [
        "O caso fica interessante quando o pacote vulnerável não está nem no seu package.json: ele entrou como dependência de dependência, três níveis abaixo. Você nunca escolheu aquele lodash — mas ele está no seu artefato rodando em produção.",
        "É aqui que o lockfile salva o dia: ele registra a árvore completa, não só o que está no manifesto. Sem SCA e sem lockfile, a pergunta 'usamos o lodash 4.17.15?' não tem resposta rápida nem no seu próprio repositório.",
      ],
    },
    {
      heading: "Como funciona, resumido",
      bullets: [
        "lê manifestos e lockfiles (package.json, package-lock, pom.xml, go.mod, requirements.txt)",
        "monta a árvore completa de dependências, incluindo as transitivas",
        "casa cada componente+versão com advisories publicados e pontua severidade (CVSS, EPSS, exploit conhecido)",
        "abre PRs automáticos de atualização e gera o SBOM do artefato",
      ],
    },
    {
      heading: "Onde entra na pipeline",
      body: [
        "No PR e no build, bloqueando dependências críticas novas. E continuamente depois do deploy: CVE novo contra versão antiga aparece todo dia — a ferramenta monitora o inventário e alerta (ou abre PR) quando uma dependência já usada vira risco.",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "só conhece vulnerabilidades já publicadas — zero-day em dependência passa",
        "não acha falha no seu código: para isso existem SAST e DAST",
        "sem política de severidade, vira fábrica de alertas ignorados",
      ],
    },
  ],
};
