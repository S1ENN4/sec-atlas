import type { Topic } from "@/content/types";

export const ciPipelines: Topic = {
  domain: "devops",
  slug: "ci-pipelines",
  title: "CI pipelines that stay fast",
  short: "stages, caching, artifacts and reproducible builds",
  tagline:
    "A pipeline people trust is fast, deterministic and clear when it fails. A slow or flaky one trains the team to ignore it.",
  kind: "tecnica",
  stage: "deliver",
  tools: ["GitHub Actions", "GitLab CI", "Buildkite", "BuildKit cache", "Renovate", "act (run workflows locally)"],
  sections: [
    {
      heading: "Anatomy",
      bullets: [
        "Trigger: a push, a pull request, a tag or a schedule.",
        "Jobs run on fresh runners; each job is isolated, so share data through artifacts and caches, not through the machine.",
        "Stages order the work: lint and unit tests first (fast, cheap), then integration tests, then build and publish the artifact.",
        "Gates: required checks must pass before merge.",
        "Environments and approvals guard deployment to sensitive targets.",
      ],
    },
    {
      heading: "A pipeline example",
      body: ["Fail fast with cheap checks, run independent jobs in parallel, cache dependencies, cancel superseded runs, and keep permissions minimal."],
      code: [
        {
          language: "yaml",
          filename: ".github/workflows/ci.yml",
          code: "name: ci\non:\n  pull_request:\n  push: { branches: [main] }\nconcurrency:\n  group: ci-${{ github.ref }}\n  cancel-in-progress: true\npermissions:\n  contents: read\njobs:\n  lint-test:\n    runs-on: ubuntu-latest\n    timeout-minutes: 15\n    steps:\n      - uses: actions/checkout@<full-commit-sha>\n      - uses: actions/setup-node@<full-commit-sha>\n        with: { node-version: 22, cache: npm }\n      - run: npm ci\n      - run: npm run lint && npm test\n  build:\n    needs: lint-test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@<full-commit-sha>\n      - run: docker build -t app:${{ github.sha }} .",
        },
      ],
    },
    {
      heading: "Keeping it fast and reliable",
      bullets: [
        "Cache dependencies and build layers, keyed on the lockfile.",
        "Run tests in parallel and split slow suites; quarantine flaky tests and fix them, never retry blindly.",
        "Set timeouts so a hung job does not hold the queue.",
        "Make builds reproducible: pinned tools, lockfiles, no network surprises.",
        "Treat the pipeline as production code: review it, test changes, and give it least privilege (see the Security engineering domain).",
      ],
    },
    {
      heading: "Reading a failure",
      body: [
        "A failing job should say what broke in its first screen. Print the failing test and the command that reproduces it locally. If people need to ask \"why is CI red?\", the pipeline is missing information.",
      ],
    },
  ],
};
