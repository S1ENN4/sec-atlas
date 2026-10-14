import type { Topic } from "@/content/types";

export const loggingDetection: Topic = {
  domain: "cloudsec",
  slug: "logging-detection",
  title: "Logging & detection - sinais e alertas",
  short: "CloudTrail, audit e correlação de sinais",
  tagline:
    "Detecção em cloud começa no log: CloudTrail, VPC flow logs, audit de IAM e DNS viram sinais correlacionados que alimentam SIEM, detecção gerenciada e automação de resposta.",
  kind: "tecnica",
  stage: "detectar",
  tools: ["AWS CloudTrail", "Amazon GuardDuty", "Amazon Detective", "OpenSearch", "Datadog"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Logging & detection é a peça da detecção que vive de sinal: trilhas de auditoria, logs de plano de controle, logs de plano de dados, eventos de runtime, saídas de DNS e eventos de identidade. O trabalho é coletar tudo isso em um só lugar, reter por tempo suficiente e disparar alerta quando aparece algo fora do padrão.",
        "CSPM vasculha configuração; CWPP vasculha comportamento de workload. Aqui a pergunta é mais ampla: 'o que aconteceu nesta conta nos últimos 90 dias, e aconteceu de novo agora?'. A resposta mora em correlação: um AssumeRole pode ser legítimo sozinho, e criminoso quando combinado com kms:Decrypt cinco minutos depois e GetObject em bucket que ninguém daquela role deveria abrir.",
      ],
    },
    {
      heading: "O que capturar: trilhas de auditoria",
      body: [
        "O pilar clássico é o log de plano de controle: cada chamada de API, assinada, com principal ARN, source IP, user agent, request parameters e response elements. Em AWS isso é o CloudTrail; em Azure é o Activity Log; em GCP é o Cloud Audit Logs. Esse é o log que responde 'quem chamou o quê, quando, e qual foi o resultado'. Sem ele, o incidente vira palpite.",
        "CloudTrail por padrão grava eventos de gestão (criar IAM user, deletar bucket) na trilha da conta, e mantém os últimos 90 dias em console. Para forense real, vale criar uma trilha multi-regional que escreve em S3 com object lock, e adiciona Lake ou um SIEM em cima para query e retenção mais longa.",
      ],
      code: [
        {
          language: "json",
          filename: "evento CloudTrail (console.amazonaws.com)",
          code: "{\n  \"eventVersion\": \"1.09\",\n  \"userIdentity\": {\n    \"type\": \"IAMUser\",\n    \"principalId\": \"AIDAEXAMPLEPRINCIPAL\",\n    \"arn\": \"arn:aws:iam::111122223333:user/alice\",\n    \"accountId\": \"111122223333\",\n    \"accessKeyId\": \"AKIAEXAMPLEACCESSKEY\",\n    \"userName\": \"alice\"\n  },\n  \"eventTime\": \"2026-10-09T03:17:42Z\",\n  \"eventSource\": \"s3.amazonaws.com\",\n  \"eventName\": \"GetObject\",\n  \"awsRegion\": \"us-east-1\",\n  \"sourceIPAddress\": \"203.0.113.45\",\n  \"userAgent\": \"aws-cli/2.15.0\",\n  \"requestParameters\": {\n    \"bucketName\": \"loja-customer-uploads\",\n    \"key\": \"billing/exports/sept-2026.csv\"\n  },\n  \"responseElements\": null,\n  \"requestID\": \"6E3D4B2XAMPLE\",\n  \"eventID\": \"e9c1f0a6-2b1c-4f37-9a4d-3e2b9c0b8c11\",\n  \"readOnly\": true,\n  \"eventType\": \"AwsApiCall\",\n  \"recipientAccountId\": \"111122223333\"\n}",
        },
      ],
    },
    {
      heading: "Logs de plano de dados e rede",
      body: [
        "CloudTrail não vê tudo. Ele registra a chamada de API, não o que aconteceu dentro dela nem o pacote que passou pela rede. Para fechar o buraco, três fontes viram obrigatórias.",
      ],
      bullets: [
        "VPC Flow Logs: todo pacote aceito ou rejeitado nas ENIs da VPC. Origem, destino, porta, decisão (ACCEPT/REJECT), bytes contados. Quando bate um alerta de exfiltração, este é o primeiro lugar para confirmar o destino.",
        "S3 data events: leitura e escrita em buckets específicos (não ligados por padrão na trilha porque custam caro). Para bucket com PII ou com segredo, é o log que conta quem tirou o quê.",
        "EKS / Kubernetes audit: kube-apiserver grava cada chamada em kube-apiserver-audit.log. ingress create, secret read, exec em pod - tudo entra. Combinado com CloudTrail, mostra a corrente completa: kubelet faz call, pod fala com API, API retorna token, token vira AssumeRole.",
        "DNS logs (Route 53 Resolver / Cloudflare): resolver queries ficam guardadas. Útil para detectar DGA (geração de domínio por malware), beaconing e C2 por baixo do radar de firewall.",
      ],
    },
    {
      heading: "Centralização e retenção",
      body: [
        "Coletar tudo e deixar cada conta com seu bucket é receita para o log sumir no primeiro incidente. O desenho certo é fan-out: cada conta escreve seu log em S3 (ou equivalente) com KMS, e um lake agregador ou um SIEM corporativo puxa de tudo para query única.",
        "Retenção é onde a maioria dos times escorrega. Logs de gestão precisam de 90 dias quente (query rápida) e 365 dias frio (S3 + Glacier). Logs de fluxo VPC, dependendo do volume, viram 30 dias quente e 180 dias frio. Logs de auditoria que vão virar evidência legal pedem object lock (WORM) para impedir alteração retroativa - sem isso, atacante com acesso de escrita apaga os próprios rastros.",
      ],
    },
    {
      heading: "Detecção: regras, anomalias e hunting",
      body: [
        "A camada de detecção tem três sabores. Regras determinísticas (signature) disparam em assinatura conhecida: ConsoleLogin sem MFA, root API key em uso, disable de CloudTrail. ML / anomalias disparam em desvio de baseline (login de região nunca vista, listagem massiva de buckets por usuário que normalmente lista três). Hunting é o humano procurando o que ninguém pensou em regra.",
        "GuardDuty combina os três sabores numa só assinatura gerenciada: consome CloudTrail, VPC Flow Logs e DNS, manda findings para EventBridge ou Security Hub. A integração típica é o Detective entrar para investigação (grafo de entidade + timeline), o Security Hub agregar com Prowler/Inspector, e o SOAR (Step Functions, Tines, Torq) disparar runbook. O segredo é manter a regra fora do SIEM quando o SIEM agrega mal, e usar GuardDuty para 80% dos achados óbvios.",
      ],
      code: [
        {
          language: "yaml",
          filename: "regra EventBridge (AWS::Events::Rule) - alerta GuardDuty crítico",
          code: "Description: \"Encaminha findings críticos do GuardDuty para a fila do SOAR\"\nState: ENABLED\nEventBusName: default\nEventPattern: |\n  {\n    \"source\": [\"aws.guardduty\"],\n    \"detail-type\": [\"GuardDuty Finding\"],\n    \"detail\": {\n      \"severity\": [{ \"numeric\": [\">=\", 7] }],\n      \"type\": [\n        \"CryptoCurrency:EC2/BitcoinTool.B\",\n        \"Backdoor:EC2/C&CActivity.B!DNS\",\n        \"UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS\",\n        \"CredentialAccess:IAMUser/AnomalousBehaviors\",\n        \"Policy:IAMUser/RootCredentialUsage\",\n        \"Persistence:IAMUser/NetworkPermissions\",\n        \"PrivilegeEscalation:IAMUser/AdministrativePermissions\",\n        \"Exfiltration:S3/MaliciousIPCaller\"\n      ]\n    }\n  }\nTargets:\n  - Id: SOARIngestTarget\n    Arn: arn:aws:sqs:us-east-1:111122223333:soar-ingest",
        },
      ],
    },
    {
      heading: "Integração com SIEM",
      body: [
        "O SIEM (OpenSearch, Splunk, Elastic, Datadog Cloud SIEM) é onde a correlação acontece. Cada fonte (CloudTrail, GuardDuty, flow logs, audit k8s, EDR) vira um stream indexado, com parser próprio e campo canônico (time, actor, target, action, result). A regra do SIEM cruza fontes: AssumeRole IAM nova + CloudTrail GetSecretValue + bucket público tocado em <5 min = sessão suspeita.",
        "Para reduzir custo e ruído, dois hábitos dão retorno alto. Primeiro, tier de armazenamento: quentes no SIEM (30 dias), frios em S3 (Iceberg, Parquet) com Athena ou OpenSearch Serverless consultando sob demanda. Segundo, detecção gerenciada para o que você não tem equipe de manter: GuardDuty cobre 80% dos achados óbvios, CSPM cobre drift de configuração, CWPP cobre runtime. SIEM fica para o que é house-specific.",
      ],
    },
    {
      heading: "Onde entra no dia a dia",
      bullets: [
        "onboarding da conta: trilha multi-regional ligada, Lake ou Firehose configurado, S3 com object lock no bucket de log, e KMS com a chave dedicada para os logs",
        "deploy de aplicação: app emite log estruturado (JSON) em stdout ou sidecar; Fluent Bit / Datadog Agent / OpenTelemetry Collector normaliza e envia para o agregador",
        "resposta a incidente: o primeiro comando é 'busque o principal ARN na janela do ataque' - sem log indexado isso vira grep em arquivos de texto",
        "compliance: CIS Foundations, PCI, SOC 2 exigem trilha ativa e retenção mínima; sem log arquitetado, o auditor reprova antes mesmo de abrir checklist",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "visibilidade total do que aconteceu: trilha imutável responde 'quem, quando, de onde, o quê' para qualquer chamada de API na conta",
        "detecção por correlação reduz falso positivo: regra que cruza sinal de três fontes tem precisão alta e ruído baixo",
        "forense decente: object lock + retenção longa garante que o log do dia do incidente ainda existe quando você abrir o caso seis meses depois",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "custódia do log é trabalho contínuo: virar uma trilha off para reduzir custo ou esquecer de validar o object lock transforma o log em peça de teatro",
        "volume come orçamento: VPC Flow Logs em conta grande custa em grandeza de USD por dia; sem filtro e sem tier, a fatura vence a conversa",
        "detecção por assinatura só pega o conhecido: atacante novo com TTPs não mapeados passa pelo GuardDuty, e a defesa fica no hunting manual e na regra do SIEM do analista sênior",
      ],
    },
  ],
};
