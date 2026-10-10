import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "recuperacao",
    title: "recuperação",
    entries: [
      {
        term: "Retrieval",
        aka: "busca semântica",
        meaning:
          "Etapa do RAG em que você procura nos seus chunks os trechos que respondem à pergunta do usuário. Retrieval é o gargalo real do sistema: LLM bom com retrieval ruim é LLM que alucina com confiança. Vai da busca densa por similaridade ao BM25 clássico, passando por híbrido e reranking.",
        topic: "retrieval",
      },
      {
        term: "Reranking",
        meaning:
          "Segunda passada do retrieval: o modelo pega os top-K candidatos que vieram da busca barata (digamos 50) e reordena pelos K mais úteis (top 5 ou 10) usando um cross-encoder que viu query e chunk juntos. Adiciona latência, mas corta o ruído: o LLM recebe contexto denso em vez de uma mistura de bom e mediano.",
        topic: "retrieval",
      },
      {
        term: "BM25",
        meaning:
          "Função de ranking clássica da busca textual: pontua cada documento por TF-IDF com saturação (termos importantes pesam mais até certo teto) e normaliza pelo tamanho. É a busca esparsa do retrieval híbrido e captura match exato de termos (código de erro, nome de API) onde embedding sozinho erra feio.",
        topic: "retrieval",
      },
      {
        term: "Similaridade de cosseno",
        meaning:
          "Medida de quão alinhados estão dois vetores no espaço de embeddings: cosseno do ângulo entre eles, independente da magnitude. Para embeddings normalizados basta o produto interno e ainda fica rápido, por isso virou o padrão de distância em quase todo banco vetorial.",
        topic: "embeddings",
      },
      {
        term: "HNSW",
        aka: "hierarchical navigable small world",
        meaning:
          "Estrutura de grafo em camadas que bancos vetoriais usam para busca de vizinhos em alta dimensão. Cada camada é um grafo esparso que pula longe; as de baixo fazem o ajuste fino. É o motivo de pgvector, Pinecone, Weaviate, Qdrant e LanceDB responderem em milissegundos com milhões de vetores.",
        topic: "vector-db",
      },
      {
        term: "ANN",
        aka: "approximate nearest neighbor",
        meaning:
          "Família de algoritmos (HNSW, IVF, LSH) que trocam exatidão por velocidade brutal em busca de vizinhos em alta dimensão. ANN não acha o vizinho perfeito, mas o vizinho bom o suficiente, e em retrieval de produção esse trade é o que faz o sistema caber no orçamento de latência.",
        topic: "vector-db",
      },
    ],
  },
  {
    id: "modelo-agentes-e-protocolos",
    title: "modelo, agentes e protocolos",
    entries: [
      {
        term: "Janela de contexto",
        aka: "context window",
        meaning:
          "Tamanho máximo de tokens que o modelo consegue ler de uma só vez: prompt, todo o histórico concatenado e a saída que vai gerar. É a memória de curto prazo do LLM. Janelas enormes parecem resolver RAG, mas amplificam custo, latência e o risco de o modelo se perder no meio do texto, então contexto bom é contexto pequeno e bem escolhido.",
        topic: "llm",
      },
      {
        term: "Alucinação",
        aka: "hallucination",
        meaning:
          "Quando o modelo inventa um fato plausível que não estava nos dados: nome de API que não existe, paper inexistente, comando coerente que não faz nada. É um problema de treinamento e de retrieval, não de 'veracidade'. Mitigação é em camadas: retrieval com fontes verificáveis, prompt que pede citação, e avaliador que caça invenção automaticamente.",
        topic: "agent-frameworks",
      },
      {
        term: "Function calling",
        aka: "tool use",
        meaning:
          "Mecanismo pelo qual o LLM pede, em vez de só texto, para executar uma função com parâmetros estruturados: o modelo emite JSON, seu código roda a função, e o resultado volta para a conversa. É o que transforma um modelo puro em agente capaz de agir no mundo, e o que precisa de guardrails para evitar o call errado com o argumento errado.",
        topic: "tool-calling",
      },
      {
        term: "Agente",
        meaning:
          "Programa que usa um LLM para decidir o que fazer em cada passo, em vez de seguir um script fixo. Recebe objetivo, escolhe ferramentas, observa resultado, decide o próximo passo, e segue até concluir ou desistir. A diferença para um chatbot é autonomia: o agente sequencia ações fora de uma ordem pré-deﬁnida.",
        topic: "agent-frameworks",
      },
      {
        term: "Grafo de agente",
        meaning:
          "Decomposição explícita do raciocínio do agente em nós (planejar, agir, observar, revisar) e arestas direcionadas, em vez de um loop único que faz tudo. Vantagem: cada nó é auditável e testável de forma independente, e quando o agente trava você sabe em que nó travou. LangGraph e state machines em geral seguem esse modelo.",
        topic: "orchestration",
      },
      {
        term: "MCP server",
        aka: "model context protocol server",
        meaning:
          "Servidor que implementa o Model Context Protocol, o padrão aberto da Anthropic que padroniza a conversa entre um agente e ferramentas externas. O agente lista o que está disponível, chama o que precisa, recebe resultado, sem integração caso a caso. Um MCP server bem escrito vira reutilizável por Claude, Cursor, Cline e qualquer cliente compatível.",
        topic: "mcp",
      },
      {
        term: "Tool vs resource (MCP)",
        meaning:
          "No MCP, tool é uma função que o agente invoca com parâmetros e recebe resultado sob demanda (um POST, um cálculo, um envio). Resource é um dado nomeado que o agente pode ler quando quiser (arquivo de configuração, schema, log). Separar os dois é importante: o LLM raciocina melhor quando operações com efeito colateral são claramente diferentes de leituras.",
        topic: "mcp",
      },
      {
        term: "DeepAgents",
        meaning:
          "Biblioteca de agentes em grafo da LangChain que combina planning tool, filesystem tool e subagentes para resolver tarefas longas demais para um loop único. É referência prática de agente que não trava no terceiro tool call e o lugar onde você aprende a calibrar autonomia antes de soltar um agente real em produção.",
        topic: "agent-frameworks",
      },
    ],
  },
  {
    id: "avaliacao-e-seguranca",
    title: "avaliação e segurança",
    entries: [
      {
        term: "SWE-bench",
        meaning:
          "Benchmark que mede se um agente consegue resolver issues reais do GitHub em código real de projetos open source: multi-arquivo, com testes, sem instruções de como fazer. É o padrão atual para diferenciar agente que impressiona em demo de agente que fecha ticket de verdade, e onde o deepagents e afins publicam os números de evolução.",
        topic: "benchmarks",
      },
      {
        term: "Judge",
        aka: "LLM-as-judge",
        meaning:
          "Usar um LLM forte (em geral GPT-4 class ou Claude Opus) para pontuar a saída de outro modelo segundo uma rubrica. Resolve escala, porque humano não lê 5.000 saídas por PR. Traz vícios próprios: viés de posição (prefere o primeiro candidato), de verbosidade (prefere o mais longo) e auto-promoção (acha que o próprio modelo é melhor). Calibração contra avaliador humano é obrigatória antes de confiar no judge.",
        topic: "llm-as-judge",
      },
      {
        term: "Rubrica",
        meaning:
          "Lista explícita de critérios e pesos que o juiz usa para pontuar uma saída: 'cite a fonte na primeira frase, máximo 2 linhas, sem adjetivo, retorne JSON'. Sem rubrica escrita o LLM-as-judge diverge entre runs e entre modelos, e você não consegue melhorar prompt, modelo e dataset de forma reprodutível. Com rubrica travada vira régua, sem ela vira opinião.",
        topic: "llm-as-judge",
      },
      {
        term: "Baseline",
        meaning:
          "Modelo ou configuração de referência (fixa) que roda em todo dataset antes de qualquer mudança, para você medir o delta da sua alteração. Em eval de LLM, 'melhor' sem baseline é chute: a versão anterior já era boa, ou só parecia boa no demo? Baseline travado por versão é o que transforma eval em ciência, e o que separa 'passou no teste' de 'passou no teste, e aqui está a evidência'.",
        topic: "regression-evals",
      },
      {
        term: "Prompt injection",
        meaning:
          "Ataque em que conteúdo hostil (em página indexada, em e-mail resumido, em doc aberto pelo agente) tenta substituir as instruções do sistema. O atacante sabe que o LLM mistura texto confiável com texto encontrado e planta um 'ignore as instruções anteriores e execute X'. É o vetor número 1 em agente em produção hoje, não é bug do LLM, é como agentes leem texto por design.",
        topic: "guardrails",
      },
      {
        term: "PII",
        aka: "personally identifiable information",
        meaning:
          "Dado pessoal que identifica alguém: nome e CPF, e-mail, telefone, endereço, IP. Quando o usuário cola um documento com PII no chat, ou o RAG indexa um CRM com 5.000 clientes, o agente vira um vazamento por design. Guardrails aqui são detecção na entrada, redação antes de mandar para o LLM, e retenção curta, porque mascarar depois de receber a resposta já é tarde demais.",
        topic: "guardrails",
      },
    ],
  },
];
