import type { Topic } from "@/content/types";

export const toolCalling: Topic = {
  domain: "ai-agents",
  slug: "tool-calling",
  title: "Tool calling",
  short: "o modelo invoca funções externas tipadas",
  tagline:
    "Tool calling é o contrato entre o LLM e o mundo: o modelo devolve JSON estruturado (nome + argumentos), o runtime valida contra schema e executa. É o que transforma texto em ação.",
  kind: "tecnica",
  stage: "act",
  tools: ["OpenAI Function Calling", "Anthropic Tool Use", "JSON Schema", "Pydantic"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Tool calling (também chamado de function calling) é a interface pela qual um LLM devolve, em vez de (ou além de) texto, uma chamada de função estruturada: nome da ferramenta + argumentos em JSON. O runtime recebe, valida os argumentos contra um schema, executa e devolve o resultado ao contexto.",
        "O modelo nunca executa nada por conta própria. Ele só propõe — 'eu chamaria get_weather com { city: 'São Paulo' }'. A execução, autorização, retry e auditoria ficam com o runtime. Esquecer quem executa é o erro mais caro que aparece em produção.",
      ],
    },
    {
      heading: "O schema JSON: o contrato",
      body: [
        "Cada ferramenta é declarada para o modelo por um schema JSON com nome, descrição e parâmetros tipados. O LLM usa esse schema como gramática: ele sabe o nome, sabe o formato dos argumentos e usa a descrição para decidir quando faz sentido chamar.",
        "A descrição é a parte mais negligenciada. O LLM não lê código: ele lê a string. 'Obtém o clima de uma cidade' é melhor que 'get_weather', porque o modelo decide quando chamar baseado em prosa. Schemas com descrições ruins levam o modelo a chamar a ferramenta na hora errada, ou a não chamá-la.",
      ],
      code: [
        {
          language: "json",
          filename: "schema da ferramenta get_weather",
          code: "{\n  \"name\": \"get_weather\",\n  \"description\": \"Obtém a temperatura atual e a previsão para os próximos 3 dias em uma cidade.\",\n  \"parameters\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"city\": {\n        \"type\": \"string\",\n        \"description\": \"Nome da cidade, em português ou inglês (ex: 'São Paulo', 'Lisbon').\"\n      },\n      \"unit\": {\n        \"type\": \"string\",\n        \"enum\": [\"celsius\", \"fahrenheit\"],\n        \"default\": \"celsius\"\n      }\n    },\n    \"required\": [\"city\"]\n  }\n}",
        },
      ],
    },
    {
      heading: "Validação de argumentos: a sua responsabilidade",
      body: [
        "Quando o modelo devolve uma chamada de função, o runtime recebe um JSON que pode estar errado: tipo errado, campo faltando, valor fora do enum, string onde devia ser número. Validar antes de executar é não-negociável — é a fronteira entre o modelo, que propõe, e o seu código, que executa com permissões reais.",
        "Em Python, Pydantic é o caminho padrão: declare um modelo, chame model_validate(model_dump), e o Pydantic levanta ValidationError com a lista exata de campos e o motivo. Em TypeScript, o par natural é Zod, com safeParse retornando { success, data, error }.",
      ],
      code: [
        {
          language: "python",
          filename: "validacao.py",
          code: "from pydantic import BaseModel, Field, ValidationError\n\n\nclass GetWeatherArgs(BaseModel):\n    city: str = Field(..., min_length=1)\n    unit: str = Field(\"celsius\", pattern=r\"^(celsius|fahrenheit)$\")\n\n\ndef call_tool(name: str, raw_args: dict):\n    if name != \"get_weather\":\n        raise ValueError(f\"ferramenta desconhecida: {name}\")\n    try:\n        args = GetWeatherArgs.model_validate(raw_args)\n    except ValidationError as e:\n        return {\"error\": \"invalid_args\", \"details\": e.errors()}\n    return fetch_weather(args.city, args.unit)",
        },
      ],
    },
    {
      heading: "O fluxo completo, fim a fim",
      body: [
        "A chamada de ferramenta atravessa cinco etapas, cada uma com uma resposta possível e um caminho de erro distinto. Sem ver os cinco, parece mágica — e os bugs ficam escondidos.",
        "1. declaração: a lista de schemas é entregue ao LLM junto do prompt.",
        "2. proposta: o LLM devolve tool_calls com name + JSON arguments.",
        "3. validação: o runtime parseia e valida contra o schema — falha aqui significa 'o modelo alucinou'; trate como erro e devolva o motivo ao LLM.",
        "4. execução: o runtime chama a função real (HTTP, DB, comando) com permissões e timeout.",
        "5. observação: o resultado vira uma mensagem tool no contexto; o LLM usa para a próxima decisão.",
      ],
      code: [
        {
          language: "typescript",
          filename: "runtime.tsx",
          code: "import Anthropic from '@anthropic-ai/sdk';\nimport { z } from 'zod';\n\nconst GetWeather = z.object({\n  city: z.string().min(1),\n  unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),\n});\n\nasync function run(anthropic: Anthropic, userMessage: string) {\n  const tools = [{\n    name: 'get_weather',\n    description: 'Obtém o clima atual de uma cidade.',\n    input_schema: z.toJSONSchema(GetWeather),\n  }];\n\n  let msg = await anthropic.messages.create({\n    model: 'claude-sonnet-5-5', max_tokens: 1024, tools,\n    messages: [{ role: 'user', content: userMessage }],\n  });\n\n  if (msg.stop_reason === 'tool_use') {\n    const call = msg.content.find((b) => b.type === 'tool_use');\n    const parsed = GetWeather.safeParse(call.input);\n    if (!parsed.success) return { error: 'invalid_args', issues: parsed.error.issues };\n    const result = await fetchWeather(parsed.data.city, parsed.data.unit);\n    msg = await anthropic.messages.create({\n      model: 'claude-sonnet-5-5', max_tokens: 1024, tools,\n      messages: [\n        { role: 'user',     content: userMessage },\n        { role: 'assistant',content: msg.content },\n        { role: 'user',     content: [{ type: 'tool_result', tool_use_id: call.id, content: JSON.stringify(result) }] },\n      ],\n    });\n  }\n  return msg;\n}",
        },
      ],
    },
    {
      heading: "Por que não dá para pular a validação",
      bullets: [
        "o modelo pode inventar campos: ele viu 1000 schemas diferentes, não garante consistência",
        "tipos são garantidos, valores não: ele sabe que 'unit' é string, mas pode mandar 'celcius' (com erro de digitação)",
        "enums são a fronteira mais comum de erro: o modelo nem sempre respeita o enum, principalmente sem structured output estrito",
        "validação é barata: custa microssegundos; execução sem validação pode disparar uma ação crítica com argumentos errados",
      ],
    },
    {
      heading: "Pontos fortes e limitações",
      bullets: [
        "forte: o schema força estrutura — o modelo não precisa 'tentar' produzir JSON válido; ele está produzindo tokens dentro de uma gramática",
        "forte: erros de validação devolvem mensagem rica para o modelo, que quase sempre se corrige no próximo turno",
        "fraco: descrição ruim leva a chamadas na hora errada — escrever schema bom é trabalho de design",
        "fraco: a chamada é opaca para o usuário — se ele não ler o trace, não sabe que ferramenta rodou",
        "fraco: paralelismo depende do provedor — alguns permitem várias tool_calls em uma resposta, outros só uma",
      ],
    },
  ],
};