import type { Topic } from "@/content/types";

export const cicd: Topic = {
  domain: "appsec",
  slug: "cicd",
  title: "CI/CD",
  short: "A esteira automatizada de build, teste e deploy",
  tagline:
    "A espinha dorsal do software moderno: cada commit vira build, teste e deploy sem intervenção manual.",
  kind: "pratica",
  stage: "source → prod",
  tools: ["GitHub Actions", "GitLab CI", "Jenkins", "Azure DevOps"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Integração Contínua (CI) é a prática de validar automaticamente cada mudança de código: a cada push ou pull request, a pipeline compila o projeto e roda os testes. O objetivo é descobrir em minutos — não em semanas — que uma mudança quebrou algo.",
        "Entrega/Deploy Contínuo (CD) estende a esteira até o fim: o artefato validado é empacotado e publicado. Na entrega contínua o deploy para produção ainda exige um clique humano; no deployment contínuo, tudo que passa nos portões vai ao ar sozinho.",
      ],
    },
    {
      heading: "Anatomia de uma pipeline",
      body: [
        "Os nomes variam entre ferramentas, mas quase toda pipeline segue a mesma espinha dorsal:",
      ],
      bullets: [
        "source — push ou PR dispara a esteira a partir do repositório",
        "build — compila, instala dependências e resolve o que o código precisa",
        "test — testes unitários, de integração e verificações de segurança",
        "package — gera o artefato final: binário, pacote ou imagem de container",
        "deploy — publica em staging e, depois, em produção",
        "monitor — observabilidade, alertas e caminho de rollback",
      ],
    },
    {
      heading: "A esteira em código",
      body: [
        "Abstração vira clareza quando você vê a esteira escrita: o workflow abaixo é uma pipeline real de GitHub Actions, com o gatilho (source), build, testes e uma verificação de segurança rodando como mais um passo.",
      ],
      code: [
        {
          filename: ".github/workflows/ci.yml",
          language: "yaml",
          code: "name: ci\non: [push, pull_request]        # stage source: o que dispara\npermissions:\n  contents: read                # privilégio mínimo para o token da esteira\njobs:\n  ci:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci                # build: instala de forma reprodutível\n      - run: npm test              # test: a suíte de testes\n      - run: pipx run semgrep scan --config auto --error   # segurança como mais um passo\n      - run: docker build -t app . # package: gera o artefato",
        },
      ],
    },
    {
      heading: "Por que é o ponto central da segurança",
      body: [
        "Cada stage é um portão onde uma verificação de segurança pode entrar: SAST e SCA no build, DAST no staging, secrets scanning no source. É isso que o DevSecOps explora.",
        "E o avesso também vale: quem controla a pipeline controla o que vai para produção. O ataque à SolarWinds (2020) comprometeu exatamente o sistema de build — a esteira virou o vetor de distribuição do malware. Pipe é infraestrutura crítica.",
      ],
    },
  ],
};
