import type { QuizBank } from "@/content/types";

export const appsecQuiz: QuizBank = {
  "cicd": [
    {
      "q": "Por que a segurança vai dentro da esteira de CI/CD, e não só no fim?",
      "options": [
        "Porque a esteira é lenta e as verificações de segurança precisam de mais etapas",
        "Porque cada commit passa por ela, então o controle roda sempre e cedo",
        "Porque os auditores exigem os logs da esteira para cada release",
        "Porque as ferramentas de segurança só funcionam dentro de um ambiente de CI"
      ],
      "answer": 1,
      "explain": "A esteira é o único caminho obrigatório do código até a produção: colocar verificações ali as torna automáticas e repetíveis."
    },
    {
      "q": "O que é um quality gate?",
      "options": [
        "Um painel com as métricas de cobertura de testes de cada repositório",
        "Uma regra que bloqueia o avanço da esteira se um critério não for atendido",
        "Um tipo de teste de carga que mede o limite da aplicação",
        "Uma revisão manual de código feita pela equipe no fim da sprint"
      ],
      "answer": 1,
      "explain": "O gate transforma uma política (sem crítico novo, sem segredo) em decisão automática de passa ou falha."
    },
    {
      "q": "Qual é um risco clássico da própria esteira de CI/CD?",
      "options": [
        "A esteira rodar testes demais e atrasar a entrega das mudanças",
        "Runners e tokens com privilégio excessivo serem comprometidos",
        "O build demorar mais de um minuto e travar a fila de deploys",
        "O uso de YAML em vez de JSON nos arquivos de configuração"
      ],
      "answer": 1,
      "explain": "A esteira guarda credenciais e publica artefatos; comprometê-la é comprometer tudo que ela entrega."
    }
  ],
  "sast": [
    {
      "q": "O que o SAST analisa?",
      "options": [
        "A aplicação em execução, enviando requisições HTTP como um atacante faria",
        "O código-fonte (ou bytecode) sem executá-lo",
        "As dependências de terceiros e as CVEs conhecidas de cada versão",
        "O tráfego de rede entre os serviços da aplicação em produção"
      ],
      "answer": 1,
      "explain": "SAST é análise estática: lê o código e procura padrões inseguros sem rodar a aplicação."
    },
    {
      "q": "Qual é uma limitação típica do SAST?",
      "options": [
        "Só funciona depois do deploy, quando a aplicação já está rodando",
        "Gera falsos positivos e não vê problemas de configuração em runtime",
        "Não consegue analisar código escrito em Python ou em JavaScript",
        "Exige acesso ao ambiente de produção para ler a configuração"
      ],
      "answer": 1,
      "explain": "Sem executar o código, o SAST pode apontar caminhos inalcançáveis e não enxerga o comportamento do ambiente real."
    },
    {
      "q": "Qual a melhor forma de reduzir o ruído do SAST sem perder cobertura?",
      "options": [
        "Desligar as regras que mais geram alertas para a equipe não se cansar",
        "Ajustar regras ao projeto, bloquear só severidade alta e tratar o resto como backlog",
        "Rodar a análise apenas uma vez por trimestre, antes da auditoria",
        "Ignorar o resultado e confiar só no DAST para achar os problemas"
      ],
      "answer": 1,
      "explain": "Calibrar regras e gates por severidade mantém a confiança dos devs sem esconder risco."
    }
  ],
  "dast": [
    {
      "q": "Como o DAST encontra vulnerabilidades?",
      "options": [
        "Lendo o código-fonte da aplicação linha por linha, em busca de padrões inseguros",
        "Atacando a aplicação em execução, de fora, como um usuário malicioso",
        "Comparando as versões das bibliotecas com uma base de CVEs conhecidas",
        "Revisando o diagrama de arquitetura para achar fluxos perigosos"
      ],
      "answer": 1,
      "explain": "DAST é caixa-preta: envia requisições e observa as respostas da aplicação rodando."
    },
    {
      "q": "Por que o DAST costuma rodar em staging e não direto em produção?",
      "options": [
        "Porque só funciona com bancos de dados de teste que estejam vazios",
        "Porque os testes podem criar dados, causar lentidão ou efeitos colaterais",
        "Porque a produção não aceita requisições HTTP vindas de ferramentas externas",
        "Porque o DAST não consegue testar aplicações que usam HTTPS"
      ],
      "answer": 1,
      "explain": "Scans ativos disparam payloads de ataque; em staging o impacto é contido."
    },
    {
      "q": "O que o DAST vê que o SAST normalmente não vê?",
      "options": [
        "Variáveis declaradas e nunca utilizadas dentro do código",
        "Problemas de configuração e comportamento em runtime (headers, TLS, autenticação)",
        "A dívida técnica acumulada na base de código ao longo dos anos",
        "As licenças das dependências usadas pela aplicação"
      ],
      "answer": 1,
      "explain": "Os dois se complementam: SAST olha o código, DAST olha o sistema vivo."
    }
  ],
  "sca": [
    {
      "q": "O que o SCA verifica?",
      "options": [
        "Erros de lógica no código escrito pela própria equipe",
        "Dependências de terceiros, suas versões, CVEs e licenças",
        "A cobertura dos testes automatizados de cada módulo",
        "O consumo de CPU e de memória dos contêineres em produção"
      ],
      "answer": 1,
      "explain": "SCA (software composition analysis) inventaria o que você importa e cruza com bases de vulnerabilidades."
    },
    {
      "q": "Uma dependência transitiva é...",
      "options": [
        "Uma dependência opcional usada apenas durante o desenvolvimento",
        "Uma dependência trazida indiretamente por outra que você declarou",
        "Uma dependência copiada manualmente para dentro do repositório",
        "Uma dependência que não declara nenhuma licença de uso"
      ],
      "answer": 1,
      "explain": "A maior parte das CVEs em projetos reais vem de dependências transitivas que ninguém declarou diretamente."
    },
    {
      "q": "Por que o SCA precisa rodar de forma contínua e não só no build?",
      "options": [
        "Porque novas CVEs são publicadas depois do deploy, em código que não mudou",
        "Porque o build troca a versão das dependências sozinho a cada execução",
        "Porque o resultado do SCA expira a cada 24 horas e precisa ser renovado",
        "Porque a esteira apaga os resultados anteriores ao terminar"
      ],
      "answer": 0,
      "explain": "O código pode ficar parado enquanto uma CVE nova atinge uma dependência que você já usa."
    }
  ],
  "secrets": [
    {
      "q": "Qual a primeira ação ao descobrir que um segredo foi commitado?",
      "options": [
        "Apagar o commit com um novo commit que remove o arquivo",
        "Revogar e rotacionar o segredo, depois limpar o histórico se necessário",
        "Esperar alguns dias para ver se alguém chega a usar a credencial",
        "Mudar o nome do arquivo para os scanners deixarem de reconhecê-lo"
      ],
      "answer": 1,
      "explain": "Quem já clonou ou espelhou o repositório tem o segredo; apagar o arquivo não desfaz a exposição."
    },
    {
      "q": "Onde o scan de segredos entrega mais valor?",
      "options": [
        "Só na produção, onde os segredos são realmente usados",
        "Antes do commit (pre-commit) e no PR, além de varreduras no histórico",
        "Apenas numa auditoria anual feita por uma equipe externa",
        "Somente nos repositórios públicos, que qualquer pessoa pode ler"
      ],
      "answer": 1,
      "explain": "Quanto mais cedo o segredo é barrado, menor o custo; o histórico precisa de uma varredura própria."
    },
    {
      "q": "Qual é a alternativa correta a segredos estáticos em código?",
      "options": [
        "Variáveis de ambiente em texto puro, guardadas dentro do repositório",
        "Cofre de segredos com credenciais de curta duração e rotação",
        "Um arquivo .env commitado num repositório privado, com acesso restrito",
        "Codificar o segredo em base64 para não ficar legível"
      ],
      "answer": 1,
      "explain": "Base64 não é cifra; o certo é buscar credenciais efêmeras de um cofre em tempo de execução."
    }
  ],
  "sbom": [
    {
      "q": "O que é um SBOM?",
      "options": [
        "Um relatório dos testes de carga feitos antes de cada release",
        "Uma lista de ingredientes: componentes e versões que compõem o software",
        "Um backup completo do repositório, com todo o histórico",
        "Um certificado TLS que identifica o software perante os clientes"
      ],
      "answer": 1,
      "explain": "O SBOM inventaria os componentes de um artefato, em formatos como CycloneDX e SPDX."
    },
    {
      "q": "Qual é o principal uso do SBOM num incidente como o do Log4Shell?",
      "options": [
        "Descobrir rápido quais sistemas usam a biblioteca afetada",
        "Reverter automaticamente o deploy dos sistemas que usam a biblioteca",
        "Cifrar o código-fonte para ele não vazar durante o incidente",
        "Substituir o SCA como ferramenta de análise de dependências"
      ],
      "answer": 0,
      "explain": "Com SBOMs consultáveis, a pergunta \"onde usamos isso?\" vira uma busca, não um mutirão."
    },
    {
      "q": "Qual é a relação entre SCA e SBOM?",
      "options": [
        "São a mesma coisa com nomes diferentes, usados pelos fornecedores",
        "O SCA analisa e gera o inventário; o SBOM é o inventário que pode ser compartilhado e reavaliado",
        "O SBOM executa testes dinâmicos na aplicação em execução",
        "O SCA depende de um SBOM pronto para poder existir"
      ],
      "answer": 1,
      "explain": "O SCA costuma gerar o SBOM, e o SBOM permite reavaliar vulnerabilidades depois, sem reanalisar o código."
    }
  ],
  "shift-left": [
    {
      "q": "O que significa shift-left?",
      "options": [
        "Mover o time de segurança para outro departamento da empresa",
        "Antecipar as verificações de segurança para o início do ciclo de desenvolvimento",
        "Rodar todos os testes apenas em produção, depois do deploy",
        "Remover a equipe de QA do processo de entrega"
      ],
      "answer": 1,
      "explain": "Quanto mais à esquerda na linha do tempo a falha é achada, mais barata é a correção."
    },
    {
      "q": "Qual prática é shift-left?",
      "options": [
        "Um pentest anual feito por uma empresa externa",
        "Pre-commit hooks e checagens no PR",
        "O monitoramento contínuo do ambiente de produção",
        "A resposta a incidentes feita pela equipe de plantão"
      ],
      "answer": 1,
      "explain": "Hooks e checks de PR dão feedback em minutos, ainda no contexto do desenvolvedor."
    },
    {
      "q": "Qual é o risco de aplicar shift-left sem cuidado?",
      "options": [
        "Ficar sem cobertura em produção depois que as verificações saem de lá",
        "Sobrecarregar devs com alertas ruidosos e perder a confiança nas ferramentas",
        "Aumentar o tamanho do repositório com os arquivos das ferramentas",
        "Impedir o uso de CI, porque as verificações passam a rodar localmente"
      ],
      "answer": 1,
      "explain": "Feedback cedo só ajuda se for preciso e acionável; ruído faz o time ignorar tudo."
    }
  ],
  "devsecops": [
    {
      "q": "A ideia central de DevSecOps é...",
      "options": [
        "Ter um time separado de segurança que aprova tudo no fim do ciclo",
        "Segurança como responsabilidade compartilhada e automatizada ao longo do ciclo",
        "Substituir os testes por scanners automáticos de vulnerabilidades",
        "Dar acesso de administrador a todos para ninguém travar a entrega"
      ],
      "answer": 1,
      "explain": "Cultura mais automação: segurança entra nos mesmos fluxos que o código, sem virar gargalo."
    },
    {
      "q": "O que é \"policy as code\"?",
      "options": [
        "Escrever as políticas em PDFs versionados dentro do repositório",
        "Expressar regras de segurança em arquivos executáveis que a esteira aplica sozinha",
        "Um tipo de licença de código aberto para ferramentas de segurança",
        "Comentários no código que explicam as regras de segurança"
      ],
      "answer": 1,
      "explain": "Regras versionadas e testáveis (OPA, por exemplo) viram gates consistentes e auditáveis."
    },
    {
      "q": "Qual métrica ajuda a medir se DevSecOps está funcionando?",
      "options": [
        "Linhas de código escritas por dia em cada equipe",
        "Tempo para corrigir vulnerabilidades e proporção de achados barrados antes da produção",
        "O número de reuniões de segurança realizadas no trimestre",
        "A quantidade de ferramentas de segurança instaladas na esteira"
      ],
      "answer": 1,
      "explain": "Importa quão cedo achamos e quão rápido corrigimos, não quantas ferramentas existem."
    }
  ],
  "threat-modeling": [
    {
      "q": "Quando o threat modeling entrega mais valor?",
      "options": [
        "Depois do pentest, quando os problemas já foram encontrados na prática",
        "No desenho, antes ou durante a implementação",
        "Só depois de um incidente, quando o time sabe o que deu errado",
        "Apenas em produção, onde o sistema real pode ser observado"
      ],
      "answer": 1,
      "explain": "Mudar uma decisão de projeto no papel custa uma conversa; depois do release custa retrabalho."
    },
    {
      "q": "No STRIDE, o que representa a letra S?",
      "options": [
        "Scanning, a varredura de portas e serviços de um sistema",
        "Spoofing (falsificação de identidade)",
        "Secrets, a exposição de credenciais em código e configuração",
        "Sandboxing, o isolamento de código não confiável"
      ],
      "answer": 1,
      "explain": "Spoofing viola a autenticidade: alguém se passa por outro usuário ou serviço."
    },
    {
      "q": "Onde as ameaças tendem a se concentrar num diagrama de fluxo de dados?",
      "options": [
        "Em qualquer caixa do diagrama, igualmente",
        "Nos fluxos que cruzam fronteiras de confiança",
        "Somente no banco de dados, onde os dados ficam guardados",
        "Nos rótulos do diagrama, que expõem detalhes internos"
      ],
      "answer": 1,
      "explain": "Onde dados mudam de nível de confiança é onde falta validação, autenticação ou autorização."
    }
  ]
};
