import type { Topic } from "@/content/types";

export const defesaEmCamadas: Topic = {
  domain: "secops",
  slug: "defesa-em-camadas",
  title: "Defesa em camadas: system design de borda",
  short: "onde cada controle vive, e o que acontece quando ele falha",
  tagline:
    "Projetar a defesa é decidir, camada por camada, quem inspeciona o quê, quanto latência isso custa e se o sistema abre ou fecha quando um controle cai.",
  kind: "conceito",
  stage: null,
  tools: ["Cloudflare", "API Gateway", "Envoy", "Terraform"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Uma requisição atravessa várias camadas antes de chegar aos dados: a borda (CDN e WAF), um gateway de API, a aplicação e o banco. Defesa em camadas é projetar o conjunto para que a falha ou o contorno de uma não derrube o resto, colocando cada controle onde ele é mais barato e mais preciso.",
      ],
    },
    {
      heading: "O caminho da requisição e o papel de cada camada",
      code: [
        {
          language: "text",
          filename: "camadas, da borda ao dado",
          code: "cliente\n  -> borda (CDN + WAF + bot + rate limit)   barato, em escala: bloquear o óbvio e o volumétrico\n  -> gateway de API                          identidade, esquema, quotas por cliente\n  -> aplicação                               autorização por objeto, regras de negócio\n  -> dados                                   menor privilégio, cifragem, auditoria",
        },
      ],
      body: [
        "A borda é ótima para o que independe do contexto de negócio (volume, assinaturas, bots). Mas ela não sabe se um usuário pode ver aquele pedido: isso é autorização, e só a aplicação conhece. Cada camada cobre o ponto cego da anterior.",
      ],
    },
    {
      heading: "Trancar a origem",
      body: [
        "De nada adianta um WAF excelente se o atacante fala direto com a origem. A origem deve aceitar tráfego apenas da borda: lista de IPs do provedor, autenticação mútua entre a borda e a origem, ou túneis privados. Sem isso, qualquer um que descubra o endereço real contorna toda a proteção.",
      ],
    },
    {
      heading: "Fail-open ou fail-closed",
      body: [
        "Toda camada de segurança pode falhar (erro de configuração, indisponibilidade, regra com defeito). A pergunta de design é o que acontece: fail-closed bloqueia tudo (seguro, mas é uma indisponibilidade), fail-open deixa passar (disponível, mas desprotegido). Não existe resposta universal: um endpoint de pagamento tende a fechar, uma página pública tende a abrir, e a decisão deve ser consciente, documentada e testada.",
      ],
    },
    {
      heading: "Latência e raio de impacto",
      bullets: [
        "Orçamento de latência: cada camada soma milissegundos; inspeção profunda no corpo cabe só onde importa.",
        "Raio de impacto: uma regra nova atinge todo o tráfego; por isso a regra entra primeiro em observação e em um subconjunto.",
        "Mudança como código: regras em repositório (Terraform, por exemplo), com revisão e rollback, em vez de cliques no painel.",
        "Observabilidade em todas as camadas, para saber em qual delas uma requisição foi barrada.",
      ],
    },
  ],
};
