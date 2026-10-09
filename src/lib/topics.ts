export type TopicKind = "tecnica" | "pratica" | "conceito";

export interface CodeSample {
  language: string;
  filename?: string;
  code: string;
}

export interface TopicSection {
  heading: string;
  body?: string[];
  bullets?: string[];
  code?: CodeSample[];
}

export interface Topic {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  kind: TopicKind;
  stage: string | null;
  tools: string[];
  sections: TopicSection[];
}

export interface Relation {
  source: string;
  target: string;
  label: string;
  sourceHandle: string;
  targetHandle: string;
  animated?: boolean;
}

export const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "técnica de teste", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "prática", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "conceito", dot: "bg-amber-400", text: "text-amber-400" },
};

export const topics: Topic[] = [
  {
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
            code: "name: ci\non: [push, pull_request]        # stage source: o que dispara\njobs:\n  ci:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci                # build: instala de forma reprodutível\n      - run: npm test              # test: a suíte de testes\n      - run: npx semgrep ci        # segurança entra como mais um passo\n      - run: docker build -t app . # package: gera o artefato",
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
            code: "const stripe = new Stripe(\"sk_live_51H8xQ2eZvKYlo2CxT9mPq3\");\n                              // chave de produção no código",
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
            code: "Finding:  stripe-access-token\nSecret:   sk_live_51H8xQ2eZ...\nFile:     src/payments.ts:1\nCommit:   a1b2c3d\nEntropy:  4.71",
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
  },
  {
    slug: "sbom",
    title: "SBOM",
    short: "A lista de ingredientes do software",
    tagline: "Um inventário formal de tudo que compõe o artefato: dependências, versões, licenças e hashes.",
    kind: "conceito",
    stage: null,
    tools: ["Syft", "CycloneDX", "SPDX"],
    sections: [
      {
        heading: "O que é",
        body: [
          "SBOM (Software Bill of Materials) é o equivalente ao rótulo nutricional de um alimento: um documento estruturado listando todos os componentes que formam um artefato de software — dependências diretas e transitivas, versões exatas, licenças e hashes criptográficos.",
        ],
      },
      {
        heading: "Um SBOM de verdade",
        body: [
          "Os dois padrões dominantes são CycloneDX e SPDX. Um trecho real de um SBOM CycloneDX, reduzido a um componente:",
        ],
        code: [
          {
            language: "json",
            filename: "bom.cdx.json (CycloneDX)",
            code: "{\n  \"bomFormat\": \"CycloneDX\",\n  \"specVersion\": \"1.5\",\n  \"components\": [\n    {\n      \"type\": \"library\",\n      \"name\": \"lodash\",\n      \"version\": \"4.17.15\",\n      \"purl\": \"pkg:npm/lodash@4.17.15\",\n      \"hashes\": [{ \"alg\": \"SHA-256\", \"content\": \"3d0a2c...\" }]\n    }\n  ]\n}",
          },
        ],
      },
      {
        heading: "Anatomia de uma entrada",
        body: [
          "O purl (package URL) é o identificador universal do componente — pkg:npm/lodash@4.17.15 diz o ecossistema, o nome e a versão exata, em um formato que qualquer sistema consulta. Os hashes provam que o componente é exatamente o que o SBOM diz que é, sem espaço para troca silenciosa.",
          "Na prática, o SBOM é gerado no stage de package da pipeline — por ferramentas de SCA ou geradores dedicados como o Syft — e publicado (idealmente assinado) junto com o artefato.",
        ],
      },
      {
        heading: "Por que importa: o teste do próximo Log4Shell",
        body: [
          "Quando estoura a próxima vulnerabilidade crítica em uma biblioteca popular, a pergunta é sempre a mesma: estamos afetados? Com SBOM, a resposta sai em minutos — uma busca pelo purl no inventário de todos os serviços. Sem ele, são dias vasculhando projeto a projeto, ou pior: descobrindo em produção.",
          "Também virou exigência de mercado: órgãos do governo dos EUA passaram a exigir SBOM de fornecedores de software, e clientes enterprise seguem o mesmo caminho.",
        ],
      },
      {
        heading: "Relação com o SCA",
        body: [
          "SCA e SBOM se alimentam: a análise de composição produz o inventário, e o inventário é o que permite monitorar continuamente os componentes contra CVEs novos. Um SBOM gerado uma vez e esquecido envelhece rápido — o valor está no ciclo vivo: gerar a cada build, monitorar sempre.",
        ],
      },
    ],
  },
  {
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
  },
  {
    slug: "devsecops",
    title: "DevSecOps",
    short: "Segurança embutida em cada stage",
    tagline: "Transforma a pipeline em uma série de portões de segurança automatizados — sem travar o time.",
    kind: "pratica",
    stage: "todas as fases",
    tools: ["OPA", "Cosign", "Sigstore", "SLSA"],
    sections: [
      {
        heading: "O que é",
        body: [
          "DevSecOps é a combinação de cultura e automação: segurança deixa de ser uma revisão no fim do ciclo e vira código dentro do CI/CD, com responsabilidade compartilhada entre desenvolvimento, operações e segurança.",
        ],
      },
      {
        heading: "Security gates",
        body: ["Cada stage ganha um portão com critério explícito:"],
        bullets: [
          "PR bloqueado se SAST ou SCA reportar achado crítico novo",
          "imagem de container só sobe se o scan de vulnerabilidades passar",
          "deploy condicionado a artefato assinado e verificado",
          "política como código (OPA/Rego) versionada junto com a pipeline",
        ],
      },
      {
        heading: "Política como código: o gate escrito, não combinado",
        body: [
          "Um gate de verdade não é acordo verbal — é um arquivo versionado que a pipeline consulta. Em OPA/Rego, a regra abaixo nega qualquer imagem com vulnerabilidade crítica, e o texto do motivo sai na mensagem de erro do deploy:",
        ],
        code: [
          {
            language: "rego",
            filename: "policy/imagens.rego",
            code: "package deploy\n\ndeny[msg] {\n  input.image.vulns.critical > 0\n  msg := sprintf(\"imagem %s tem %d vulnerabilidades críticas\",\n                 [input.image.name, input.image.vulns.critical])\n}",
          },
        ],
      },
      {
        heading: "Provar procedência: o deploy que verifica assinatura",
        body: [
          "O nível seguinte é provar origem e integridade: frameworks como SLSA e in-toto registram a proveniência de cada artefato, e ferramentas como Cosign/Sigstore assinam imagens e commits. O deploy só prossegue se a assinatura bater — o artefato veio da sua pipeline, do commit esperado, sem adulteração:",
        ],
        code: [
          {
            language: "bash",
            filename: "deploy.sh",
            code: "cosign verify --key cosign.pub ghcr.io/org/app:1.4.2\ncosign verify-attestation --type slsaprovenance \\\n  --key cosign.pub ghcr.io/org/app:1.4.2",
          },
        ],
      },
      {
        heading: "O equilíbrio",
        body: [
          "Portão rígido demais vira contorno: devs dão bypass em ferramenta que trava entrega por falso positivo. O caminho saudável é começar em modo auditoria (alerta sem bloqueio), medir, ajustar regras e endurecer os gates aos poucos — cada endurecimento é uma decisão baseada em dados, não em fé.",
        ],
      },
    ],
  },
];

export const relations: Relation[] = [
  { source: "secrets", target: "cicd", label: "stage: source", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: "sast", target: "cicd", label: "stage: build/PR", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: "sca", target: "cicd", label: "stage: build", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: "dast", target: "cicd", label: "stage: staging", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: "sca", target: "sbom", label: "gera", sourceHandle: "s-b", targetHandle: "t-t" },
  { source: "shift-left", target: "sast", label: "antecipa", sourceHandle: "s-r", targetHandle: "t-l" },
  { source: "shift-left", target: "sca", label: "antecipa", sourceHandle: "s-r", targetHandle: "t-l" },
  { source: "devsecops", target: "cicd", label: "gates & políticas", sourceHandle: "s-t", targetHandle: "t-b" },
  { source: "sast", target: "dast", label: "complementa", sourceHandle: "s-t", targetHandle: "t-t", animated: true },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function relationsOf(slug: string): Relation[] {
  return relations.filter((r) => r.source === slug || r.target === slug);
}
