import type { Topic } from "@/content/types";

export const sast: Topic = {
  domain: "appsec",
  slug: "sast",
  title: "SAST",
  short: "Análise estática do código-fonte",
  tagline: "Raio-x do código sem executar nada: acha padrões vulneráveis antes do primeiro deploy.",
  kind: "tecnica",
  stage: "build / PR",
  tools: ["Semgrep", "CodeQL", "SonarQube", "Checkmarx"],
  sections: [
    {
      heading: "O que é",
      body: [
        "SAST (Static Application Security Testing) analisa o código-fonte, bytecode ou binário sem executar o programa. O scanner procura construções perigosas — concatenação de SQL, desserialização insegura, criptografia fraca, XSS — e aponta arquivo e linha, no formato que o desenvolvedor já consome.",
        "A sigla esconde três técnicas bem diferentes: pattern matching (regras textuais), análise de fluxo de dados (o famoso taint tracking) e análise semântica. Sem entender as três, o output do scanner parece mágica — e os falsos positivos parecem bug.",
      ],
    },
    {
      heading: "Do texto ao AST",
      body: [
        "Antes de qualquer análise, o código passa por um parser e vira uma AST (Abstract Syntax Tree): cada construção da linguagem vira um nó tipado, e o scanner navega nessa árvore em vez de ler texto solto. É isso que permite perguntar coisas como 'existe um nó de concatenação dentro de uma chamada de query?'.",
        "Uma linha inocente de JavaScript vira uma árvore assim:",
      ],
      code: [
        {
          language: "text",
          filename: "sql.js → AST",
          code: "const sql = \"SELECT * FROM users WHERE id = \" + req.query.id\n\nVariableDeclaration\n  id:   Identifier \"sql\"\n  init: BinaryExpression \"+\"\n          left:  StringLiteral \"SELECT * FROM users WHERE id = \"\n          right: MemberExpression\n                   req.query.id",
        },
      ],
    },
    {
      heading: "Source → sink: o coração da análise",
      body: [
        "A AST sozinha diz que existe uma concatenação — não diz se ela é perigosa. A pergunta de segurança é outra: esse dado tem origem confiável? Onde ele termina?",
        "Taint analysis (análise de contaminação) responde seguindo o dado: fontes não confiáveis — input do usuário, headers, query strings — são marcadas como 'tainted'. O engine propaga essa marca por atribuições, concatenações e chamadas de função, e dispara o alerta quando a marca chega a um sink: um ponto onde o dado vira comando, query, HTML ou caminho de arquivo.",
        "No exemplo abaixo, o fluxo é completo: nasce em req.query.id (source), atravessa uma concatenação (propagação) e termina dentro de db.query (sink):",
      ],
      code: [
        {
          language: "javascript",
          filename: "server.js — vulnerável",
          code: "app.get(\"/users\", (req, res) => {\n  const id = req.query.id;                                // SOURCE\n  const sql = \"SELECT * FROM users WHERE id = \" + id;     // propagação\n  db.query(sql, (err, rows) => res.json(rows));           // SINK\n});",
        },
      ],
    },
    {
      heading: "O que o scanner reporta",
      body: [
        "O resultado não é 'existe concatenação' — é o caminho inteiro, com CWE e correção sugerida. Algo como:",
      ],
      code: [
        {
          language: "text",
          filename: "saída do scanner",
          code: "server.js:3\n  SQL Injection (CWE-89) · alta\n  taint:  req.query.id -> id -> sql -> db.query()\n  fix:    use query parametrizada (placeholder $1)",
        },
      ],
    },
    {
      heading: "A correção que o engine aceita",
      body: [
        "Parametrizar a query interrompe a taint: o valor do usuário deixa de ser código e vira dado. Na linguagem do taint analysis, o prepared statement é um sanitizador (ou barrier) — o engine sabe que aquele caminho específico está limpo e para de alertar nele.",
      ],
      code: [
        {
          language: "javascript",
          filename: "server.js — corrigido",
          code: "app.get(\"/users\", (req, res) => {\n  const sql = \"SELECT * FROM users WHERE id = $1\";        // query fixa\n  db.query(sql, [req.query.id], (err, rows) => res.json(rows));\n});",
        },
      ],
    },
    {
      heading: "Onde entra na pipeline",
      body: [
        "O mais cedo possível: plugin de IDE e pre-commit dão feedback em segundos, a análise completa roda no PR e no stage de build. Regras críticas quebradas falham o build (quality gate) e bloqueiam o merge.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "cobertura de 100% do código, inclusive caminhos raramente executados",
        "acha a vulnerabilidade cedo, quando corrigir custa pouco",
        "não precisa de ambiente rodando nem de credenciais",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "falsos positivos: quando o engine não consegue provar que o caminho é seguro (um sanitizador customizado, por exemplo), ele alerta por precaução — e a triagem é trabalho humano",
        "explosão de caminhos: analisar todas as combinações de execução é caro; os engines usam heurísticas e podem perder fluxos raros",
        "é cego para configuração de runtime, infraestrutura e comportamento real — território do DAST",
      ],
    },
  ],
};
