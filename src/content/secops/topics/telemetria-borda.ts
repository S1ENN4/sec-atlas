import type { Topic } from "@/content/types";

export const telemetriaBorda: Topic = {
  domain: "secops",
  slug: "telemetria-borda",
  title: "Telemetria de borda e aplicação",
  short: "do log bruto ao evento pronto para detectar",
  tagline:
    "Detecção boa começa em dado bom: um pipeline que recebe o tráfego da borda e da aplicação, normaliza, enriquece e guarda de um jeito que dê para consultar em segundos.",
  kind: "tecnica",
  stage: "observar",
  tools: ["Cloudflare Logpush", "BigQuery", "Vector", "Kafka"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Telemetria de borda é o conjunto de eventos que descrevem o tráfego que chega à sua aplicação: cada requisição na CDN e no WAF, com o resultado da inspeção, e os eventos da própria aplicação (login, erro, mudança de estado). É a matéria-prima de toda detecção e de toda métrica.",
        "Sem ela, o SOC opera às cegas ou depende de painéis prontos que respondem às perguntas dos outros, não às suas.",
      ],
    },
    {
      heading: "O pipeline, de ponta a ponta",
      body: ["Pensar em etapas ajuda a localizar onde um problema nasce quando a detecção falha:"],
      bullets: [
        "Ingestão: entrega dos logs em lote ou streaming a partir da borda (por exemplo, um serviço de push de logs) e da aplicação.",
        "Normalização: esquema único de campos (timestamp, IP, caminho, método, status, user agent, resultado do WAF), independente da origem.",
        "Enriquecimento: ASN, país, reputação, score de bot, identificador de conta, versão da aplicação.",
        "Armazenamento: tabelas particionadas por tempo, pensadas para consulta por janela.",
        "Detecção: consultas e regras sobre os dados (assunto do tópico de engenharia de detecção).",
        "Ação e métrica: o resultado vira bloqueio, alerta ou indicador, e volta ao pipeline para fechar o ciclo.",
      ],
    },
    {
      heading: "Um evento normalizado",
      body: [
        "O esquema é um contrato. Quando todo evento tem os mesmos campos com os mesmos nomes, uma detecção escrita uma vez funciona para qualquer fonte. Um exemplo enxuto:",
      ],
      code: [
        {
          language: "json",
          filename: "edge_event.json",
          code: "{\n  \"ts\": \"2026-10-13T14:03:21.482Z\",\n  \"client_ip\": \"203.0.113.42\",\n  \"asn\": 64500,\n  \"country\": \"BR\",\n  \"method\": \"POST\",\n  \"host\": \"api.exemplo.com\",\n  \"path\": \"/api/login\",\n  \"status\": 401,\n  \"user_agent\": \"python-requests/2.31\",\n  \"bot_score\": 8,\n  \"waf_action\": \"log\",\n  \"waf_rule\": \"login-ratelimit-v2\",\n  \"account_id\": \"u_18273\"\n}",
        },
      ],
    },
    {
      heading: "Qualidade do dado",
      body: [
        "Três problemas aparecem sempre: campos ausentes (a detecção silenciosamente deixa de funcionar), relógios desalinhados (janelas erradas) e volume perdido (um pipeline que descarta eventos sob carga). Vale monitorar o próprio pipeline: latência de ingestão, contagem por fonte e taxa de eventos sem campos essenciais. Detecção sobre dado incompleto dá confiança falsa.",
      ],
    },
  ],
};
