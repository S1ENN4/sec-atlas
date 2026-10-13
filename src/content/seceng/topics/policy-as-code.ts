import type { Topic } from "@/content/types";

export const policyAsCode: Topic = {
  domain: "seceng",
  slug: "policy-as-code",
  title: "Policy as code",
  short: "regras de segurança executáveis, versionadas e testáveis",
  tagline:
    "Política escrita em documento depende de alguém lembrar. Política escrita como código é aplicada em toda mudança, de forma igual para todos, e deixa rastro do que foi decidido.",
  kind: "tecnica",
  stage: "definir",
  tools: ["Open Policy Agent", "Conftest", "Kyverno", "Sentinel"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Policy as code é expressar as regras da organização (\"nenhum bucket é público\", \"container não roda como root\", \"todo recurso tem dono\") em uma linguagem que uma ferramenta consegue avaliar automaticamente contra uma entrada: um plano de Terraform, um manifesto Kubernetes, uma requisição de API.",
        "O ganho é consistência e velocidade. A regra deixa de depender de revisor atento e passa a ser um gate que responde em segundos, com uma mensagem clara de por que bloqueou.",
      ],
    },
    {
      heading: "Exemplo em Rego (OPA)",
      body: [
        "O OPA usa a linguagem Rego. A política abaixo avalia o plano do Terraform e nega a criação de um bucket sem bloqueio de acesso público. Com o Conftest, o mesmo arquivo roda no CI sobre o plano exportado em JSON.",
      ],
      code: [
        {
          language: "rego",
          filename: "policy/s3.rego",
          code: "package terraform.s3\n\nimport rego.v1\n\ndeny contains msg if {\n\tr := input.resource_changes[_]\n\tr.type == \"aws_s3_bucket_public_access_block\"\n\tr.change.after.block_public_acls == false\n\tmsg := sprintf(\"%s permite ACL pública\", [r.address])\n}\n\ndeny contains msg if {\n\tr := input.resource_changes[_]\n\tr.type == \"aws_s3_bucket\"\n\tnot r.change.after.tags.owner\n\tmsg := sprintf(\"%s sem tag 'owner'\", [r.address])\n}",
        },
      ],
    },
    {
      heading: "Onde aplicar",
      bullets: [
        "No PR ou no CI: avaliar o plano de IaC antes do merge (rápido e barato de corrigir).",
        "Na admissão do cluster: um controlador (Kyverno ou OPA Gatekeeper) recusa objetos que violam a política no momento em que chegam à API.",
        "Em runtime e na nuvem: regras gerenciadas e verificação contínua pegam o que escapou ou mudou depois.",
        "As três camadas se complementam: o gate de CI dá feedback cedo; a admissão é a rede de proteção que ninguém contorna.",
      ],
    },
    {
      heading: "Testar a política como código",
      body: [
        "Uma política sem teste é uma suposição. O OPA permite testes unitários em Rego com casos que devem passar e casos que devem ser negados. Sem eles, uma regra pode silenciosamente deixar de pegar nada, ou, no outro extremo, bloquear mudanças legítimas e levar o time a desligá-la.",
      ],
    },
    {
      heading: "Exceções e adoção gradual",
      body: [
        "Exceções existem, e o importante é que sejam explícitas, com dono e prazo, e não buracos informais. Para adotar sem travar todo mundo, comece em modo de aviso (a política só reporta), meça o que seria bloqueado, corrija o legado e só então passe a bloquear, a mesma lógica de observação, shadow e enforcement usada em WAF.",
      ],
    },
  ],
};
