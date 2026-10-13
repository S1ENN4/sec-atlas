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
