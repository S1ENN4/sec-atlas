import type { Topic } from "@/content/types";

export const threatModeling: Topic = {
  domain: "appsec",
  slug: "threat-modeling",
  title: "Threat modeling - pensar como o atacante antes de codar",
  short: "achar a falha no desenho, antes de existir código",
  tagline:
    "Modelagem de ameaças é a conversa estruturada que descobre o que pode dar errado enquanto ainda é barato corrigir: no desenho, não no pentest.",
  kind: "pratica",
  stage: "source",
  tools: ["STRIDE", "OWASP Threat Dragon", "Microsoft Threat Modeling Tool", "pytm", "IriusRisk"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Threat modeling é o exercício de olhar para um sistema (ou uma feature) e perguntar, de forma sistemática, o que pode dar errado, quem poderia causar isso e o que fazemos a respeito. Ele acontece antes ou durante o desenho, quando mudar uma decisão custa uma conversa e não uma sprint inteira.",
        "SAST, DAST e SCA encontram defeitos que já existem no código ou no ambiente. O threat model encontra defeitos de projeto: o serviço que confia em um header que o cliente controla, o fluxo de reset de senha que vaza se o e-mail existe, o bucket que mistura dados de tenants. Nenhum scanner enxerga isso porque nenhuma linha de código está \"errada\".",
      ],
    },
    {
      heading: "As quatro perguntas",
      body: [
        "O método mais simples cabe em quatro perguntas, repetidas a cada mudança relevante de arquitetura:",
      ],
      bullets: [
        "No que estamos trabalhando? Um diagrama de fluxo de dados (DFD) com atores, processos, armazenamentos e fronteiras de confiança.",
        "O que pode dar errado? Percorrer cada elemento e cada fluxo que cruza uma fronteira de confiança procurando ameaças (STRIDE ajuda aqui).",
        "O que vamos fazer a respeito? Para cada ameaça: mitigar, eliminar, transferir ou aceitar, com um dono e uma decisão registrada.",
        "Fizemos um bom trabalho? Revisar o modelo depois do release e depois de cada incidente, porque o sistema muda e o modelo envelhece.",
      ],
    },
    {
      heading: "STRIDE: um checklist de ameaças",
      body: [
        "STRIDE é um mnemônico da Microsoft que associa cada letra a uma propriedade de segurança violada. Ao olhar um fluxo no diagrama, você pergunta se cada uma das seis categorias se aplica:",
      ],
      bullets: [
        "Spoofing (falsificação de identidade) viola a autenticidade: alguém se passa por outro usuário ou serviço.",
        "Tampering (adulteração) viola a integridade: dados ou código alterados em trânsito ou em repouso.",
        "Repudiation (repúdio) viola o não-repúdio: não há log para provar quem fez o quê.",
        "Information disclosure (vazamento) viola a confidencialidade: dados expostos a quem não deveria ver.",
        "Denial of service (negação de serviço) viola a disponibilidade: o serviço é esgotado ou derrubado.",
        "Elevation of privilege (elevação de privilégio) viola a autorização: um usuário comum passa a agir como admin.",
      ],
    },
    {
      heading: "Threat model como código",
      body: [
        "O modelo não precisa viver em um slide esquecido. Ferramentas como pytm descrevem o sistema em código, geram o DFD e listam as ameaças aplicáveis. Versionado junto do repositório, o modelo passa por code review e muda no mesmo PR que muda a arquitetura.",
      ],
      code: [
        {
          language: "python",
          filename: "tm.py - exemplo com pytm",
          code: "from pytm import TM, Server, Datastore, Dataflow, Boundary, Actor\n\ntm = TM(\"Checkout API\")\ninternet = Boundary(\"Internet\")\nvpc = Boundary(\"VPC privada\")\n\nuser = Actor(\"Cliente\", inBoundary=internet)\napi = Server(\"API de checkout\", inBoundary=vpc)\ndb = Datastore(\"Pedidos\", inBoundary=vpc, isEncrypted=True)\n\nDataflow(user, api, \"POST /checkout (HTTPS)\", isEncrypted=True)\nDataflow(api, db, \"INSERT pedido\")\n\ntm.process()  # gera o DFD e a lista de ameaças STRIDE",
        },
      ],
    },
    {
      heading: "Como encaixar na esteira",
      body: [
        "O gatilho mais prático é o mesmo do code review: uma feature nova que toca autenticação, dados sensíveis, um serviço externo ou uma fronteira de confiança pede meia hora de threat model antes do primeiro commit. Para o resto, uma revisão rápida de ameaças no template do PR já cobre.",
        "As ameaças viram itens rastreáveis: cada mitigação aponta para um teste, uma regra de SAST ou um gate da esteira. Assim o threat model deixa de ser documento e passa a gerar verificações que rodam sozinhas, e o mapa fecha o ciclo: o desenho informa o que o SAST, o DAST e os gates precisam checar.",
      ],
    },
  ],
};
