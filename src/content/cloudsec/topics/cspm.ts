import type { Topic } from "@/content/types";

export const cspm: Topic = {
  domain: "cloudsec",
  slug: "cspm",
  title: "CSPM — postura cloud",
  short: "postura contínua na nuvem",
  tagline:
    "Cloud Security Posture Management vasculha a configuração de cada conta contra baselines (CIS, PCI, NIST) e aponta drift antes que vire incidente.",
  kind: "pratica",
  stage: "detectar",
  tools: ["Wiz", "Prisma Cloud", "Orca Security", "Microsoft Defender for Cloud"],
  sections: [
    {
      heading: "O que é",
      body: [
        "CSPM (Cloud Security Posture Management) é o auditor contínuo da sua nuvem. Ele conecta nas contas (via IAM role com leitura) e compara a configuração real contra baselines publicados (CIS, PCI, NIST 800-53, o benchmark interno do seu time). A diferença entre o estado atual e o baseline é o finding: storage sem criptografia, SG com 0.0.0.0/0, IAM user sem MFA, log group sem retenção.",
        "A ideia é simples: a maior parte dos incidentes não começa com ataque sofisticado, começa com um bucket aberto que ficou aberto por três meses. CSPM existe para fechar essa janela automaticamente.",
      ],
    },
    {
      heading: "Como funciona: regras e benchmarks",
      body: [
        "O motor de regras é declarativo. Para cada controle, uma expressão que avalia a configuração: se o recurso casa com o padrão perigoso, finding. Os frameworks públicos viram pacotes de regras reutilizáveis.",
        "Quanto mais regras, mais ruído. A maioria dos times liga o benchmark inteiro no primeiro mês e passa o resto do ano desligando regras que não se aplicam (kubernetes 1.22 num serviço legado, RDS sem CMK em dev). O filtro prático é separar baseline global (vale pra toda conta) de baseline por ambiente (dev recebe controles mais fracos, prod recebe tudo).",
      ],
      bullets: [
        "CIS Foundations: baseline de higiene geral (root MFA, CloudTrail ligado, S3 sem acesso público)",
        "PCI DSS: controles de pagamento (criptografia em repouso, segmentação, audit log)",
        "NIST 800-53 / 800-171: controles federais, exige compliance programático em orgs do governo americano",
        "SOC 2 Trust Services Criteria: segurança, disponibilidade, confidencialidade, privacidade",
      ],
    },
    {
      heading: "Drift: o achado que volta toda semana",
      body: [
        "Drift é quando a infraestrutura volta para um estado inseguro sem ninguém ter pedido. Acontece por automação concorrente (Terraform apply e console ao mesmo tempo), por mudança manual em incidente, ou por outra equipe mexendo onde não devia. CSPM mede drift por diff de configuração entre execuções: a mesma conta hoje e ontem deveriam ser iguais, salvo mudanças aprovadas.",
        "O valor do drift não é o alerta em si, é o sinal de que existe mudança não aprovada. Achar a origem (console do cloud, IaC desatualizado, outro pipeline) é onde o problema mora.",
      ],
      code: [
        {
          language: "json",
          filename: "finding CSPM — drift detectado",
          code: "{\n  \"rule_id\": \"S3-PUBLIC-READ-DRIFT\",\n  \"framework\": \"CIS AWS Foundations 2.1.5\",\n  \"severity\": \"high\",\n  \"resource\": \"arn:aws:s3:::loja-customer-uploads\",\n  \"account\": \"111122223333\",\n  \"region\": \"us-east-1\",\n  \"title\": \"Bucket allowing public read access was changed back to public\",\n  \"drift\": {\n    \"previous_state\": {\n      \"public_access_block\": \"all_true\",\n      \"evaluated_at\": \"2026-09-29T08:00:00Z\"\n    },\n    \"current_state\": {\n      \"public_access_block_configuration\": {\n        \"block_public_acls\": false,\n        \"ignore_public_acls\": false,\n        \"block_public_policy\": false,\n        \"restrict_public_buckets\": false\n      },\n      \"evaluated_at\": \"2026-10-09T14:22:11Z\"\n    }\n  },\n  \"remediation\": \"aws s3api put-public-access-block --bucket loja-customer-uploads --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true\"\n}",
        },
      ],
    },
    {
      heading: "Multi-cloud e o problema do conector",
      body: [
        "Cada provedor tem APIs próprias, e cada CSPM precisa aprender a falar com AWS, Azure, GCP, OCI, Alibaba. Os melhores produtos fazem isso de forma nativa; os piores parecem um tradutor mal calibrado. Avaliar o suporte a multi-cloud não é checar o logo na landing page, é rodar o mesmo controle CIS em duas contas idênticas (uma AWS, uma Azure) e ver se o finding sai igual.",
        "A escolha entre agente-based e API-based tem impacto. CSPM puro API-based lê a configuração, não o que roda dentro dela: vê o security group, não o processo escutando na porta. Para workload runtime, CWPP (próximo tópico) entra.",
      ],
    },
    {
      heading: "Remediação: do achado ao conserto",
      body: [
        "Remediação tem três níveis. Manual: o finding vira ticket no Jira, alguém conserta. Assistida: o CSPM gera o comando (terraform plan, aws cli) e o humano aprova em PR. Automática: o CSPM aplica a correção sozinho, com rollback se algo quebrar (S3 Public Block que apaga política ativa é caso clássico).",
        "O caminho seguro é começar com manual em todas as contas, ir para assistida em ambientes de dev/staging, e ligar automática em controles com blast radius pequeno (forçar log, forçar encryption) e sob mudança monitorada. Auto-remediation em IAM com chave de produção é receita para incidente.",
      ],
    },
    {
      heading: "Onde entra",
      body: [
        "CSPM é detecção contínua, então não tem 'onde entra' único: ele roda 24/7 contra a API do provedor. No fluxo de mudanças, ele aparece em dois pontos: na PR de IaC (avalia antes do apply) e no monitoramento pós-apply (avalia o estado real). O primeiro pega a regra antes do break; o segundo pega o que driftou sem ninguém ter pedido.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "visibilidade imediata: em uma hora você tem lista de buckets abertos, chaves sem uso e security groups que viraram Swiss cheese",
        "compliance programático: CIS/PCI/NIST deixa de ser auditoria anual e vira dashboard diário",
        "drift detection fecha o buraco entre IaC (que vale pra aplicar) e runtime (que vale pra rodar)",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "CSPM vê configuração, não comportamento: um container rodando crypto miner com SG aparentemente OK passa pelo benchmark",
        "ruído é o calcanhar de Aquiles: benchmark inteiro vira 500 findings na primeira semana, e sem triagem vira dashboard ignorado",
        "remediação automática tem blast radius: consertar um bucket sem entender o uso quebra aplicação em produção, e o conserto silencioso esconde o bug que precisava de mudança de arquitetura",
      ],
    },
  ],
};