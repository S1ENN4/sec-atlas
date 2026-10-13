import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "frameworks",
    title: "frameworks e listas",
    entries: [
      {
        term: "OWASP Top 10",
        meaning:
          "A lista de referência mais famosa de riscos de segurança em aplicações web (A01 acesso quebrado, A02 falhas criptográficas, A03 injeção...), revisada a cada alguns anos pela comunidade OWASP. É um mapa educacional de categorias de risco — não um checklist de ferramenta nem uma certificação.",
      },
      {
        term: "OWASP ASVS",
        aka: "verification standard",
        meaning:
          "Application Security Verification Standard: checklist verificável, em três níveis de rigor, para auditar uma aplicação ou contratar auditoria. Onde o Top 10 ensina, o ASVS audita.",
      },
      {
        term: "NIST SSDF",
        meaning:
          "Framework norte-americano de processo seguro de desenvolvimento (práticas de produção de software seguro). É processo, não ferramenta — cita SAST, SCA, SBOM como partes do ciclo.",
      },
      {
        term: "OWASP SAMM",
        meaning:
          "Modelo de maturidade de segurança de software: avalia a organização em cinco funções de negócio para dizer em que nível ela está e o que priorizar depois.",
      },
    ],
  },
  {
    id: "identificadores",
    title: "identificadores, bancos e scores",
    entries: [
      {
        term: "CVE",
        aka: "common vulnerabilities and exposures",
        meaning:
          "O identificador único de UMA vulnerabilidade pública específica, no formato CVE-ANO-NÚMERO. Ex.: CVE-2021-44228 é o Log4Shell. É a instância real, não a classe do problema.",
      },
      {
        term: "CWE",
        aka: "common weakness enumeration",
        meaning:
          "O identificador do TIPO de fraqueza, a classe do erro no código. CWE-89 é SQL injection, CWE-79 é XSS. A distinção que confunde todo mundo: CWE é a categoria, CVE é uma ocorrência concreta dela — uma CVE de SQL injection no seu framework vai referenciar o CWE-89.",
      },
      {
        term: "CVSS",
        aka: "common vulnerability scoring system",
        meaning:
          "Score de 0 a 10 que mede a severidade técnica de uma vulnerabilidade: como é explorada (rede ou local, complexidade, privilégio necessário, interação do usuário) e qual o impacto. 9.0+ é crítico, mas o número é teórico — não sabe se você está exposto.",
      },
      {
        term: "EPSS",
        aka: "exploit prediction scoring system",
        meaning:
          "Probabilidade (0 a 100%) de um CVE ser explorado de verdade nos próximos 30 dias, baseada em evidência. Complementa o CVSS: um 9.8 com EPSS 0,1% pode ser menos urgente que um 7.5 com EPSS 60%.",
      },
      {
        term: "CISA KEV",
        aka: "known exploited vulnerabilities",
        meaning:
          "Catálogo das vulnerabilidades que estão sendo exploradas ativamente, agora, no mundo real. 'Está no KEV' = prioridade máxima, independente do CVSS.",
      },
      {
        term: "NVD",
        aka: "national vulnerability database",
        meaning:
          "O banco do NIST que enriquece cada CVE com score CVSS e CWE associada. É de onde a maioria das ferramentas de SCA bebe.",
      },
      {
        term: "OSV / GitHub Advisory",
        aka: "advisories",
        meaning:
          "Bancos de vulnerabilidades focados em ecossistemas de pacotes (npm, PyPI, Maven...). Mais práticos que o CVE genérico: dizem exatamente qual versão é afetada e qual corrige.",
      },
    ],
  },
  {
    id: "testes",
    title: "testes e técnicas",
    entries: [
      {
        term: "SAST",
        meaning:
          "Análise estática: examina o código sem executar. Acha por análise de fluxo, não por adivinhação.",
        topic: "sast",
      },
      { term: "DAST", meaning: "Teste dinâmico: ataca a aplicação rodando, de fora, em caixa-preta.", topic: "dast" },
      {
        term: "IAST",
        meaning:
          "Híbrido: um agente dentro da aplicação observa a execução em tempo real, combinando o contexto do código (SAST) com a evidência do ataque (DAST).",
      },
      {
        term: "RASP",
        meaning:
          "Runtime Application Self-Protection: proteção embutida no runtime da aplicação que bloqueia ataques em execução, mesmo depois do deploy.",
      },
      {
        term: "SCA",
        meaning: "Análise de composição: inventaria dependências de terceiros e cruza com CVEs conhecidas.",
        topic: "sca",
      },
      { term: "Secrets scanning", meaning: "Varredura de credenciais expostas em código, commits e histórico do git.", topic: "secrets" },
      {
        term: "Fuzzing",
        meaning:
          "Bombardear a aplicação com entradas aleatórias ou mutações de entradas válidas, caçando crashe mesmo comportamento inesperado — o ancestral do DAST moderno.",
      },
      {
        term: "Pentest",
        meaning:
          "Teste manual adversarial, com escopo definido e relatório: um humano (ou time) tentando invadir a aplicação de propósito.",
      },
      {
        term: "AST",
        aka: "abstract syntax tree",
        meaning:
          "A árvore de sintaxe que o parser produz: cada construção do código vira um nó tipado, e as ferramentas analisam a árvore em vez de texto solto.",
        topic: "sast",
      },
      {
        term: "Source",
        meaning:
          "A origem de um dado não confiável: input de usuário, query string, header, arquivo. É onde o taint nasce.",
        topic: "sast",
      },
      {
        term: "Sink",
        meaning:
          "O destino perigoso onde dado não confiável vira comando, query ou HTML: db.query, eval, innerHTML. Se a taint chega aqui, é vulnerabilidade.",
        topic: "sast",
      },
      {
        term: "Taint tracking",
        aka: "análise de contaminação",
        meaning:
          "Seguir a marca de 'dado sujo' do source até o sink, propagando por atribuições e chamadas. É o coração do SAST moderno.",
        topic: "sast",
      },
      {
        term: "Sanitizador / barrier",
        meaning:
          "A função que limpa o dado ou prova que ele é seguro (query parametrizada, escape de HTML). Corta o fluxo e o engine deixa de alertar naquele caminho.",
        topic: "sast",
      },
      {
        term: "Falso positivo / falso negativo",
        meaning:
          "Falso positivo: alerta de vulnerabilidade que não existe. Falso negativo: vulnerabilidade real que passou batido. Toda ferramenta vive trocando um pelo outro.",
      },
    ],
  },
  {
    id: "supply-chain",
    title: "supply chain e artefatos",
    entries: [
      { term: "SBOM", meaning: "A lista de ingredientes do software: dependências, versões, licenças e hashes, em formato padrão.", topic: "sbom" },
      {
        term: "purl",
        aka: "package url",
        meaning:
          "Identificador universal de um pacote: pkg:npm/lodash@4.17.15 diz ecossistema, nome e versão sem ambiguidade. É a coluna vertebral de um SBOM.",
      },
      {
        term: "CycloneDX / SPDX",
        meaning:
          "Os dois formatos padrão de SBOM. CycloneDX é mais voltado a segurança, SPDX a licenças — na prática, ambos listam os mesmos componentes.",
      },
      {
        term: "Hash (SHA-256)",
        meaning:
          "Impressão digital de um arquivo: se um byte muda, o hash muda. Prova que o componente é exatamente o que dizem que é.",
      },
      {
        term: "Lockfile",
        meaning:
          "O registro exato de qual versão de cada dependência foi resolvida (package-lock.json, go.sum...). Sem ele, builds não são reproduzíveis e o SCA não enxerga a árvore real.",
      },
      {
        term: "Dependência transitiva",
        meaning:
          "Pacote que você não escolheu: entrou como dependência de outra dependência, às vezes três níveis abaixo. Recebe CVEs igual — e é o ponto cego clássico.",
      },
      {
        term: "Provenance",
        aka: "proveniência",
        meaning:
          "O registro de como e onde um artefato foi construído: qual pipeline, qual commit, qual máquina. Permite perguntar 'esse binário veio mesmo do nosso código?'.",
      },
      {
        term: "SLSA",
        meaning:
          "Supply-chain Levels for Software Artifacts: escala de 1 a 4 para a integridade do build — do 'tem documentação' até 'build à prova de adulteração com proveniência verificável'.",
      },
      {
        term: "Sigstore / Cosign",
        meaning:
          "Assinatura e verificação de artefatos sem gerenciar chaves na mão: chaves efêmeras atreladas à identidade do build, com log público de transparência.",
      },
      {
        term: "in-toto",
        meaning:
          "Framework que assina, etapa por etapa, o que a pipeline fez: prova que o processo esperado rodou, na ordem esperada, sem etapa trocada.",
      },
      {
        term: "SCA vs SBOM",
        meaning:
          "SCA é a análise viva (monitora CVEs); SBOM é o retrato do momento (o inventário). Na prática, alimentam um ao outro: o SCA gera o SBOM e o monitora.",
        topic: "sbom",
      },
    ],
  },
  {
    id: "pipeline",
    title: "pipeline e práticas",
    entries: [
      {
        term: "CI / CD",
        aka: "entrega vs deploy",
        meaning:
          "CI: validar cada mudança automaticamente. CD de entrega: deploy é um clique. CD de deploy: tudo que passa nos gates vai ao ar sozinho.",
        topic: "cicd",
      },
      {
        term: "Stage",
        meaning: "Uma etapa da pipeline: source, build, test, package, deploy, monitor. Cada stage é um lugar possível para um portão de segurança.",
        topic: "cicd",
      },
      {
        term: "Quality gate",
        meaning:
          "O portão explícito de um stage: 'falha o build se houver achado crítico novo'. Sem critério claro, gate vira sugestão.",
      },
      {
        term: "Policy as code",
        aka: "OPA / Rego",
        meaning:
          "A política de segurança escrita como arquivo versionado que a pipeline consulta (negar imagem com vulnerabilidade crítica, exigir assinatura). Muda o critério = muda o arquivo, com review.",
        topic: "devsecops",
      },
      {
        term: "Pre-commit hook",
        meaning:
          "Verificação local que roda antes do commit sair da sua máquina: secrets scanning, linter, SAST rápido. A forma mais barata de feedback.",
        topic: "shift-left",
      },
      {
        term: "Shift-left / shift-right",
        meaning:
          "Shift-left: mover a verificação para o mais cedo possível no ciclo. Shift-right: testar e observar também em produção (canário, observabilidade). Os dois convivem.",
        topic: "shift-left",
      },
      { term: "DevSecOps", meaning: "Segurança como código dentro do CI/CD, com gates automatizados e responsabilidade compartilhada.", topic: "devsecops" },
      {
        term: "Secret manager / vault",
        meaning:
          "Cofre que guarda credenciais e as injeta em runtime (Vault, AWS Secrets Manager, Doppler). Tira o segredo do código e permite rotação sem deploy.",
      },
      {
        term: "Rotação de credencial",
        meaning:
          "Trocar a chave comprometida — o passo número um após vazamento. Commit de remoção não resolve: o histórico guarda o que foi commitado.",
        topic: "secrets",
      },
      {
        term: "WAF",
        aka: "web application firewall",
        meaning:
          "Filtro na borda que bloqueia padrões de ataque conhecidos em HTTP. Complementa o código — não substitui corrigir a vulnerabilidade, apenas compra tempo.",
      },
    ],
  },
  {
    id: "conceitos",
    title: "conceitos fundamentais",
    entries: [
      {
        term: "Vulnerabilidade",
        meaning:
          "A fraqueza no sistema que pode ser explorada: uma falha concreta de código, configuração ou design.",
      },
      {
        term: "Exploit",
        meaning:
          "A técnica ou o artefato concreto que abusa de uma vulnerabilidade. A vulnerabilidade é o buraco; o exploit é o pé que entra nele.",
      },
      {
        term: "Ameaça vs risco",
        meaning:
          "Ameaça é quem ou o que pode causar dano (o atacante). Risco é probabilidade × impacto no SEU contexto. Ferramentas reportam vulnerabilidades; quem decide o risco é você.",
      },
      {
        term: "Superfície de ataque",
        meaning:
          "Tudo que está exposto a entrada não confiável: endpoints, formulários, dependências, portas, pipelines. Superfície mínima é estratégia de defesa.",
      },
      {
        term: "Defesa em profundidade",
        meaning:
          "Camadas independentes de proteção, partindo da premissa de que qualquer uma pode falhar: validação + parametrização + WAF + monitoramento.",
      },
      {
        term: "Zero-day",
        meaning:
          "Vulnerabilidade explorada antes de existir correção pública. Contra zero-day, só defesa em profundidade e detecção ajudam na hora.",
      },
      {
        term: "CNAPP / ASPM",
        meaning:
          "Categorias de mercado que empacotam SAST + DAST + SCA + infraestrutura numa plataforma só. Útil saber que existem — o conceito por trás é o mesmo dos gates desta KB.",
      },
    ],
  },
  {
    id: "modelagem-de-ameacas",
    title: "modelagem de ameaças",
    entries: [
      {
        term: "STRIDE",
        meaning:
          "Mnemônico de seis categorias de ameaça (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) usado como checklist ao percorrer um diagrama de fluxo de dados.",
        topic: "threat-modeling",
      },
      {
        term: "DFD",
        aka: "diagrama de fluxo de dados",
        meaning:
          "Desenho de atores, processos, armazenamentos e fluxos de um sistema, com as fronteiras de confiança marcadas. É a entrada do threat modeling: as ameaças aparecem onde um fluxo cruza uma fronteira.",
        topic: "threat-modeling",
      },
      {
        term: "Fronteira de confiança",
        aka: "trust boundary",
        meaning:
          "Linha onde muda o nível de confiança dos dados ou de quem os envia (internet para VPC, serviço para banco, usuário para admin). Tudo que a cruza deve ser autenticado, autorizado e validado.",
        topic: "threat-modeling",
      },
    ],
  },
];
