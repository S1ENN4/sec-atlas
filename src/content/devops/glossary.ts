import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "delivery",
    title: "delivery",
    entries: [
      {
        term: "CI",
        aka: "continuous integration",
        meaning: "Merging small changes into a shared branch often, with every change built and tested automatically so integration problems appear within minutes.",
        topic: "delivery-lifecycle",
      },
      {
        term: "CD",
        aka: "continuous delivery · continuous deployment",
        meaning: "Delivery keeps every change deployable at any time; deployment goes further and releases each passing change to production automatically.",
        topic: "delivery-lifecycle",
      },
      {
        term: "Artifact",
        meaning: "The versioned, immutable output of a build (a container image, a package). The same artifact is promoted through every environment.",
        topic: "ci-pipelines",
      },
      {
        term: "Trunk-based development",
        meaning: "Working in short-lived branches merged into the main branch frequently, hiding unfinished work behind feature flags.",
        topic: "git-workflows",
      },
      {
        term: "CODEOWNERS",
        meaning: "A repository file that maps paths to the people or teams who must review changes there.",
        topic: "git-workflows",
      },
    ],
  },
  {
    id: "release",
    title: "release",
    entries: [
      {
        term: "Canary release",
        meaning: "Sending a small share of traffic to a new version, watching its metrics, then widening it. Limits the damage of a bad release.",
        topic: "release-strategies",
      },
      {
        term: "Blue/green deployment",
        meaning: "Two full environments: traffic switches from the old to the new at once, and rollback is switching back.",
        topic: "release-strategies",
      },
      {
        term: "Feature flag",
        meaning: "A switch in configuration that turns a feature on or off without a deploy. Separates deploying code from releasing it.",
        topic: "release-strategies",
      },
    ],
  },
  {
    id: "platform",
    title: "platform",
    entries: [
      {
        term: "IaC",
        aka: "infrastructure as code",
        meaning: "Describing infrastructure in versioned files that are reviewed and applied by tools, so environments are reproducible.",
        topic: "infrastructure-as-code",
      },
      {
        term: "Drift",
        meaning: "A difference between the real infrastructure and what the code says, usually from a manual change.",
        topic: "infrastructure-as-code",
      },
      {
        term: "Container image",
        meaning: "A read-only stack of layers plus metadata from which containers start. Identified by a digest, tagged by a mutable name.",
        topic: "container-images",
      },
      {
        term: "Pod",
        meaning: "In Kubernetes, one or more containers that run together and share a network identity. The smallest deployable, and disposable, unit.",
        topic: "kubernetes-basics",
      },
      {
        term: "Probe",
        aka: "readiness · liveness",
        meaning: "A health check the cluster runs: readiness decides whether a pod gets traffic, liveness decides whether it should be restarted.",
        topic: "kubernetes-basics",
      },
    ],
  },
  {
    id: "operations",
    title: "operations and reliability",
    entries: [
      {
        term: "SLI",
        aka: "service level indicator",
        meaning: "A measurement of service quality as users experience it, such as the fraction of requests that succeed quickly.",
        topic: "sre-reliability",
      },
      {
        term: "SLO",
        aka: "service level objective",
        meaning: "The target for an SLI over a window. It defines how reliable is reliable enough.",
        topic: "sre-reliability",
      },
      {
        term: "Error budget",
        meaning: "The allowed unreliability, 100% minus the SLO. While it remains you can take risks; when spent, reliability work comes first.",
        topic: "sre-reliability",
      },
      {
        term: "Golden signals",
        meaning: "Latency, traffic, errors and saturation: four measurements that describe the health of almost any service.",
        topic: "observability",
      },
      {
        term: "Cardinality",
        meaning: "The number of distinct label combinations in a metric. Unbounded labels (user ids) can overwhelm a metrics system.",
        topic: "observability",
      },
      {
        term: "Postmortem",
        aka: "blameless review",
        meaning: "A written review of an incident that asks how the system allowed it, not who erred, and ends with owned actions.",
        topic: "sre-reliability",
      },
    ],
  },
];
