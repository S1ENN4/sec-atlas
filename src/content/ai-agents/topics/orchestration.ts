import type { Topic } from "@/content/types";

export const orchestration: Topic = {
  domain: "ai-agents",
  slug: "orchestration",
  title: "Orchestration",
  short: "coordenar múltiplos agentes e etapas",
  tagline:
    "Orchestration é o padrão acima do agente único: pipeline (sequência fixa), supervisor (um agente comanda N) ou swarm (N agentes se auto-organizam). Define quem fala com quem, quando e em que ordem.",
  kind: "pratica",
  stage: "act",
  tools: ["Temporal", "LangGraph", "Apache Airflow", "Prefect"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Orchestration coordena múltiplos agentes (ou múltiplas etapas de um agente) em um fluxo maior. Enquanto agent frameworks tratam do loop interno de um agente, orchestration trata do meta-loop: quem entra, quem sai, quanto tempo dura, onde o estado fica persistido.",
        "A pergunta que orchestration responde não é 'o que esse agente faz', mas 'como esse agente conversa com o próximo'. Sem orchestration, cada agente vira uma ilha e a única cola entre eles é copiar e colar texto.",
      ],
    },
    {
      heading: "Os três padrões clássicos",
      body: [
        "Três padrões cobrem 90% dos casos reais. A escolha entre eles depende de quem decide o próximo passo:",
        "pipeline: sequência fixa. Cada etapa recebe a saída da anterior; a ordem é conhecida em tempo de design. Boa para ETL com LLM, pré-processamento, ou qualquer caso onde a divisão de trabalho é clara.",
        "supervisor: um agente (o supervisor) olha o estado e decide qual subagente chama agora. A estrutura existe, mas o caminho é decidido em runtime. Boa para fluxos com ramos dependentes de contexto.",
        "swarm: N agentes se coordenam por mensagens, sem dono central. Mais flexível, mais difícil de auditar; reservado para exploração ou tarefas mal definidas.",
      ],
      code: [
        {
          language: "text",
          filename: "comparação dos três padrões",
          code: "  pipeline    A -> B -> C -> D\n              ordem fixa, custo previsível, fácil de auditar\n\n  supervisor  A (decide) -> B ou C -> A (decide de novo)\n              ramo dinâmico, custo variável, supervisor é ponto único de falha\n\n  swarm       A <-> B <-> C <-> D\n              sem dono, mais caro, mais difícil de reproduzir",
        },
      ],
    },
    {
      heading: "Estado e checkpoint: como sobreviver a falhas",
      body: [
        "Agentes são flaky por natureza: APIs externas caem, modelos retornam respostas ruins, timeouts acontecem no meio do fluxo. Sem checkpoint, uma falha de 5 minutos significa começar do zero, com prompt gasto e dinheiro queimado.",
        "Checkpoint é o ato de persistir o estado do fluxo em um storage durável após cada etapa, com um ID único. Quando a execução recomeça (por crash, deploy ou retomada manual), o runtime lê o último checkpoint e continua de onde parou, sem repetir trabalho já feito.",
        "Temporal e Prefect modelam isso como workflow durable: cada função pode ser async, o runtime sabe reexecutar do ponto de falha. LangGraph expõe o mesmo conceito como thread_id com persistência em Redis ou Postgres.",
      ],
      code: [
        {
          language: "python",
          filename: "orchestrator.py",
          code: "from temporalio import workflow, activity\nfrom datetime import timedelta\n\n\n@activity.defn\nasync def extract(pdf_url: str) -> dict:\n    return {'text': '...'}\n\n\n@activity.defn\nasync def summarize(text: str) -> str:\n    return 'resumo'\n\n\n@workflow.defn\nclass ReportFlow:\n    @workflow.run\n    async def run(self, pdf_url: str) -> str:\n        # Cada execute_activity vira um step persistido pelo Temporal;\n        # se o worker cair no meio, o workflow retoma do ponto de falha\n        # sem repetir a atividade já concluída.\n        extracted = await workflow.execute_activity(\n            extract,\n            pdf_url,\n            start_to_close_timeout=timedelta(minutes=2),\n        )\n        return await workflow.execute_activity(\n            summarize,\n            extracted['text'],\n            start_to_close_timeout=timedelta(minutes=2),\n        )",
        },
      ],
    },
    {
      heading: "Pipeline com LangGraph: supervisor + subagentes",
      body: [
        "LangGraph deixa modelar supervisor e pipeline no mesmo grafo: cada nó é uma função (ou um subagente), e cada aresta condicional carrega a lógica 'qual nó agora'. O grafo é determinístico o suficiente para auditoria e flexível o suficiente para reagir ao estado.",
        "No exemplo abaixo, um orquestrador decide entre chamar 'researcher' ou 'writer' dependendo do estado; cada um deles é um subagente com seu próprio loop interno.",
      ],
      code: [
        {
          language: "typescript",
          filename: "supervisor.tsx",
          code: "import { StateGraph, END } from '@langchain/langgraph';\n\ntype S = { messages: any[]; stage: 'pending' | 'researched' | 'written' };\n\nasync function orchestrator(s: S) {\n  if (s.stage === 'pending')  return 'researcher';\n  if (s.stage === 'researched') return 'writer';\n  return END;\n}\n\nconst graph = new StateGraph<S>({ channels: { messages: [], stage: 'pending' } })\n  .addNode('orchestrator', orchestrator)\n  .addNode('researcher',  async (s) => ({ ...s, stage: 'researched' as const }))\n  .addNode('writer',      async (s) => ({ ...s, stage: 'written' as const }))\n  .addEdge('__start__', 'orchestrator')\n  .addConditionalEdges('orchestrator', (s) => s.stage,\n    { researcher: 'researcher', writer: 'writer', written: END, [END]: END })\n  .addEdge('researcher', 'orchestrator')\n  .addEdge('writer',     'orchestrator')\n  .compile({ checkpointer: redisCheckpointer });",
        },
      ],
    },
    {
      heading: "Onde orchestration encontra o resto do sistema",
      bullets: [
        "filas e workers: orchestration transforma chamadas longas em jobs assíncronos; cada etapa vira um worker",
        "idempotência por design — checkpoint sem idempotência significa reexecutar e duplicar efeito colateral",
        "observabilidade: cada etapa emite métricas, logs e spans; sem isso, debugar multi-agente é adivinhar",
        "human-in-the-loop: em fluxos críticos, o supervisor pausa e espera aprovação antes da próxima etapa",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "orquestrador é um lugar para más decisões se acumularem — supervisor mal calibrado vira loop infinito",
        "checkpoint tem custo: cada persistência adiciona latência e acoplamento a um banco",
        "swarm e supervisor flexível são difíceis de reproduzir — mesmo prompt pode dar fluxos diferentes",
        "tooling ainda é jovem: Temporal é sólido para código determinístico, mas o suporte a LLM dentro dele é recente",
      ],
    },
  ],
};
