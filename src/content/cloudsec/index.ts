import type { Domain, TopicKind } from "@/content/types";

import { iam } from "./topics/iam";
import { network } from "./topics/network";
import { kubernetes } from "./topics/kubernetes";
import { containers } from "./topics/containers";
import { cspm } from "./topics/cspm";
import { cwpp } from "./topics/cwpp";
import { secretsCloud } from "./topics/secrets-cloud";
import { kmsCrypto } from "./topics/kms-crypto";
import { loggingDetection } from "./topics/logging-detection";
import { zeroTrust } from "./topics/zero-trust";
import { relations } from "./relations";
import { pipeline } from "./pipeline";
import { glossary } from "./glossary";
import { graphLayout } from "./graph-layout";

// Per-domain kind metadata. CloudSec drops the "de teste" qualifier from
// AppSec's `tecnica` label (CloudSec techniques aren't tests; they're
// controls). The dot/text colors are the same so badges read visually
// identical across domains — only the textual label differs.
const kindMeta: Record<TopicKind, { label: string; dot: string; text: string }> = {
  tecnica: { label: "técnica", dot: "bg-emerald-400", text: "text-emerald-400" },
  pratica: { label: "prática", dot: "bg-sky-400", text: "text-sky-400" },
  conceito: { label: "conceito", dot: "bg-amber-400", text: "text-amber-400" },
};

export const cloudsec: Domain = {
  id: "cloudsec",
  route: "/cloudsec",
  status: "live",
  accent: "sky",
  kindMeta,
  topics: [
    iam,
    network,
    kubernetes,
    containers,
    cspm,
    cwpp,
    secretsCloud,
    kmsCrypto,
    loggingDetection,
    zeroTrust,
  ],
  relations,
  pipeline,
  glossary,
  graphLayout,
};
