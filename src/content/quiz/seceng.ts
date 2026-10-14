import type { QuizBank } from "@/content/types";

export const secengQuiz: QuizBank = {
  "iac-seguro": [
    {
      "q": "Por que o estado do Terraform não deve ir para o repositório?",
      "options": [
        "Pode conter segredos em texto, e precisa de backend remoto cifrado, com acesso restrito e bloqueio",
        "Porque o arquivo é grande demais para ficar no repositório",
        "Porque o Git não consegue guardar arquivos no formato JSON",
        "Porque o estado é gerado de novo a cada commit e causaria conflitos"
      ],
      "answer": 0,
      "explain": "O estado guarda o que foi criado, inclusive valores sensíveis. Backend remoto com cifragem e lock é o padrão."
    },
    {
      "q": "O que é drift de infraestrutura?",
      "options": [
        "A realidade divergir do que o código descreve, por exemplo por mudança manual no console",
        "Um erro de sintaxe no código do Terraform que bloqueia o plano",
        "A latência de rede entre duas regiões da nuvem",
        "Um tipo de backup do estado da infraestrutura"
      ],
      "answer": 0,
      "explain": "Detectar drift mantém o código como fonte da verdade."
    },
    {
      "q": "Qual é a vantagem de escanear o IaC antes do apply?",
      "options": [
        "Achar configurações inseguras (como 0.0.0.0/0 em SSH) antes de qualquer recurso existir",
        "Reduzir o custo mensal cobrado pelo provedor de nuvem",
        "Dispensar a revisão por pares das mudanças de infraestrutura",
        "Evitar o uso de módulos compartilhados entre os times"
      ],
      "answer": 0,
      "explain": "É o shift-left da infraestrutura: corrigir no código custa muito menos que em produção."
    }
  ],
  "policy-as-code": [
    {
      "q": "O que é policy as code?",
      "options": [
        "Regras de segurança expressas em linguagem executável, avaliadas automaticamente a cada mudança",
        "Um manual de políticas em PDF mantido sob controle de versão",
        "Um comentário no código explicando as regras de segurança",
        "Um tipo de licença de código aberto para ferramentas de segurança"
      ],
      "answer": 0,
      "explain": "A política vira um gate que responde em segundos e é aplicado igual para todos."
    },
    {
      "q": "Por que testar políticas escritas em Rego?",
      "options": [
        "Sem teste uma regra pode deixar de pegar qualquer coisa, ou bloquear mudanças legítimas",
        "Porque o Rego não compila sem que existam testes",
        "Para reduzir o tamanho dos arquivos de política",
        "Porque o OPA exige testes para carregar as políticas"
      ],
      "answer": 0,
      "explain": "Casos que devem passar e casos que devem ser negados dão confiança na regra."
    },
    {
      "q": "Qual é a forma saudável de adotar uma política nova sem travar todo mundo?",
      "options": [
        "Começar em modo de aviso, medir, corrigir o legado e só então bloquear",
        "Bloquear imediatamente em produção, para ninguém violar a regra",
        "Aplicar só em ambientes de teste, para sempre",
        "Criar exceções sem prazo para cada time que reclamar"
      ],
      "answer": 0,
      "explain": "É a mesma escada do WAF: observação, shadow e enforcement."
    }
  ],
  "cicd-hardening": [
    {
      "q": "Qual é a vantagem do OIDC sobre chaves de nuvem guardadas como segredo da esteira?",
      "options": [
        "Credenciais temporárias, restritas ao repositório e à branch, sem segredo estático para vazar",
        "É mais rápido de configurar do que guardar uma chave como segredo",
        "Dispensa o uso de IAM para controlar as permissões na nuvem",
        "Funciona mesmo sem acesso à internet na esteira"
      ],
      "answer": 0,
      "explain": "O token expira sozinho e o provedor só entrega o que a identidade da esteira pode receber."
    },
    {
      "q": "Por que fixar ações e imagens por SHA ou digest?",
      "options": [
        "Uma tag mutável pode ser reapontada para código malicioso",
        "Para reduzir o tamanho da imagem baixada pela esteira",
        "Porque o SHA é mais fácil de ler do que uma tag de versão",
        "Porque as tags são proibidas pelo GitHub"
      ],
      "answer": 0,
      "explain": "A dependência da esteira também é cadeia de suprimentos."
    },
    {
      "q": "O que há de arriscado em gatilhos como pull_request_target?",
      "options": [
        "Rodar código de fork com acesso a segredos, tratando entrada de PR como confiável",
        "Eles não funcionam com repositórios Git comuns",
        "Eles executam apenas no ambiente de produção",
        "Eles cifram o repositório e impedem a leitura do código"
      ],
      "answer": 0,
      "explain": "Entradas de PR (título, branch, conteúdo) são controladas por quem abre o PR."
    }
  ],
  "confiabilidade-em-escala": [
    {
      "q": "Por que usar jitter junto do backoff exponencial?",
      "options": [
        "Para desincronizar os clientes e evitar que todos repitam ao mesmo tempo e derrubem a dependência",
        "Para aumentar o número total de tentativas feitas por cada cliente",
        "Para eliminar por completo os timeouts nas chamadas",
        "Para cifrar a chamada durante as novas tentativas"
      ],
      "answer": 0,
      "explain": "Retries sincronizados criam uma nova rajada exatamente quando a dependência se recuperava."
    },
    {
      "q": "Qual é a abordagem prática para evitar agir duas vezes sobre o mesmo evento?",
      "options": [
        "Aceitar entrega at-least-once e tornar o processamento idempotente",
        "Buscar exactly-once em todas as camadas do sistema",
        "Desativar os retries para nunca repetir uma ação",
        "Descartar os eventos repetidos sem registrar que eles chegaram"
      ],
      "answer": 0,
      "explain": "IDs estáveis e registro dos processados, ou ações por estado desejado, toleram duplicatas."
    },
    {
      "q": "Para que serve uma DLQ?",
      "options": [
        "Guardar eventos que não puderam ser processados, sem travar o fluxo",
        "Aumentar a velocidade de processamento do consumidor",
        "Cifrar as mensagens antes de enviá-las ao broker",
        "Apagar os eventos antigos da fila para ganhar espaço"
      ],
      "answer": 0,
      "explain": "Preserva o evento para análise e libera a partição."
    }
  ],
  "observabilidade-plataforma": [
    {
      "q": "Por que alertar sobre uma fonte que parou de enviar eventos?",
      "options": [
        "Falha silenciosa deixa ataques sem detecção, sem nenhum erro visível",
        "Porque fontes silenciosas custam menos para a plataforma",
        "Para reduzir o número de logs guardados no SIEM",
        "Porque o Prometheus exige esse tipo de alerta para funcionar"
      ],
      "answer": 0,
      "explain": "O silêncio pode ser falha; sem alerta de ausência, ninguém percebe."
    },
    {
      "q": "Qual é o papel do tracing na plataforma?",
      "options": [
        "Mostrar em qual etapa o tempo foi gasto quando a latência fim a fim sobe",
        "Cifrar o tráfego entre os serviços da plataforma",
        "Substituir as métricas por um registro mais detalhado",
        "Contar quantos usuários existem em cada serviço"
      ],
      "answer": 0,
      "explain": "O contexto do trace acompanha o evento entre serviços e filas."
    },
    {
      "q": "O que é um bom SLO de plataforma de segurança?",
      "options": [
        "Uma meta mensurável, como 99% dos eventos virarem decisão em menos de 60 segundos",
        "Uma frase genérica sobre qualidade, sem número nem prazo",
        "Zero alertas por mês, o que mostra que tudo funciona",
        "Uso de CPU abaixo de 5% em todos os serviços"
      ],
      "answer": 0,
      "explain": "Metas objetivas permitem priorizar confiabilidade contra funcionalidades novas."
    }
  ],
  "automacao-soar": [
    {
      "q": "Qual destes é um freio essencial de automação de resposta?",
      "options": [
        "Aprovação humana para ações destrutivas ou de grande alcance",
        "Executar sempre a ação mais ampla possível, para conter rápido",
        "Remover os logs de auditoria da automação para ganhar velocidade",
        "Dar permissões de administrador à automação para ela nunca falhar"
      ],
      "answer": 0,
      "explain": "Quanto maior o impacto da ação, maior a necessidade de uma checagem humana."
    },
    {
      "q": "Para que serve o dry-run em um playbook?",
      "options": [
        "Mostrar o que a ação faria, sem executá-la, para teste e shadow",
        "Acelerar a execução do playbook ao pular as verificações",
        "Cifrar as credenciais usadas pelo playbook",
        "Substituir a auditoria das ações executadas"
      ],
      "answer": 0,
      "explain": "Permite validar uma automação nova antes de dar a ela poder de agir."
    },
    {
      "q": "Por que dar prazo (TTL) aos bloqueios automáticos?",
      "options": [
        "Para que um erro de classificação não vire um bloqueio permanente",
        "Para economizar o armazenamento da lista de bloqueios",
        "Porque bloqueios sem prazo são tecnicamente impossíveis",
        "Para aumentar o atraso entre a detecção e a resposta"
      ],
      "answer": 0,
      "explain": "Toda ação automática deve ser reversível, de preferência sozinha com o tempo."
    }
  ],
  "ia-na-seguranca": [
    {
      "q": "Por que logs e user agents são um risco ao alimentar um LLM?",
      "options": [
        "São controlados por atacantes e podem conter instruções que o modelo obedece",
        "Porque são grandes demais para caber no contexto do modelo",
        "Porque o modelo não consegue ler texto de logs",
        "Porque eles são sempre cifrados antes de chegarem ao modelo"
      ],
      "answer": 0,
      "explain": "Prompt injection pelos dados: o conteúdo analisado vira instrução."
    },
    {
      "q": "Qual a vantagem de exigir saída estruturada validada por esquema?",
      "options": [
        "O que não casa é descartado ou vai a um humano, e a automação pode checar o dado",
        "O modelo passa a nunca errar no formato das respostas",
        "Elimina a necessidade de avaliar a qualidade das respostas",
        "Reduz a latência do modelo a praticamente zero"
      ],
      "answer": 0,
      "explain": "Transforma texto livre em dado verificável."
    },
    {
      "q": "Qual é o padrão seguro para IA em um playbook?",
      "options": [
        "A IA resume e sugere; uma regra determinística ou um humano decide, e a ação passa pelos freios",
        "A saída do modelo aciona diretamente a ação destrutiva",
        "A IA aprova as próprias ações para ganhar velocidade",
        "Remover a revisão humana para não atrasar a resposta"
      ],
      "answer": 0,
      "explain": "A IA em volta da decisão, não no lugar dela."
    }
  ],
  "plataforma-como-produto": [
    {
      "q": "O que é um caminho pavimentado (golden path)?",
      "options": [
        "A forma recomendada de fazer algo, já com os controles de segurança embutidos",
        "Um tipo de ataque que explora caminhos de rede pavimentados",
        "Uma política que proíbe qualquer exceção",
        "Um relatório mensal sobre o estado da plataforma"
      ],
      "answer": 0,
      "explain": "A segurança deixa de ser um imposto e vira o atalho."
    },
    {
      "q": "Qual métrica mostra o alcance da plataforma de segurança?",
      "options": [
        "Adoção e cobertura, como o percentual de serviços e repositórios dentro do padrão",
        "O número de reuniões realizadas com os times",
        "O tamanho do repositório da plataforma",
        "A quantidade de regras de segurança escritas"
      ],
      "answer": 0,
      "explain": "Plataforma boa é a que as pessoas usam, e dá para medir isso."
    },
    {
      "q": "Se os devs estão desligando um controle, qual é a leitura correta?",
      "options": [
        "O problema do produto é o controle (atrito, ruído, falta de clareza)",
        "Os devs são o problema e precisam de mais treinamento",
        "O controle deve ser removido sem nenhuma análise",
        "Deve-se aumentar as punições para quem desligar controles"
      ],
      "answer": 0,
      "explain": "Atrito alto leva ao contorno; mensagens claras e correção automática reduzem isso."
    }
  ]
};
