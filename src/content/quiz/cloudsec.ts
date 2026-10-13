import type { QuizBank } from "@/content/types";

export const cloudsecQuiz: QuizBank = {
  iam: [
    {
      q: "O que significa privilégio mínimo (least privilege)?",
      options: [
        "Dar a cada identidade só o acesso necessário para a sua função",
        "Dar acesso total e revogar depois",
        "Usar uma única conta compartilhada",
        "Bloquear todo acesso à nuvem",
      ],
      answer: 0,
      explain: "Cada permissão extra é um caminho a mais para o atacante depois de um comprometimento.",
    },
    {
      q: "Por que roles são preferíveis a usuários com chave estática para workloads?",
      options: [
        "Roles entregam credenciais temporárias que expiram sozinhas",
        "Roles não precisam de policies",
        "Roles têm permissões ilimitadas",
        "Chaves estáticas são mais rápidas",
      ],
      answer: 0,
      explain: "Credenciais efêmeras reduzem a janela de uso de qualquer vazamento.",
    },
    {
      q: "Numa trust policy, o que é um sinal de alerta?",
      options: [
        "Principal: \"*\" sem condições",
        "Uma condição de MFA",
        "Uma conta específica listada",
        "Um serviço da AWS como principal",
      ],
      answer: 0,
      explain: "Isso permite que qualquer identidade autenticada assuma a role.",
    },
  ],
  network: [
    {
      q: "O que a microsegmentação faz?",
      options: [
        "Isola workloads com regras específicas, limitando o movimento lateral",
        "Divide o disco em partições",
        "Comprime o tráfego",
        "Substitui o IAM",
      ],
      answer: 0,
      explain: "Se um workload cai, o atacante não alcança automaticamente o resto da rede.",
    },
    {
      q: "Qual a diferença típica entre security group e NACL na AWS?",
      options: [
        "Security group é stateful e por instância; NACL é stateless e por sub-rede",
        "São idênticos",
        "NACL é stateful e security group é stateless",
        "Security groups só valem para S3",
      ],
      answer: 0,
      explain: "O security group lembra conexões (stateful); a NACL avalia pacote a pacote nas duas direções.",
    },
    {
      q: "Qual regra de entrada é um red flag clássico?",
      options: [
        "0.0.0.0/0 liberando SSH ou banco de dados",
        "HTTPS aberto para um load balancer público",
        "Porta 443 de um CDN",
        "Tráfego interno entre sub-redes privadas",
      ],
      answer: 0,
      explain: "Portas administrativas e bancos nunca devem estar expostos para toda a internet.",
    },
  ],
  kubernetes: [
    {
      q: "Para que serve o RBAC no Kubernetes?",
      options: [
        "Controlar quem pode fazer o quê na API do cluster",
        "Balancear carga entre pods",
        "Cifrar imagens",
        "Escalar nós automaticamente",
      ],
      answer: 0,
      explain: "RBAC liga identidades a verbos e recursos, aplicando privilégio mínimo ao cluster.",
    },
    {
      q: "O que fazem os admission controllers?",
      options: [
        "Interceptam requisições à API e podem validar ou barrar objetos antes de serem criados",
        "Reiniciam pods com falha",
        "Fazem backup do etcd",
        "Gerenciam DNS",
      ],
      answer: 0,
      explain: "Políticas como \"sem container privilegiado\" são aplicadas aqui, na entrada do cluster.",
    },
    {
      q: "Qual configuração de pod é perigosa?",
      options: [
        "privileged: true",
        "readOnlyRootFilesystem: true",
        "runAsNonRoot: true",
        "allowPrivilegeEscalation: false",
      ],
      answer: 0,
      explain: "Um container privilegiado tem quase o poder do próprio nó e anula o isolamento.",
    },
  ],
  containers: [
    {
      q: "Por que imagens devem ser imutáveis e assinadas?",
      options: [
        "Para garantir que o que roda é exatamente o que foi construído e aprovado",
        "Para reduzir o tamanho da imagem",
        "Para acelerar o pull",
        "Para dispensar scanners",
      ],
      answer: 0,
      explain: "Assinatura e digest fixam a identidade do artefato; tags mutáveis podem apontar para outra coisa amanhã.",
    },
    {
      q: "Qual prática reduz a superfície de ataque de uma imagem?",
      options: [
        "Usar base mínima (distroless/alpine) e remover ferramentas desnecessárias",
        "Instalar um shell completo e utilitários de debug",
        "Rodar como root",
        "Usar a tag latest",
      ],
      answer: 0,
      explain: "Menos pacotes significa menos CVEs e menos ferramentas à disposição de um invasor.",
    },
    {
      q: "O que é o risco da cadeia de suprimentos de containers?",
      options: [
        "Uma imagem base ou dependência comprometida entrar na sua imagem",
        "O registry ficar sem espaço",
        "A CPU do nó esgotar",
        "O Docker mudar de versão",
      ],
      answer: 0,
      explain: "Você herda tudo que a imagem base e as camadas trazem, incluindo o que está comprometido.",
    },
  ],
  cspm: [
    {
      q: "O que o CSPM faz?",
      options: [
        "Avalia continuamente a configuração da nuvem contra boas práticas e detecta desvios",
        "Protege processos em runtime dentro de containers",
        "Cifra volumes",
        "Gerencia identidades humanas",
      ],
      answer: 0,
      explain: "CSPM olha a postura (configuração), não o comportamento do workload.",
    },
    {
      q: "Qual achado é típico de CSPM?",
      options: [
        "Bucket de armazenamento público sem necessidade",
        "Um processo suspeito num container",
        "Uma injeção SQL",
        "Um pacote com CVE no código",
      ],
      answer: 0,
      explain: "Configuração errada de recurso é o território do CSPM.",
    },
    {
      q: "O que é drift de configuração?",
      options: [
        "A configuração real divergir do estado desejado ou aprovado",
        "A latência da rede aumentar",
        "O custo da nuvem cair",
        "Um erro de DNS",
      ],
      answer: 0,
      explain: "Mudanças manuais fora do código criam drift, e o CSPM é o que o detecta.",
    },
  ],
  cwpp: [
    {
      q: "O que o CWPP protege?",
      options: [
        "O workload em execução: VMs, containers e funções, vendo o comportamento em runtime",
        "Apenas a configuração das contas",
        "O código-fonte no repositório",
        "O DNS público",
      ],
      answer: 0,
      explain: "CWPP complementa o CSPM: um olha o ambiente, o outro olha o que roda dentro dele.",
    },
    {
      q: "Qual sinal é típico de detecção em runtime?",
      options: [
        "Um container abrindo um shell reverso para um IP externo",
        "Um bucket com política restritiva",
        "Uma imagem assinada",
        "Uma role com MFA",
      ],
      answer: 0,
      explain: "Comportamento anômalo em execução é o que o CWPP e ferramentas como Falco observam.",
    },
    {
      q: "Por que um baseline de comportamento ajuda?",
      options: [
        "Porque desvios do normal se destacam e geram alertas mais precisos",
        "Porque elimina a necessidade de logs",
        "Porque cifra o tráfego",
        "Porque substitui o IAM",
      ],
      answer: 0,
      explain: "Saber o que é normal para um workload torna o anormal visível.",
    },
  ],
  "secrets-cloud": [
    {
      q: "Qual é o objetivo de um cofre de segredos gerenciado?",
      options: [
        "Centralizar, controlar o acesso e rotacionar segredos, sem deixá-los em código",
        "Armazenar segredos em texto puro de forma organizada",
        "Substituir o IAM",
        "Aumentar o desempenho",
      ],
      answer: 0,
      explain: "O cofre entrega o segredo só a quem tem permissão, com auditoria e rotação.",
    },
    {
      q: "Por que rotacionar segredos periodicamente?",
      options: [
        "Para limitar o dano de um vazamento que ninguém percebeu",
        "Porque eles estragam com o tempo",
        "Para reduzir custos",
        "Para evitar uso de MFA",
      ],
      answer: 0,
      explain: "Um segredo rotacionado deixa de valer sozinho, mesmo se vazou sem alarme.",
    },
    {
      q: "O que é melhor que um segredo estático para um workload na nuvem?",
      options: [
        "Credenciais temporárias via identidade do workload",
        "Uma senha longa em variável de ambiente",
        "Um arquivo em repositório privado",
        "Uma chave compartilhada pelo time",
      ],
      answer: 0,
      explain: "Se o workload tem identidade, ele nem precisa guardar uma senha.",
    },
  ],
  "kms-crypto": [
    {
      q: "O que é criptografia de envelope?",
      options: [
        "Cifrar os dados com uma chave de dados, e cifrar essa chave com uma chave mestra do KMS",
        "Cifrar duas vezes com a mesma chave",
        "Guardar a chave junto do dado em texto puro",
        "Usar somente chaves públicas",
      ],
      answer: 0,
      explain: "A chave mestra nunca sai do KMS, e a chave de dados cifrada pode viajar com o dado.",
    },
    {
      q: "Por que o acesso à chave no KMS é tão crítico?",
      options: [
        "Quem pode usar a chave pode decifrar tudo que ela protege",
        "Porque as chaves expiram em horas",
        "Porque o KMS é lento",
        "Porque as chaves ocupam espaço",
      ],
      answer: 0,
      explain: "Cifrar não adianta se a policy da chave for permissiva demais.",
    },
    {
      q: "Qual prática é recomendada para chaves?",
      options: [
        "Rotação automática e separação entre quem administra e quem usa a chave",
        "Compartilhar a chave por e-mail",
        "Nunca rotacionar",
        "Usar a mesma chave em todos os ambientes",
      ],
      answer: 0,
      explain: "Separação de funções e rotação reduzem o impacto de qualquer abuso.",
    },
  ],
  "logging-detection": [
    {
      q: "Qual é o papel do CloudTrail (ou similar)?",
      options: [
        "Registrar as chamadas de API: quem fez o quê, quando e de onde",
        "Bloquear tráfego malicioso",
        "Cifrar dados em repouso",
        "Escalar a infraestrutura",
      ],
      answer: 0,
      explain: "A trilha de auditoria é a base para detectar abuso e investigar incidentes.",
    },
    {
      q: "Por que enviar logs para uma conta separada e imutável?",
      options: [
        "Para que um atacante com acesso à conta de produção não apague os rastros",
        "Para economizar armazenamento",
        "Para acelerar consultas",
        "Porque a lei exige duas contas",
      ],
      answer: 0,
      explain: "A primeira coisa que muitos atacantes fazem é tentar desligar ou apagar os logs.",
    },
    {
      q: "O que torna um alerta bom?",
      options: [
        "Ser acionável: dizer o que aconteceu, onde e o que fazer, com baixo ruído",
        "Disparar a cada evento",
        "Ser enviado só por e-mail semanal",
        "Não ter dono",
      ],
      answer: 0,
      explain: "Alertas demais viram fadiga; sem dono ou ação, ninguém responde.",
    },
  ],
  "zero-trust": [
    {
      q: "Qual é o princípio central de Zero Trust?",
      options: [
        "Nunca confiar, sempre verificar: nenhuma rede ou origem é confiável por padrão",
        "Confiar em tudo dentro da VPN",
        "Bloquear toda a internet",
        "Usar só senhas fortes",
      ],
      answer: 0,
      explain: "Cada requisição é autenticada, autorizada e avaliada, esteja ela dentro ou fora da rede.",
    },
    {
      q: "O que muda do modelo de perímetro para Zero Trust?",
      options: [
        "A decisão de acesso passa da rede para a identidade e o contexto",
        "Remove-se a autenticação",
        "Tudo vira público",
        "Elimina-se o log",
      ],
      answer: 0,
      explain: "O perímetro deixou de existir como barreira única; identidade e postura do dispositivo decidem.",
    },
    {
      q: "Qual prática representa Zero Trust?",
      options: [
        "Acesso por requisição com MFA e privilégio mínimo",
        "VPN com acesso total à rede interna",
        "Uma senha compartilhada",
        "Liberar todas as portas internas",
      ],
      answer: 0,
      explain: "Acesso total pela VPN é o oposto: uma credencial roubada abre tudo.",
    },
  ],
  "incident-response": [
    {
      q: "Num alerta de chave de acesso vazada, qual é um bom primeiro passo?",
      options: [
        "Desativar a chave e restringir a identidade, preservando o estado para forense",
        "Apagar o usuário e todos os logs",
        "Ignorar até confirmar com o atacante",
        "Reiniciar todas as instâncias",
      ],
      answer: 0,
      explain: "Cortar o acesso rapidamente, sem destruir evidência, é o equilíbrio da contenção.",
    },
    {
      q: "Por que isolar uma instância suspeita antes de terminá-la?",
      options: [
        "Porque terminar apaga memória e conexões que servem de evidência",
        "Porque terminar é mais caro",
        "Porque instâncias não podem ser terminadas",
        "Porque isolar acelera a rede",
      ],
      answer: 0,
      explain: "Em ambientes efêmeros, a evidência volátil some junto com o recurso.",
    },
    {
      q: "O que o MTTR mede?",
      options: [
        "O tempo médio até responder e conter um incidente",
        "O custo mensal da nuvem",
        "O número de alertas por dia",
        "A latência das APIs",
      ],
      answer: 0,
      explain: "É a medida da eficácia dos runbooks e da automação de resposta.",
    },
  ],
};
