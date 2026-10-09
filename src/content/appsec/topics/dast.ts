import type { Topic } from "@/content/types";

export const dast: Topic = {
  domain: "appsec",
  slug: "dast",
  title: "DAST",
  short: "Teste dinâmico na aplicação rodando",
  tagline: "Ataca a aplicação em execução como um usuário mal-intencionado faria — sem ver o código.",
  kind: "tecnica",
  stage: "staging",
  tools: ["OWASP ZAP", "Burp Suite", "Nuclei"],
  sections: [
    {
      heading: "O que é",
      body: [
        "DAST (Dynamic Application Security Testing) testa a aplicação em execução, de fora para dentro, em caixa-preta: o scanner envia requisições maliciosas e observa as respostas, como um atacante faria — sem acesso ao código-fonte.",
        "Por operar sobre o sistema real montado, o DAST valida o que o SAST não vê: configuração de servidor, headers HTTP, autenticação, sessão e a interação entre componentes.",
      ],
    },
    {
      heading: "Como funciona",
      bullets: [
        "crawling — um spider mapeia endpoints, formulários e parâmetros da aplicação",
        "fuzzing — cada entrada descoberta recebe payloads de ataque (SQLi, XSS, path traversal, SSRF)",
        "análise de resposta — o scanner verifica se o ataque refletiu, executou ou vazou informação",
        "checagens passivas — headers ausentes, cookies sem flags, versões expostas",
      ],
    },
    {
      heading: "Um ataque na prática",
      body: [
        "O scanner achou um parâmetro id no crawler. Primeiro passo: o teste clássico de SQL injection — fechar a aspa e inserir uma condição sempre-verdadeira. O que o scanner envia:",
      ],
      code: [
        {
          language: "http",
          filename: "requisição de teste",
          code: "GET /users?id=1'%20OR%20'1'='1 HTTP/1.1\nHost: loja.exemplo.com",
        },
      ],
    },
    {
      heading: "O que denuncia a falha",
      body: [
        "A assinatura do SQLi está na resposta: em vez de um usuário, voltaram todos — a condição injetada virou parte da query. O scanner compara essa resposta com a baseline do parâmetro original e conclui: injetável.",
      ],
      code: [
        {
          language: "http",
          filename: "resposta (200 OK)",
          code: "200 OK\n[ {\"id\": 1, \"nome\": \"Ana\"}, {\"id\": 2, \"nome\": \"Beto\"},\n  {\"id\": 3, \"nome\": \"Caio\"}, ... ]   <- todos os usuários",
        },
      ],
    },
    {
      heading: "Quando não há eco: injeção cega",
      body: [
        "Nem sempre a resposta devolve os dados — engines modernos escondem o erro. Para esses casos, o scanner usa injeções cegas e infere pelo comportamento. Um atraso controlado é a evidência:",
      ],
      code: [
        {
          language: "http",
          filename: "injeção cega baseada em tempo",
          code: "GET /users?id=1'%20AND%20SLEEP(5)--  HTTP/1.1\n\ncom o payload:  resposta em 5,2 s\nsem o payload:  resposta em 0,1 s\n                  => o banco executou o SLEEP: injetável às cegas",
        },
      ],
    },
    {
      heading: "Onde entra na pipeline",
      body: [
        "Depois do deploy em staging ou preview: a pipeline sobe o ambiente e aponta o scanner para ele, falhando em achados críticos. Scans agendados contra produção cobrem o que muda fora do ciclo de release.",
      ],
    },
    {
      heading: "Pontos fortes e limitações",
      bullets: [
        "forte: reporta o que é realmente explorável — baixíssimo falso positivo, porque só afirma o que provocou",
        "forte: agnóstico de linguagem — testa HTTP, não código",
        "fraco: só enxerga a superfície exposta; código sem rota acessível fica de fora",
        "fraco: lento e tardio — encontra depois do deploy, quando corrigir já custa",
      ],
    },
  ],
};
