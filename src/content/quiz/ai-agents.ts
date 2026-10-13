import type { QuizBank } from "@/content/types";

export const aiAgentsQuiz: QuizBank = {
  rag: [
    {
      q: "O que é RAG?",
      options: [
        "Recuperar documentos relevantes e injetá-los no prompt para o modelo responder com base neles",
        "Treinar um modelo do zero com seus dados",
        "Um tipo de banco de dados relacional",
        "Um protocolo de rede",
      ],
      answer: 0,
      explain: "RAG (retrieval-augmented generation) dá ao modelo contexto externo em tempo de consulta.",
    },
    {
      q: "Qual risco de segurança é típico de RAG?",
      options: [
        "Instruções maliciosas escondidas em documentos recuperados (prompt injection indireta)",
        "O modelo ficar sem memória RAM",
        "Excesso de CPU",
        "Falta de HTTPS no tokenizer",
      ],
      answer: 0,
      explain: "Conteúdo recuperado é entrada não confiável: pode carregar instruções que o modelo obedece.",
    },
    {
      q: "Por que RAG ajuda a reduzir alucinação?",
      options: [
        "Porque ancora a resposta em fontes recuperadas, que podem ser citadas",
        "Porque deixa o modelo maior",
        "Porque desliga a geração",
        "Porque apaga o treinamento",
      ],
      answer: 0,
      explain: "Com trechos reais no contexto, o modelo depende menos de memória paramétrica.",
    },
  ],
  chunking: [
    {
      q: "O que é chunking?",
      options: [
        "Dividir documentos em pedaços que cabem no contexto e preservam sentido",
        "Comprimir o modelo",
        "Remover stop words do prompt",
        "Cifrar o corpus",
      ],
      answer: 0,
      explain: "Pedaços bem definidos são a unidade que será indexada e recuperada.",
    },
    {
      q: "Chunks pequenos demais tendem a...",
      options: [
        "Perder contexto e produzir recuperações sem sentido completo",
        "Aumentar a precisão sempre",
        "Eliminar a necessidade de embeddings",
        "Evitar prompt injection",
      ],
      answer: 0,
      explain: "Frases soltas perdem o que as explica; o equilíbrio é tamanho com coerência.",
    },
    {
      q: "Para que serve a sobreposição (overlap) entre chunks?",
      options: [
        "Evitar que uma informação seja cortada exatamente na fronteira entre dois pedaços",
        "Duplicar o custo",
        "Acelerar a busca",
        "Reduzir o tamanho do índice",
      ],
      answer: 0,
      explain: "A sobreposição preserva continuidade quando o corte cai no meio de uma ideia.",
    },
  ],
  embeddings: [
    {
      q: "O que é um embedding?",
      options: [
        "Um vetor numérico que representa o significado de um texto",
        "Um tipo de prompt",
        "Um log de conversa",
        "Uma chave de API",
      ],
      answer: 0,
      explain: "Textos com sentido parecido ficam próximos no espaço vetorial.",
    },
    {
      q: "Como medir a semelhança entre dois embeddings?",
      options: [
        "Com distância ou similaridade vetorial, como cosseno",
        "Contando letras iguais",
        "Comparando o tamanho dos textos",
        "Com um hash SHA-256",
      ],
      answer: 0,
      explain: "A similaridade de cosseno compara a direção dos vetores.",
    },
    {
      q: "Por que misturar modelos de embedding diferentes no mesmo índice é problema?",
      options: [
        "Os vetores vivem em espaços distintos e não são comparáveis",
        "Fica mais lento por padrão",
        "Aumenta o custo de rede",
        "Impede o uso de chunks",
      ],
      answer: 0,
      explain: "Consulta e documentos precisam ser vetorizados pelo mesmo modelo.",
    },
  ],
  "vector-db": [
    {
      q: "Para que serve um banco vetorial?",
      options: [
        "Buscar rapidamente os vetores mais próximos de uma consulta",
        "Executar transações financeiras",
        "Cifrar mensagens",
        "Servir páginas estáticas",
      ],
      answer: 0,
      explain: "É otimizado para busca por vizinhos mais próximos em muitas dimensões.",
    },
    {
      q: "O que é busca aproximada (ANN)?",
      options: [
        "Trocar um pouco de exatidão por muito ganho de velocidade na busca",
        "Buscar só por palavras exatas",
        "Um erro de configuração",
        "Uma busca sem índice",
      ],
      answer: 0,
      explain: "Índices como HNSW encontram vizinhos muito bons sem comparar com todos os vetores.",
    },
    {
      q: "Qual cuidado de segurança vale para o banco vetorial?",
      options: [
        "Controle de acesso por documento: a busca não deve devolver o que o usuário não pode ver",
        "Nenhum, vetores não vazam dados",
        "Deixar a API pública para facilitar",
        "Guardar a chave no índice",
      ],
      answer: 0,
      explain: "Se o índice mistura documentos de vários donos, a autorização precisa ser aplicada na recuperação.",
    },
  ],
  retrieval: [
    {
      q: "Qual é o objetivo da etapa de retrieval?",
      options: [
        "Escolher os trechos mais relevantes para a pergunta",
        "Gerar a resposta final",
        "Treinar o modelo",
        "Cifrar o índice",
      ],
      answer: 0,
      explain: "A qualidade da resposta depende de o contexto certo chegar ao modelo.",
    },
    {
      q: "O que a busca híbrida combina?",
      options: [
        "Busca vetorial semântica e busca lexical por palavras-chave",
        "Dois modelos de linguagem",
        "Dois bancos de dados SQL",
        "CPU e GPU",
      ],
      answer: 0,
      explain: "A lexical acerta termos exatos e siglas; a vetorial acerta paráfrases.",
    },
    {
      q: "Para que serve o re-ranking?",
      options: [
        "Reordenar os candidatos com um modelo mais preciso antes de entregar ao LLM",
        "Apagar resultados antigos",
        "Aumentar o número de chunks",
        "Traduzir os documentos",
      ],
      answer: 0,
      explain: "Um segundo estágio refina o top-k inicial, que é rápido porém aproximado.",
    },
  ],
  llm: [
    {
      q: "O que um LLM faz fundamentalmente?",
      options: [
        "Prevê o próximo token a partir do contexto",
        "Executa consultas SQL",
        "Verifica fatos automaticamente",
        "Mantém memória permanente entre sessões",
      ],
      answer: 0,
      explain: "Tudo o que parece raciocínio emerge de prever tokens com base no contexto.",
    },
    {
      q: "O que é prompt injection?",
      options: [
        "Entrada que tenta sobrescrever as instruções originais do modelo",
        "Um erro de sintaxe",
        "Um tipo de compressão",
        "Uma técnica de treinamento",
      ],
      answer: 0,
      explain: "Como instruções e dados vão no mesmo canal de texto, o modelo pode obedecer o conteúdo errado.",
    },
    {
      q: "Por que não dá para confiar cegamente na saída do modelo?",
      options: [
        "Porque ele pode alucinar e gerar respostas plausíveis, porém erradas",
        "Porque ele sempre mente",
        "Porque as respostas são cifradas",
        "Porque ele não entende português",
      ],
      answer: 0,
      explain: "A saída precisa de validação, principalmente antes de acionar ferramentas.",
    },
  ],
  "agent-frameworks": [
    {
      q: "O que um framework de agentes oferece?",
      options: [
        "Estrutura para ciclo de raciocínio, ferramentas e memória do agente",
        "Um novo modelo de linguagem",
        "Um banco de dados",
        "Um firewall",
      ],
      answer: 0,
      explain: "Eles organizam o loop observar, decidir e agir em torno do modelo.",
    },
    {
      q: "Qual risco cresce quando o agente tem mais autonomia?",
      options: [
        "Ações indevidas com impacto real, se não houver limites",
        "O prompt ficar curto",
        "A latência cair",
        "O modelo esquecer o alfabeto",
      ],
      answer: 0,
      explain: "Mais autonomia significa mais necessidade de permissões mínimas e aprovação humana em ações sensíveis.",
    },
    {
      q: "Qual boa prática ajuda a conter um agente?",
      options: [
        "Dar a ele apenas as ferramentas e permissões necessárias à tarefa",
        "Dar acesso de admin para evitar erros",
        "Rodar sem logs",
        "Deixar o agente aprovar suas próprias ações",
      ],
      answer: 0,
      explain: "Mesmo princípio do privilégio mínimo, aplicado a ferramentas.",
    },
  ],
  "tool-calling": [
    {
      q: "O que é tool calling?",
      options: [
        "O modelo pedir a execução de uma função com argumentos estruturados, que o sistema executa",
        "O modelo executando código sozinho na GPU",
        "Um tipo de embedding",
        "Uma chamada de telefone",
      ],
      answer: 0,
      explain: "O modelo propõe a chamada; quem executa e decide é o seu código.",
    },
    {
      q: "Por que validar os argumentos que o modelo gera para uma ferramenta?",
      options: [
        "Porque podem estar malformados ou ser resultado de injeção",
        "Porque o modelo nunca erra",
        "Porque a ferramenta cobra por argumento",
        "Porque JSON é proibido",
      ],
      answer: 0,
      explain: "Tratar a saída do modelo como entrada não confiável evita comandos ou consultas perigosas.",
    },
    {
      q: "Qual ação deveria exigir confirmação humana?",
      options: [
        "Enviar e-mails, apagar dados ou fazer pagamentos",
        "Ler a data atual",
        "Somar dois números",
        "Formatar um texto",
      ],
      answer: 0,
      explain: "Ações irreversíveis ou com efeito externo merecem um passo de aprovação.",
    },
  ],
  orchestration: [
    {
      q: "O que a orquestração coordena?",
      options: [
        "Vários agentes ou passos, definindo ordem, paralelismo e passagem de contexto",
        "Somente o treinamento do modelo",
        "A impressão de relatórios",
        "A compressão de imagens",
      ],
      answer: 0,
      explain: "Ela decide quem faz o quê e em que sequência num fluxo multi-agente.",
    },
    {
      q: "Qual é um risco em sistemas multi-agente?",
      options: [
        "Um agente comprometido contaminar os outros com instruções ou dados",
        "Falta de tokens",
        "O fluxo ficar rápido demais",
        "Ter muitos comentários no código",
      ],
      answer: 0,
      explain: "A saída de um agente é entrada do próximo; a confiança não deve ser transitiva.",
    },
    {
      q: "Por que limitar o número de iterações de um agente?",
      options: [
        "Para evitar laços infinitos e custo descontrolado",
        "Para deixar o modelo mais criativo",
        "Para aumentar o contexto",
        "Para desligar os logs",
      ],
      answer: 0,
      explain: "Limites de passos, tempo e custo são freios básicos de segurança.",
    },
  ],
  mcp: [
    {
      q: "O que é o MCP (Model Context Protocol)?",
      options: [
        "Um protocolo aberto para conectar modelos a ferramentas e fontes de dados de forma padronizada",
        "Um novo modelo de linguagem",
        "Um formato de imagem",
        "Um tipo de GPU",
      ],
      answer: 0,
      explain: "Um servidor MCP expõe ferramentas e recursos que qualquer cliente compatível pode usar.",
    },
    {
      q: "Qual é um risco ao instalar um servidor MCP de terceiros?",
      options: [
        "Ele pode expor ferramentas maliciosas ou excessivamente poderosas ao agente",
        "Nenhum, são sempre seguros",
        "Aumenta o tamanho do modelo",
        "Impede o uso de HTTPS",
      ],
      answer: 0,
      explain: "Tratar servidores MCP como código de terceiros: revisar, restringir e isolar.",
    },
    {
      q: "Qual cuidado vale para as descrições de ferramentas MCP?",
      options: [
        "Podem conter instruções ocultas que manipulam o modelo (tool poisoning)",
        "São sempre inofensivas",
        "Não são lidas pelo modelo",
        "São cifradas",
      ],
      answer: 0,
      explain: "O modelo lê as descrições; um texto malicioso ali é uma forma de prompt injection.",
    },
  ],
  evals: [
    {
      q: "Para que servem evals?",
      options: [
        "Medir a qualidade do sistema de IA com casos de teste repetíveis",
        "Treinar o modelo",
        "Cifrar prompts",
        "Reduzir o contexto",
      ],
      answer: 0,
      explain: "Sem evals, cada mudança de prompt ou modelo é um chute.",
    },
    {
      q: "Por que usar dados reais de produção nos evals?",
      options: [
        "Porque refletem como os usuários realmente usam o sistema",
        "Porque são mais baratos",
        "Porque dispensam revisão",
        "Porque o modelo exige",
      ],
      answer: 0,
      explain: "Casos sintéticos perdem a distribuição real; os reais mostram onde o sistema falha de verdade.",
    },
    {
      q: "Qual o problema de avaliar só a resposta final?",
      options: [
        "Você não sabe se a falha veio da recuperação, do prompt ou do modelo",
        "Fica caro demais",
        "A resposta final não existe",
        "Não é possível medir nada",
      ],
      answer: 0,
      explain: "Avaliar cada etapa (retrieval, geração, ferramentas) localiza a causa.",
    },
  ],
  benchmarks: [
    {
      q: "O que é um benchmark público?",
      options: [
        "Um conjunto padronizado de tarefas para comparar modelos",
        "Um tipo de prompt",
        "Um log de produção",
        "Uma licença",
      ],
      answer: 0,
      explain: "Permite comparações entre modelos usando as mesmas provas.",
    },
    {
      q: "Qual a limitação de confiar só em benchmarks públicos?",
      options: [
        "Podem não refletir o seu caso de uso, e os dados podem ter vazado para o treino",
        "São sempre falsos",
        "São pagos",
        "Não rodam em computadores",
      ],
      answer: 0,
      explain: "Contaminação e distância do seu domínio reduzem o valor do número isolado.",
    },
    {
      q: "Para que benchmarks servem melhor?",
      options: [
        "Como triagem inicial de candidatos, antes de avaliar no seu próprio conjunto",
        "Como prova final de qualidade em produção",
        "Para substituir evals",
        "Para treinar o modelo",
      ],
      answer: 0,
      explain: "O benchmark estreita a lista; as suas evals decidem.",
    },
  ],
  "llm-as-judge": [
    {
      q: "O que é LLM-as-judge?",
      options: [
        "Usar um modelo para avaliar saídas de outro seguindo uma rubrica",
        "Um tribunal para modelos",
        "Treinar um modelo para ser juiz humano",
        "Um benchmark de direito",
      ],
      answer: 0,
      explain: "Automatiza a nota onde revisão humana seria cara demais.",
    },
    {
      q: "Qual viés é comum em juízes baseados em LLM?",
      options: [
        "Preferir respostas mais longas ou do próprio estilo",
        "Preferir respostas curtas sempre",
        "Dar sempre nota zero",
        "Ignorar a rubrica por completo",
      ],
      answer: 0,
      explain: "Viés de verbosidade e de autopreferência exigem calibração.",
    },
    {
      q: "Como aumentar a confiança num juiz automático?",
      options: [
        "Calibrar contra uma amostra avaliada por humanos e usar rubricas claras",
        "Usar o mesmo modelo para gerar e avaliar sem revisão",
        "Desativar a rubrica",
        "Aumentar a temperatura",
      ],
      answer: 0,
      explain: "A concordância com humanos é o que valida o juiz.",
    },
  ],
  "regression-evals": [
    {
      q: "O que são regression evals?",
      options: [
        "Um conjunto fixo de casos que roda a cada mudança para detectar piora",
        "Evals que só rodam uma vez",
        "Um tipo de regressão linear",
        "Testes de interface",
      ],
      answer: 0,
      explain: "Protegem o baseline: mudar prompt, modelo ou índice não pode quebrar o que já funcionava.",
    },
    {
      q: "Onde regression evals se encaixam no fluxo?",
      options: [
        "No PR, como gate de CI, antes de a mudança ir para produção",
        "Somente depois do incidente",
        "No treino do modelo",
        "Fora do repositório",
      ],
      answer: 0,
      explain: "Rodar no PR dá feedback antes de a mudança alcançar usuários.",
    },
    {
      q: "Por que incluir casos de falhas passadas?",
      options: [
        "Para garantir que o mesmo erro não volte",
        "Para aumentar o tempo de execução",
        "Porque o modelo exige",
        "Para esconder o histórico",
      ],
      answer: 0,
      explain: "Cada incidente vira um teste, e o conjunto cresce com a experiência.",
    },
  ],
  guardrails: [
    {
      q: "Qual o papel dos guardrails?",
      options: [
        "Filtrar e restringir entradas e saídas para manter o sistema dentro de limites seguros",
        "Aumentar a criatividade do modelo",
        "Substituir o prompt",
        "Comprimir o contexto",
      ],
      answer: 0,
      explain: "São camadas de proteção antes e depois do modelo.",
    },
    {
      q: "Por que guardrails sozinhos não bastam?",
      options: [
        "Podem ser contornados, então devem somar-se a permissões mínimas e isolamento",
        "Porque são sempre perfeitos",
        "Porque o modelo os ignora sempre",
        "Porque deixam tudo mais lento",
      ],
      answer: 0,
      explain: "Defesa em profundidade: o filtro é uma camada, não a única barreira.",
    },
    {
      q: "Qual exemplo é um guardrail de saída?",
      options: [
        "Detectar e mascarar dados pessoais na resposta antes de entregá-la",
        "Aumentar o tamanho do contexto",
        "Trocar o modelo",
        "Reindexar os documentos",
      ],
      answer: 0,
      explain: "A checagem de saída impede vazamento mesmo quando o modelo erra.",
    },
  ],
};
