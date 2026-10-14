import type { Topic } from "@/content/types";

export const mcp: Topic = {
  domain: "ai-agents",
  slug: "mcp",
  title: "MCP - model context protocol",
  short: "protocolo padronizado entre modelo e ferramentas",
  tagline:
    "MCP (Model Context Protocol) padroniza como um cliente LLM descobre, lista e chama capacidades expostas por servidores: tools (ações), resources (dados) e prompts (templates). Uma interface única para integrar com qualquer fonte.",
  kind: "conceito",
  stage: null,
  tools: ["Anthropic MCP", "MCP Python SDK", "MCP TypeScript SDK", "FastMCP"],
  sections: [
    {
      heading: "O que é",
      body: [
        "MCP (Model Context Protocol) é um protocolo aberto que padroniza a conversa entre um cliente LLM (o host, geralmente um IDE ou app de chat) e servidores externos que expõem capacidades. Em vez de cada provedor de ferramenta inventar sua própria API, todo servidor MCP fala o mesmo JSON-RPC e todo cliente MCP descobre tudo igual.",
        "Pense em USB-C para agentes. A peça física mudou uma vez; o ecossistema ganhou. A mesma ideia aqui: o protocolo muda uma vez, e um servidor escrito para o Claude Desktop funciona no Cursor, no Continue e em qualquer host que reenvie a mensagem.",
        "Este tópico descreve o modelo com handshake das revisões de 2024 e 2025 (como a 2025-06-18), que ainda é o mais implantado. A revisão atual, 2026-07-28, é stateless: remove o handshake initialize e as sessões, e cada requisição leva a versão do protocolo e as capabilities do cliente em _meta; os servidores passam a expor server/discover. Sampling, roots e logging estão deprecados. Confira a revisão que o seu SDK declara antes de adotar.",
      ],
    },
    {
      heading: "Host, client e server: a topologia",
      body: [
        "Três papéis coexistem na especificação. Confundi-los é o erro mais comum ao ler documentação.",
        "host: o aplicativo onde o usuário está (IDE, chat, agente). Ele hospeda os clientes e coordena permissões. Em geral um host roda muitos clientes.",
        "client: vive dentro do host, fala com um único servidor via JSON-RPC. É o objeto que serializa as chamadas e negocia capabilities.",
        "server: o processo que expõe tools, resources e prompts. Pode rodar localmente via stdin/stdout, ou remotamente via Streamable HTTP (o transporte antigo HTTP+SSE está deprecado). É onde vive a lógica de integração.",
        "O transporte típico local é stdio: o host spawna o server como subprocesso e fala JSON-RPC linha a linha. Em ambientes distribuídos, o transporte é Streamable HTTP: POST para as mensagens, com respostas que podem virar um stream de eventos. A revisão 2026-07-28 trocou o GET de notificações por um stream único aberto com subscriptions/listen.",
      ],
      code: [
        {
          language: "text",
          filename: "topologia típica",
          code: "  Host (Claude Desktop, Cursor, VS Code, app própria)\n  |\n  | 1:N\n  |\n  +-- Client MCP (stdio)   <--> Server MCP local  (ex: filesystem)\n  +-- Client MCP (stdio)   <--> Server MCP local  (ex: postgres)\n  +-- Client MCP (Streamable HTTP)<--> Server MCP remoto (ex: API SaaS)\n\n  Transporte sempre é JSON-RPC 2.0. Nas revisões com handshake, o estado da sessão é por conexão.",
        },
      ],
    },
    {
      heading: "Tools, resources e prompts",
      body: [
        "O server expõe três tipos de capacidade, cada um com um papel claro no ciclo do agente:",
        "tools: ações que o modelo pode invocar. Análogas a function calls: nome, schema JSON, side effects. O LLM escolhe quando chamar baseado na descrição.",
        "resources: dados que o host pode ler. Passivos, identificados por nome ou URI (ex: file:///docs/spec.pdf, db://customers/42). O host decide quando incluir no contexto; o modelo só vê o conteúdo que o host escolheu.",
        "prompts: templates de prompt que o usuário invoca explicitamente (ex: '/summarize este arquivo'). Não são descobertos pelo modelo — ficam como slash commands no host.",
      ],
      code: [
        {
          language: "json",
          filename: "manifest de um server MCP",
          code: "{\n  \"name\": \"docs-server\",\n  \"version\": \"0.2.1\",\n  \"capabilities\": {\n    \"tools\":     { \"listChanged\": true },\n    \"resources\": { \"subscribe\":   true, \"listChanged\": true }\n  },\n  \"tools\": [\n    {\n      \"name\": \"search_docs\",\n      \"description\": \"Busca trechos relevantes na base de documentação.\",\n      \"inputSchema\": {\n        \"type\": \"object\",\n        \"properties\": {\n          \"query\":   { \"type\": \"string\" },\n          \"top_k\":   { \"type\": \"integer\", \"default\": 5 }\n        },\n        \"required\": [\"query\"]\n      }\n    }\n  ],\n  \"resources\": [\n    {\n      \"uri\":  \"file:///docs/architecture.md\",\n      \"name\": \"arquitetura\",\n      \"mimeType\": \"text/markdown\"\n    }\n  ]\n}",
        },
      ],
    },
    {
      heading: "Como o cliente descobre capacidades",
      body: [
        "Nas revisões com handshake (até a 2025-11-25), a primeira mensagem do client é initialize, com a versão do protocolo e as capabilities do cliente, e o server responde com as suas. Na revisão 2026-07-28 não há handshake: cada requisição declara a versão e as capabilities, e o client pode chamar server/discover para saber o que o server suporta. Em ambos os casos, o host chama tools/list, resources/list e prompts/list para montar o catálogo disponível.",
        "Cada capacidade pode declarar listChanged: true, indicando que o server vai emitir notifications/resources/list_changed ou notifications/tools/list_changed quando algo mudar. O host re-lista e atualiza o catálogo sem precisar reiniciar.",
      ],
      code: [
        {
          language: "typescript",
          filename: "client.tsx",
          code: "import { Client } from '@modelcontextprotocol/sdk/client/index.js';\nimport { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';\n\nconst transport = new StdioClientTransport({\n  command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '/docs'],\n});\n\nconst client = new Client({ name: 'host', version: '1.0.0' }, { capabilities: {} });\nawait client.connect(transport);\n\nconst { tools }     = await client.listTools();     // -> catálogo para o LLM\nconst { resources } = await client.listResources(); // -> dados disponíveis\n\nconst result = await client.callTool({\n  name: 'search_docs',\n  arguments: { query: 'como funciona checkpoint', top_k: 3 },\n});",
        },
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "interoperabilidade: um server MCP serve vários hosts sem reescrita; trocar de IDE não é reescrever integração",
        "descoberta dinâmica: tools e resources aparecem em tempo de conexão, sem reiniciar o host",
        "separação clara de papéis: tools são ações, resources são dados, prompts são templates — sem ambiguidade",
        "transporte flexível: stdio para local, Streamable HTTP para distribuído; o contrato sobre o token é o mesmo",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "tools ainda são ação do modelo: o server pode chamar APIs perigosas — autorização e sandboxing ficam por conta do host",
        "spec evolui rápido: a revisão atual (2026-07-28) removeu o handshake e deprecou sampling, roots e logging; versões antigas continuam em uso, então confira o que o SDK declara",
        "debug remoto é mais difícil: o stream HTTP esconde o ciclo de vida; logs e handlers são equivalentes em importância",
        "trust on first connect: o host precisa confiar no server; assinatura de pacotes e allowlist ainda são responsabilidade de deployment",
      ],
    },
  ],
};