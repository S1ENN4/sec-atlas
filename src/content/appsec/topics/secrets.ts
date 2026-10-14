import type { Topic } from "@/content/types";

export const secrets: Topic = {
  domain: "appsec",
  slug: "secrets",
  title: "Secrets Scanning",
  short: "Detecta chaves e senhas no repositório",
  tagline: "Caça tokens, chaves de API e senhas antes que virem incidente — inclusive no histórico do git.",
  kind: "tecnica",
  stage: "source",
  tools: ["Gitleaks", "TruffleHog", "GitHub Secret Scanning"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Secrets scanning varre código, commits, pull requests e arquivos de configuração procurando credenciais: chaves de API, tokens de acesso, senhas, chaves privadas e connection strings.",
        "É a verificação mais barata da pipeline e protege contra um dos vazamentos mais comuns — credencial commitada por engano.",
      ],
    },
    {
      heading: "Como funciona: padrões e entropia",
      body: [
        "A primeira camada é pattern matching: formatos de token são reconhecíveis. Chaves da AWS começam com AKIA, tokens de API da Stripe com sk_live_, chaves privadas com -----BEGIN. Uma regex bem feita pega a maioria.",
        "A segunda camada é análise de entropia, para os formatos que ninguém documentou: strings com cara de aleatoriedade alta (muitos caracteres distintos, sem padrão de palavra) perto de nomes suspeitos como api_key, secret ou password. É o que pega chave caseira de serviço interno.",
        "A terceira camada, quando disponível, é verificação ativa: a ferramenta testa se a credencial encontrada é válida — transformando 'achado potencial' em 'incidente confirmado'.",
      ],
    },
    {
      heading: "Um vazamento, do commit à rotação",
      body: [
        "O cenário clássico em três atos. Ato um: alguém cola uma chave de produção direto no código — funciona, o teste passa, vida que segue.",
      ],
      code: [
        {
          language: "typescript",
          filename: "src/payments.ts",
          code: "const stripe = new Stripe(\"sk_live_EXAMPLEEXAMPLE0000000\");\n                              // chave de produção no código",
        },
      ],
    },
    {
      heading: "Ato dois: o bot já achou",
      body: [
        "Segundos depois do push, varredores automatizados de terceiros (e o secret scanning do próprio GitHub) já estão testando a chave. Apagar o commit não resolve — o segredo continua no histórico do git, em forks e em caches. Um relatório típico de scanner local:",
      ],
      code: [
        {
          language: "text",
          filename: "gitleaks report",
          code: "Finding:  stripe-access-token\nSecret:   sk_live_EXAMPLEEXAM...\nFile:     src/payments.ts:1\nCommit:   a1b2c3d\nEntropy:  4.71",
        },
      ],
    },
    {
      heading: "Ato três: revogar primeiro, explicar depois",
      body: [
        "A única resposta correta é revogar e rotacionar a credencial imediatamente — antes de limpar o repositório, antes de conversar sobre processo. Nenhuma limpeza de histórico é rápida o suficiente para competir com um bot que testa a chave a cada segundo.",
        "A prevenção estrutural é tirar segredos do código de vez: gerenciadores como HashiCorp Vault, AWS Secrets Manager ou Doppler injetam a credencial em runtime e permitem rotação sem deploy.",
      ],
    },
  ],
};
