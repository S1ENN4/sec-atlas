import type { StudyPath } from "@/content/types";

const a = (slug: string) => ({ domain: "appsec" as const, slug });
const c = (slug: string) => ({ domain: "cloudsec" as const, slug });
const g = (slug: string) => ({ domain: "ai-agents" as const, slug });
const s = (slug: string) => ({ domain: "secops" as const, slug });
const e = (slug: string) => ({ domain: "seceng" as const, slug });

// Curated study paths. Order matters: each step assumes the previous ones.
// Every ref must resolve to a topic (validator R8).
export const paths: StudyPath[] = [
  {
    id: "appsec-do-zero",
    title: "AppSec do zero à esteira",
    description: "A ordem natural para entender cada verificação e onde ela entra na pipeline.",
    level: "iniciante",
    steps: [
      { ref: a("cicd"), why: "A esteira é o palco: entenda as etapas antes das ferramentas." },
      { ref: a("shift-left"), why: "A ideia que organiza tudo: achar cedo custa menos." },
      { ref: a("threat-modeling"), why: "O ponto mais à esquerda: achar a falha no desenho." },
      { ref: a("secrets"), why: "O erro mais comum e mais barato de evitar." },
      { ref: a("sast"), why: "Olhar o código que você escreveu." },
      { ref: a("sca"), why: "Olhar o código que você importou." },
      { ref: a("sbom"), why: "Guardar o inventário do que foi entregue." },
      { ref: a("dast"), why: "Atacar a aplicação rodando, de fora." },
      { ref: a("devsecops"), why: "Juntar tudo em gates, políticas e cultura." },
    ],
  },
  {
    id: "cloud-fundamentos",
    title: "Cloud security: da identidade à resposta",
    description: "Segue o ciclo cloud: proteger, detectar e responder, começando pela identidade.",
    level: "iniciante",
    steps: [
      { ref: c("zero-trust"), why: "O modelo mental: nenhuma origem é confiável por padrão." },
      { ref: c("iam"), why: "Identidade é o novo perímetro." },
      { ref: c("network"), why: "Segmentar para limitar o movimento lateral." },
      { ref: c("kms-crypto"), why: "Cifrar bem depende de controlar as chaves." },
      { ref: c("secrets-cloud"), why: "Segredos efêmeros, em cofre, com rotação." },
      { ref: c("containers"), why: "Imagens imutáveis e a cadeia de suprimentos." },
      { ref: c("kubernetes"), why: "O cluster como sistema operacional distribuído." },
      { ref: c("cspm"), why: "Postura contínua: detectar desvios de configuração." },
      { ref: c("cwpp"), why: "Ver o que acontece dentro do workload." },
      { ref: c("logging-detection"), why: "Sem sinal, não há detecção." },
      { ref: c("incident-response"), why: "Do alerta à contenção, com a prova preservada." },
    ],
  },
  {
    id: "agentes-seguros",
    title: "Agentes de IA, do RAG à avaliação",
    description: "Monte o pipeline de um agente e aprenda onde cada risco aparece.",
    level: "intermediário",
    steps: [
      { ref: g("llm"), why: "O núcleo: o que o modelo faz e onde ele falha." },
      { ref: g("chunking"), why: "Como o conhecimento é fatiado." },
      { ref: g("embeddings"), why: "Transformar texto em significado vetorial." },
      { ref: g("vector-db"), why: "Onde os vetores moram e quem pode vê-los." },
      { ref: g("retrieval"), why: "Escolher o contexto certo para a pergunta." },
      { ref: g("rag"), why: "Juntar recuperação e geração, e seu risco de injeção indireta." },
      { ref: g("tool-calling"), why: "Quando o modelo passa a agir no mundo." },
      { ref: g("mcp"), why: "O protocolo que conecta ferramentas, e sua superfície de ataque." },
      { ref: g("orchestration"), why: "Vários agentes, confiança que não deve ser transitiva." },
      { ref: g("guardrails"), why: "Camadas de proteção antes e depois do modelo." },
      { ref: g("evals"), why: "Medir antes de acreditar." },
      { ref: g("regression-evals"), why: "Proteger o que já funciona a cada mudança." },
    ],
  },
  {
    id: "do-commit-a-nuvem",
    title: "Do commit à nuvem",
    description: "Um caminho cruzando domínios: o mesmo artefato, da esteira à produção.",
    level: "intermediário",
    steps: [
      { ref: a("threat-modeling"), why: "Comece pelo desenho: quais ameaças valem a pena tratar?" },
      { ref: a("secrets"), why: "Nada de segredo no repositório." },
      { ref: a("sca"), why: "Dependências verificadas antes do build." },
      { ref: a("sbom"), why: "O inventário que acompanha o artefato." },
      { ref: c("containers"), why: "O artefato vira imagem: assinada e imutável." },
      { ref: c("secrets-cloud"), why: "Em produção, o segredo vem do cofre." },
      { ref: c("iam"), why: "A workload roda com o mínimo de privilégio." },
      { ref: c("cspm"), why: "A postura do ambiente é vigiada continuamente." },
      { ref: c("incident-response"), why: "Quando algo escapa, a resposta já está ensaiada." },
    ],
  },
  {
    id: "defesa-l7",
    title: "Defesa L7 e operação de SOC",
    description: "Do log ao bloqueio: observe, detecte, aja e meça, como um programa de defesa de borda de verdade.",
    level: "intermediário",
    steps: [
      { ref: s("telemetria-borda"), why: "Sem dado bom, não há detecção boa." },
      { ref: s("escala-telemetria"), why: "Como manter tudo rápido e barato quando o volume explode." },
      { ref: s("ataques-l7"), why: "As assinaturas dos ataques que você vai procurar." },
      { ref: s("detection-engineering"), why: "Transformar padrões em detecções versionadas e medidas." },
      { ref: s("waf"), why: "Agir com cuidado: observação, shadow e enforcement." },
      { ref: s("rate-limiting"), why: "Limitar abuso sem punir quem usa de verdade." },
      { ref: s("bot-management"), why: "Separar automação legítima de abuso automatizado." },
      { ref: s("runbooks-e-hardening"), why: "Contenção rápida e correção que fecha a porta." },
      { ref: s("slos-soc"), why: "Provar que funciona e ajustar toda semana." },
      { ref: s("defesa-em-camadas"), why: "O desenho que une tudo: onde cada controle vive e o que acontece se ele falha." },
    ],
  },
  {
    id: "engenharia-de-seguranca",
    title: "Engenharia de segurança em escala",
    description: "Da infraestrutura como código ao pipeline de eventos com Go e Kafka: como construir a plataforma de segurança.",
    level: "intermediário",
    steps: [
      { ref: e("iac-seguro"), why: "Comece pelo que você provisiona: infraestrutura revisada e escaneada." },
      { ref: e("policy-as-code"), why: "Regras executáveis que valem para todo mundo." },
      { ref: e("cicd-hardening"), why: "A esteira que entrega tudo precisa ser confiável." },
      { ref: e("go-para-seguranca"), why: "Serviços simples de operar e que aguentam volume." },
      { ref: e("kafka-eventos"), why: "O log durável entre a borda e a detecção." },
      { ref: e("confiabilidade-em-escala"), why: "Falha acontece: não perder nem duplicar decisão." },
      { ref: e("observabilidade-plataforma"), why: "Saber quando o próprio pipeline está cego." },
      { ref: e("automacao-soar"), why: "Resposta automática com freios." },
      { ref: e("ia-na-seguranca"), why: "Acelerar a triagem sem confiar às cegas." },
      { ref: e("plataforma-como-produto"), why: "O caminho seguro precisa ser o mais fácil." },
    ],
  },
];
