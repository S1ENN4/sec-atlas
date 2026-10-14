import type { Topic } from "@/content/types";

export const secretsCloud: Topic = {
  domain: "cloudsec",
  slug: "secrets-cloud",
  title: "Secrets - cofres e rotação",
  short: "credenciais nunca no código",
  tagline:
    "Chaves de API, tokens de banco e segredos saem do repositório e vão para cofres com rotação automática, identidade de curta duração e audit log centralizado.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["HashiCorp Vault", "AWS Secrets Manager", "AWS Parameter Store", "Doppler"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Segredo em cloud é qualquer coisa que dá acesso: chave de API, senha de banco, token de serviço, certificado privado. O ponto crítico não é guardar o valor, é controlar quem consegue ler, em que momento, e com qual rastro.",
        "Três práticas se repetem em qualquer arquitetura madura: o segredo vive num cofre (Vault, Secrets Manager, Parameter Store), a aplicação lê em tempo de execução (não em build), e o tempo de vida é curto. Uma credencial que vale por um ano continua útil ao atacante por até 365 dias depois do vazamento, se ninguém a revogar, e é aí que mora o risco real.",
      ],
    },
    {
      heading: "O padrão de incidente clássico",
      body: [
        "Toda semana aparece o mesmo enredo: alguém commita uma Access Key da AWS em um repositório público ou em um chat. Bots de mineradores varrem GitHub em minutos, encontram a chave, validam se ainda funciona e começam a minerar crypto em instâncias reservadas da vítima. A fatura vem antes do alerta.",
        "O detalhe que mata: a chave estava em uma variável de ambiente, então o time achava que não tinha 'commitado segredo'. Mas o .env.example com placeholder, o screenshot do painel da cloud, o log do CI com o valor impresso... cada um desses vaza. Varrer 'AWS_ACCESS_KEY_ID' no repositório antes do merge é higiene básica que quase ninguém faz.",
      ],
    },
    {
      heading: "Segredo estático versus identidade de workload",
      body: [
        "O caminho velho é estático: cria um usuário IAM para a aplicação, gera Access Key + Secret, cola no .env e roda. O segredo fica válido até alguém revogar, e cada deploy novo multiplica quem tem cópia dele.",
        "O caminho moderno é identidade de workload. No AWS chama IRSA (IAM Roles for Service Accounts), no GCP é Workload Identity, no Azure é Workload Identity Federation. A ideia é a mesma: o cluster (EKS, GKE, AKS) recebe um token curto para o pod, e a cloud troca esse token por credenciais temporárias via STS/OIDC. Não existe secret estático para vazar.",
      ],
      code: [
        {
          language: "yaml",
          filename: "service-account.yaml - IRSA",
          code: "apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: app-frontend\n  namespace: prod\n  annotations:\n    eks.amazonaws.com/role-arn: arn:aws:iam::111122223333:role/app-frontend-prod",
        },
        {
          language: "yaml",
          filename: ".env - o que NÃO fazer",
          code: "AWS_ACCESS_KEY_ID=AKIA...         # NUNCA faça isso\nAWS_SECRET_ACCESS_KEY=wJalr...       # nunca em arquivo versionado",
        },
      ],
    },
    {
      heading: "Lendo do cofre em runtime",
      body: [
        "Quando o workload não pode assumir identidade federada (caso comum em serviços antigos ou em SaaS de terceiros), a alternativa é buscar o segredo no cofre na inicialização da aplicação, montar em memória e nunca persistir em disco.",
        "A diferença entre buscar em runtime e copiar em build é a diferença entre o segredo existir em uma imagem Docker (que alguém pode abrir) e existir só na heap do processo em execução. O segundo cenário ainda pode vazar via log ou dump, mas é ordens de grandeza mais difícil.",
      ],
    },
    {
      heading: "Rotação: por que a chave de 5 anos é um risco",
      body: [
        "Rotação é o exercício de substituir um segredo antes que ele expire sozinho ou que alguém o tenha comprometido. Cofres modernos tratam isso como cidadão de primeira: Secrets Manager tem rotação automática via Lambda, Vault tem dynamic secrets que expiram em minutos, o Parameter Store guarda valores, mas não rotaciona sozinho (para isso, use o Secrets Manager).",
        "A regra prática: se você não consegue rotacionar a chave sem downtime, você não consegue revogar a chave sob pressão. E sob pressão é quando a revogação precisa acontecer.",
      ],
    },
    {
      heading: "Onde entra no dia a dia",
      bullets: [
        "inicialização da aplicação: SDK do cofre lê os segredos na boot, expõe via in-memory e falha fechado se o cofre estiver fora",
        "CI/CD: secrets do pipeline vêm do cofre do provedor, nunca de variáveis globais do runner",
        "deploy de banco: rotação automática da senha do RDS via Lambda + Secrets Manager, sem janela de manutenção",
        "resposta a incidente: revogação central derruba todas as cópias em segundos, e a próxima inicialização pega o valor novo",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "centralização: um único painel mostra quem tem qual segredo e quando usou pela última vez",
        "revogação imediata: tira o acesso no cofre, e todas as aplicações perdem o segredo no próximo request",
        "rotação sem downtime: banco, API keys e tokens podem ser trocados com a aplicação no ar",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "identidade de workload exige configuração fina (OIDC, trust policy, audience) que erra fácil em clusters novos",
        "secrets ainda vazam por log, dump ou erro de código: ninguém substitui varredura de log por cofre",
        "custo e latência: leitura por request pode adicionar centenas de milissegundos e alguns centavos por milhão de chamadas",
      ],
    },
  ],
};