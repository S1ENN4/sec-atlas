import type { Topic } from "@/content/types";

export const shiftLeft: Topic = {
  domain: "appsec",
  slug: "shift-left",
  title: "Shift-left",
  short: "Segurança o mais cedo possível",
  tagline: "Quanto mais à esquerda no ciclo a falha é encontrada, mais barato custa corrigi-la.",
  kind: "conceito",
  stage: null,
  tools: ["plugins de IDE", "pre-commit hooks", "checks de PR"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Desenhe o ciclo de vida do software da esquerda para a direita: código, build, teste, staging, produção. Shift-left é mover as verificações de segurança o máximo possível para a esquerda dessa linha — da produção em direção ao teclado de quem desenvolve.",
      ],
    },
    {
      heading: "Na prática: o hook que barra antes do commit",
      body: [
        "O exemplo mais tangível é o pre-commit: um hook local que roda as mesmas ferramentas da pipeline — mas na máquina do dev, antes do código sequer sair. A configuração abaixo roda secrets scanning e SAST a cada commit:",
      ],
      code: [
        {
          language: "yaml",
          filename: ".pre-commit-config.yaml",
          code: "repos:\n  - repo: https://github.com/gitleaks/gitleaks\n    hooks:\n      - id: gitleaks          # barra a chave antes do commit\n  - repo: https://github.com/semgrep/semgrep\n    hooks:\n      - id: semgrep\n        args: [\"--config\", \"auto\"]   # as mesmas regras do CI",
        },
      ],
    },
    {
      heading: "Defesa em camadas, não substituição",
      body: [
        "O hook local é rápido e barato, mas não é autoridade: dá para dar --no-verify e pular. É por isso que a mesma verificação roda de novo no PR e no build — camadas com custos diferentes. Cedo (IDE, pre-commit) para feedback rápido; depois (CI) como portão de verdade, que ninguém pula.",
      ],
    },
    {
      heading: "O efeito econômico",
      body: [
        "O custo de um defeito cresce ordens de magnitude conforme ele avança no ciclo: corrigir uma linha no editor custa segundos; o mesmo problema em produção pode custar um incidente, um vazamento e a confiança dos usuários. Shift-left não é sobre gostar de segurança — é sobre aritmética.",
      ],
    },
    {
      heading: "O limite do shift-left",
      body: [
        "Antecipar não elimina o que vem depois: algumas vulnerabilidades só existem no sistema montado, com configuração e dados reais — território do DAST e do monitoramento em produção. Shift-left é complemento das verificações tardias, não substituto.",
      ],
    },
  ],
};
