import type { Relation } from "@/content/types";

const ref = (slug: string) => ({ domain: "seceng" as const, slug });

export const relations: Relation[] = [
  { source: ref("iac-seguro"), target: ref("policy-as-code"), label: "é validado por" },
  { source: ref("iac-seguro"), target: ref("cicd-hardening"), label: "passa pela" },
  { source: ref("policy-as-code"), target: ref("cicd-hardening"), label: "vira gate" },
  { source: ref("go-para-seguranca"), target: ref("kafka-eventos"), label: "publica e consome" },
  { source: ref("kafka-eventos"), target: ref("confiabilidade-em-escala"), label: "exige" },
  { source: ref("confiabilidade-em-escala"), target: ref("observabilidade-plataforma"), label: "é medida por" },
  { source: ref("kafka-eventos"), target: ref("automacao-soar"), label: "dispara" },
  { source: ref("automacao-soar"), target: ref("ia-na-seguranca"), label: "pode usar" },
  { source: ref("automacao-soar"), target: ref("confiabilidade-em-escala"), label: "depende de" },
  { source: ref("plataforma-como-produto"), target: ref("confiabilidade-em-escala"), label: "define o SLO" },
  { source: ref("plataforma-como-produto"), target: ref("policy-as-code"), label: "entrega como caminho pavimentado" },
  { source: ref("plataforma-como-produto"), target: ref("cicd-hardening"), label: "padroniza" },
];
