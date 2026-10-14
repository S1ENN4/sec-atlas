// Single source of truth for everything personal on the site. Edit only this
// file to change the hero, /sobre, link previews and the footer. Any list
// left empty simply hides its section.
//
// Facts below come from the public LinkedIn profile (saved copy, Oct 2026).
// Private items (analytics, "open to work", credential ids) are deliberately
// left out.

export interface ProfileLink {
  label: string;
  href: string;
}

export interface ProfileItem {
  title: string;
  detail?: string;
  period?: string;
}

export const profile = {
  name: "Vitor Sienna",
  headline: "Security Operations Lead · DevSecOps, AppSec e Blue Team",
  location: "Brasília, Brasil",
  summary:
    "Líder de operações de segurança com background em AppSec e DevSecOps: WAF e defesa L7, detecção e resposta a incidentes, SAST, DAST e SCA em pipelines de CI/CD. Este site é o meu caderno público de estudo e portfólio: um mapa interativo que mostra o que cada verificação faz, onde ela entra na esteira e como as peças se conectam.",
  summaryEn:
    "Security operations lead with an AppSec and DevSecOps background: WAF and layer-7 defense, detection and incident response, and SAST, DAST and SCA in CI/CD pipelines. This site is my public study notebook and portfolio: an interactive map of what each security check does, where it fits in the delivery pipeline and how the pieces connect. It covers AppSec, cloud security and AI-agent security, with guided paths, attack scenarios and quizzes.",

  // Public base URL of the deployed site, used for link previews and the
  // sitemap. Set NEXT_PUBLIC_SITE_URL at build time.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  links: {
    linkedin: "https://www.linkedin.com/in/vitor-sienna/",
    website: "https://vitorsienna.com/",
    github: "https://github.com/S1ENN4",
    repo: "https://github.com/S1ENN4/sec-atlas",
    email: "", // shown publicly if filled
  },

  skills: ["DevSecOps", "AppSec", "WAF", "SAST", "DAST", "SCA", "CI/CD", "Cloud Security", "Blue Team", "Automação"],
  languages: ["Português (nativo)", "Inglês (fluente)"],

  experience: [
    {
      title: "CloudWalk · Security Operations Lead / Security Engineer",
      period: "fev/2025 – hoje",
      detail: "Liderança de SOC, defesa L7, telemetria de borda e aplicação, resposta a incidentes e pós-mortem com hardening.",
    },
    {
      title: "BB Tecnologia e Serviços · Senior Application Security Engineer",
      period: "jan/2024 – fev/2025",
      detail: "Estratégia DevSecOps, pipelines no Azure DevOps com Defender, treinamentos e workshops de segurança.",
    },
    {
      title: "NOVA8 · Application Security Engineer",
      period: "jun/2023 – fev/2024",
      detail: "Análise de código, gestão de vulnerabilidades, desenvolvimento seguro e automação de segurança.",
    },
    {
      title: "Every Cybersecurity and GRC Solutions · Analista de tecnologia",
      period: "mai/2021 – jun/2023",
      detail: "Automações e integrações de GRC e segurança em Python e NodeJS, com atendimento a clientes de grande porte.",
    },
    {
      title: "Vert Integradora de TI · Suporte técnico",
      period: "jan/2019 – jan/2021",
      detail: "Servidores Linux e Windows, scripts de automação (Python, Ansible, PowerShell).",
    },
  ] as ProfileItem[],

  education: [
    {
      title: "Pós-graduação em cibersegurança ofensiva · Acadi-TI",
      period: "2022 – 2024",
    },
    {
      title: "Análise e Desenvolvimento de Sistemas (CST) · UniCEUB",
      period: "2016 – 2018",
    },
  ] as ProfileItem[],

  certifications: [
    { title: "Microsoft Certified: Azure AI Engineer Associate", detail: "Microsoft · emitida em nov/2024, expirada em nov/2025" },
    { title: "CSAE · Certified Security Architecture Expert", detail: "Acadi-TI · mai/2023" },
    { title: "CNSE · Certified Network Security Expert", detail: "Acadi-TI · 2022" },
  ] as ProfileItem[],

  // Shown on /sobre and /fontes: how to report an error.
  contentNote:
    "Encontrou um erro ou uma imprecisão? Me avise pelo LinkedIn: corrijo e registro no changelog.",

  // ISO date of the last content update, shown as "atualizado em".
  contentUpdated: "2026-10-13",
};

export function contactLinks(): ProfileLink[] {
  const out: ProfileLink[] = [{ label: "LinkedIn", href: profile.links.linkedin }];
  if (profile.links.website) out.push({ label: "Site", href: profile.links.website });
  if (profile.links.github) out.push({ label: "GitHub", href: profile.links.github });
  if (profile.links.email) out.push({ label: "E-mail", href: `mailto:${profile.links.email}` });
  return out;
}

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
