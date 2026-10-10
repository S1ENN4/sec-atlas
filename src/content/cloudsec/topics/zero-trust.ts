import type { Topic } from "@/content/types";

export const zeroTrust: Topic = {
  domain: "cloudsec",
  slug: "zero-trust",
  title: "Zero-trust - modelo de confiança",
  short: "nunca confiar, sempre verificar",
  tagline:
    "Zero-trust substitui o perímetro por política: cada requisição é autenticada, autorizada e logada, independente da origem ser interna ou externa.",
  kind: "conceito",
  stage: null,
  tools: ["BeyondCorp", "Cloudflare Access", "NIST SP 800-207", "OpenZiti"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Zero-trust é um modelo de segurança, não um produto. A premissa é simples: nada é confiável por posição na rede. Não importa se o request vem de dentro do data center, do laptop do CTO ou de um pod em outra conta: cada chamada é autenticada, autorizada e logada antes de tocar recurso algum.",
        "O modelo nasce da constatação de que perímetro clássico não funciona mais. VPN coloca o usuário na rede interna, e a rede interna não tem mais muro - VPCs se conectam, workloads rodam em Kubernetes efêmero, parceiros têm federação, e o atacante que entra uma vez passeia até o bucket de pagamentos. Zero-trust responde mudando a unidade de confiança da rede para a identidade, e exige verificação explícita em cada fronteira.",
      ],
    },
    {
      heading: "Os principios",
      body: [
        "NIST SP 800-207 fixa cinco princípios que aparecem em toda implementação séria. Não são exclusivos - na prática são combinados - mas servem de régua para saber se a arquitetura em estudo é zero-trust ou 'VPN com MFA'.",
      ],
      bullets: [
        "nunca confiar, sempre verificar: cada request é avaliado, mesmo o que veio do mesmo IP dez segundos atrás",
        "identidade é o novo perímetro: usuário, workload e device ganham identidade própria, e a autorização viaja junto deles (SPIFFE, mTLS, tokens curtos)",
        "privilégio mínimo por padrão: cada sujeito ganha só o que precisa para a tarefa atual, em janela curta, com revogação central",
        "assume-breach: a postura parte de que o atacante já está dentro; logs, segmentação e detecção ficam em primeiro plano, não em plano B",
        "verificação contínua: postura do device, geografia, horário e sinal de risco reavaliados a cada chamada - autenticação não é evento único",
      ],
    },
    {
      heading: "Na pratica",
      body: [
        "Zero-trust se concretiza em quatro frentes técnicas, quase sempre combinadas. O caminho costuma começar em uma frente (acesso de usuário, por exemplo) e expandir com o tempo até cobrir toda a malha de serviço.",
      ],
      bullets: [
        "identidade de workload: cada serviço carrega uma identidade curta (SPIFFE/SPIRE, mTLS automático via service mesh) e a política de autorização fala com a identidade, não com IP ou subnet",
        "acesso de usuário: substitui VPN por proxy de identidade (BeyondCorp, Cloudflare Access, Tailscale, Zscaler ZIA), e cada app publica policy declarativa",
        "segmentação de workload: network policy no cluster (Calico, Cilium), VPC lattice na AWS, ou service mesh garante que east-west traffic tem a política que cabe",
        "policy engine central: Open Policy Agent, Cedar (AWS Verify Access) ou similar decide cada permissão; policy-as-code sai do PR para produção com revisão e teste",
      ],
    },
    {
      heading: "Limites",
      body: [
        "O limite mais comum é confundir zero-trust com 'colocar MFA na VPN'. MFA é uma camada; zero-trust é uma arquitetura que pressupõe MFA em cada chamada, identidade em cada workload e policy por serviço. Time que chama qualquer coisa de 'zero-trust' porque liga MFA vira projeto de marketing, não de segurança.",
        "O segundo limite é operacional. Trocar VPN por BeyondCorp em mil funcionários é um projeto de meses com vendor lock-in e roll-back difícil. A versão pragmática começa pequena (uma aplicação sensível, ou um cluster) e expande por ondas, com política versionada e teste antes de promover.",
      ],
    },
  ],
};
