import type { Topic } from "@/content/types";

export const kubernetes: Topic = {
  domain: "cloudsec",
  slug: "kubernetes",
  title: "Kubernetes — runtime seguro",
  short: "RBAC, admission e segurança de cluster",
  tagline:
    "O cluster Kubernetes é um sistema operacional distribuído: RBAC, admission controllers e policies regem o que cada pod pode fazer, montar e expor.",
  kind: "pratica",
  stage: "proteger",
  tools: ["Kubernetes", "OPA Gatekeeper", "Kyverno", "Kube-bench"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Kubernetes não é só um orquestrador de containers, é um sistema operacional distribuído com superfície de ataque própria: API, etcd, rede de pods, secrets e volumes. Cada camada traz controles: RBAC diz quem pode pedir o quê à API, admission controllers dizem o que pode entrar no cluster, NetworkPolicies dizem o que cada pod pode falar com os outros, e o kubelet diz o que cada container pode fazer no nó.",
        "Tratar Kubernetes como 'só um deploy runner' é o erro que vaza tokens em logs, abre portas para a internet e roda containers como root com sistemas de arquivos graváveis. Defender o cluster exige os quatro controles combinados, não um só.",
      ],
    },
    {
      heading: "RBAC: a primeira cerca",
      body: [
        "RBAC (Role-Based Access Control) liga um sujeito (ServiceAccount, User, Group) a um papel, e o papel a um conjunto de verbos sobre recursos. Funciona em dois níveis: Role + RoleBinding (escopo de namespace) e ClusterRole + ClusterRoleBinding (escopo de cluster inteiro).",
        "O erro clássico é abrir cluster-admin para a esteira de CI ou para um service account de aplicação. Funciona, o deploy passa, e qualquer RCE num pod vira controle total do cluster, incluindo leitura de todos os secrets em todos os namespaces.",
      ],
      code: [
        {
          language: "yaml",
          filename: "rbac-inseguro.yaml",
          code: "apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: ci-deployer-all\nsubjects:\n  - kind: ServiceAccount\n    name: ci-runner\n    namespace: ci\nroleRef:\n  kind: ClusterRole\n  name: cluster-admin          # poder total, em todo o cluster\n  apiGroup: rbac.authorization.k8s.io",
        },
        {
          language: "yaml",
          filename: "rbac-corrigido.yaml",
          code: "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: payments\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: deployer\n  namespace: payments\nrules:\n  - apiGroups: [\"apps\"]\n    resources: [\"deployments\", \"replicasets\"]\n    verbs: [\"get\", \"list\", \"watch\", \"update\", \"patch\"]\n  - apiGroups: [\"\"]\n    resources: [\"pods\", \"pods/log\"]\n    verbs: [\"get\", \"list\", \"watch\"]\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: ci-deployer\n  namespace: payments\nsubjects:\n  - kind: ServiceAccount\n    name: ci-runner\n    namespace: ci\nroleRef:\n  kind: Role\n  name: deployer\n  apiGroup: rbac.authorization.k8s.io",
        },
      ],
    },
    {
      heading: "NetworkPolicies: o firewall dos pods",
      body: [
        "Por padrão, todo pod fala com todo pod em todo namespace. NetworkPolicies corrigem isso: são seletores de pod que dizem quem pode entrar e sair, na semântica de allowlist (o que não está permitido está bloqueado).",
        "A primeira política sempre é a de deny-by-default no namespace. Sem ela, abrir uma porta nova num pod é abrir uma porta nova em todo o cluster. A segunda vem com allow explícito para o tráfego legítimo (ingress do ingress controller, saída para APIs externas, pod-to-pod na mesma app).",
      ],
      code: [
        {
          language: "yaml",
          filename: "netpol-default-deny.yaml",
          code: "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: default-deny-all\n  namespace: payments\nspec:\n  podSelector: {}              # vale para todos os pods do namespace\n  policyTypes:\n    - Ingress\n    - Egress\n  ingress: []                  # nada entra\n  egress:\n    - to:\n        - namespaceSelector:\n            matchLabels:\n              kubernetes.io/metadata.name: kube-system\n      ports:\n        - protocol: UDP\n          port: 53             # DNS para resolver serviços externos",
        },
      ],
    },
    {
      heading: "Admission control: política antes do pod subir",
      body: [
        "Admission controllers ficam entre o aceite da request e a persistência no etcd. Eles podem validar (rejeitar) ou mutar (reescrever) o manifesto. O Kubernetes traz o Pod Security Admission (PSA) embutido (beta na 1.23, estável na 1.25), com profiles privileged, baseline e restricted. Para lógica mais fina, entram os policy engines:",
      ],
      bullets: [
        "OPA Gatekeeper: usa Rego, sintaxe de policy como código, ideal para times com cultura de engenharia de policy",
        "Kyverno: YAML puro, lê como um manifesto normal de Kubernetes, ideal para times que querem escrever policies sem aprender outra linguagem",
        "Pod Security Admission: nativo, sem dependência extra, profiles baseline e restricted cobrem 80% dos casos",
        "ValidatingAdmissionPolicy: admission declarativo escrito em CEL, estável desde o Kubernetes 1.30",
      ],
    },
    {
      heading: "Segredos em etcd: criptografia em repouso",
      body: [
        "Por padrão, secrets no etcd são guardados em texto puro (apenas base64 no YAML). Quem tem acesso de leitura ao etcd, ou a um backup dele, lê todos os tokens, senhas e chaves. Encryption at rest resolve isso: cada chave do etcd é criptografada com uma chave embrulhada por KMS.",
        "O preço é gerenciar uma chave (rotação, revogação), e o que se ganha é defesa em profundidade: mesmo um dump do etcd vira dado inerte sem o KMS.",
      ],
      code: [
        {
          language: "yaml",
          filename: "kube-apiserver --encryption-config",
          code: "apiVersion: apiserver.config.k8s.io/v1\nkind: EncryptionConfiguration\nresources:\n  - resources:\n      - secrets\n    providers:\n      - kms:\n          apiVersion: v2\n          name: aws-kms\n          endpoint: unix:///var/run/kms-provider/socket\n          timeout: 3s\n      - identity: {}                  # fallback para leitura de dados antigos",
        },
      ],
    },
    {
      heading: "Onde entra",
      body: [
        "Kubernetes é a fronteira entre o que o pipeline produziu e o que vai rodar em produção. Toda defesa que falhou antes (imagem sem scan, manifesto sem policy) cai aqui: admission control rejeita, NetworkPolicy isola, RBAC limita o estrago. Por outro lado, é a última chance de corrigir o que passou: o PSA pega manifesto frouxo, OPA pega labels errados, secrets em KMS pega dump de etcd.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "controles nativos do Kubernetes já cobrem RBAC, NetworkPolicy, PSA, encryption at rest: não precisa comprar nada",
        "policy as code (Kyverno, Gatekeeper) vira coisa de PR, com review e teste, não de ticket urgente",
        "namespaces viram unidades de isolamento barato, dando limite de blast radius sem precisar de clusters separados",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "RBAC, NetworkPolicy e admission são controles default-deny: precisam ser configurados antes de qualquer coisa rodar, e o caminho de migração para um cluster existente é manual",
        "o cluster inteiro é tão seguro quanto o nó: um kubelet exposto ou um container com privilégios quebra as garantias dos layers acima",
        "operar policies em escala (X clusters, Y namespaces) vira trabalho de plataforma, não de app, e sem alguém responsável vira bagunça",
      ],
    },
  ],
};