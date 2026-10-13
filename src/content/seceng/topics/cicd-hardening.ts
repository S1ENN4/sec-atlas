import type { Topic } from "@/content/types";

export const cicdHardening: Topic = {
  domain: "seceng",
  slug: "cicd-hardening",
  title: "Hardening de CI/CD",
  short: "a esteira também é um alvo: protegê-la é proteger tudo que ela entrega",
  tagline:
    "A esteira guarda credenciais, executa código de terceiros e publica o que vai para produção. Comprometê-la é a rota mais curta para comprometer tudo.",
  kind: "pratica",
  stage: "entregar",
  tools: ["GitHub Actions", "GitLab CI", "Azure DevOps", "Sigstore cosign"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Hardening de CI/CD é reduzir o que um atacante consegue se comprometer a esteira: um runner, uma ação de terceiros, um token vazado ou um pull request malicioso. Os incidentes reais de cadeia de suprimentos mostram o padrão: o alvo deixa de ser a aplicação e passa a ser o caminho que leva o código à produção.",
      ],
    },
    {
      heading: "Fora com os segredos estáticos: OIDC",
      body: [
        "Chaves de nuvem guardadas como segredo da esteira vazam e vivem para sempre. A alternativa é a federação por OIDC: a esteira prova sua identidade ao provedor de nuvem com um token de curta duração, e o provedor entrega credenciais temporárias, restritas àquele repositório e àquela branch.",
      ],
      code: [
        {
          language: "yaml",
          filename: ".github/workflows/deploy.yml",
          code: "permissions:\n  contents: read        # mínimo por padrão\n  id-token: write       # permite pedir o token OIDC\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@<sha-completo-do-commit>   # fixado por SHA\n      - uses: aws-actions/configure-aws-credentials@<sha-completo>\n        with:\n          role-to-assume: arn:aws:iam::123456789012:role/ci-deploy\n          aws-region: us-east-1\n      - run: ./scripts/deploy.sh",
        },
      ],
    },
    {
      heading: "Dependências da esteira também são dependências",
      bullets: [
        "Fixar ações e imagens por digest ou SHA, não por tag mutável: uma tag pode ser reapontada para código malicioso.",
        "Permissões mínimas para o token da esteira, definidas por job.",
        "Cuidado com gatilhos que rodam código de forks com acesso a segredos (por exemplo, pull_request_target em GitHub Actions): tratar entrada de PR como não confiável.",
        "Injeção em scripts: nunca interpolar títulos de PR, nomes de branch ou mensagens de commit direto em comandos de shell.",
      ],
    },
    {
      heading: "Runners e ambientes",
      body: [
        "Runners efêmeros (um por job, descartado ao final) evitam que um job contamine o próximo e que credenciais fiquem em disco. Runners compartilhados e de longa vida acumulam estado e viram alvo. Separe os runners que fazem deploy em produção dos que rodam testes de código externo, e restrinja a rede de saída ao necessário.",
      ],
    },
    {
      heading: "Integridade do que sai da esteira",
      body: [
        "Assinar artefatos e registrar a proveniência (quem construiu, a partir de qual commit, em qual ambiente) permite que o destino verifique que o que vai rodar é exatamente o que a esteira produziu. Frameworks como o SLSA descrevem níveis crescentes dessas garantias, e ferramentas como o cosign cuidam da assinatura de imagens.",
      ],
    },
  ],
};
