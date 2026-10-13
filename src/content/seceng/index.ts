import type { Domain, TopicKind } from "@/content/types";

import { automacaoSoar } from "./topics/automacao-soar";
import { cicdHardening } from "./topics/cicd-hardening";
import { confiabilidadeEmEscala } from "./topics/confiabilidade-em-escala";
import { iacSeguro } from "./topics/iac-seguro";
import { iaNaSeguranca } from "./topics/ia-na-seguranca";
import { observabilidadePlataforma } from "./topics/observabilidade-plataforma";
import { plataformaComoProduto } from "./topics/plataforma-como-produto";
import { policyAsCode } from "./topics/policy-as-code";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";
import { graphLayout } from "./graph-layout";

const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "técnica", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "prática", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "conceito", dot: "bg-amber-400", text: "text-amber-400" },
};

export const seceng: Domain = {
  id: "seceng",
  route: "/engenharia",
  status: "live",
  accent: "rose",
  kindMeta,
  topics: [
    iacSeguro,
    policyAsCode,
    cicdHardening,
    confiabilidadeEmEscala,
    observabilidadePlataforma,
    automacaoSoar,
    iaNaSeguranca,
    plataformaComoProduto,
  ],
  relations,
  pipeline,
  glossary,
  graphLayout,
};
