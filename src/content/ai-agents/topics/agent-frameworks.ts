import type { Topic } from "@/content/types";

export const agentFrameworks: Topic = {
  domain: "ai-agents",
  slug: "agent-frameworks",
  title: "Agent frameworks",
  short: "esqueleto para orquestrar raciocínio, memória e ferramentas",
  tagline:
    "Agent framework é o esqueleto que segura o loop do agente: estado, plano, ferramentas e o que acontece entre cada chamada ao modelo. Sem framework, o agente vira um script cheio de if/else que ninguém consegue auditar.",
  kind: "pratica",
  stage: "act",
  tools: ["LangGraph", "CrewAI", "AutoGen", "DeepAgents"],
  sections: [
    {
      heading: "O loop: perceber, decidir, agir, observar",
      body: [
        "Todo agente, do mais simples ao mais complexo, executa o mesmo loop de quatro passos — até esgotar um orçamento de passos ou chegar a uma resposta final:",
        "1. perceber: o agente olha o estado atual (system prompt, histórico, resultado da última ação) e o que o usuário pediu.",
        "2. decidir: o LLM produz ou uma resposta final ao usuário, ou uma chamada de ferramenta com argumentos estruturados.",
        "3. agir: o runtime valida os argumentos contra o schema da ferramenta, executa e captura o resultado.",
        "4. observar: o resultado volta para o contexto e o loop reinicia.",
        "Um agente só tem valor se o loop termina — e por isso todo framework expõe um limite máximo de passos e um critério de fim explícito.",
      ],
      code: [
        {
          language: "typescript",
          filename: "loop.tsx",
          code: "type Step = { kind: 'final'; answer: string }\n       | { kind: 'tool';    tool: string; args: unknown };\n\nasync function agentLoop(state, llm, tools, maxSteps = 8) {\n  for (let i = 0; i < maxSteps; i++) {\n    const step: Step = await llm.decide(state);   // perceber + decidir\n    if (step.kind === 'final') return step.answer; // fim\n    const out = await tools[step.tool].run(step.args); // agir\n    state = state.observe(step, out);              // observar\n  }\n  throw new Error('loop budget exhausted');\n}",
        },
      ],
    },
    {
      heading: "Por que usar um framework",
      body: [
        "O loop acima é curto, mas o que vem em volta não é: persistir estado entre passos, retomar a conversa depois de um erro, paralelizar ferramentas independentes, validar argumentos, gerenciar retries e expor observabilidade. Sem framework, você reimplementa isso em todo projeto — e reimplementa errado.",
        "Um framework de agente entrega três coisas que vale pagar para ter: um grafo de execução explícito (você vê o que pode rodar quando), um estado tipado que sobrevive entre passos e a integração pronta com o modelo, o provedor de ferramentas e o storage de memória.",
      ],
    },
    {
      heading: "LangGraph: o agente como grafo de nós",
      body: [
        "LangGraph modela o agente como uma máquina de estados: cada nó é uma função (uma chamada ao LLM, uma execução de ferramenta, um filtro), cada aresta é uma decisão. O estado é um canal tipado que todos os nós leem e escrevem. Quando o grafo é cíclico, o agente pode iterar; quando é acíclico, ele é um pipeline.",
        "O exemplo abaixo define um agente de pesquisa com dois nós (chamar modelo e executar ferramenta) e uma aresta condicional: se o modelo pediu ferramenta, vá para tools e volte; se devolveu resposta final, termine.",
      ],
      code: [
        {
          language: "typescript",
          filename: "research-agent.tsx",
          code: "import { StateGraph, END } from '@langchain/langgraph';\nimport { ChatAnthropic } from '@langchain/anthropic';\n\ntype S = { messages: Array<{ role: string; content: string }> };\n\nconst llm = new ChatAnthropic({ model: 'claude-sonnet-5-5' });\nconst tools = { search: { run: async (q: string) => `result for ${q}` } };\n\nconst graph = new StateGraph<S>({ channels: { messages: { value: [] } } })\n  .addNode('llm', async (s) => ({ messages: s.messages.concat([await llm.invoke(s.messages)]) }))\n  .addNode('tool', async (s) => ({ messages: s.messages.concat([{ role: 'tool', content: 'ok' }]) }))\n  .addEdge('__start__', 'llm')\n  .addConditionalEdges('llm',\n    (s) => s.messages.at(-1)?.content.startsWith('CALL ') ? 'tool' : END,\n    { tool: 'tool', [END]: END })\n  .addEdge('tool', 'llm')\n  .compile();\n\nconst out = await graph.invoke({ messages: [{ role: 'user', content: 'qual a capital da França?' }] });",
        },
      ],
    },
    {
      heading: "Deep Agents: um harness pronto sobre o LangGraph",
      body: [
        "Deep Agents é um agent harness de código aberto (licença MIT) da LangChain, construído sobre o LangGraph. Em vez de pedir que você monte o grafo, ele entrega um agente que já funciona e pode ser estendido peça por peça: subagentes que recebem tarefas delegadas com janelas de contexto isoladas, um sistema de arquivos (local, em sandbox ou remoto) para ler, escrever e buscar, gestão de contexto (resumir conversas longas e descarregar saídas de ferramentas em disco), acesso a shell num sandbox, memória persistente, aprovação humana de chamadas de ferramenta, skills carregadas sob demanda, ferramentas próprias e servidores MCP.",
        "A diferença para um framework de grafo é o ponto de partida: em vez de desenhar nós e arestas, você começa de um agente completo e troca o modelo, o prompt, as ferramentas ou o backend conforme precisa. A segurança segue o modelo 'confie no LLM': a barreira de proteção precisa ficar nas ferramentas e no sandbox, nunca no modelo.",
      ],
      code: [
        {
          language: "python",
          filename: "deepagents.py",
          code: "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"provedor:nome-do-modelo\",   # troque pelo modelo que você usa\n    system_prompt=\"Você é um assistente de pesquisa. Cite as fontes.\",\n)\n\nresult = agent.invoke({\"messages\": \"Pesquise o que é LangGraph e escreva um resumo de 5 linhas\"})",
        },
      ],
    },
    {
      heading: "CrewAI e AutoGen: estilos vizinhos",
      body: [
        "CrewAI foca em times com papéis fixos (pesquisador, redator, revisor) e um processo de delega mais opinativo; é rápido para protótipos onde a divisão de trabalho é conhecida. AutoGen, da Microsoft (hoje em modo de manutenção, com o Microsoft Agent Framework como sucessor), generaliza para múltiplos agentes conversando entre si, útil para exploração mas com tendência a loops longos e custo difícil de controlar.",
        "A escolha entre frameworks raramente é técnica: é sobre o nível de estrutura que você quer no grafo. Quanto mais fixo o papel de cada nó, mais fácil de auditar; quanto mais flexível, mais poderoso para tarefas mal definidas e mais caro de operar.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "loop explícito: cada framework pode ter certeza de quanto já rodou e o que falta rodar, simplificando budget e auditoria",
        "estado tipado: o canal de estado passa a ser contrato, não dicionário solto — a IDE mostra erros antes de rodar",
        "grafo visual: o fluxo do agente vira diagrama, e debugar vira olhar 'antes', executar nó, ler saída",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "abstração vira lock-in: migrar entre frameworks custa reescrever o grafo, não só trocar a chamada",
        "orçamento de loop é heurístico — sem guarda boa, agentes travam em ciclos ou estouram custo",
        "LangGraph e DeepAgents ainda são projetos jovens (2024-2026); APIs e contratos mudam entre versões",
      ],
    },
  ],
};