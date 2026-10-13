import type { QuizBank } from "@/content/types";

export const secopsQuiz: QuizBank = {
  waf: [
    {
      q: "Qual é o caminho seguro para ativar uma regra nova de WAF?",
      options: [
        "Observação, depois shadow, e só então enforcement",
        "Ligar direto em bloqueio para ver o efeito",
        "Ativar só em produção, fora do horário comercial",
        "Copiar a regra de outra empresa sem testar",
      ],
      answer: 0,
      explain: "Observar e simular primeiro mostra o falso positivo antes que ele custe um cliente.",
    },
    {
      q: "O que caracteriza o modelo positivo de WAF?",
      options: [
        "Definir o que é válido para o endpoint e bloquear o resto",
        "Bloquear apenas assinaturas conhecidas de ataque",
        "Liberar tudo e registrar em log",
        "Usar somente listas de IPs maliciosos",
      ],
      answer: 0,
      explain: "É a allowlist aplicada por endpoint: mais precisa, mas exige conhecer a aplicação.",
    },
    {
      q: "Para que serve um patch virtual?",
      options: [
        "Bloquear a exploração de uma falha conhecida enquanto a correção real não chega",
        "Substituir a correção definitiva da vulnerabilidade",
        "Atualizar o sistema operacional da origem",
        "Cifrar o tráfego entre a borda e a origem",
      ],
      answer: 0,
      explain: "Ganha tempo, mas não elimina a falha: a correção na aplicação continua necessária.",
    },
  ],
  "rate-limiting": [
    {
      q: "Por que limitar apenas por IP costuma ser insuficiente?",
      options: [
        "NAT agrupa muitos usuários legítimos, e botnets espalham o tráfego por muitos IPs",
        "IPs não aparecem nos logs de HTTP",
        "O limite por IP é ilegal em alguns países",
        "Porque IPv6 não pode ser limitado",
      ],
      answer: 0,
      explain: "A chave certa (conta, token, ASN, combinações) separa melhor o abuso do uso legítimo.",
    },
    {
      q: "Por que usar uma escada de respostas com prazo (TTL)?",
      options: [
        "Para que um erro de classificação não vire bloqueio permanente e a resposta cresça com a reincidência",
        "Para economizar armazenamento de logs",
        "Para evitar o uso de desafios",
        "Porque bloqueios sem prazo são tecnicamente impossíveis",
      ],
      answer: 0,
      explain: "Desafio, bloqueio curto e depois mais longo: proporcional e reversível.",
    },
    {
      q: "Qual é a vantagem de um limite adaptativo?",
      options: [
        "Acompanha o comportamento normal de cada endpoint e janela, em vez de um número fixo que envelhece",
        "Elimina a necessidade de qualquer limite estático",
        "Dispensa o uso de telemetria",
        "Garante zero falso positivo",
      ],
      answer: 0,
      explain: "Campanhas e sazonalidade mudam o normal; o baseline acompanha. O teto estático segue como segurança.",
    },
  ],
  "bot-management": [
    {
      q: "O que o bot management entrega para a política de segurança?",
      options: [
        "Uma pontuação de confiança por requisição, sobre a qual a política decide a ação",
        "Um bloqueio automático de todo tráfego automatizado",
        "Uma lista fixa de IPs de robôs",
        "Um substituto para o rate limiting",
      ],
      answer: 0,
      explain: "A nota é um insumo: a ação (permitir, desafiar, bloquear) depende do endpoint e do risco.",
    },
    {
      q: "Por que tratar bots verificados à parte?",
      options: [
        "Buscadores e monitores legítimos não devem ser bloqueados junto com o abuso",
        "Porque eles nunca geram tráfego relevante",
        "Porque são mais difíceis de identificar que humanos",
        "Porque pagam pelo acesso",
      ],
      answer: 0,
      explain: "Bloquear um crawler legítimo pode derrubar sua presença em buscadores.",
    },
    {
      q: "Qual a vantagem de um desafio gerenciado sobre um CAPTCHA clássico?",
      options: [
        "Tenta provar que o cliente é real sem atrito, e só escala para interação quando a dúvida persiste",
        "É impossível de contornar",
        "Dispensa JavaScript no navegador",
        "Não gera nenhum custo para o atacante",
      ],
      answer: 0,
      explain: "Reduz falso positivo e o atrito para usuários, e ainda encarece a automação em escala.",
    },
  ],
  "telemetria-borda": [
    {
      q: "Por que normalizar os eventos em um esquema único?",
      options: [
        "Para que uma detecção escrita uma vez funcione para qualquer fonte",
        "Para reduzir o número de campos a zero",
        "Para dispensar o enriquecimento",
        "Para cifrar os logs",
      ],
      answer: 0,
      explain: "O esquema é um contrato entre a ingestão e a detecção.",
    },
    {
      q: "Qual é um exemplo de enriquecimento útil?",
      options: [
        "Adicionar ASN, país e score de bot ao evento",
        "Apagar o user agent",
        "Converter o timestamp para texto livre",
        "Remover o caminho da requisição",
      ],
      answer: 0,
      explain: "Esses campos permitem agrupar e detectar comportamento que o IP sozinho não mostra.",
    },
    {
      q: "Qual risco aparece quando o pipeline descarta eventos sob carga?",
      options: [
        "A detecção passa a operar sobre dado incompleto, com confiança falsa",
        "Nenhum, o volume perdido não importa",
        "O WAF para de funcionar imediatamente",
        "Os logs ficam mais seguros",
      ],
      answer: 0,
      explain: "Por isso vale monitorar o próprio pipeline: latência, contagem por fonte e campos ausentes.",
    },
  ],
  "escala-telemetria": [
    {
      q: "O que é cardinalidade em telemetria?",
      options: [
        "O número de valores distintos de um campo, como IPs ou user agents",
        "A velocidade da rede",
        "O tamanho da retenção em dias",
        "O número de regras de WAF",
      ],
      answer: 0,
      explain: "Alta cardinalidade deixa agregações lentas e caras.",
    },
    {
      q: "Qual técnica reduz bastante o custo das consultas de detecção?",
      options: [
        "Particionar por tempo e manter agregados por minuto para as detecções lerem",
        "Consultar sempre o dado bruto inteiro",
        "Desativar a retenção",
        "Guardar tudo em um único arquivo",
      ],
      answer: 0,
      explain: "A consulta lê só a janela necessária e a tabela pequena, deixando o bruto para investigação.",
    },
    {
      q: "Que eventos devem ficar sempre completos, mesmo com amostragem?",
      options: [
        "Bloqueios, desafios e anomalias de segurança",
        "Todo tráfego de imagens estáticas",
        "Apenas requisições com status 200",
        "Nenhum, tudo pode ser amostrado",
      ],
      answer: 0,
      explain: "A amostragem serve ao tráfego volumétrico uniforme; o que é relevante para segurança se preserva.",
    },
  ],
  "ataques-l7": [
    {
      q: "Qual é a assinatura típica de credential stuffing nos logs?",
      options: [
        "Muitas falhas de login distribuídas por muitos IPs, com poucas tentativas por conta",
        "Uma única requisição enorme",
        "Aumento de requisições a imagens estáticas",
        "Queda repentina de tráfego",
      ],
      answer: 0,
      explain: "A botnet distribui o ataque, então o IP sozinho engana; ASN e fingerprint mostram o padrão.",
    },
    {
      q: "O que sugere forced browsing?",
      options: [
        "Explosão de 404 e 403 com muitos caminhos distintos vindos da mesma origem",
        "Apenas respostas 200 em poucos caminhos",
        "Falhas de TLS",
        "Aumento de latência da origem",
      ],
      answer: 0,
      explain: "O atacante varre caminhos administrativos e de backup à procura de algo exposto.",
    },
    {
      q: "Que sinal levanta suspeita de SSRF?",
      options: [
        "Parâmetros de URL apontando para endereços internos ou de metadados",
        "Cabeçalhos de cache ausentes",
        "Muitos acessos à página inicial",
        "Uso de HTTP/2",
      ],
      answer: 0,
      explain: "A aplicação busca a URL no servidor, então um endereço interno pode expor serviços de dentro da rede.",
    },
  ],
  "detection-engineering": [
    {
      q: "Qual a diferença entre assinaturas e heurísticas?",
      options: [
        "Assinaturas reconhecem o conhecido; heurísticas medem comportamento e pegam variações novas, com mais ruído",
        "Assinaturas são sempre estatísticas",
        "Heurísticas só funcionam com IP fixo",
        "Não há diferença prática",
      ],
      answer: 0,
      explain: "A biblioteca saudável combina as duas.",
    },
    {
      q: "O que significa um z-score alto para a contagem atual?",
      options: [
        "Ela está muito acima da média histórica, em desvios padrão",
        "Ela é igual à média",
        "O dado está criptografado",
        "A janela de tempo é curta demais para analisar",
      ],
      answer: 0,
      explain: "Valores muito acima do esperado para a mesma chave são candidatos a alerta.",
    },
    {
      q: "O que é tratar detecções como código?",
      options: [
        "Versionar, revisar, testar e medir cada detecção, com um dono",
        "Escrever todas em um único script sem comentários",
        "Editar regras direto no console de produção",
        "Mantê-las em planilhas",
      ],
      answer: 0,
      explain: "Detecção é software: precisa de revisão, teste contra eventos conhecidos e aposentadoria quando não entrega valor.",
    },
  ],
  "runbooks-e-hardening": [
    {
      q: "Por que começar a contenção por desafio em vez de bloqueio?",
      options: [
        "É barato para o legítimo e caro para o robô, e reduz o falso positivo",
        "Porque o bloqueio é ilegal",
        "Porque o desafio nunca falha",
        "Porque bloqueios derrubam a borda",
      ],
      answer: 0,
      explain: "O desafio é o degrau antes do bloqueio, com a mesma ideia de escada com TTL.",
    },
    {
      q: "O que um pós-mortem sem culpa registra?",
      options: [
        "Linha do tempo, causa, o que funcionou e o que atrapalhou, com ações, donos e prazos",
        "O nome do responsável pelo erro",
        "Apenas o número de alertas",
        "Somente as lições positivas",
      ],
      answer: 0,
      explain: "O objetivo é aprender e gerar ações que evitem a repetição.",
    },
    {
      q: "Qual destes é um exemplo de hardening na aplicação?",
      options: [
        "CSP com nonce, CORS estrito e validação de schema no gateway",
        "Desligar o WAF após o incidente",
        "Aumentar o TTL de todos os bloqueios",
        "Remover os logs de erro",
      ],
      answer: 0,
      explain: "Cada incidente deve virar controle que não dependa só da borda.",
    },
  ],
  "slos-soc": [
    {
      q: "O que mede o MTTC?",
      options: [
        "O tempo médio da confirmação do ataque até a sua contenção",
        "O custo mensal da ferramenta",
        "A latência média do site",
        "O número de regras ativas",
      ],
      answer: 0,
      explain: "É um dos principais indicadores de eficácia de runbooks e automação.",
    },
    {
      q: "O que acontece com a precisão quando se aumenta muito a sensibilidade de uma detecção?",
      options: [
        "O recall tende a subir e a precisão a cair, com mais falso positivo",
        "Ambos sobem sempre",
        "Nada muda",
        "A detecção deixa de funcionar",
      ],
      answer: 0,
      explain: "Há um trade-off: o limiar é decisão de negócio apoiada em dados.",
    },
    {
      q: "Qual é o objetivo declarado do tuning semanal?",
      options: [
        "Reduzir falso positivo sem perder cobertura",
        "Desligar regras barulhentas",
        "Aumentar o número de alertas",
        "Eliminar o recall",
      ],
      answer: 0,
      explain: "A prova é a precisão subindo enquanto o recall se mantém.",
    },
  ],
  "defesa-em-camadas": [
    {
      q: "Por que trancar a origem para aceitar tráfego só da borda?",
      options: [
        "Senão o atacante fala direto com a origem e contorna WAF, bots e limites",
        "Para reduzir o custo de armazenamento",
        "Para acelerar o DNS",
        "Porque a origem não suporta HTTPS",
      ],
      answer: 0,
      explain: "Sem isso, qualquer um que descubra o endereço real ignora toda a proteção da borda.",
    },
    {
      q: "O que significa fail-closed?",
      options: [
        "Se o controle falha, o tráfego é bloqueado: seguro, porém indisponível",
        "Se o controle falha, o tráfego passa",
        "O controle nunca falha",
        "O sistema reinicia sozinho",
      ],
      answer: 0,
      explain: "Pagamentos tendem a fechar; páginas públicas tendem a abrir. A decisão deve ser consciente e testada.",
    },
    {
      q: "Por que a autorização por objeto não pode ficar só na borda?",
      options: [
        "A borda não conhece o contexto de negócio, como quem pode ver aquele pedido",
        "A borda não lê cabeçalhos",
        "Porque a aplicação é mais rápida",
        "Porque a borda não suporta HTTPS",
      ],
      answer: 0,
      explain: "Cada camada cobre o ponto cego da anterior: a borda cuida do que independe do negócio.",
    },
  ],
};
