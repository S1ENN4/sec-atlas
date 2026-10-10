import type { PipelineStage } from "@/content/types";

// Four-stage cloudsec cycle. Inventario and Responder are label-only (no
// attached topic; content waves T14-17 will fold concrete operational
// content into the stage card body itself). Proteger collects the
// preventive controls (identity, network, data, workload baseline);
// Detectar collects the detective controls (posture, runtime, signal).
//
// Item order within a stage mirrors attacker progression: an adversary
// has to bypass IAM/network/KMS/secrets/k8s/containers-in-order to act,
// then trips CSPM/CWPP/logging on the way out, leaving signal for
// response.

export const pipeline: PipelineStage[] = [
  {
    id: "inventario",
    index: "01",
    name: "inventario",
    description: "assets e donos mapeados",
    items: [
      { label: "mapeamento de contas e serviços" },
      { label: "inventário de ativos / owners" },
      { label: "classificação de dados" },
    ],
    gate: "todo asset tem dono e classificação",
  },
  {
    id: "proteger",
    index: "02",
    name: "proteger",
    description: "identidade, rede e dados sob controle",
    items: [
      { label: "privilégios mínimos", slug: "iam" },
      { label: "segmentação e microsegmentação", slug: "network" },
      { label: "chaves e envelopes", slug: "kms-crypto" },
      { label: "cofres e rotação", slug: "secrets-cloud" },
      { label: "RBAC e admission", slug: "kubernetes" },
      { label: "imagens assinadas e imutáveis", slug: "containers" },
    ],
    gate: "nenhum segredo estático · IAM com menor privilégio",
  },
  {
    id: "detectar",
    index: "03",
    name: "detectar",
    description: "visibilidade e postura monitoradas",
    items: [
      { label: "postura contínua", slug: "cspm" },
      { label: "runtime e workload", slug: "cwpp" },
      { label: "sinais e alertas", slug: "logging-detection" },
    ],
    gate: "drift e anomalia viram alerta em minutos",
  },
  {
    id: "responder",
    index: "04",
    name: "responder",
    description: "do alerta à contenção",
    items: [
      { label: "runbooks e automação" },
      { label: "isolamento de credenciais" },
      { label: "forense preservada" },
    ],
    gate: "MTTR abaixo do limite · lições voltam ao inventario",
  },
];
