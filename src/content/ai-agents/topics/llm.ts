import type { Topic } from "@/content/types";

export const llm: Topic = {
  domain: "ai-agents",
  slug: "llm",
  title: "LLM - large language model",
  short: "o modelo que gera texto a partir de contexto",
  tagline:
    "LLM é o motor generativo do agente: recebe contexto (system prompt, histórico, retrieval, ferramentas) e produz a próxima resposta. Não consulta uma base de fatos; usa o contexto para parecer consultar.",
  kind: "conceito",
  stage: null,
  tools: ["OpenAI", "Anthropic Claude", "Google Gemini", "Mistral"],
  sections: [
    {
      heading: "O que é",
      body: [
        "LLM (Large Language Model) é um modelo generativo treinado para prever a próxima unidade de texto (token) dado tudo que veio antes. Em vez de 'saber' fatos como uma enciclopédia, ele aprendeu padrões de linguagem, código, raciocínio e conhecimento de mundo embutido nos dados de treino.",
        "Quando você envia uma pergunta, o modelo não consulta nada: ele lê o contexto inteiro que você entregou (system prompt, histórico, retrieval, saídas de ferramentas) e continua o padrão. A qualidade da resposta depende quase totalmente do que está nesse contexto, não do que o modelo 'sabe'.",
      ],
    },
    {
      heading: "Tokens: a unidade real do modelo",
      body: [
        "Modelos não leem palavras, leem tokens — pedaços de texto que podem ser uma palavra inteira, um pedaço de palavra, um número ou um símbolo. Um parágrafo em português vira tipicamente 1,3x mais tokens do que palavras. Isso importa porque tudo se conta em tokens: prompt de entrada, resposta de saída, custo, latência e o limite da janela de contexto.",
        "A janela de contexto é o tamanho máximo que o modelo consegue olhar de uma vez — medido em milhares (K) ou milhões (M). Passou do limite, o começo do diálogo deixa de existir para o modelo. Por isso retrieval, sumarização e corte de histórico são técnicas que existem.",
      ],
      code: [
        {
          language: "text",
          filename: "contagem aproximada de tokens",
          code: "  'Olá, mundo'                     -> 3 tokens  ('Ol', 'á', ', mundo')\n  'Grandes modelos de linguagem'    -> 7 tokens\n  'functionCalling'                 -> 6 tokens  (3 palavras + 3 subpalavras)\n\n  regra prática PT-BR:  ~1 token por 0,75 palavra\n  regra prática EN:    ~1 token por 0,75 palavra",
        },
      ],
    },
    {
      heading: "System prompt: o contrato com o modelo",
      body: [
        "O system prompt é a mensagem de sistema que define o comportamento do modelo: papel, restrições, formato de saída, política de recusa. É a única parte do contexto que o usuário comum não escreve — e por isso é a mais valiosa.",
        "Um system prompt bom descreve três blocos: identidade e propósito, regras duras (o que o modelo nunca deve fazer) e formato de saída (como responder). Quanto mais específico, menos o modelo inventa.",
      ],
      code: [
        {
          language: "markdown",
          filename: "system prompt mínimo",
          code: "Você é um atendente de suporte técnico da empresa X.\n\nRegras:\n  - responda em português do Brasil, tom profissional e direto\n  - se não souber a resposta, diga 'não sei' e ofereça abrir chamado\n  - nunca invente preços, prazos ou números de protocolo\n\nFormato:\n  - respostas em no máximo 3 parágrafos\n  - cite o artigo da base de conhecimento quando usar (formato KB-[IDX])",
        },
      ],
    },
    {
      heading: "Custo e latência",
      body: [
        "Cada chamada ao modelo tem dois componentes de custo: tokens de entrada (o que você envia) e tokens de saída (o que ele gera). Tokens de saída costumam custar 3 a 5 vezes mais que os de entrada em APIs comercializadas, porque a geração é serial e mais cara para o provedor.",
        "Latência segue duas regras simples: o tempo até o primeiro caractere depende do tamanho do prompt, e o tempo total depende de quantos tokens o modelo gera. Por isso prompts grandes demoram para começar e respostas longas demoram para terminar — e por isso 'seja conciso' no system prompt economiza dinheiro real.",
      ],
      code: [
        {
          language: "text",
          filename: "custo estimado por chamada",
          code: "  prompt:      2.000 tokens de entrada\n  resposta:    400 tokens de saída\n\n  preço (exemplo genérico):\n    entrada  US$ 3 / 1M tokens  -> US$ 0,006\n    saída    US$ 15 / 1M tokens -> US$ 0,006\n    total                          US$ 0,012 por chamada\n\n  a 10.000 chamadas/mês no mesmo padrão: ~US$ 120/mês",
        },
      ],
    },
    {
      heading: "O que o modelo não faz",
      bullets: [
        "consultar dados externos por conta própria — sem retrieval ou ferramenta, ele só sabe o que estava no treino",
        "lembrar conversas passadas — entre chamadas o modelo é stateless; cada turno recomeça do zero",
        "executar código — o modelo devolve strings, inclusive strings que parecem código; a execução fica com o runtime",
        "garantir verdade factual — alucinações são o estado padrão quando o modelo completa padrões sem ancoragem em fonte",
        "manter sigilo por si só — segredos no system prompt não ficam secretos para sempre; o prompt vaza via exfiltre logs",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "janela de contexto finita: passa do limite, o histórico some; passa o limite, o custo de visão muda.",
        "modelo não é determinístico: a mesma pergunta pode gerar respostas diferentes a cada chamada; temperatura controla isso",
        "conhecimento desatualizado: o treino tem data de corte; o que mudou depois não existe para o modelo",
        "custo cresce com uso: agents que chamam LLM várias vezes por tarefa multiplicam o custo, em vezes pelo uso",
      ],
    },
  ],
};