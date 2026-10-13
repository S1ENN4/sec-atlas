import type { PipelineStage } from "@/content/types";

// Four-stage security-engineering lifecycle: you DEFINE controls as code,
// DELIVER them through a hardened pipeline, run them at SCALE on services you
// own (Go, Kafka), and AUTOMATE the response. `plataforma-como-produto` is a
// dashed layer: it is the mindset that ties all four together.

export const pipeline: PipelineStage[] = [
  {
    id: "definir",
    index: "01",
    name: "definir",
    description: "controles descritos como código",
    items: [
      { label: "infraestrutura segura como código", slug: "iac-seguro" },
      { label: "políticas executáveis", slug: "policy-as-code" },
      { label: "módulos e padrões aprovados" },
    ],
    gate: "nenhuma mudança de infra sem revisão e política passando",
  },
  {
    id: "entregar",
    index: "02",
    name: "entregar",
    description: "esteira confiável, sem segredo estático",
    items: [
      { label: "runners efêmeros e OIDC", slug: "cicd-hardening" },
      { label: "ações e dependências fixadas" },
      { label: "artefatos assinados" },
    ],
    gate: "a própria esteira é tratada como alvo",
  },
  {
    id: "escalar",
    index: "03",
    name: "escalar",
    description: "serviços e pipelines que aguentam o volume",
    items: [
      { label: "serviços em Go", slug: "go-para-seguranca" },
      { label: "eventos com Kafka", slug: "kafka-eventos" },
      { label: "retries, idempotência e backpressure", slug: "confiabilidade-em-escala" },
      { label: "observar o próprio pipeline", slug: "observabilidade-plataforma" },
    ],
    gate: "lag, latência e erro do pipeline têm SLO e alerta",
  },
  {
    id: "automatizar",
    index: "04",
    name: "automatizar",
    description: "resposta automática, com freios",
    items: [
      { label: "playbooks como código", slug: "automacao-soar" },
      { label: "IA na triagem e na mitigação", slug: "ia-na-seguranca" },
      { label: "aprovação humana em ações destrutivas" },
    ],
    gate: "toda automação é idempotente, auditável e reversível",
  },
];
