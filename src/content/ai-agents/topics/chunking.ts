import type { Topic } from "@/content/types";

export const chunking: Topic = {
  domain: "ai-agents",
  slug: "chunking",
  title: "Chunking",
  short: "cortar o documento em pedaços recuperáveis",
  tagline:
    "Chunking é a primeira decisão técnica de RAG: o tamanho, a sobreposição e a estratégia de corte determinam o que o retrieval consegue encontrar depois. Pedaços ruins viram respostas sem contexto.",
  kind: "tecnica",
  stage: "ingest",
  tools: ["LangChain", "LlamaIndex", "Unstructured", "spaCy"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Chunking é o processo de dividir um documento em pedaços menores que serão indexados e recuperados. O tamanho do pedaço não é detalhe: ele define o que cabe na janela do modelo, qual é a unidade de busca, e qual é a granularidade da citação que aparece na resposta.",
        "Em quase toda arquitetura RAG, chunking acontece uma vez na ingestão e nunca mais. O pipeline padrão lê o documento, aplica um splitter, gera um embedding por bloco, e segue. Se o corte foi mal pensado, o índice inteiro carrega o problema até alguém refazer a indexação.",
      ],
    },
    {
      heading: "Tamanho e overlap",
      body: [
        "A pergunta mais comum é 'qual o tamanho certo?'. A resposta honesta é 'depende'. Para perguntas curtas e respostas factuais, blocos menores funcionam melhor: cada bloco carrega uma ideia só, então o retrieval traz o trecho exato. Para perguntas que exigem raciocínio entre parágrafos, blocos maiores preservam contexto, e blocos pequenos demais quebram o argumento no meio.",
        "Sobreposição (overlap) é o segundo parâmetro. Sem sobreposição, uma ideia que começa no fim de um bloco e continua no começo do próximo fica órfã: nenhum dos dois blocos tem o sentido completo. Com sobreposição de 10 a 20% do tamanho do bloco, o início do próximo repete o fim do anterior, então a fronteira nunca corta uma frase no meio.",
      ],
      code: [
        {
          language: "text",
          filename: "Parâmetros típicos",
          code: "  tamanho do bloco      200 a 1000 tokens\n  overlap               10% a 20% do bloco\n  regra prática         bloco ~512 tokens, overlap ~50\n\n  bloco pequeno  -> citação precisa, contexto curto\n  bloco grande   -> raciocínio longo, citação ruidosa",
        },
      ],
    },
    {
      heading: "Estratégias de corte",
      body: [
        "Três famílias dominam a prática. A primeira é corte por caracteres ou tokens, simples e previsível, e que funciona quando o documento é prosa limpa. A segunda é corte recursivo por separadores, que tenta quebrar primeiro por parágrafo, depois por frase, depois por palavra, e só por caractere em último caso. Preserva a estrutura do texto sem precisar de modelo. A terceira é corte semântico, que agrupa frases por similaridade e só corta quando a próxima frase tem baixa relação com a anterior. Custa mais e usa embeddings, mas produz blocos coerentes.",
        "Tem ainda o corte por estrutura: títulos, seções, células de tabela, parágrafos de código. Em documentos com marcação clara (Markdown, HTML, docx convertido), separar por estrutura e manter a hierarquia no metadata dá chunks mais úteis do que qualquer splitter genérico.",
      ],
    },
    {
      heading: "Na prática",
      body: [
        "O LangChain oferece o splitter recursivo pronto. O exemplo configura tamanho e overlap e aplica em um texto qualquer. Para texto em português, vale separar por parágrafo, frase e palavra, nessa sequência.",
      ],
      code: [
        {
          language: "python",
          filename: "chunking/splitter.py",
          code: "from langchain_text_splitters import RecursiveCharacterTextSplitter\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=512,\n    chunk_overlap=50,\n    separators=[\n        \"\\n\\n\",     # parágrafo\n        \"\\n\",       # linha\n        \"(?<=[.!?])\\\\s+\",  # fim de frase em PT-BR (lookbehind)\n        \" \",        # palavra\n        \"\",         # caractere (último caso)\n    ],\n    length_function=len,\n    is_separator_regex=True,\n)\n\nwith open(\"manual.txt\", encoding=\"utf-8\") as f:\n    texto = f.read()\n\nblocos = splitter.split_text(texto)\nfor i, bloco in enumerate(blocos):\n    print(f\"#{i:03d}  {len(bloco)} chars  {bloco[:60].replace(chr(10), ' ')}...\")",
        },
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "estabilidade: chunking determinístico produz os mesmos blocos para o mesmo documento, então o índice se mantém reproduzível",
        "controle de granularidade: ajustar tamanho e overlap é uma alavanca direta na qualidade do retrieval",
        "compatibilidade: quase todo framework (LangChain, LlamaIndex, Haystack) traz splitter pronto, então a barreira de entrada é baixa",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "cegueira semântica: splitter recursivo corta por separador, não por sentido; uma ideia que cruza a fronteira some",
        "estrutura perdida: separar por caractere ignora títulos, listas e tabelas; em documentos mistos, é melhor splitter específico por tipo",
        "custo de reindexação: trocar a estratégia de chunking obriga reindexar tudo; em bases grandes, isso vira migração",
      ],
    },
  ],
};