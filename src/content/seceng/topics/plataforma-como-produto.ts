import type { Topic } from "@/content/types";

export const plataformaComoProduto: Topic = {
  domain: "seceng",
  slug: "plataforma-como-produto",
  title: "Segurança como produto interno",
  short: "o caminho seguro precisa ser o caminho mais fácil",
  tagline:
    "Controles que atrapalham são contornados. Uma plataforma de segurança que trata devs como clientes, com caminho pavimentado, métricas de adoção e atrito baixo, é a que realmente protege.",
  kind: "conceito",
  stage: null,
  tools: ["Backstage", "Terraform modules", "OPA", "Internal CLI"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Em vez de um time de segurança que revisa tudo no fim (e vira gargalo), a engenharia de segurança constrói a plataforma que torna o comportamento seguro o padrão: módulos, templates, esteiras, bibliotecas e verificações prontas, com documentação e suporte, oferecidos como um produto interno.",
      ],
    },
    {
      heading: "Caminho pavimentado",
      body: [
        "O caminho pavimentado (golden path) é a forma recomendada de fazer algo: criar um serviço novo, publicar uma imagem, provisionar um banco. Quem o segue ganha de graça cifragem, logs, políticas e esteira configurados. Quem sai dele pode, mas assume o custo e passa por revisão. Isso muda o incentivo: a segurança deixa de ser um imposto e vira o atalho.",
      ],
    },
    {
      heading: "Métricas de produto",
      bullets: [
        "Adoção: percentual de serviços usando o template ou o módulo aprovado.",
        "Cobertura: percentual de repositórios com SAST, SCA e escaneamento de segredos ativos.",
        "Tempo para onboarding: quanto leva para um time novo estar dentro do padrão.",
        "Atrito: tempo adicionado à esteira por controle, e taxa de falso positivo percebida pelos devs.",
        "Tempo de correção: da descoberta de um achado à correção, por severidade.",
      ],
    },
    {
      heading: "Atrito é um custo real",
      body: [
        "Cada controle que bloqueia sem explicar, demora ou erra vira motivo para contornar a plataforma. Mensagens claras (o que falhou, por quê e como corrigir), correção automática quando possível e exceções com prazo reduzem o atrito. Se os devs estão desligando um controle, o problema do produto é o controle, não os devs.",
      ],
    },
    {
      heading: "SLOs da plataforma",
      body: [
        "A plataforma tem usuários e, portanto, metas: disponibilidade da esteira de segurança, latência das verificações, tempo de resposta a pedidos de exceção. Tratar esses números como objetivo, e não como acaso, é o que dá à segurança credibilidade de engenharia diante dos demais times.",
      ],
    },
  ],
};
