import type { StudyPath } from "@/content/types";

const a = (slug: string) => ({ domain: "appsec" as const, slug });
const c = (slug: string) => ({ domain: "cloudsec" as const, slug });
const g = (slug: string) => ({ domain: "ai-agents" as const, slug });

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
];
