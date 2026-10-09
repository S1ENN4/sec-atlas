import type { Topic } from "@/content/types";

export const sbom: Topic = {
  domain: "appsec",
  slug: "sbom",
  title: "SBOM",
  short: "A lista de ingredientes do software",
  tagline: "Um inventário formal de tudo que compõe o artefato: dependências, versões, licenças e hashes.",
  kind: "conceito",
  stage: null,
  tools: ["Syft", "CycloneDX", "SPDX"],
  sections: [
    {
      heading: "O que é",
      body: [
        "SBOM (Software Bill of Materials) é o equivalente ao rótulo nutricional de um alimento: um documento estruturado listando todos os componentes que formam um artefato de software — dependências diretas e transitivas, versões exatas, licenças e hashes criptográficos.",
      ],
    },
    {
      heading: "Um SBOM de verdade",
      body: [
        "Os dois padrões dominantes são CycloneDX e SPDX. Um trecho real de um SBOM CycloneDX, reduzido a um componente:",
      ],
      code: [
        {
          language: "json",
          filename: "bom.cdx.json (CycloneDX)",
          code: "{\n  \"bomFormat\": \"CycloneDX\",\n  \"specVersion\": \"1.5\",\n  \"components\": [\n    {\n      \"type\": \"library\",\n      \"name\": \"lodash\",\n      \"version\": \"4.17.15\",\n      \"purl\": \"pkg:npm/lodash@4.17.15\",\n      \"hashes\": [{ \"alg\": \"SHA-256\", \"content\": \"3d0a2c...\" }]\n    }\n  ]\n}",
        },
      ],
    },
    {
      heading: "Anatomia de uma entrada",
      body: [
        "O purl (package URL) é o identificador universal do componente — pkg:npm/lodash@4.17.15 diz o ecossistema, o nome e a versão exata, em um formato que qualquer sistema consulta. Os hashes provam que o componente é exatamente o que o SBOM diz que é, sem espaço para troca silenciosa.",
        "Na prática, o SBOM é gerado no stage de package da pipeline — por ferramentas de SCA ou geradores dedicados como o Syft — e publicado (idealmente assinado) junto com o artefato.",
      ],
    },
    {
      heading: "Por que importa: o teste do próximo Log4Shell",
      body: [
        "Quando estoura a próxima vulnerabilidade crítica em uma biblioteca popular, a pergunta é sempre a mesma: estamos afetados? Com SBOM, a resposta sai em minutos — uma busca pelo purl no inventário de todos os serviços. Sem ele, são dias vasculhando projeto a projeto, ou pior: descobrindo em produção.",
        "Também virou exigência de mercado: órgãos do governo dos EUA passaram a exigir SBOM de fornecedores de software, e clientes enterprise seguem o mesmo caminho.",
      ],
    },
    {
      heading: "Relação com o SCA",
      body: [
        "SCA e SBOM se alimentam: a análise de composição produz o inventário, e o inventário é o que permite monitorar continuamente os componentes contra CVEs novos. Um SBOM gerado uma vez e esquecido envelhece rápido — o valor está no ciclo vivo: gerar a cada build, monitorar sempre.",
      ],
    },
  ],
};
