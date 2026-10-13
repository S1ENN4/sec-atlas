import type { Topic } from "@/content/types";

export const iaNaSeguranca: Topic = {
  domain: "seceng",
  slug: "ia-na-seguranca",
  title: "IA na triagem e na mitigação",
  short: "LLMs como assistentes de segurança, com validação e sem confiança cega",
  tagline:
    "Modelos de linguagem aceleram a triagem de alertas e a escrita de mitigações, mas leem dado não confiável e podem errar com segurança. O desenho certo trata a saída como sugestão, não como decisão.",
  kind: "tecnica",
  stage: "automatizar",
  tools: ["Azure OpenAI", "Promptfoo", "JSON Schema", "Python"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Usos comuns de IA em segurança: resumir um alerta e o contexto em linguagem clara, sugerir a classificação e a gravidade, propor uma mitigação de código a partir de um relatório de SAST ou DAST, e responder perguntas de analistas sobre incidentes. O ganho é tempo de leitura e de escrita, não substituir o julgamento.",
      ],
    },
    {
      heading: "Riscos específicos",
      bullets: [
        "Prompt injection pelos dados: logs, user agents, títulos de PR e corpos de requisição são controlados por atacantes e podem conter instruções que o modelo obedece.",
        "Alucinação: uma mitigação plausível, porém errada, ou uma referência a uma correção que não existe.",
        "Vazamento: enviar segredos, dados pessoais ou código proprietário a um serviço externo sem controle.",
        "Excesso de autonomia: ligar a saída do modelo diretamente a uma ação destrutiva.",
      ],
    },
    {
      heading: "Saída estruturada e validação",
      body: [
        "Peça ao modelo uma saída em formato fixo e valide contra um esquema antes de usar. O que não casa é descartado ou vai para um humano. Isso transforma texto livre em dado que a automação pode checar.",
      ],
      code: [
        {
          language: "json",
          filename: "triage_output.schema.json",
          code: "{\n  \"type\": \"object\",\n  \"required\": [\"verdict\", \"severity\", \"reasons\"],\n  \"additionalProperties\": false,\n  \"properties\": {\n    \"verdict\":  { \"enum\": [\"attack\", \"benign\", \"needs_human\"] },\n    \"severity\": { \"enum\": [\"low\", \"medium\", \"high\", \"critical\"] },\n    \"reasons\":  { \"type\": \"array\", \"items\": { \"type\": \"string\" }, \"maxItems\": 5 }\n  }\n}",
        },
      ],
    },
    {
      heading: "Onde a IA entra no playbook",
      body: [
        "O padrão seguro é a IA em volta da decisão, não no lugar dela: ela resume e sugere, uma regra determinística ou um humano decide, e a ação passa pelos freios do playbook (idempotência, aprovação, dry-run, auditoria). Quanto maior o impacto da ação, mais longe ela fica da saída direta do modelo.",
      ],
    },
    {
      heading: "Medir antes de confiar",
      bullets: [
        "Conjunto de avaliação com alertas reais já rotulados por analistas, rodando a cada mudança de prompt ou modelo.",
        "Acompanhar acerto, falso positivo e casos em que o modelo recusou ou pediu um humano.",
        "Revisão amostral contínua da saída em produção.",
        "Controle de dados: o que sai para o provedor, com mascaramento de segredos e de dados pessoais antes do envio.",
      ],
    },
  ],
};
