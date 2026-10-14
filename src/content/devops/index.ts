import type { Domain, TopicKind } from "@/content/types";

import { ciPipelines } from "./topics/ci-pipelines";
import { containerImages } from "./topics/container-images";
import { deliveryLifecycle } from "./topics/delivery-lifecycle";
import { gitWorkflows } from "./topics/git-workflows";
import { infrastructureAsCode } from "./topics/infrastructure-as-code";
import { kubernetesBasics } from "./topics/kubernetes-basics";
import { linuxAndNetworking } from "./topics/linux-and-networking";
import { observability } from "./topics/observability";
import { releaseStrategies } from "./topics/release-strategies";
import { sreReliability } from "./topics/sre-reliability";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";

const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "technique", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "practice", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "concept", dot: "bg-amber-400", text: "text-amber-400" },
};

// Authored in English (the source language). The foundations that DevOps and
// DevSecOps roles stand on; the security hardening of each piece lives in the
// Engineering and Cloud domains and is linked through bridges.
export const devops: Domain = {
  id: "devops",
  route: "/devops",
  status: "live",
  contentLang: "en",
  accent: "orange",
  kindMeta,
  topics: [
    linuxAndNetworking,
    gitWorkflows,
    containerImages,
    deliveryLifecycle,
    ciPipelines,
    releaseStrategies,
    infrastructureAsCode,
    kubernetesBasics,
    observability,
    sreReliability,
  ],
  relations,
  pipeline,
  glossary,
};
