import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "identidade-e-acesso",
    title: "identidade e acesso",
    entries: [
      {
        term: "IAM",
        aka: "identity and access management",
        meaning:
          "O conjunto de políticas, papéis e credenciais que diz quem é cada humano, serviço ou workload, e o que cada um pode fazer. Em cloud, IAM virou o novo perímetro: a borda de rede ficou porosa, então a identidade carrega a autorização.",
        topic: "iam",
      },
      {
        term: "Privilégio mínimo",
        aka: "least privilege",
        meaning:
          "Princípio de dar a cada identidade só as permissões estritamente necessárias para a sua função, e nada mais. É oposto a 'usuário admin por padrão': cada papel extra é um caminho a mais que um atacante pode usar depois de um compromise.",
        topic: "iam",
      },
      {
        term: "Modelo de responsabilidade compartilhada",
        aka: "shared responsibility model",
        meaning:
          "A divisão clássica entre o que o provedor de cloud garante (segurança DA nuvem: datacenter, hardware, serviço físico) e o que é responsabilidade do cliente (segurança NA nuvem: dados, IAM, configuração, rede). Confundir as duas pontas é a fonte clássica de vazamento.",
      },
      {
        term: "Rotação de segredos",
        aka: "credential rotation",
        meaning:
          "Trocar periodicamente (ou após suspeita de vazamento) chaves de API, tokens e senhas armazenadas num cofre. Sem rotação, um segredo exposto num log ou num histórico git vale para sempre; com rotação, vale até a próxima virada.",
        topic: "secrets-cloud",
      },
      {
        term: "Raio de impacto",
        aka: "blast radius",
        meaning:
          "O tamanho do estrago quando uma coisa quebra: uma conta, uma região inteira, um tenant. Bom design de cloud limita o raio por isolamento (contas separadas, VPCs separadas, papéis estreitos) para que uma falha ou um ataque não se torne um desastre de página inteira.",
      },
    ],
  },
  {
    id: "rede-e-dados",
    title: "rede e dados",
    entries: [
      {
        term: "Grupo de segurança",
        aka: "security group",
        meaning:
          "Lista de regras stateful anexada a uma instância ou interface de rede na cloud: quem pode entrar em qual porta, de qual origem. Funciona como firewall de host no nível da cloud — e erra por padrão: se você esquecer de fechar uma porta, ela fica aberta para 0.0.0.0/0.",
        topic: "network",
      },
      {
        term: "VPC",
        aka: "virtual private cloud",
        meaning:
          "Rede privada isolada logicamente dentro da cloud pública: você escolhe o range de IPs, divide em sub-redes públicas e privadas, controla o tráfego com route tables e NAT. A VPC é o seu datacenter virtual; tudo que roda dentro dela conversa como se estivesse no mesmo rack.",
        topic: "network",
      },
      {
        term: "Network policy",
        meaning:
          "Regras de firewall declarativas no nível do pod (Kubernetes) ou da workload (service mesh), dizendo qual serviço pode falar com qual porta. Diferente do grupo de segurança, opera em L7 dentro do cluster, com selectors por label, e é peça central de defesa em profundidade para east-west traffic.",
        topic: "kubernetes",
      },
      {
        term: "KMS",
        aka: "key management service",
        meaning:
          "Serviço gerenciado que cria, armazena e controla o uso de chaves criptográficas. A aplicação raramente toca a chave mestra: ela pede ao KMS para criptografar ou descriptografar, e o provedor registra cada uso em log auditável. Sem KMS, a chave acaba em disco e vira alvo.",
        topic: "kms-crypto",
      },
      {
        term: "Envelope encryption",
        meaning:
          "Padrão em duas camadas: uma chave de dados (DEK) criptografa o payload, e uma chave do KMS (KEK) criptografa a DEK. A aplicação guarda a DEK criptografada junto dos dados, e só chama o KMS para desembrulhar a DEK quando precisa usar. Reduz chamadas ao KMS e limita exposição da chave mestra.",
        topic: "kms-crypto",
      },
    ],
  },
  {
    id: "postura-e-deteccao",
    title: "postura e detecção",
    entries: [
      {
        term: "Zero trust",
        meaning:
          "Modelo que parte da premissa de não confiar em ninguém por posição na rede: cada requisição é autenticada, autorizada e logada, mesmo vinda da rede interna. Substitui o castelo com fosso por verificação contínua em cada porta, humana ou de serviço.",
        topic: "zero-trust",
      },
      {
        term: "CSPM",
        aka: "cloud security posture management",
        meaning:
          "Ferramenta que varre a configuração da sua cloud contra boas práticas e benchmarks (CIS, NIST), apontando bucket S3 público, IAM largo demais, porta exposta. Faz a pergunta que humanos esquecem: 'o que está configurado errado AGORA?'.",
        topic: "cspm",
      },
      {
        term: "CWPP",
        aka: "cloud workload protection platform",
        meaning:
          "Proteção monitora para workloads em execução: VM, container, função serverless. Combina visibilidade do que roda (processos, syscalls, rede) com prevenção (bloquear execução, isolar anomalia). É o endpoint security reformulado para a realidade efêmera da cloud.",
        topic: "cwpp",
      },
      {
        term: "Drift",
        aka: "configuration drift",
        meaning:
          "Quando a infraestrutura viva se afasta do estado declarado: alguém abriu uma porta no console, um bucket ficou público, uma IAM virou admin. Drift é configuração acumulada fora de controle de versão, e a melhor cura é IaC com revisão: tudo que muda passa por código.",
      },
      {
        term: "Hardening",
        aka: "endurecimento",
        meaning:
          "Reduzir a superfície de uma workload ao essencial: desabilitar serviços não usados, fechar portas, remover pacotes supérfluos, aplicar baseline (CIS). É o equivalente cloud de tirar a senha padrão e fechar as janelas: chato, repetitivo, e a diferença entre alvo fácil e alvo caro.",
      },
      {
        term: "Trilha de auditoria",
        aka: "cloudtrail",
        meaning:
          "Registro imutável de cada chamada de API feita na conta da cloud: quem chamou o quê, de onde, com qual resultado. É a caixa-preta da conta: depois de um vazamento, é o que responde 'o atacante fez o quê, e quando?'. Sem trilha, não tem investigação nem contenção informada.",
        topic: "logging-detection",
      },
    ],
  },
  {
    id: "resposta-a-incidentes",
    title: "resposta a incidentes",
    entries: [
      {
        term: "MTTR",
        aka: "mean time to respond",
        meaning:
          "Tempo médio entre a confirmação de um incidente e a sua contenção. É a métrica que mostra se runbooks e automações funcionam de verdade, e a que mais cai quando a resposta é praticada em exercícios.",
        topic: "incident-response",
      },
      {
        term: "Runbook",
        meaning:
          "Roteiro passo a passo para um tipo de incidente (chave vazada, instância comprometida). Escrito antes da crise, testado em game days e, quando possível, transformado em automação.",
        topic: "incident-response",
      },
      {
        term: "Cadeia de custódia",
        aka: "chain of custody",
        meaning:
          "Registro de quem coletou, guardou e manipulou cada evidência digital, e quando. Sem ela, a prova perde valor para auditoria e para eventual disputa legal.",
        topic: "incident-response",
      },
    ],
  },
];
