import type { Topic } from "@/content/types";

export const guardrails: Topic = {
  domain: "ai-agents",
  slug: "guardrails",
  title: "Guardrails - filtros de entrada e saída",
  short: "filtros de entrada e saída para conter o agente",
  tagline:
    "Guardrails validam entrada (prompt injection, PII, jailbreak) e saída (PII, schema, política) em cada turno. Complementam o eval: seguram o que vai ao usuário, mas não medem se a resposta é boa.",
  kind: "conceito",
  stage: null,
  tools: ["Guardrails AI", "NeMo Guardrails", "Lakera", "Rebuff"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Guardrail é uma camada de validação que fica entre o usuário e o agente, e entre o agente e a resposta final. Em cada turno, duas bordas: a borda de cima analisa a mensagem do usuário (e o histórico, e os documentos que vão entrar como contexto) e decide se passa, bloqueia ou reescreve. A borda de baixo faz o mesmo com a saída do agente antes dela alcançar quem pediu.",
        "A diferença para o eval é a posição no tempo. Eval mede qualidade depois que a resposta foi gerada, em batch ou em amostragem. O guardrail age agora, em cada request. São complementares. Quem substitui um pelo outro vira teatro de segurança: o eval lento demais para bloquear e o guardrail sozinho sem visão da qualidade geral.",
      ],
    },
    {
      heading: "Entrada: prompt injection, jailbreak, PII",
      body: [
        "A entrada é a parte mais visada. O usuário pode tentar instruir o modelo a ignorar as instruções do sistema (jailbreak clássico), embutir comando dentro de um documento recuperado (indirect prompt injection), ou colar dado sensível pedindo para o agente processar (PII que vai parar no log). O guardrail de entrada precisa das três detecções, e cada uma tem mecanismo próprio.",
        "PII é o mais fácil: regex sobre email, CPF, telefone, cartão. Falsos positivos são trabalho de revisão, falsos negativos viram incidente. Jailbreak é mais sutil: classificadores treinados em adversarial prompts, ou padrões conhecidos (DAN, role-play). Indirect injection é o mais novo e o mais difícil: a instrução hostil está num documento que o retrieval trouxe, não na mensagem do usuário. Detecção aqui pede análise semântica do conteúdo recuperado, não só do texto cru.",
      ],
    },
    {
      heading: "Saída: schema, PII, política",
      body: [
        "A saída precisa de três camadas também. Validação de schema garante que a resposta final tem a forma esperada (JSON tipado, markdown válido, links com host confiável). Máscara de PII redige email, telefone, endereço que o modelo tenha inventado ou copiado. Política rejeita conteúdo proibido pelo negócio (concorrente citado, jurisdição restrita, categoria sensível).",
        "A camada de schema merece atenção especial. Sem schema válido, o frontend não renderiza e o agente parece quebrado. Por isso o guardrail de saída começa fail-closed: melhor bloquear uma resposta válida e devolver fallback do que entregar resposta que quebra o consumidor.",
      ],
    },
    {
      heading: "Guardrail de saída na prática",
      body: [
        "O snippet mostra um guardrail de saída mínimo: valida JSON contra um schema, redige PII básica, e bloqueia quando o conteúdo foge da rubrica. Em produção vale trocar regex por detector (Guardrails AI, Lakera), mas a mecânica fica esta:",
      ],
      code: [
        {
          language: "typescript",
          filename: "guardrails/saida.ts",
          code: "import Ajv from \"ajv\";\n\nconst schema = {\n  type: \"object\",\n  required: [\"resposta\", \"fontes\"],\n  properties: {\n    resposta: { type: \"string\", minLength: 1, maxLength: 2000 },\n    fontes: { type: \"array\", items: { type: \"string\" } }\n  },\n  additionalProperties: false\n};\n\nconst ajv = new Ajv();\nconst validate = ajv.compile(schema);\n\nconst PII = /\\b([\\w._%+-]+@[\\w.-]+\\.[A-Za-z]{2,}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})\\b/g;\nconst PROIBIDO = /(concorrente-x|concorrente-y)/i;\n\nexport type Veredito = { ok: true; saida: unknown } | { ok: false; motivo: string };\n\nexport function guardrailSaida(raw: string): Veredito {\n  let parsed: unknown;\n  try { parsed = JSON.parse(raw); } catch { return { ok: false, motivo: \"json_invalido\" }; }\n  if (!validate(parsed)) return { ok: false, motivo: \"schema_invalido\" };\n  if (PROIBIDO.test(JSON.stringify(parsed))) return { ok: false, motivo: \"politica_violada\" };\n  const redigido = JSON.stringify(parsed).replace(PII, \"[REDIGIDO]\");\n  return { ok: true, saida: JSON.parse(redigido) };\n}",
        },
      ],
    },
    {
      heading: "Onde entra na arquitetura",
      body: [
        "Como camada cross-cutting, antes do LLM e depois do LLM. Em produção o guardrail de entrada vira um middleware do endpoint HTTP; o de saída vira wrapper do cliente LLM ou post-processor do stream. Em frameworks como LangGraph, é um node dedicado entre o usuário e o agente, e entre o agente e a resposta.",
        "Performance importa. Cada guardrail adiciona latência, e latência em chat visível logo de cara. Regra: guardrail de entrada roda em <= 50ms para a maior parte dos casos, e o de saída fica dentro do orçamento total do request (tipicamente <= 200ms). Acima disso, usar detector assíncrono e mostrar placeholder enquanto processa.",
      ],
    },
    {
      heading: "Guardrail não substitui eval",
      body: [
        "Guardrail cuida do que pode acontecer. Um agente pode passar em todos os guardrails e ainda assim dar resposta ruim (off-topic, factualmente errada, com tom inadequado). Isso é trabalho do eval, e o eval roda em batch onde o guardrail não consegue.",
        "A confusão aparece quando alguém trata guardrail como prova de qualidade. Pontuação média de guardrail é alta (a maior parte das requests passa), e isso leva o time a achar que 'está tudo bem'. Não está. Guardrail mede segurança e conformidade; eval mede qualidade. São dois eixos diferentes, ambos necessários.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "bloqueia ataques conhecidos antes de chegarem ao modelo, e.g. injection simples e PII óbvia",
        "conformidade rastreável: cada turno vira um log de decisão, e auditoria quer sinal rápido quando há violação",
        "composable: dá para combinar vários guardrails em pipeline, cada um cuidando de uma classe de risco",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "falso negativo em ataque novo: prompt injection evolui, e o detector treinado em 2024 erra em 2026",
        "custo de latência: cada camada síncrona a mais é visível no SLA, e pipeline de 5 guardrails começa a parecer caro",
        "cegueira de qualidade: bloqueia o perigoso, mas não mede se o que passou é bom, e isso continua sendo do eval",
      ],
    },
  ],
};