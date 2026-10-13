import type { Topic } from "@/content/types";

export const releaseStrategies: Topic = {
  domain: "devops",
  slug: "release-strategies",
  title: "Release strategies and rollback",
  short: "blue/green, canary, rolling and feature flags: shipping without betting the company",
  tagline:
    "Deploying and releasing are different. You can put code in production dark, then turn it on gradually and turn it off in seconds if it misbehaves.",
  kind: "pratica",
  stage: "deliver",
  tools: ["Kubernetes rolling updates", "Argo Rollouts / Flagger", "feature flags (OpenFeature, Unleash)", "load balancers", "database migrations tools"],
  sections: [
    {
      heading: "The strategies",
      bullets: [
        "Rolling: replace instances a few at a time. Simple and the default in most orchestrators; old and new versions run side by side for a while.",
        "Blue/green: keep two full environments and switch traffic from the old (blue) to the new (green) at once. Rollback is switching back; costs double capacity during the switch.",
        "Canary: send a small share of traffic to the new version, watch the metrics, then widen. Limits the blast radius of a bad release.",
        "Feature flags: ship code disabled and enable it per user, percentage or environment. Separates deploy from release and gives an instant off switch.",
        "Shadow traffic: copy real requests to the new version without returning its answers, to compare behavior safely.",
      ],
    },
    {
      heading: "Rollback is a design decision",
      bullets: [
        "Keep the previous artifact deployable and deploy by immutable version or digest.",
        "Make database changes backward compatible (expand, migrate, contract) so the old code still works with the new schema.",
        "Decide in advance what metric triggers a rollback, and automate it where you can.",
        "Practice the rollback: an untested rollback is a hope.",
      ],
    },
    {
      heading: "Example: a canary rollout",
      body: ["A progressive delivery controller moves traffic in steps and checks metrics between them. The sketch below uses Argo Rollouts syntax."],
      code: [
        {
          language: "yaml",
          filename: "rollout.yaml (Argo Rollouts)",
          code: "apiVersion: argoproj.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: api\nspec:\n  replicas: 6\n  selector:\n    matchLabels: { app: api }\n  strategy:\n    canary:\n      steps:\n        - setWeight: 10\n        - pause: { duration: 5m }\n        - setWeight: 50\n        - pause: { duration: 10m }\n  template:\n    metadata:\n      labels: { app: api }\n    spec:\n      containers:\n        - name: api\n          image: registry.example.com/api@sha256:<digest>",
        },
      ],
    },
    {
      heading: "Choosing",
      body: [
        "Match the strategy to the risk and the cost. A low-risk internal tool can use rolling updates. A payment path deserves a canary with automatic rollback. A change that touches data needs the compatible-schema discipline whatever the strategy.",
      ],
    },
  ],
};
