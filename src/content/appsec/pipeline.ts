import type { PipelineStage } from "@/content/types";

export const pipeline: PipelineStage[] = [
  {
    id: "source",
    index: "01",
    name: "source",
    description: "push ou PR dispara a esteira",
    items: [
      { label: "secrets scanning", slug: "secrets" },
      { label: "pre-commit hooks", slug: "shift-left" },
      { label: "checks de PR", slug: "shift-left" },
      { label: "threat model da feature", slug: "threat-modeling" },
    ],
    gate: "nenhum segredo no diff",
  },
  {
    id: "build",
    index: "02",
    name: "build",
    description: "compila e resolve dependências",
    items: [
      { label: "SAST", slug: "sast" },
      { label: "SCA", slug: "sca" },
    ],
    gate: "sem achado crítico novo",
  },
  {
    id: "test",
    index: "03",
    name: "test",
    description: "unitários, integração e segurança",
    items: [
      { label: "orquestração da esteira", slug: "cicd" },
      { label: "testes unitários" },
      { label: "testes de integração" },
      { label: "quality gate", slug: "devsecops" },
    ],
    gate: "suite verde + políticas ok",
  },
  {
    id: "package",
    index: "04",
    name: "package",
    description: "artefato final: binário ou imagem",
    items: [
      { label: "SBOM", slug: "sbom" },
      { label: "scan de imagem", slug: "sca" },
      { label: "assinatura + proveniência", slug: "devsecops" },
    ],
    gate: "artefato assinado e íntegro",
  },
  {
    id: "deploy",
    index: "05",
    name: "deploy",
    description: "staging primeiro, produção depois",
    items: [
      { label: "DAST em staging", slug: "dast" },
      { label: "smoke tests" },
      { label: "gate p/ produção", slug: "devsecops" },
    ],
    gate: "DAST sem crítico + aprovação",
  },
  {
    id: "monitor",
    index: "06",
    name: "monitor",
    description: "produção observada, feedback contínuo",
    items: [
      { label: "observabilidade e alertas" },
      { label: "SCA contínuo", slug: "sca" },
      { label: "rollback" },
    ],
    gate: "CVE novo vira PR automático",
  },
];
