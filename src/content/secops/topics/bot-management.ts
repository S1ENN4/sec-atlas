import type { Topic } from "@/content/types";

export const botManagement: Topic = {
  domain: "secops",
  slug: "bot-management",
  title: "Bot management",
  short: "separar automação legítima de abuso automatizado",
  tagline:
    "Nem todo bot é inimigo e nem todo humano é legítimo. Bot management dá uma nota de confiança a cada requisição e deixa a política decidir o que fazer com ela.",
  kind: "tecnica",
  stage: "agir",
  tools: ["Cloudflare Bot Management", "Cloudflare Turnstile", "reCAPTCHA", "DataDome"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Uma parte grande do tráfego de qualquer aplicação pública é automação: buscadores e monitoramento (úteis), e também scrapers, credential stuffing, acúmulo de estoque e criação de contas falsas. A defesa não é bloquear \"bots\", é distinguir intenção e agir sobre o abuso.",
      ],
    },
    {
      heading: "Como a classificação funciona",
      body: [
        "Soluções de bot management combinam sinais para produzir uma pontuação por requisição. Nenhum sinal é decisivo sozinho, mas juntos separam bem o tráfego:",
      ],
      bullets: [
        "Fingerprints de rede e TLS: clientes de automação costumam ter assinaturas diferentes de navegadores reais.",
        "Sinais de navegador e comportamento: execução de JavaScript, movimento, cadência de requisições.",
        "Reputação e contexto: IP, ASN, histórico do cliente, padrão por endpoint.",
        "Bots verificados: crawlers conhecidos (buscadores, monitores) identificados de forma confiável e tratados à parte.",
      ],
    },
    {
      heading: "A política decide a ação",
      body: [
        "A pontuação não bloqueia nada por si: a política é que define a ação por endpoint. Um catálogo público pode tolerar score médio, enquanto o login e o checkout desafiam ou bloqueiam. Uma expressão de exemplo, no estilo de regras da Cloudflare:",
      ],
      code: [
        {
          language: "text",
          filename: "bot rule - ilustrativo",
          code: "# alto risco de automação em endpoints sensíveis, ignorando bots verificados\n(cf.bot_management.score lt 30\n and not cf.bot_management.verified_bot\n and http.request.uri.path in {\"/api/login\" \"/api/checkout\"})\n  -> action: Managed Challenge",
        },
      ],
    },
    {
      heading: "Desafios sem atrito",
      body: [
        "Desafios clássicos (CAPTCHA) punem usuários reais. Desafios modernos e gerenciados tentam provar que o cliente é um navegador real sem pedir nada ao usuário, e só escalam para uma interação quando a dúvida persiste. O desafio é o degrau antes do bloqueio: reduz falso positivo e ainda custa caro para quem automatiza em escala.",
      ],
    },
    {
      heading: "Casos de uso mais comuns",
      bullets: [
        "Credential stuffing no login e em recuperação de senha.",
        "Scraping de preços, catálogo ou conteúdo.",
        "Criação em massa de contas e abuso de promoções.",
        "Acúmulo de estoque e fraude em checkout.",
        "APIs: bots usam diretamente as rotas, então a política também precisa cobrir o tráfego sem navegador.",
      ],
    },
  ],
};
