import type { QuizBank } from "@/content/types";

export const cloudsecQuiz: QuizBank = {
  "iam": [
    {
      "q": "O que significa privilégio mínimo (least privilege)?",
      "options": [
        "Dar a cada identidade só o acesso necessário para a sua função",
        "Dar acesso total no início e revogar o que não for usado depois",
        "Usar uma única conta compartilhada para toda a equipe de infraestrutura",
        "Bloquear todo acesso à nuvem até a auditoria anual terminar"
      ],
      "answer": 0,
      "explain": "Cada permissão extra é um caminho a mais para o atacante depois de um comprometimento."
    },
    {
      "q": "Por que roles são preferíveis a usuários com chave estática para workloads?",
      "options": [
        "Roles entregam credenciais temporárias que expiram sozinhas",
        "Roles dispensam o uso de policies para liberar acesso",
        "Roles têm permissões ilimitadas por padrão em qualquer conta",
        "Chaves estáticas são mais rápidas de usar em cargas de trabalho"
      ],
      "answer": 0,
      "explain": "Credenciais efêmeras reduzem a janela de uso de qualquer vazamento."
    },
    {
      "q": "Numa trust policy, o que é um sinal de alerta?",
      "options": [
        "Principal: \"*\" sem condições",
        "Uma condição de MFA exigida antes de assumir a role",
        "Uma conta específica listada como principal confiável",
        "Um serviço da AWS listado como principal da role"
      ],
      "answer": 0,
      "explain": "Isso permite que qualquer identidade autenticada assuma a role."
    }
  ],
  "network": [
    {
      "q": "O que a microsegmentação faz?",
      "options": [
        "Isola workloads com regras específicas, limitando o movimento lateral",
        "Divide o disco em partições para separar os dados de cada workload",
        "Comprime o tráfego entre as sub-redes para reduzir a latência",
        "Substitui o IAM no controle de quem pode usar cada recurso"
      ],
      "answer": 0,
      "explain": "Se um workload cai, o atacante não alcança automaticamente o resto da rede."
    },
    {
      "q": "Qual a diferença típica entre security group e NACL na AWS?",
      "options": [
        "Security group é stateful e por instância; NACL é stateless e por sub-rede",
        "São idênticos, e a escolha entre eles é só uma questão de estilo",
        "NACL é stateful e por instância; security group é stateless e por sub-rede",
        "Security groups só valem para o S3 e NACLs só para o EC2"
      ],
      "answer": 0,
      "explain": "O security group lembra conexões (stateful); a NACL avalia pacote a pacote nas duas direções."
    },
    {
      "q": "Qual regra de entrada é um red flag clássico?",
      "options": [
        "0.0.0.0/0 liberando SSH ou banco de dados",
        "HTTPS aberto para um load balancer público",
        "Porta 443 de um CDN",
        "Tráfego interno entre sub-redes privadas"
      ],
      "answer": 0,
      "explain": "Portas administrativas e bancos nunca devem estar expostos para toda a internet."
    }
  ],
  "kubernetes": [
    {
      "q": "Para que serve o RBAC no Kubernetes?",
      "options": [
        "Controlar quem pode fazer o quê na API do cluster",
        "Balancear a carga de requisições entre os pods de um serviço",
        "Cifrar as imagens de contêiner guardadas no registry",
        "Escalar os nós do cluster automaticamente conforme a demanda"
      ],
      "answer": 0,
      "explain": "RBAC liga identidades a verbos e recursos, aplicando privilégio mínimo ao cluster."
    },
    {
      "q": "O que fazem os admission controllers?",
      "options": [
        "Interceptam requisições à API e podem validar ou barrar objetos antes de serem criados",
        "Reiniciam automaticamente os pods que falham nas verificações de saúde",
        "Fazem o backup periódico do etcd para o armazenamento de objetos",
        "Gerenciam os registros de DNS internos dos serviços do cluster"
      ],
      "answer": 0,
      "explain": "Políticas como \"sem container privilegiado\" são aplicadas aqui, na entrada do cluster."
    },
    {
      "q": "Qual configuração de pod é perigosa?",
      "options": [
        "privileged: true",
        "readOnlyRootFilesystem: true",
        "runAsNonRoot: true",
        "allowPrivilegeEscalation: false"
      ],
      "answer": 0,
      "explain": "Um container privilegiado tem quase o poder do próprio nó e anula o isolamento."
    }
  ],
  "containers": [
    {
      "q": "Por que imagens devem ser imutáveis e assinadas?",
      "options": [
        "Para garantir que o que roda é exatamente o que foi construído e aprovado",
        "Para reduzir o tamanho da imagem e economizar espaço no registry",
        "Para acelerar o download da imagem em cada nó do cluster",
        "Para dispensar o uso de scanners de vulnerabilidades no pipeline"
      ],
      "answer": 0,
      "explain": "Assinatura e digest fixam a identidade do artefato; tags mutáveis podem apontar para outra coisa amanhã."
    },
    {
      "q": "Qual prática reduz a superfície de ataque de uma imagem?",
      "options": [
        "Usar base mínima (distroless/alpine) e remover ferramentas desnecessárias",
        "Instalar um shell completo e utilitários de debug para facilitar o suporte",
        "Rodar o processo como root para evitar problemas de permissão",
        "Usar a tag latest para sempre receber a base mais recente"
      ],
      "answer": 0,
      "explain": "Menos pacotes significa menos CVEs e menos ferramentas à disposição de um invasor."
    },
    {
      "q": "O que é o risco da cadeia de suprimentos de containers?",
      "options": [
        "Uma imagem base ou dependência comprometida entrar na sua imagem",
        "O registry ficar sem espaço e impedir novos deploys",
        "A CPU do nó se esgotar durante o build da imagem",
        "O Docker mudar de versão e quebrar a compatibilidade"
      ],
      "answer": 0,
      "explain": "Você herda tudo que a imagem base e as camadas trazem, incluindo o que está comprometido."
    }
  ],
  "cspm": [
    {
      "q": "O que o CSPM faz?",
      "options": [
        "Avalia continuamente a configuração da nuvem contra boas práticas e detecta desvios",
        "Protege em tempo de execução os processos dentro dos contêineres",
        "Cifra os volumes e os backups de todas as contas da organização",
        "Gerencia as identidades humanas e o ciclo de vida dos acessos"
      ],
      "answer": 0,
      "explain": "CSPM olha a postura (configuração), não o comportamento do workload."
    },
    {
      "q": "Qual achado é típico de CSPM?",
      "options": [
        "Bucket de armazenamento público sem necessidade",
        "Um processo suspeito abrindo uma conexão dentro de um container",
        "Uma injeção SQL em um endpoint da aplicação",
        "Um pacote com CVE conhecida dentro do código da aplicação"
      ],
      "answer": 0,
      "explain": "Configuração errada de recurso é o território do CSPM."
    },
    {
      "q": "O que é drift de configuração?",
      "options": [
        "A configuração real divergir do estado desejado ou aprovado",
        "A latência da rede entre duas regiões aumentar sem aviso",
        "O custo mensal da nuvem cair depois de um ajuste de capacidade",
        "Um erro de resolução de DNS em um serviço interno"
      ],
      "answer": 0,
      "explain": "Mudanças manuais fora do código criam drift, e o CSPM é o que o detecta."
    }
  ],
  "cwpp": [
    {
      "q": "O que o CWPP protege?",
      "options": [
        "O workload em execução: VMs, containers e funções, vendo o comportamento em runtime",
        "Apenas a configuração das contas e dos serviços gerenciados",
        "O código-fonte guardado nos repositórios da organização",
        "O DNS público e os registros de domínio da empresa"
      ],
      "answer": 0,
      "explain": "CWPP complementa o CSPM: um olha o ambiente, o outro olha o que roda dentro dele."
    },
    {
      "q": "Qual sinal é típico de detecção em runtime?",
      "options": [
        "Um container abrindo um shell reverso para um IP externo",
        "Um bucket com política restritiva e acesso privado",
        "Uma imagem assinada e verificada antes de ser executada",
        "Uma role que exige MFA para ser assumida por pessoas"
      ],
      "answer": 0,
      "explain": "Comportamento anômalo em execução é o que o CWPP e ferramentas como Falco observam."
    },
    {
      "q": "Por que um baseline de comportamento ajuda?",
      "options": [
        "Porque desvios do normal se destacam e geram alertas mais precisos",
        "Porque elimina a necessidade de guardar logs dos workloads",
        "Porque cifra o tráfego entre os contêineres automaticamente",
        "Porque substitui o IAM na decisão de quem acessa o quê"
      ],
      "answer": 0,
      "explain": "Saber o que é normal para um workload torna o anormal visível."
    }
  ],
  "secrets-cloud": [
    {
      "q": "Qual é o objetivo de um cofre de segredos gerenciado?",
      "options": [
        "Centralizar, controlar o acesso e rotacionar segredos, sem deixá-los em código",
        "Armazenar os segredos em texto puro, mas de forma mais organizada",
        "Substituir o IAM como mecanismo de controle de acesso",
        "Aumentar o desempenho das aplicações que consultam os segredos"
      ],
      "answer": 0,
      "explain": "O cofre entrega o segredo só a quem tem permissão, com auditoria e rotação."
    },
    {
      "q": "Por que rotacionar segredos periodicamente?",
      "options": [
        "Para limitar o dano de um vazamento que ninguém percebeu",
        "Porque os segredos se degradam e deixam de funcionar com o tempo",
        "Para reduzir o custo mensal do cofre de segredos",
        "Para evitar a necessidade de usar MFA nas contas"
      ],
      "answer": 0,
      "explain": "Um segredo rotacionado deixa de valer sozinho, mesmo se vazou sem alarme."
    },
    {
      "q": "O que é melhor que um segredo estático para um workload na nuvem?",
      "options": [
        "Credenciais temporárias via identidade do workload",
        "Uma senha longa e aleatória em uma variável de ambiente",
        "Um arquivo de configuração em um repositório privado",
        "Uma chave compartilhada guardada pelo time responsável"
      ],
      "answer": 0,
      "explain": "Se o workload tem identidade, ele nem precisa guardar uma senha."
    }
  ],
  "kms-crypto": [
    {
      "q": "O que é criptografia de envelope?",
      "options": [
        "Cifrar os dados com uma chave de dados, e cifrar essa chave com uma chave mestra do KMS",
        "Cifrar duas vezes os mesmos dados com a mesma chave, para dobrar a proteção",
        "Guardar a chave de dados junto do dado, em texto puro, no mesmo bucket",
        "Usar somente chaves públicas para cifrar e decifrar todo o conteúdo"
      ],
      "answer": 0,
      "explain": "A chave mestra nunca sai do KMS, e a chave de dados cifrada pode viajar com o dado."
    },
    {
      "q": "Por que o acesso à chave no KMS é tão crítico?",
      "options": [
        "Quem pode usar a chave pode decifrar tudo que ela protege",
        "Porque as chaves do KMS expiram em poucas horas por padrão",
        "Porque o KMS é lento e qualquer acesso extra atrasa a aplicação",
        "Porque cada chave ocupa espaço e o armazenamento é limitado"
      ],
      "answer": 0,
      "explain": "Cifrar não adianta se a policy da chave for permissiva demais."
    },
    {
      "q": "Qual prática é recomendada para chaves?",
      "options": [
        "Rotação automática e separação entre quem administra e quem usa a chave",
        "Compartilhar a chave por e-mail com quem precisar usá-la",
        "Nunca rotacionar, para não invalidar os dados já cifrados",
        "Usar a mesma chave em todos os ambientes para simplificar a operação"
      ],
      "answer": 0,
      "explain": "Separação de funções e rotação reduzem o impacto de qualquer abuso."
    }
  ],
  "logging-detection": [
    {
      "q": "Qual é o papel do CloudTrail (ou similar)?",
      "options": [
        "Registrar as chamadas de API: quem fez o quê, quando e de onde",
        "Bloquear o tráfego malicioso antes de ele chegar à aplicação",
        "Cifrar os dados em repouso nos serviços de armazenamento",
        "Escalar a infraestrutura de acordo com a carga das aplicações"
      ],
      "answer": 0,
      "explain": "A trilha de auditoria é a base para detectar abuso e investigar incidentes."
    },
    {
      "q": "Por que enviar logs para uma conta separada e imutável?",
      "options": [
        "Para que um atacante com acesso à conta de produção não apague os rastros",
        "Para economizar armazenamento nas contas de produção",
        "Para acelerar as consultas feitas pela equipe de segurança",
        "Porque a lei exige que os logs fiquem em duas contas diferentes"
      ],
      "answer": 0,
      "explain": "A primeira coisa que muitos atacantes fazem é tentar desligar ou apagar os logs."
    },
    {
      "q": "O que torna um alerta bom?",
      "options": [
        "Ser acionável: dizer o que aconteceu, onde e o que fazer, com baixo ruído",
        "Disparar a cada evento, para nenhuma ocorrência passar despercebida",
        "Ser enviado por um e-mail semanal que resume todos os eventos",
        "Não ter dono definido, para qualquer pessoa poder agir"
      ],
      "answer": 0,
      "explain": "Alertas demais viram fadiga; sem dono ou ação, ninguém responde."
    }
  ],
  "zero-trust": [
    {
      "q": "Qual é o princípio central de Zero Trust?",
      "options": [
        "Nunca confiar, sempre verificar: nenhuma rede ou origem é confiável por padrão",
        "Confiar em tudo o que estiver dentro da VPN da empresa",
        "Bloquear toda a internet e liberar apenas o que for solicitado",
        "Usar somente senhas fortes e trocá-las com frequência"
      ],
      "answer": 0,
      "explain": "Cada requisição é autenticada, autorizada e avaliada, esteja ela dentro ou fora da rede."
    },
    {
      "q": "O que muda do modelo de perímetro para Zero Trust?",
      "options": [
        "A decisão de acesso passa da rede para a identidade e o contexto",
        "A autenticação deixa de existir, já que a rede é confiável",
        "Tudo vira público e a proteção fica só nos dados",
        "O log deixa de ser necessário, porque o acesso é verificado"
      ],
      "answer": 0,
      "explain": "O perímetro deixou de existir como barreira única; identidade e postura do dispositivo decidem."
    },
    {
      "q": "Qual prática representa Zero Trust?",
      "options": [
        "Acesso por requisição com MFA e privilégio mínimo",
        "VPN com acesso total à rede interna depois do login",
        "Uma senha compartilhada pelo time, trocada a cada trimestre",
        "Liberar todas as portas internas entre os serviços"
      ],
      "answer": 0,
      "explain": "Acesso total pela VPN é o oposto: uma credencial roubada abre tudo."
    }
  ],
  "incident-response": [
    {
      "q": "Num alerta de chave de acesso vazada, qual é um bom primeiro passo?",
      "options": [
        "Desativar a chave e restringir a identidade, preservando o estado para forense",
        "Apagar o usuário e todos os logs relacionados para limpar o ambiente",
        "Ignorar o alerta até confirmar a atividade com o atacante",
        "Reiniciar todas as instâncias da conta para interromper o acesso"
      ],
      "answer": 0,
      "explain": "Cortar o acesso rapidamente, sem destruir evidência, é o equilíbrio da contenção."
    },
    {
      "q": "Por que isolar uma instância suspeita antes de terminá-la?",
      "options": [
        "Porque terminar apaga memória e conexões que servem de evidência",
        "Porque terminar a instância é mais caro do que isolá-la",
        "Porque instâncias suspeitas não podem ser terminadas na nuvem",
        "Porque isolar a instância acelera a rede dos outros serviços"
      ],
      "answer": 0,
      "explain": "Em ambientes efêmeros, a evidência volátil some junto com o recurso."
    },
    {
      "q": "O que o MTTR mede?",
      "options": [
        "O tempo médio até responder e conter um incidente",
        "O custo mensal médio da nuvem para cada equipe",
        "O número médio de alertas gerados por dia",
        "A latência média das APIs durante os incidentes"
      ],
      "answer": 0,
      "explain": "É a medida da eficácia dos runbooks e da automação de resposta."
    }
  ]
};
