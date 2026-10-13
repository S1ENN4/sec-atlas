import type { Topic } from "@/content/types";

export const confiabilidadeEmEscala: Topic = {
  domain: "seceng",
  slug: "confiabilidade-em-escala",
  title: "Confiabilidade em escala: idempotência, retries e backpressure",
  short: "o pipeline que aguenta falha sem perder nem duplicar decisão",
  tagline:
    "Em sistemas distribuídos tudo falha, em algum momento. O que separa uma plataforma de segurança confiável é como ela se comporta quando isso acontece: sem perder evento e sem agir duas vezes.",
  kind: "pratica",
  stage: "escalar",
  tools: ["Redis", "Temporal", "Envoy", "Prometheus"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Confiabilidade aqui é a propriedade de continuar correto sob falha: rede que cai, dependência lenta, mensagem repetida, pico de volume. Em segurança as duas falhas mais caras são perder um evento (uma detecção que nunca dispara) e agir duas vezes (bloquear, notificar ou revogar em duplicidade).",
        "A abordagem prática é aceitar que a entrega será at-least-once e tornar o processamento idempotente, em vez de perseguir uma entrega \"exactly-once\" mágica de ponta a ponta.",
      ],
    },
    {
      heading: "Idempotência: processar de novo sem efeito extra",
      body: [
        "Uma operação é idempotente quando executá-la várias vezes dá o mesmo resultado que executá-la uma. Para eventos, o caminho comum é dar a cada um um identificador estável e registrar os já processados: se o ID reaparece, o handler descarta ou repete só o que é seguro.",
      ],
      bullets: [
        "ID de evento determinístico (hash dos campos relevantes, ou o ID da origem) para detectar repetição.",
        "Registro dos IDs processados com prazo (Redis com expiração, ou uma tabela com restrição de unicidade).",
        "Ações definidas por estado desejado (\"o IP X está bloqueado até T\") em vez de ações incrementais (\"bloqueie\"), pois repetir o estado desejado não muda nada.",
      ],
    },
    {
      heading: "Retries com backoff e jitter",
      body: [
        "Repetir uma chamada que falhou ajuda, mas repetir todos ao mesmo tempo derruba a dependência que acabou de se recuperar. O padrão é backoff exponencial (esperar mais a cada tentativa) com jitter (aleatoriedade para desincronizar os clientes) e um teto de tentativas, após o qual o evento vai para a DLQ.",
      ],
      code: [
        {
          language: "python",
          filename: "retry.py",
          code: "import random\nimport time\n\n\ndef retry(fn, max_attempts=5, base=0.2):\n    for i in range(max_attempts):\n        try:\n            return fn()\n        except Exception as err:\n            if i == max_attempts - 1:\n                raise RuntimeError(f\"esgotou {max_attempts} tentativas\") from err\n            # backoff exponencial com jitter total: espera em [0, base * 2**i)\n            time.sleep(random.uniform(0, base * 2 ** i))",
        },
      ],
    },
    {
      heading: "Backpressure e isolamento",
      bullets: [
        "Backpressure: filas e buffers com limite. Quando o consumidor não acompanha, o produtor desacelera ou o excesso é descartado de forma consciente, em vez de a memória crescer até o processo morrer.",
        "Circuit breaker: depois de falhas seguidas, parar de chamar a dependência por um tempo e responder com um fallback definido.",
        "Bulkheads: pools separados por dependência, para que a lentidão de uma não consuma os recursos de todas.",
        "Timeouts em toda chamada externa, com prazo menor que o do chamador.",
      ],
    },
    {
      heading: "Falhar de forma segura",
      body: [
        "Cada componente precisa de uma resposta definida para \"não consegui decidir\". Um enriquecimento que falhou deve gerar o evento sem o campo (e uma marca de que faltou), não descartá-lo. Uma ação automática que não pôde confirmar o contexto deve pedir aprovação humana, não agir às cegas.",
      ],
    },
  ],
};
