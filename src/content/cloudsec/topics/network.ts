import type { Topic } from "@/content/types";

export const network: Topic = {
  domain: "cloudsec",
  slug: "network",
  title: "Network - segmentação e zero-trust",
  short: "segmentação, microsegmentação e policies de rede",
  tagline:
    "A rede cloud é programável: VPCs, subnets, security groups e firewalls de aplicação escrevem o perímetro aplicação por aplicação, em vez de esperar pela borda do data center.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["AWS VPC", "Cloudflare", "Palo Alto Networks", "Calico"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Em cloud, rede não é cabeamento: é configuração. VPCs, subnets, route tables, security groups e network ACLs são objetos que você cria e versiona como qualquer outro recurso. A topologia vira código, e a superfície de ataque vira um arquivo que dá para ler em PR.",
        "Isso muda o jogo. Em vez de um firewall grande na entrada, o controle se espalha: cada subnet decide quem fala com ela, cada instância define quem chega nela, e o tráfego que sai do cluster passa por um gateway que inspeciona e registra.",
      ],
    },
    {
      heading: "VPC e subnets: pública versus privada",
      body: [
        "Dentro de uma VPC, o desenho clássico tem duas camadas de subnet. A pública tem rota direta para um Internet Gateway e serve coisas que precisam de IP alcançável (NAT gateway, bastion, load balancer público). A privada não tem rota para a internet de saída, só recebe tráfego interno e, quando precisa sair, fala com o NAT.",
        "O erro mais comum é colocar o banco de dados na subnet pública por preguiça de configurar rota. O resultado é um Postgres com IP elástico respondendo na 5432 para o mundo, esperando o primeiro scanner passar.",
      ],
    },
    {
      heading: "Security groups: stateful, no nível da ENI",
      body: [
        "Security group é a primeira linha em cloud. Ele é stateful: a resposta de um request autorizado volta sem precisar de regra de entrada. Anexado à interface de rede (ENI), funciona como um firewall por instância, e várias instâncias podem compartilhar o mesmo grupo quando fazem o mesmo papel.",
        "O anti-padrão clássico é abrir 0.0.0.0/0 nas portas de administração. Aparece em todo post-mortem:",
      ],
      code: [
        {
          language: "json",
          filename: "security-group.json - permissivo (NÃO use)",
          code: "{\n  \"GroupName\": \"web-sg\",\n  \"Description\": \"Aberto para a internet (NÃO use em prod)\",\n  \"IpPermissions\": [\n    {\n      \"IpProtocol\": \"tcp\",\n      \"FromPort\": 22,\n      \"ToPort\": 22,\n      \"IpRanges\": [ { \"CidrIp\": \"0.0.0.0/0\", \"Description\": \"SSH aberto\" } ]\n    },\n    {\n      \"IpProtocol\": \"tcp\",\n      \"FromPort\": 3389,\n      \"ToPort\": 3389,\n      \"IpRanges\": [ { \"CidrIp\": \"0.0.0.0/0\", \"Description\": \"RDP aberto\" } ]\n    }\n  ]\n}",
        },
      ],
    },
    {
      heading: "A regra que deveria existir",
      body: [
        "Feche as portas de administração para a internet e force entrada via bastion ou Systems Manager Session Manager. Para o que precisa de acesso humano, restrinja por IP corporativo ou por VPN:",
      ],
      code: [
        {
          language: "json",
          filename: "security-group.json - corrigido",
          code: "{\n  \"GroupName\": \"web-sg\",\n  \"Description\": \"Acesso administrativo via bastion corporativo\",\n  \"IpPermissions\": [\n    {\n      \"IpProtocol\": \"tcp\",\n      \"FromPort\": 22,\n      \"ToPort\": 22,\n      \"IpRanges\": [ { \"CidrIp\": \"203.0.113.0/24\", \"Description\": \"range corporativo VPN\" } ]\n    },\n    {\n      \"IpProtocol\": \"tcp\",\n      \"FromPort\": 443,\n      \"ToPort\": 443,\n      \"IpRanges\": [ { \"CidrIp\": \"0.0.0.0/0\", \"Description\": \"HTTPS público\" } ]\n    }\n  ]\n}",
        },
      ],
    },
    {
      heading: "Network ACLs e VPC Flow Logs",
      body: [
        "NACL é o complemento stateless da subnet. Atua antes do security group e serve para regras amplas (bloquear um range inteiro conhecido como malicioso, por exemplo). É stateless, então a resposta precisa de regra de entrada específica, e raramente precisa mexer depois que a topologia está madura.",
        "VPC Flow Logs captura todo tráfego aceito ou rejeitado nas ENIs da VPC e despeja em CloudWatch ou S3. Sem flow log, você está investigando incidente no escuro. Com o mínimo (bloqueio por padrão, flow logs ativos e endpoints privados para os serviços da nuvem), o time de segurança consegue responder o que entrou, por onde e quando.",
      ],
    },
    {
      heading: "Microsegmentação e zero-trust",
      body: [
        "Security groups resolvem perímetro por carga. Quando o ambiente cresce, o segredo é começar a falar de workload-identity em vez de IP: política que fala 'o serviço A fala com o serviço B na porta 8080 via mTLS' é mais durável do que liberar um /24 entre subnets porque alguém pediu acesso uma vez.",
        "Ferramentas como Calico, Cilium ou VPC lattice abstraem o IP e deixam a política viajar junto com o workload. Mesmo que o pod troque de node, a regra continua valendo.",
      ],
    },
    {
      heading: "Onde entra no dia a dia",
      bullets: [
        "desenho inicial da VPC: topologia de subnets públicas e privadas, NAT, rotas e bastion definidos como código no Terraform/Pulumi",
        "deploy de aplicação: o manifesto declara o security group, e o pipeline cria/reconcilia com a VPC existente",
        "resposta a incidente: VPC flow logs + CloudTrail mostram a origem do ataque em minutos, não em horas",
        "auditoria contínua: detector de SG com 0.0.0.0/0 em portas sensíveis quebra o build antes do merge",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "rede virando código: revisar topologia em PR pega erro de subnet antes do tráfego",
        "logs nativos: VPC Flow Logs registra origem, destino, porta e decisão sem agente no host",
        "isolamento por workload: cada serviço tem o menor caminho de rede possível",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "complexidade da topologia: 5 contas, 12 subnets e 200 SGs precisam de ferramenta de visualização e lint",
        "SG não inspeciona payload: a porta pode estar certa e o conteúdo do request ser um ataque",
        "zero-trust de verdade depende de identidade de workload (mTLS, SPIFFE), que ainda é cedo em muitos stacks",
      ],
    },
  ],
};