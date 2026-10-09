import type { Topic } from "@/content/types";

export const devsecops: Topic = {
  domain: "appsec",
  slug: "devsecops",
  title: "DevSecOps",
  short: "Segurança embutida em cada stage",
  tagline: "Transforma a pipeline em uma série de portões de segurança automatizados — sem travar o time.",
  kind: "pratica",
  stage: "todas as fases",
  tools: ["OPA", "Cosign", "Sigstore", "SLSA"],
  sections: [
    {
      heading: "O que é",
      body: [
        "DevSecOps é a combinação de cultura e automação: segurança deixa de ser uma revisão no fim do ciclo e vira código dentro do CI/CD, com responsabilidade compartilhada entre desenvolvimento, operações e segurança.",
      ],
    },
    {
      heading: "Security gates",
      body: ["Cada stage ganha um portão com critério explícito:"],
      bullets: [
        "PR bloqueado se SAST ou SCA reportar achado crítico novo",
        "imagem de container só sobe se o scan de vulnerabilidades passar",
        "deploy condicionado a artefato assinado e verificado",
        "política como código (OPA/Rego) versionada junto com a pipeline",
      ],
    },
    {
      heading: "Política como código: o gate escrito, não combinado",
      body: [
        "Um gate de verdade não é acordo verbal — é um arquivo versionado que a pipeline consulta. Em OPA/Rego, a regra abaixo nega qualquer imagem com vulnerabilidade crítica, e o texto do motivo sai na mensagem de erro do deploy:",
      ],
      code: [
        {
          language: "rego",
          filename: "policy/imagens.rego",
          code: "package deploy\n\ndeny[msg] {\n  input.image.vulns.critical > 0\n  msg := sprintf(\"imagem %s tem %d vulnerabilidades críticas\",\n                 [input.image.name, input.image.vulns.critical])\n}",
        },
      ],
    },
    {
      heading: "Provar procedência: o deploy que verifica assinatura",
      body: [
        "O nível seguinte é provar origem e integridade: frameworks como SLSA e in-toto registram a proveniência de cada artefato, e ferramentas como Cosign/Sigstore assinam imagens e commits. O deploy só prossegue se a assinatura bater — o artefato veio da sua pipeline, do commit esperado, sem adulteração:",
      ],
      code: [
        {
          language: "bash",
          filename: "deploy.sh",
          code: "cosign verify --key cosign.pub ghcr.io/org/app:1.4.2\ncosign verify-attestation --type slsaprovenance \\\n  --key cosign.pub ghcr.io/org/app:1.4.2",
        },
      ],
    },
    {
      heading: "O equilíbrio",
      body: [
        "Portão rígido demais vira contorno: devs dão bypass em ferramenta que trava entrega por falso positivo. O caminho saudável é começar em modo auditoria (alerta sem bloqueio), medir, ajustar regras e endurecer os gates aos poucos — cada endurecimento é uma decisão baseada em dados, não em fé.",
      ],
    },
  ],
};
