import type { Topic } from "@/content/types";

export const ataquesL7: Topic = {
  domain: "secops",
  slug: "ataques-l7",
  title: "Ataques L7: o que procurar",
  short: "uma taxonomia dos abusos de camada de aplicação",
  tagline:
    "Cada ataque L7 deixa uma assinatura nos logs. Conhecer o padrão de cada um é o que transforma um oceano de requisições em hipóteses que dá para testar.",
  kind: "conceito",
  stage: "detectar",
  tools: ["OWASP Automated Threats", "MITRE ATT&CK", "OWASP Top 10", "OWASP Core Rule Set"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Ataques de camada 7 usam o próprio protocolo da aplicação (HTTP) para explorar lógica, credenciais ou capacidade. Muitos parecem tráfego legítimo requisição a requisição, e só o conjunto revela o padrão, por isso a detecção é, em grande parte, estatística e comportamental.",
      ],
    },
    {
      heading: "Seis padrões e a assinatura de cada um",
      bullets: [
        "Credential stuffing: muitas tentativas de login com pares usuário/senha vazados, falhas (401) em volume, muitos IPs e user agents, poucas tentativas por conta.",
        "DDoS L7: pico de requisições a poucos caminhos caros (busca, relatórios), muitos IPs, taxa por IP baixa mas agregada altíssima.",
        "Forced browsing: varredura de caminhos inexistentes ou administrativos (/admin, /.git, /backup), explosão de 404 e 403 de uma origem.",
        "Probing e IDOR: sequência de identificadores em ordem (/orders/1001, 1002, 1003...) com mesma sessão, em busca de acesso a objetos de outros usuários.",
        "SSRF: parâmetros de URL apontando para endereços internos ou de metadados (169.254.169.254, localhost), em campos que a aplicação busca do lado do servidor.",
        "Injeções (SQL, comando, template): caracteres e palavras-chave de sintaxe em parâmetros, cabeçalhos ou corpo, muitas vezes em tentativas de sondagem antes do ataque real.",
      ],
    },
    {
      heading: "Do padrão à hipótese de detecção",
      body: [
        "Para cada padrão, a pergunta é \"que campo, em que janela e agrupado por quê denuncia isso?\". Credential stuffing, por exemplo, não se vê no IP (a botnet distribui), mas se vê na razão de falhas por ASN ou por fingerprint, e no número de contas distintas tentadas por origem.",
      ],
      code: [
        {
          language: "text",
          filename: "hipóteses por padrão",
          code: "credential stuffing -> falhas de login / minuto por ASN, contas distintas por fingerprint\nDDoS L7             -> reqs / minuto por path caro, razão vs baseline da hora\nforced browsing     -> 404+403 por origem, paths distintos por janela\nIDOR                -> IDs sequenciais por sessão, acessos negados a objetos alheios\nSSRF                -> parâmetros com IP privado/metadata em campos de URL\ninjeção             -> tokens de sintaxe em parâmetros, repetidos e variando",
        },
      ],
    },
    {
      heading: "Atacantes se adaptam",
      body: [
        "Quando você bloqueia por IP, o ataque muda de IP; quando bloqueia por user agent, ele rotaciona. As detecções mais duráveis ancoram em características difíceis de trocar: fingerprints, comportamento, a própria lógica do alvo. E toda mudança de padrão deve virar uma nova detecção ou um ajuste, registrada junto com o incidente que a motivou.",
      ],
    },
  ],
};
