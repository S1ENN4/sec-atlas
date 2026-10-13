import type { Topic } from "@/content/types";

export const deliveryLifecycle: Topic = {
  domain: "devops",
  slug: "delivery-lifecycle",
  title: "The delivery lifecycle",
  short: "from commit to production and back: continuous integration, delivery and deployment",
  tagline:
    "DevOps is the practice of shortening the loop between an idea and learning how it behaves in production, while keeping each step safe. The pipeline is how that loop is made repeatable.",
  kind: "conceito",
  stage: "deliver",
  tools: ["GitHub Actions", "GitLab CI", "Jenkins", "ArgoCD / Flux", "Terraform", "feature flags"],
  sections: [
    {
      heading: "The loop",
      bullets: [
        "Plan and code: small changes, in version control.",
        "Build and test: every commit is compiled and tested automatically (continuous integration).",
        "Release: the tested result becomes a versioned, immutable artifact (a container image, a package).",
        "Deploy: the artifact reaches an environment through an automated, repeatable process (continuous delivery means it can go to production at any time; continuous deployment means it does so automatically).",
        "Operate and observe: monitoring, logs and traces show how it behaves.",
        "Learn and feed back: incidents, metrics and user feedback shape the next change.",
      ],
    },
    {
      heading: "Principles",
      bullets: [
        "Build once, deploy many: the same artifact moves through test, staging and production. Only configuration changes.",
        "Everything as code: application, infrastructure, pipeline and policy live in version control and go through review.",
        "Small batches: frequent small releases are easier to understand, test and roll back than rare big ones.",
        "Automate the repeatable, keep humans for judgment: approvals for risky steps, not for typing commands.",
        "Fast feedback: a failing check should tell you within minutes.",
        "You build it, you run it: the team that writes the code owns how it behaves in production.",
      ],
    },
    {
      heading: "Environments",
      body: [
        "Typical environments are development, staging (as close to production as practical) and production. Their differences should be configuration, not code, and each one should be reproducible from code. A staging that differs from production in important ways produces false confidence.",
      ],
    },
    {
      heading: "Measuring delivery",
      body: [
        "Four measures from the DORA research are widely used: how often you deploy, how long a change takes from commit to production, how often a change causes a failure, and how fast you restore service. Use them as a conversation about the system, not as targets for individuals; a measure that becomes a target gets gamed.",
      ],
    },
  ],
};
