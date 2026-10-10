import type { Topic } from "@/content/types";

export const iam: Topic = {
  domain: "cloudsec",
  slug: "iam",
  title: "IAM - identidade e acesso",
  short: "quem é quem, e o que cada um pode fazer",
  tagline:
    "Identidade é o novo perímetro: a segurança em cloud começa por saber quem é cada workload, cada humano e cada serviço, e limitar exatamente o que cada um pode tocar.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["AWS IAM", "Okta", "Microsoft Entra ID", "Palo Alto Prisma Cloud"],
  sections: [
    {
      heading: "O que é",
      body: [
        "IAM (Identity and Access Management) é o sistema que decide quem existe no seu ambiente cloud, o que cada um pode fazer e em quais condições. Em vez de um firewall na borda, o controle se distribui por cada chamada de API: cada request carrega uma identidade, e essa identidade é avaliada contra políticas antes de tocar qualquer recurso.",
        "Três peças sustentam tudo: o principal (humano, serviço, workload), a ação que ele quer fazer (s3:GetObject, ec2:TerminateInstance) e o recurso alvo (bucket, instância, função). A resposta é sempre sim ou não, e o motor registra quem pediu o quê, quando e como.",
      ],
    },
    {
      heading: "Usuários, roles e policies",
      body: [
        "Usuários são identidades persistentes atreladas a alguém (ou a um segredo estático). Roles são identidades assumíveis: em vez de senha, alguém troca de papel via AssumeRole e ganha credenciais temporárias por minutos ou horas. Para workloads, quase sempre é assim: nada de usuário fixo, tudo via role.",
        "Policies são documentos JSON que descrevem permissões. Há três tipos que você encontra o tempo todo: identity policies (anexadas ao principal), resource policies (anexadas ao recurso, como uma bucket policy) e session policies (limites adicionais durante AssumeRole). A avaliação combina todas elas, e basta um único deny explícito para bloquear a ação.",
        "Quando tudo é uma policy, dá para revisar, versionar e testar o acesso como código. Quando metade é um clique no console e a outra metade é um JSON colado no Slack, o caos aparece no primeiro incidente.",
      ],
    },
    {
      heading: "Wildcard versus least privilege",
      body: [
        "A política abaixo é o anti-padrão clássico: admin com tudo para qualquer recurso. Aparece toda semana em algum workshop e em metade dos incidentes de bucket público da internet.",
      ],
      code: [
        {
          language: "json",
          filename: "policy.json - permissiva (NÃO use)",
          code: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"FullAccessForDev\",\n      \"Effect\": \"Allow\",\n      \"Action\": \"*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}",
        },
      ],
    },
    {
      heading: "A política que deveria existir",
      body: [
        "Mesmo um job simples raramente precisa de tudo. Esta política concede apenas a leitura do bucket certo, na região certa, com um condition que limita a origem a uma role específica:",
      ],
      code: [
        {
          language: "json",
          filename: "policy.json - least privilege",
          code: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"ReadSiteAssets\",\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:GetObject\",\n        \"s3:ListBucket\"\n      ],\n      \"Resource\": [\n        \"arn:aws:s3:::appsec-kb-static\",\n        \"arn:aws:s3:::appsec-kb-static/*\"\n      ],\n      \"Condition\": {\n        \"StringEquals\": {\n          \"aws:PrincipalTag/Team\": \"frontend\"\n        }\n      }\n    }\n  ]\n}",
        },
      ],
    },
    {
      heading: "Trust policy: quem pode assumir a role",
      body: [
        "Toda role tem duas pontas. A primeira é a trust policy, que define quem pode chamar sts:AssumeRole. A segunda é a permission policy, que define o que o assumir ganha. Misturar as duas é onde nascem os incidentes de escalonamento: a role permite s3:* em qualquer lugar, e a trust aceita Principal: \"*\", então qualquer conta autenticada entra.",
        "A boa trust policy nomeia contas, serviços e até condições externas (MFA, hora do dia, federated provider). Quando você vê \"Principal\": \"*\" sem Condition explícita, vale parar e perguntar por quê.",
      ],
    },
    {
      heading: "Permission boundaries: o cinto de segurança",
      body: [
        "Permission boundaries funcionam como um teto: a permissão efetiva de um principal é a interseção entre o que a boundary permite e o que a identity policy permite. É a ferramenta padrão para dar autonomia a times sem abrir mão do controle central.",
        "Na prática, você define uma boundary por equipe ou ambiente (produção, staging) e deixa o time escrever as identity policies dentro desse envelope. O desenvolvedor pode abrir o leque o quanto quiser, mas nunca passa do teto.",
      ],
    },
    {
      heading: "Onde entra no dia a dia",
      bullets: [
        "onboarding de pessoa nova: identity provider (SAML/OIDC) emite tokens curtos, a cloud nunca vê senha",
        "deploy de aplicação: workload recebe role via OIDC/IRSA e troca token por credenciais, sem secret no repositório",
        "revogação imediata: tira a role, encerra a sessão STS e o acesso morre no minuto seguinte, sem rotacionar segredo",
        "auditoria: cada chamada vira um evento no CloudTrail/equivalent, com principal ARN, source IP e user agent",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "controle granular por ação, recurso, tag e condição, sem precisar de rede privada",
        "revogação central: derruba a role e todos perdem acesso ao mesmo tempo",
        "modelo auditável: cada decisão passa por políticas versionadas que podem ser revisadas em PR",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "políticas viram spaghetti: sem ferramenta de visualização e lint, é fácil manter 4.000 statements contraditórios",
        "least privilege exige descoberta contínua: o que o time precisa muda todo sprint, e a política fica para trás",
        "modelo confunde humano e workload: tratar workload como se fosse humano (com usuário fixo + Access Key estática) é a porta de entrada para quase todo vazamento",
      ],
    },
  ],
};