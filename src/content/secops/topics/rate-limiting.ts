import type { Topic } from "@/content/types";

export const rateLimiting: Topic = {
  domain: "secops",
  slug: "rate-limiting",
  title: "Rate limiting adaptativo",
  short: "limitar abuso sem punir quem usa de verdade",
  tagline:
    "Um limite fixo por IP é fácil de contornar e injusto com redes compartilhadas. O rate limiting que funciona escolhe bem a chave, aprende o comportamento normal e escala a resposta.",
  kind: "tecnica",
  stage: "agir",
  tools: ["Cloudflare Rate Limiting", "AWS WAF rate-based rules", "NGINX limit_req", "Envoy"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Rate limiting restringe quantas requisições uma entidade pode fazer em uma janela de tempo. Ele protege contra força bruta, credential stuffing, scraping e esgotamento de recursos, e é uma das poucas defesas que funcionam mesmo quando o atacante envia tráfego que, requisição por requisição, parece válido.",
      ],
    },
    {
      heading: "A escolha da chave é metade do trabalho",
      body: [
        "Limitar por IP é o ponto de partida, mas atrás de um NAT corporativo ou de uma operadora móvel milhares de usuários legítimos compartilham o mesmo IP, enquanto um atacante com uma botnet espalha o tráfego por milhares de IPs. A chave certa depende do que você protege:",
      ],
      bullets: [
        "IP: simples, bom contra abuso grosseiro, ruim com NAT e botnets.",
        "Conta ou identificador no corpo (por exemplo, o usuário tentado no login): pega o ataque a uma conta vinda de muitos IPs.",
        "Token, cookie ou header de sessão: limita por cliente autenticado, não por rede.",
        "ASN, país ou fingerprint: útil como agregador para detectar ondas coordenadas.",
        "Combinações (IP + caminho, conta + ASN): reduzem falso positivo.",
      ],
    },
    {
      heading: "Janelas, limites e a escada de respostas",
      body: [
        "Em vez de só bloquear, escale a resposta. Um primeiro excesso recebe um desafio, o segundo um bloqueio curto e a reincidência um bloqueio mais longo, sempre com prazo (TTL) para que o erro de um dia não vire punição permanente.",
      ],
      code: [
        {
          language: "text",
          filename: "rate limit rule - ilustrativo",
          code: "# login: 10 tentativas por minuto por IP, e 5 por minuto por conta tentada\nmatch:   (http.request.method eq \"POST\" and http.request.uri.path eq \"/api/login\")\ncounting: per ip.src            -> 10 req / 60s\n          per login username    ->  5 req / 60s   (característica customizada)\nresponse: 1º excesso  -> Managed Challenge\n          reincidência -> Block, timeout 600s",
        },
      ],
    },
    {
      heading: "Adaptativo: o limite acompanha o normal",
      body: [
        "Limites fixos envelhecem: uma campanha de marketing dobra o tráfego legítimo e dispara bloqueios, e um atacante paciente fica logo abaixo do limite. O caminho adaptativo usa o baseline de cada endpoint e janela (por hora e dia da semana) e alerta ou age quando o desvio passa de um limiar, com z-score ou média móvel exponencial.",
        "Na prática, o limite estático continua como teto de segurança e o adaptativo cuida do comportamento fino, sempre passando por observação e shadow antes de bloquear.",
      ],
    },
    {
      heading: "Onde o limite deve viver",
      body: [
        "Idealmente na borda, antes de o tráfego custar processamento na origem. Mas alguns limites só fazem sentido perto da aplicação (por usuário autenticado, por tenant), onde a identidade já é conhecida. Cada camada tem seu papel, assunto do tópico de defesa em camadas.",
      ],
    },
  ],
};
