import type { QuizBank } from "@/content/types";

export const aiAgentsQuiz: QuizBank = {
  "rag": [
    {
      "q": "O que é RAG?",
      "options": [
        "Recuperar documentos relevantes e injetá-los no prompt para o modelo responder com base neles",
        "Treinar um modelo do zero com os seus próprios dados internos",
        "Um tipo de banco de dados relacional otimizado para texto",
        "Um protocolo de rede para o modelo falar com outros serviços"
      ],
      "answer": 0,
      "explain": "RAG (retrieval-augmented generation) dá ao modelo contexto externo em tempo de consulta."
    },
    {
      "q": "Qual risco de segurança é típico de RAG?",
      "options": [
        "Instruções maliciosas escondidas em documentos recuperados (prompt injection indireta)",
        "O modelo ficar sem memória RAM ao carregar os documentos",
        "Um excesso de uso de CPU durante a busca nos documentos",
        "A falta de HTTPS no tokenizer que prepara o texto"
      ],
      "answer": 0,
      "explain": "Conteúdo recuperado é entrada não confiável: pode carregar instruções que o modelo obedece."
    },
    {
      "q": "Por que RAG ajuda a reduzir alucinação?",
      "options": [
        "Porque ancora a resposta em fontes recuperadas, que podem ser citadas",
        "Porque deixa o modelo maior e mais capaz de lembrar fatos",
        "Porque desliga a geração de texto e só devolve documentos",
        "Porque apaga o treinamento original do modelo"
      ],
      "answer": 0,
      "explain": "Com trechos reais no contexto, o modelo depende menos de memória paramétrica."
    }
  ],
  "chunking": [
    {
      "q": "O que é chunking?",
      "options": [
        "Dividir documentos em pedaços que cabem no contexto e preservam sentido",
        "Comprimir o modelo para ele caber em uma máquina menor",
        "Remover as stop words do prompt para economizar tokens",
        "Cifrar o corpus antes de enviá-lo ao índice"
      ],
      "answer": 0,
      "explain": "Pedaços bem definidos são a unidade que será indexada e recuperada."
    },
    {
      "q": "Chunks pequenos demais tendem a...",
      "options": [
        "Perder contexto e produzir recuperações sem sentido completo",
        "Aumentar sempre a precisão, porque cada pedaço fica mais específico",
        "Eliminar a necessidade de usar embeddings na busca",
        "Evitar prompt injection, já que o texto fica fragmentado"
      ],
      "answer": 0,
      "explain": "Frases soltas perdem o que as explica; o equilíbrio é tamanho com coerência."
    },
    {
      "q": "Para que serve a sobreposição (overlap) entre chunks?",
      "options": [
        "Evitar que uma informação seja cortada exatamente na fronteira entre dois pedaços",
        "Duplicar o custo do índice sem trazer nenhum benefício",
        "Acelerar a busca, porque há menos pedaços para comparar",
        "Reduzir o tamanho do índice ao compartilhar o texto repetido"
      ],
      "answer": 0,
      "explain": "A sobreposição preserva continuidade quando o corte cai no meio de uma ideia."
    }
  ],
  "embeddings": [
    {
      "q": "O que é um embedding?",
      "options": [
        "Um vetor numérico que representa o significado de um texto",
        "Um tipo de prompt especial que guia o estilo da resposta",
        "O log de uma conversa guardado para análise posterior",
        "Uma chave de API usada para acessar o modelo"
      ],
      "answer": 0,
      "explain": "Textos com sentido parecido ficam próximos no espaço vetorial."
    },
    {
      "q": "Como medir a semelhança entre dois embeddings?",
      "options": [
        "Com distância ou similaridade vetorial, como cosseno",
        "Contando quantas letras iguais os dois textos têm em comum",
        "Comparando o tamanho dos dois textos em caracteres",
        "Calculando o hash SHA-256 de cada texto e comparando"
      ],
      "answer": 0,
      "explain": "A similaridade de cosseno compara a direção dos vetores."
    },
    {
      "q": "Por que misturar modelos de embedding diferentes no mesmo índice é problema?",
      "options": [
        "Os vetores vivem em espaços distintos e não são comparáveis",
        "Fica mais lento por padrão, porque cada consulta usa dois modelos",
        "Aumenta o custo de rede ao trafegar vetores maiores",
        "Impede o uso de chunks de tamanhos diferentes"
      ],
      "answer": 0,
      "explain": "Consulta e documentos precisam ser vetorizados pelo mesmo modelo."
    }
  ],
  "vector-db": [
    {
      "q": "Para que serve um banco vetorial?",
      "options": [
        "Buscar rapidamente os vetores mais próximos de uma consulta",
        "Executar transações financeiras com garantias fortes de consistência",
        "Cifrar mensagens de ponta a ponta entre os usuários",
        "Servir páginas estáticas com baixa latência"
      ],
      "answer": 0,
      "explain": "É otimizado para busca por vizinhos mais próximos em muitas dimensões."
    },
    {
      "q": "O que é busca aproximada (ANN)?",
      "options": [
        "Trocar um pouco de exatidão por muito ganho de velocidade na busca",
        "Buscar apenas por palavras exatas, sem nenhuma aproximação",
        "Um erro de configuração que faz a busca devolver resultados vazios",
        "Uma busca feita sem nenhum índice, comparando tudo com tudo"
      ],
      "answer": 0,
      "explain": "Índices como HNSW encontram vizinhos muito bons sem comparar com todos os vetores."
    },
    {
      "q": "Qual cuidado de segurança vale para o banco vetorial?",
      "options": [
        "Controle de acesso por documento: a busca não deve devolver o que o usuário não pode ver",
        "Nenhum, porque vetores não conseguem vazar dados dos documentos",
        "Deixar a API pública para facilitar o uso pelas aplicações",
        "Guardar a chave de acesso dentro do próprio índice"
      ],
      "answer": 0,
      "explain": "Se o índice mistura documentos de vários donos, a autorização precisa ser aplicada na recuperação."
    }
  ],
  "retrieval": [
    {
      "q": "Qual é o objetivo da etapa de retrieval?",
      "options": [
        "Escolher os trechos mais relevantes para a pergunta",
        "Gerar a resposta final em linguagem natural para o usuário",
        "Treinar o modelo com os documentos mais usados",
        "Cifrar o índice para proteger o conteúdo recuperado"
      ],
      "answer": 0,
      "explain": "A qualidade da resposta depende de o contexto certo chegar ao modelo."
    },
    {
      "q": "O que a busca híbrida combina?",
      "options": [
        "Busca vetorial semântica e busca lexical por palavras-chave",
        "Dois modelos de linguagem, um para gerar e outro para revisar",
        "Dois bancos de dados SQL replicados entre regiões",
        "CPU e GPU, para acelerar o cálculo dos vetores"
      ],
      "answer": 0,
      "explain": "A lexical acerta termos exatos e siglas; a vetorial acerta paráfrases."
    },
    {
      "q": "Para que serve o re-ranking?",
      "options": [
        "Reordenar os candidatos com um modelo mais preciso antes de entregar ao LLM",
        "Apagar os resultados antigos do índice para economizar espaço",
        "Aumentar o número de chunks devolvidos para cada consulta",
        "Traduzir os documentos para o idioma da pergunta"
      ],
      "answer": 0,
      "explain": "Um segundo estágio refina o top-k inicial, que é rápido porém aproximado."
    }
  ],
  "llm": [
    {
      "q": "O que um LLM faz fundamentalmente?",
      "options": [
        "Prevê o próximo token a partir do contexto",
        "Executa consultas SQL diretamente sobre os dados da empresa",
        "Verifica automaticamente se cada fato da resposta é verdadeiro",
        "Mantém uma memória permanente das conversas entre as sessões"
      ],
      "answer": 0,
      "explain": "Tudo o que parece raciocínio emerge de prever tokens com base no contexto."
    },
    {
      "q": "O que é prompt injection?",
      "options": [
        "Entrada que tenta sobrescrever as instruções originais do modelo",
        "Um erro de sintaxe que aparece quando o prompt é mal montado",
        "Um tipo de compressão aplicado ao contexto do modelo",
        "Uma técnica de treinamento para melhorar o desempenho"
      ],
      "answer": 0,
      "explain": "Como instruções e dados vão no mesmo canal de texto, o modelo pode obedecer o conteúdo errado."
    },
    {
      "q": "Por que não dá para confiar cegamente na saída do modelo?",
      "options": [
        "Porque ele pode alucinar e gerar respostas plausíveis, porém erradas",
        "Porque ele sempre mente de propósito para enganar o usuário",
        "Porque as respostas são cifradas e só ele consegue lê-las",
        "Porque ele não entende bem o idioma português"
      ],
      "answer": 0,
      "explain": "A saída precisa de validação, principalmente antes de acionar ferramentas."
    }
  ],
  "agent-frameworks": [
    {
      "q": "O que um framework de agentes oferece?",
      "options": [
        "Estrutura para ciclo de raciocínio, ferramentas e memória do agente",
        "Um novo modelo de linguagem treinado para tarefas de agente",
        "Um banco de dados otimizado para guardar o estado do agente",
        "Um firewall que filtra as chamadas feitas pelo agente"
      ],
      "answer": 0,
      "explain": "Eles organizam o loop observar, decidir e agir em torno do modelo."
    },
    {
      "q": "Qual risco cresce quando o agente tem mais autonomia?",
      "options": [
        "Ações indevidas com impacto real, se não houver limites",
        "O prompt ficar curto demais para o modelo entender a tarefa",
        "A latência das respostas cair a cada nova decisão do agente",
        "O modelo esquecer partes do alfabeto ao escrever respostas longas"
      ],
      "answer": 0,
      "explain": "Mais autonomia significa mais necessidade de permissões mínimas e aprovação humana em ações sensíveis."
    },
    {
      "q": "Qual boa prática ajuda a conter um agente?",
      "options": [
        "Dar a ele apenas as ferramentas e permissões necessárias à tarefa",
        "Dar acesso de administrador para evitar que o agente erre",
        "Rodar o agente sem logs, para não registrar dados sensíveis",
        "Deixar o agente aprovar as suas próprias ações arriscadas"
      ],
      "answer": 0,
      "explain": "Mesmo princípio do privilégio mínimo, aplicado a ferramentas."
    }
  ],
  "tool-calling": [
    {
      "q": "O que é tool calling?",
      "options": [
        "O modelo pedir a execução de uma função com argumentos estruturados, que o sistema executa",
        "O modelo executando código sozinho na GPU do servidor",
        "Um tipo de embedding usado para buscar funções semelhantes",
        "Uma chamada de telefone feita pelo modelo ao usuário"
      ],
      "answer": 0,
      "explain": "O modelo propõe a chamada; quem executa e decide é o seu código."
    },
    {
      "q": "Por que validar os argumentos que o modelo gera para uma ferramenta?",
      "options": [
        "Porque podem estar malformados ou ser resultado de injeção",
        "Porque o modelo nunca erra ao montar os argumentos",
        "Porque a ferramenta cobra por cada argumento recebido",
        "Porque o formato JSON é proibido em chamadas de ferramentas"
      ],
      "answer": 0,
      "explain": "Tratar a saída do modelo como entrada não confiável evita comandos ou consultas perigosas."
    },
    {
      "q": "Qual ação deveria exigir confirmação humana?",
      "options": [
        "Enviar e-mails, apagar dados ou fazer pagamentos",
        "Ler a data atual do sistema para responder ao usuário",
        "Somar dois números informados na conversa",
        "Formatar um texto de acordo com um modelo"
      ],
      "answer": 0,
      "explain": "Ações irreversíveis ou com efeito externo merecem um passo de aprovação."
    }
  ],
  "orchestration": [
    {
      "q": "O que a orquestração coordena?",
      "options": [
        "Vários agentes ou passos, definindo ordem, paralelismo e passagem de contexto",
        "Somente o treinamento do modelo e o ajuste dos seus pesos",
        "A impressão de relatórios gerados pelo agente",
        "A compressão de imagens enviadas para o modelo"
      ],
      "answer": 0,
      "explain": "Ela decide quem faz o quê e em que sequência num fluxo multi-agente."
    },
    {
      "q": "Qual é um risco em sistemas multi-agente?",
      "options": [
        "Um agente comprometido contaminar os outros com instruções ou dados",
        "A falta de tokens disponíveis no plano contratado",
        "O fluxo ficar rápido demais para os usuários acompanharem",
        "Ter muitos comentários no código da orquestração"
      ],
      "answer": 0,
      "explain": "A saída de um agente é entrada do próximo; a confiança não deve ser transitiva."
    },
    {
      "q": "Por que limitar o número de iterações de um agente?",
      "options": [
        "Para evitar laços infinitos e custo descontrolado",
        "Para deixar o modelo mais criativo a cada tentativa",
        "Para aumentar o tamanho do contexto disponível",
        "Para desligar os logs depois de algumas rodadas"
      ],
      "answer": 0,
      "explain": "Limites de passos, tempo e custo são freios básicos de segurança."
    }
  ],
  "mcp": [
    {
      "q": "O que é o MCP (Model Context Protocol)?",
      "options": [
        "Um protocolo aberto para conectar modelos a ferramentas e fontes de dados de forma padronizada",
        "Um novo modelo de linguagem treinado para usar ferramentas",
        "Um formato de imagem para enviar capturas de tela ao modelo",
        "Um tipo de GPU feito para executar agentes"
      ],
      "answer": 0,
      "explain": "Um servidor MCP expõe ferramentas e recursos que qualquer cliente compatível pode usar."
    },
    {
      "q": "Qual é um risco ao instalar um servidor MCP de terceiros?",
      "options": [
        "Ele pode expor ferramentas maliciosas ou excessivamente poderosas ao agente",
        "Nenhum, porque servidores de terceiros são sempre seguros",
        "Aumentar o tamanho do modelo que está em uso",
        "Impedir o uso de HTTPS nas outras conexões do agente"
      ],
      "answer": 0,
      "explain": "Tratar servidores MCP como código de terceiros: revisar, restringir e isolar."
    },
    {
      "q": "Qual cuidado vale para as descrições de ferramentas MCP?",
      "options": [
        "Podem conter instruções ocultas que manipulam o modelo (tool poisoning)",
        "São sempre inofensivas, porque só descrevem a ferramenta",
        "Não são lidas pelo modelo, só pela interface do usuário",
        "São cifradas e só o servidor consegue lê-las"
      ],
      "answer": 0,
      "explain": "O modelo lê as descrições; um texto malicioso ali é uma forma de prompt injection."
    }
  ],
  "evals": [
    {
      "q": "Para que servem evals?",
      "options": [
        "Medir a qualidade do sistema de IA com casos de teste repetíveis",
        "Treinar o modelo com os casos de teste que falharam",
        "Cifrar os prompts enviados ao modelo",
        "Reduzir o tamanho do contexto a cada rodada"
      ],
      "answer": 0,
      "explain": "Sem evals, cada mudança de prompt ou modelo é um chute."
    },
    {
      "q": "Por que usar dados reais de produção nos evals?",
      "options": [
        "Porque refletem como os usuários realmente usam o sistema",
        "Porque são mais baratos do que criar casos de teste sintéticos",
        "Porque dispensam qualquer revisão humana dos resultados",
        "Porque o modelo exige dados reais para funcionar"
      ],
      "answer": 0,
      "explain": "Casos sintéticos perdem a distribuição real; os reais mostram onde o sistema falha de verdade."
    },
    {
      "q": "Qual o problema de avaliar só a resposta final?",
      "options": [
        "Você não sabe se a falha veio da recuperação, do prompt ou do modelo",
        "Fica caro demais para rodar a cada mudança",
        "A resposta final pode simplesmente não existir",
        "Não é possível medir nada sem olhar as etapas internas"
      ],
      "answer": 0,
      "explain": "Avaliar cada etapa (retrieval, geração, ferramentas) localiza a causa."
    }
  ],
  "benchmarks": [
    {
      "q": "O que é um benchmark público?",
      "options": [
        "Um conjunto padronizado de tarefas para comparar modelos",
        "Um tipo de prompt reutilizado em vários modelos",
        "Um log de produção usado para auditar os custos",
        "Uma licença que define como o modelo pode ser usado"
      ],
      "answer": 0,
      "explain": "Permite comparações entre modelos usando as mesmas provas."
    },
    {
      "q": "Qual a limitação de confiar só em benchmarks públicos?",
      "options": [
        "Podem não refletir o seu caso de uso, e os dados podem ter vazado para o treino",
        "São sempre falsos, porque os fornecedores manipulam os resultados",
        "São pagos e só estão disponíveis para grandes empresas",
        "Não rodam em computadores comuns, só em servidores dedicados"
      ],
      "answer": 0,
      "explain": "Contaminação e distância do seu domínio reduzem o valor do número isolado."
    },
    {
      "q": "Para que benchmarks servem melhor?",
      "options": [
        "Como triagem inicial de candidatos, antes de avaliar no seu próprio conjunto",
        "Como prova final da qualidade do sistema em produção",
        "Para substituir completamente os evals do projeto",
        "Para treinar o modelo com os casos mais difíceis"
      ],
      "answer": 0,
      "explain": "O benchmark estreita a lista; as suas evals decidem."
    }
  ],
  "llm-as-judge": [
    {
      "q": "O que é LLM-as-judge?",
      "options": [
        "Usar um modelo para avaliar saídas de outro seguindo uma rubrica",
        "Um tribunal formado por modelos que decidem disputas jurídicas",
        "Treinar um modelo para imitar um juiz humano de um concurso",
        "Um benchmark criado com questões de direito"
      ],
      "answer": 0,
      "explain": "Automatiza a nota onde revisão humana seria cara demais."
    },
    {
      "q": "Qual viés é comum em juízes baseados em LLM?",
      "options": [
        "Preferir respostas mais longas ou do próprio estilo",
        "Preferir sempre as respostas mais curtas, por serem objetivas",
        "Dar sempre nota zero para respostas de outros modelos",
        "Ignorar por completo a rubrica recebida"
      ],
      "answer": 0,
      "explain": "Viés de verbosidade e de autopreferência exigem calibração."
    },
    {
      "q": "Como aumentar a confiança num juiz automático?",
      "options": [
        "Calibrar contra uma amostra avaliada por humanos e usar rubricas claras",
        "Usar o mesmo modelo para gerar e avaliar, sem nenhuma revisão",
        "Desativar a rubrica para o juiz ter mais liberdade",
        "Aumentar a temperatura para deixar as notas mais variadas"
      ],
      "answer": 0,
      "explain": "A concordância com humanos é o que valida o juiz."
    }
  ],
  "regression-evals": [
    {
      "q": "O que são regression evals?",
      "options": [
        "Um conjunto fixo de casos que roda a cada mudança para detectar piora",
        "Evals que só rodam uma vez, quando o projeto começa",
        "Um tipo de regressão linear aplicada às respostas",
        "Testes de interface que verificam botões e telas"
      ],
      "answer": 0,
      "explain": "Protegem o baseline: mudar prompt, modelo ou índice não pode quebrar o que já funcionava."
    },
    {
      "q": "Onde regression evals se encaixam no fluxo?",
      "options": [
        "No PR, como gate de CI, antes de a mudança ir para produção",
        "Somente depois do incidente, para investigar o que quebrou",
        "No treino do modelo, antes de ele ser publicado",
        "Fora do repositório, em uma planilha da equipe"
      ],
      "answer": 0,
      "explain": "Rodar no PR dá feedback antes de a mudança alcançar usuários."
    },
    {
      "q": "Por que incluir casos de falhas passadas?",
      "options": [
        "Para garantir que o mesmo erro não volte",
        "Para aumentar o tempo de execução dos testes",
        "Porque o modelo exige esses casos para funcionar",
        "Para esconder o histórico de falhas dos clientes"
      ],
      "answer": 0,
      "explain": "Cada incidente vira um teste, e o conjunto cresce com a experiência."
    }
  ],
  "guardrails": [
    {
      "q": "Qual o papel dos guardrails?",
      "options": [
        "Filtrar e restringir entradas e saídas para manter o sistema dentro de limites seguros",
        "Aumentar a criatividade do modelo nas respostas",
        "Substituir o prompt do sistema por regras fixas",
        "Comprimir o contexto para caber mais informação"
      ],
      "answer": 0,
      "explain": "São camadas de proteção antes e depois do modelo."
    },
    {
      "q": "Por que guardrails sozinhos não bastam?",
      "options": [
        "Podem ser contornados, então devem somar-se a permissões mínimas e isolamento",
        "Porque são sempre perfeitos e dispensam outros controles",
        "Porque o modelo sempre os ignora, sem exceção",
        "Porque deixam tudo mais lento e ninguém os usa"
      ],
      "answer": 0,
      "explain": "Defesa em profundidade: o filtro é uma camada, não a única barreira."
    },
    {
      "q": "Qual exemplo é um guardrail de saída?",
      "options": [
        "Detectar e mascarar dados pessoais na resposta antes de entregá-la",
        "Aumentar o tamanho do contexto disponível ao modelo",
        "Trocar o modelo por outro mais barato",
        "Reindexar os documentos que alimentam a busca"
      ],
      "answer": 0,
      "explain": "A checagem de saída impede vazamento mesmo quando o modelo erra."
    }
  ]
};
