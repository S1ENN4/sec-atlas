export interface ChangelogEntry {
  date: string; // ISO
  title: string;
  items: string[];
}

// Newest first. Add an entry whenever content or features change in a way a
// returning reader would care about; it doubles as a public record of
// corrections.
export const changelog: ChangelogEntry[] = [
  {
    date: "2026-10-13",
    title: "Manifesto e servidor MCP",
    items: [
      "Página de manifesto: por que o jeito de ensinar segurança precisa mudar e o que este projeto faz diferente.",
      "Servidor MCP local (7 ferramentas, sem dependências) para agentes de código lerem, buscarem, validarem e criarem o esqueleto de novos tópicos.",
      "Smoke test do servidor MCP no CI, com checagem das recusas de segurança.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Projeto aberto",
    items: [
      "Código sob MIT e conteúdo sob CC BY-SA 4.0, com guia de contribuição, código de conduta e política de segurança.",
      "CI com validação de conteúdo e orçamento de tamanho, análise estática (CodeQL) e atualização automática de dependências.",
      "Modelos de issue para erros de conteúdo e propostas de tópico: correções são o tipo de contribuição mais bem-vindo.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Novo domínio: Engenharia de segurança",
    items: [
      "Mapa com 8 tópicos: IaC seguro, policy as code, hardening de CI/CD, confiabilidade em escala, observabilidade da plataforma, automação (SOAR), IA na segurança e segurança como produto.",
      "Trilha de estudo, cenário de ataque (esteira comprometida) e quiz em todos os tópicos.",
      "Pontes com AppSec, CloudSec, SecOps e agentes de IA.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Novo domínio: SecOps e defesa L7",
    items: [
      "Mapa com 10 tópicos: telemetria de borda, escala, ataques L7, engenharia de detecção, WAF, rate limiting, bot management, runbooks, SLOs de SOC e defesa em camadas.",
      "Trilha de estudo e cenário de ataque (credential stuffing) do novo domínio, com quiz em todos os tópicos.",
      "Pontes com AppSec, CloudSec e agentes de IA.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Landing pessoal, páginas de apoio e fontes",
    items: [
      "Apresentação no topo do hub, página Sobre (experiência, formação, certificações), resumo em inglês e links de contato.",
      "Pré-visualização de link (Open Graph), sitemap e robots para compartilhamento.",
      "Página de fontes por domínio, e em cada tópico a data de atualização e um link para reportar erros.",
      "Página de novidades (esta) para registrar mudanças e correções.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Estudo guiado",
    items: [
      "Trilhas de estudo com progresso salvo só no navegador.",
      "Cenários de ataque passo a passo e quiz em todos os tópicos (105 perguntas).",
      "Busca global (Ctrl+K), painel de detalhes no mapa, filtros e visão em lista no celular.",
      "Pontes entre domínios: o mesmo problema visto em AppSec, CloudSec e agentes de IA.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Conteúdo novo e mapas mais legíveis",
    items: [
      "Novos tópicos: threat modeling (AppSec) e resposta a incidentes (CloudSec).",
      "CI/CD passou a aparecer no mapa do AppSec.",
      "Mapas reorganizados: cards alinhados por etapa, relações só no foco e linhas retas.",
    ],
  },
];
