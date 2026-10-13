import type { QuizBank } from "@/content/types";

// AppSec quiz bank, keyed by topic slug. `answer` is the index of the correct
// option; `explain` is shown after answering. Keep options short and make the
// wrong ones plausible, not silly.
export const appsecQuiz: QuizBank = {
  cicd: [
    {
      q: "Por que a segurança vai dentro da esteira de CI/CD, e não só no fim?",
      options: [
        "Porque a esteira é lenta e precisa de mais etapas",
        "Porque cada commit passa por ela, então o controle roda sempre e cedo",
        "Porque auditores exigem logs da esteira",
        "Porque ferramentas de segurança só funcionam em CI",
      ],
      answer: 1,
      explain: "A esteira é o único caminho obrigatório do código até a produção: colocar verificações ali as torna automáticas e repetíveis.",
    },
    {
      q: "O que é um quality gate?",
      options: [
        "Um painel de métricas de cobertura",
        "Uma regra que bloqueia o avanço da esteira se um critério não for atendido",
        "Um tipo de teste de carga",
        "Uma revisão de código manual no fim da sprint",
      ],
      answer: 1,
      explain: "O gate transforma uma política (sem crítico novo, sem segredo) em decisão automática de passa ou falha.",
    },
    {
      q: "Qual é um risco clássico da própria esteira de CI/CD?",
      options: [
        "Ela rodar testes demais",
        "Runners e tokens com privilégio excessivo serem comprometidos",
        "O build demorar mais de um minuto",
        "Usar YAML em vez de JSON",
      ],
      answer: 1,
      explain: "A esteira guarda credenciais e publica artefatos; comprometê-la é comprometer tudo que ela entrega.",
    },
  ],
  sast: [
    {
      q: "O que o SAST analisa?",
      options: [
        "A aplicação em execução, via requisições HTTP",
        "O código-fonte (ou bytecode) sem executá-lo",
        "As dependências de terceiros e suas CVEs",
        "O tráfego de rede entre serviços",
      ],
      answer: 1,
      explain: "SAST é análise estática: lê o código e procura padrões inseguros sem rodar a aplicação.",
    },
    {
      q: "Qual é uma limitação típica do SAST?",
      options: [
        "Só funciona depois do deploy",
        "Gera falsos positivos e não vê problemas de configuração em runtime",
        "Não consegue analisar código Python",
        "Exige acesso à produção",
      ],
      answer: 1,
      explain: "Sem executar o código, o SAST pode apontar caminhos inalcançáveis e não enxerga o comportamento do ambiente real.",
    },
    {
      q: "Qual a melhor forma de reduzir o ruído do SAST sem perder cobertura?",
      options: [
        "Desligar as regras que mais alertam",
        "Ajustar regras ao projeto, bloquear só severidade alta e tratar o resto como backlog",
        "Rodar apenas uma vez por trimestre",
        "Ignorar o resultado e confiar no DAST",
      ],
      answer: 1,
      explain: "Calibrar regras e gates por severidade mantém a confiança dos devs sem esconder risco.",
    },
  ],
  dast: [
    {
      q: "Como o DAST encontra vulnerabilidades?",
      options: [
        "Lendo o código-fonte",
        "Atacando a aplicação em execução, de fora, como um usuário malicioso",
        "Comparando versões de bibliotecas com uma base de CVEs",
        "Revisando o diagrama de arquitetura",
      ],
      answer: 1,
      explain: "DAST é caixa-preta: envia requisições e observa as respostas da aplicação rodando.",
    },
    {
      q: "Por que o DAST costuma rodar em staging e não direto em produção?",
      options: [
        "Porque só funciona com bancos de teste vazios",
        "Porque os testes podem criar dados, causar lentidão ou efeitos colaterais",
        "Porque produção não tem HTTP",
        "Porque o DAST não suporta HTTPS",
      ],
      answer: 1,
      explain: "Scans ativos disparam payloads de ataque; em staging o impacto é contido.",
    },
    {
      q: "O que o DAST vê que o SAST normalmente não vê?",
      options: [
        "Variáveis não utilizadas",
        "Problemas de configuração e comportamento em runtime (headers, TLS, autenticação)",
        "Dívida técnica",
        "Licenças de dependências",
      ],
      answer: 1,
      explain: "Os dois se complementam: SAST olha o código, DAST olha o sistema vivo.",
    },
  ],
  sca: [
    {
      q: "O que o SCA verifica?",
      options: [
        "Erros de lógica no código próprio",
        "Dependências de terceiros, suas versões, CVEs e licenças",
        "A cobertura de testes",
        "O consumo de CPU dos containers",
      ],
      answer: 1,
      explain: "SCA (software composition analysis) inventaria o que você importa e cruza com bases de vulnerabilidades.",
    },
    {
      q: "Uma dependência transitiva é...",
      options: [
        "Uma dependência opcional de desenvolvimento",
        "Uma dependência trazida indiretamente por outra que você declarou",
        "Uma dependência copiada para o repositório",
        "Uma dependência sem licença",
      ],
      answer: 1,
      explain: "A maior parte das CVEs em projetos reais vem de dependências transitivas que ninguém declarou diretamente.",
    },
    {
      q: "Por que o SCA precisa rodar de forma contínua e não só no build?",
      options: [
        "Porque novas CVEs são publicadas depois do deploy, em código que não mudou",
        "Porque o build muda a versão das dependências sozinho",
        "Porque o SCA expira a cada 24 horas",
        "Porque a esteira apaga os resultados",
      ],
      answer: 0,
      explain: "O código pode ficar parado enquanto uma CVE nova atinge uma dependência que você já usa.",
    },
  ],
  secrets: [
    {
      q: "Qual a primeira ação ao descobrir que um segredo foi commitado?",
      options: [
        "Apagar o commit com um novo commit",
        "Revogar e rotacionar o segredo, depois limpar o histórico se necessário",
        "Esperar para ver se alguém usa",
        "Mudar o nome do arquivo",
      ],
      answer: 1,
      explain: "Quem já clonou ou espelhou o repositório tem o segredo; apagar o arquivo não desfaz a exposição.",
    },
    {
      q: "Onde o scan de segredos entrega mais valor?",
      options: [
        "Só na produção",
        "Antes do commit (pre-commit) e no PR, além de varreduras no histórico",
        "Apenas em auditoria anual",
        "Somente em repositórios públicos",
      ],
      answer: 1,
      explain: "Quanto mais cedo o segredo é barrado, menor o custo; o histórico precisa de uma varredura própria.",
    },
    {
      q: "Qual é a alternativa correta a segredos estáticos em código?",
      options: [
        "Variáveis de ambiente em texto puro no repositório",
        "Cofre de segredos com credenciais de curta duração e rotação",
        "Arquivo .env commitado em repositório privado",
        "Codificar o segredo em base64",
      ],
      answer: 1,
      explain: "Base64 não é cifra; o certo é buscar credenciais efêmeras de um cofre em tempo de execução.",
    },
  ],
  sbom: [
    {
      q: "O que é um SBOM?",
      options: [
        "Um relatório de testes de carga",
        "Uma lista de ingredientes: componentes e versões que compõem o software",
        "Um backup do repositório",
        "Um certificado TLS",
      ],
      answer: 1,
      explain: "O SBOM inventaria os componentes de um artefato, em formatos como CycloneDX e SPDX.",
    },
    {
      q: "Qual é o principal uso do SBOM num incidente como o do Log4Shell?",
      options: [
        "Descobrir rápido quais sistemas usam a biblioteca afetada",
        "Reverter automaticamente o deploy",
        "Cifrar o código-fonte",
        "Substituir o SCA",
      ],
      answer: 0,
      explain: "Com SBOMs consultáveis, a pergunta \"onde usamos isso?\" vira uma busca, não um mutirão.",
    },
    {
      q: "Qual é a relação entre SCA e SBOM?",
      options: [
        "São a mesma coisa",
        "O SCA analisa e gera o inventário; o SBOM é o inventário que pode ser compartilhado e reavaliado",
        "O SBOM executa testes dinâmicos",
        "O SCA depende do SBOM para existir",
      ],
      answer: 1,
      explain: "O SCA costuma gerar o SBOM, e o SBOM permite reavaliar vulnerabilidades depois, sem reanalisar o código.",
    },
  ],
  "shift-left": [
    {
      q: "O que significa shift-left?",
      options: [
        "Mover o time de segurança para outro departamento",
        "Antecipar as verificações de segurança para o início do ciclo de desenvolvimento",
        "Rodar todos os testes só em produção",
        "Remover o QA do processo",
      ],
      answer: 1,
      explain: "Quanto mais à esquerda na linha do tempo a falha é achada, mais barata é a correção.",
    },
    {
      q: "Qual prática é shift-left?",
      options: [
        "Pentest anual",
        "Pre-commit hooks e checagens no PR",
        "Monitoramento de produção",
        "Resposta a incidentes",
      ],
      answer: 1,
      explain: "Hooks e checks de PR dão feedback em minutos, ainda no contexto do desenvolvedor.",
    },
    {
      q: "Qual é o risco de aplicar shift-left sem cuidado?",
      options: [
        "Ficar sem cobertura em produção",
        "Sobrecarregar devs com alertas ruidosos e perder a confiança nas ferramentas",
        "Aumentar o tamanho do repositório",
        "Impedir o uso de CI",
      ],
      answer: 1,
      explain: "Feedback cedo só ajuda se for preciso e acionável; ruído faz o time ignorar tudo.",
    },
  ],
  devsecops: [
    {
      q: "A ideia central de DevSecOps é...",
      options: [
        "Ter um time separado que aprova tudo no fim",
        "Segurança como responsabilidade compartilhada e automatizada ao longo do ciclo",
        "Substituir testes por scanners",
        "Dar acesso de admin a todos",
      ],
      answer: 1,
      explain: "Cultura mais automação: segurança entra nos mesmos fluxos que o código, sem virar gargalo.",
    },
    {
      q: "O que é \"policy as code\"?",
      options: [
        "Escrever políticas em PDF versionado",
        "Expressar regras de segurança em arquivos executáveis que a esteira aplica sozinha",
        "Um tipo de licença open source",
        "Comentários em código sobre segurança",
      ],
      answer: 1,
      explain: "Regras versionadas e testáveis (OPA, por exemplo) viram gates consistentes e auditáveis.",
    },
    {
      q: "Qual métrica ajuda a medir se DevSecOps está funcionando?",
      options: [
        "Linhas de código por dia",
        "Tempo para corrigir vulnerabilidades e proporção de achados barrados antes da produção",
        "Número de reuniões de segurança",
        "Quantidade de ferramentas instaladas",
      ],
      answer: 1,
      explain: "Importa quão cedo achamos e quão rápido corrigimos, não quantas ferramentas existem.",
    },
  ],
  "threat-modeling": [
    {
      q: "Quando o threat modeling entrega mais valor?",
      options: [
        "Depois do pentest",
        "No desenho, antes ou durante a implementação",
        "Só após um incidente",
        "Apenas em produção",
      ],
      answer: 1,
      explain: "Mudar uma decisão de projeto no papel custa uma conversa; depois do release custa retrabalho.",
    },
    {
      q: "No STRIDE, o que representa a letra S?",
      options: [
        "Scanning",
        "Spoofing (falsificação de identidade)",
        "Secrets",
        "Sandboxing",
      ],
      answer: 1,
      explain: "Spoofing viola a autenticidade: alguém se passa por outro usuário ou serviço.",
    },
    {
      q: "Onde as ameaças tendem a se concentrar num diagrama de fluxo de dados?",
      options: [
        "Em qualquer caixa, igualmente",
        "Nos fluxos que cruzam fronteiras de confiança",
        "Somente no banco de dados",
        "Nos rótulos do diagrama",
      ],
      answer: 1,
      explain: "Onde dados mudam de nível de confiança é onde falta validação, autenticação ou autorização.",
    },
  ],
};
