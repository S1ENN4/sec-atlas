// The explorable world: structure only (ids, nesting, files, code, links).
// All prose lives in ./text.ts, keyed by node id, so it can be translated.
//
// Rules (checked by validate-content R12):
//   - every node id has an entry in text.nodes
//   - every `topics` entry is "<domain>/<slug>" of an existing topic
//   - every challenge line number exists in the node's code
//   - every mission step is a node id

export type NodeKind = "place" | "file" | "tool" | "check" | "artifact" | "concept";

export interface WorldNode {
  id: string;
  kind: NodeKind;
  /** Literal file or path where this thing lives (not translated). */
  path?: string;
  /** Topics to study, "<domain>/<slug>". */
  topics?: string[];
  code?: { lang: string; text: string };
  /** 1-based lines of `code` that are the risky ones (turns the code into a challenge). */
  risky?: number[];
  children?: WorldNode[];
  /** Node ids on other maps that explain the same idea in general terms. */
  see?: string[];
  /** Lab exercise id (src/content/explore/text.ts lab.exercises) to try this in practice. */
  lab?: string;
}

const SHA = "<40-char-sha>";

export const world: WorldNode = {
  id: "pipeline",
  kind: "place",
  children: [
    {
      id: "dev",
      kind: "place",
      topics: ["appsec/shift-left"],
      children: [
        {
          id: "precommit",
          kind: "file",
          path: ".pre-commit-config.yaml",
          topics: ["appsec/secrets"],
          code: {
            lang: "yaml",
            text: `repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files`,
          },
        },
        { id: "signed-commits", kind: "concept", topics: ["devops/git-workflows"] },
      ],
    },
    {
      id: "repo",
      kind: "place",
      topics: ["devops/git-workflows", "seceng/cicd-hardening"],
      children: [
        { id: "branch-protection", kind: "check", topics: ["devops/git-workflows", "seceng/cicd-hardening"] },
        {
          id: "codeowners",
          kind: "file",
          path: ".github/CODEOWNERS",
          topics: ["seceng/cicd-hardening"],
          code: {
            lang: "text",
            text: `# Anyone touching pipelines, infra or auth needs the security team
/.github/workflows/   @acme/security-team
/infra/               @acme/platform-team @acme/security-team
/src/auth/            @acme/security-team`,
          },
        },
        {
          id: "dependabot",
          kind: "file",
          path: ".github/dependabot.yml",
          topics: ["appsec/sca"],
          code: {
            lang: "yaml",
            text: `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"`,
          },
        },
        { id: "secret-push", kind: "check", topics: ["appsec/secrets"] },
      ],
    },
    {
      id: "ci",
      kind: "file",
      path: ".github/workflows/ci.yml",
      topics: ["devops/ci-pipelines", "appsec/cicd", "seceng/cicd-hardening"],
      code: {
        lang: "yaml",
        text: `name: ci
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  sast:        # static analysis
    ...
  sca:         # dependency review
    ...
  secrets:     # secrets scan
    ...
  iac:         # infrastructure scan
    ...
  build:
    needs: [sast, sca, secrets, iac]
    ...`,
      },
      children: [
        {
          id: "ci-trigger",
          kind: "concept",
          path: ".github/workflows/*.yml",
          topics: ["seceng/cicd-hardening"],
          code: {
            lang: "yaml",
            text: `name: pr-preview
on:
  pull_request_target:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
      - run: npm ci && npm test`,
          },
          risky: [3, 10],
        },
        {
          id: "ci-permissions",
          kind: "concept",
          path: ".github/workflows/release.yml",
          topics: ["seceng/cicd-hardening"],
          code: {
            lang: "yaml",
            text: `name: release
on:
  push:
    branches: [main]
permissions: write-all
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@${SHA} # v4
      - run: npm publish`,
          },
          risky: [5],
        },
        {
          id: "ci-pinning",
          kind: "concept",
          path: ".github/workflows/ci.yml",
          topics: ["seceng/cicd-hardening"],
          code: {
            lang: "yaml",
            text: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@${SHA} # v4.1.1
      - uses: some-org/setup-tool@main
      - uses: some-org/upload@v1
      - run: ./build.sh`,
          },
          risky: [6, 7],
        },
        {
          id: "ci-injection",
          kind: "concept",
          path: ".github/workflows/greet.yml",
          topics: ["seceng/cicd-hardening"],
          code: {
            lang: "yaml",
            text: `on: pull_request
jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Thanks for \${{ github.event.pull_request.title }}"
      - env:
          TITLE: \${{ github.event.pull_request.title }}
        run: echo "Thanks for $TITLE"`,
          },
          risky: [6],
        },
        {
          id: "sast",
          kind: "check",
          topics: ["appsec/sast"],
          children: [
            {
              id: "sast-tool",
              kind: "tool",
              path: ".github/workflows/ci.yml",
              topics: ["appsec/sast"],
              code: {
                lang: "yaml",
                text: `sast:
  runs-on: ubuntu-latest
  permissions:
    contents: read
    security-events: write
  steps:
    - uses: actions/checkout@${SHA} # v4
    - uses: github/codeql-action/init@${SHA} # v3
      with:
        languages: javascript-typescript
        queries: security-extended
    - uses: github/codeql-action/analyze@${SHA} # v3`,
              },
            },
            { id: "sast-triage", kind: "concept", topics: ["appsec/sast"] },
            {
              id: "sast-gate",
              kind: "check",
              topics: ["appsec/sast", "appsec/devsecops"],
              code: {
                lang: "yaml",
                text: `- name: Fail on new high-severity findings
  run: semgrep scan --config p/ci --severity ERROR --error`,
              },
            },
          ],
        },
        {
          id: "sca",
          kind: "check",
          path: ".github/workflows/ci.yml",
          topics: ["appsec/sca"],
          code: {
            lang: "yaml",
            text: `sca:
  runs-on: ubuntu-latest
  permissions:
    contents: read
  steps:
    - uses: actions/checkout@${SHA} # v4
    - uses: actions/dependency-review-action@${SHA} # v4
      with:
        fail-on-severity: high`,
          },
        },
        {
          id: "secrets-scan",
          kind: "check",
          path: ".github/workflows/ci.yml",
          topics: ["appsec/secrets"],
          code: {
            lang: "yaml",
            text: `secrets:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@${SHA} # v4
      with:
        fetch-depth: 0
    - uses: gitleaks/gitleaks-action@${SHA} # v2
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
          },
        },
        {
          id: "iac-scan",
          kind: "check",
          topics: ["seceng/iac-seguro", "devops/infrastructure-as-code"],
          code: {
            lang: "yaml",
            text: `iac:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@${SHA} # v4
    - run: trivy config --severity HIGH,CRITICAL --exit-code 1 infra/`,
          },
        },
      ],
    },
    {
      id: "build",
      kind: "place",
      topics: ["devops/container-images"],
      children: [
        {
          id: "dockerfile",
          kind: "file",
          path: "Dockerfile",
          topics: ["devops/container-images", "cloudsec/containers"],
          code: {
            lang: "dockerfile",
            text: `FROM node:latest
WORKDIR /app
COPY . .
ADD https://example.com/install.sh /tmp/install.sh
RUN npm install
ENV DB_PASSWORD=hunter2
EXPOSE 3000
CMD ["node", "server.js"]`,
          },
          risky: [1, 4, 6],
        },
        {
          id: "registry",
          kind: "artifact",
          topics: ["seceng/cicd-hardening", "appsec/sbom"],
          code: {
            lang: "yaml",
            text: `permissions:
  id-token: write   # keyless signing through OIDC
  packages: write
steps:
  - id: build
    uses: docker/build-push-action@${SHA} # v6
    with:
      push: true
      tags: ghcr.io/acme/app:\${{ github.sha }}
  - uses: sigstore/cosign-installer@${SHA} # v3
  - run: cosign sign --yes ghcr.io/acme/app@\${{ steps.build.outputs.digest }}`,
          },
        },
        {
          id: "sbom",
          kind: "artifact",
          topics: ["appsec/sbom"],
          code: {
            lang: "yaml",
            text: `- run: syft ghcr.io/acme/app@\${{ steps.build.outputs.digest }} -o spdx-json=sbom.spdx.json
- run: >
    cosign attest --yes --type spdxjson --predicate sbom.spdx.json
    ghcr.io/acme/app@\${{ steps.build.outputs.digest }}`,
          },
        },
      ],
    },
    {
      id: "deploy",
      kind: "place",
      topics: ["devops/release-strategies", "devops/delivery-lifecycle"],
      children: [
        {
          id: "envs",
          kind: "file",
          path: ".github/workflows/deploy.yml",
          topics: ["devops/release-strategies"],
          code: {
            lang: "yaml",
            text: `deploy:
  needs: build
  runs-on: ubuntu-latest
  environment: production   # reviewers and branch rules live here
  permissions:
    id-token: write
    contents: read
  steps:
    - uses: aws-actions/configure-aws-credentials@${SHA} # v4
      with:
        role-to-assume: arn:aws:iam::123456789012:role/deploy-prod
        aws-region: eu-west-1`,
          },
        },
        {
          id: "iac",
          kind: "file",
          path: "infra/main.tf",
          topics: ["devops/infrastructure-as-code", "seceng/policy-as-code"],
          code: {
            lang: "yaml",
            text: `- run: terraform plan -out=tfplan
- run: terraform show -json tfplan > tfplan.json
- run: conftest test tfplan.json --policy policy/`,
          },
        },
        {
          id: "admission",
          kind: "check",
          topics: ["seceng/policy-as-code", "cloudsec/kubernetes"],
          code: {
            lang: "yaml",
            text: `apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-signed-images
spec:
  validationFailureAction: Enforce
  rules:
    - name: verify-signature
      match:
        any:
          - resources:
              kinds: [Pod]
      verifyImages:
        - imageReferences: ["ghcr.io/acme/*"]
          attestors:
            - entries:
                - keyless:
                    issuer: https://token.actions.githubusercontent.com
                    subject: https://github.com/acme/app/.github/workflows/*`,
          },
        },
      ],
    },
    {
      id: "runtime",
      kind: "place",
      topics: ["secops/defesa-em-camadas"],
      children: [
        { id: "waf", kind: "tool", topics: ["secops/waf"] },
        { id: "runtime-secrets", kind: "tool", topics: ["cloudsec/secrets-cloud"] },
        { id: "detect", kind: "tool", topics: ["secops/detection-engineering", "cloudsec/logging-detection"] },
      ],
    },
    { id: "feedback", kind: "concept", topics: ["devops/observability", "appsec/devsecops"] },
  ],
};

export interface Mission {
  id: string;
  /** Node ids, visited in order. Nodes with a challenge must be solved. */
  steps: string[];
}

export const missions: Mission[] = [
  { id: "follow-commit", steps: ["dev", "repo", "ci", "build", "deploy", "runtime"] },
  { id: "stop-leaks", steps: ["precommit", "secret-push", "secrets-scan", "runtime-secrets"] },
  { id: "harden-pipeline", steps: ["ci-trigger", "ci-permissions", "ci-pinning", "ci-injection"] },
  { id: "trust-dependencies", steps: ["dependabot", "sca", "sbom", "admission"] },
];

// --- derived indexes ---------------------------------------------------------

export interface FlatNode extends Omit<WorldNode, "children"> {
  parent: string | null;
  depth: number;
  children: string[];
}

export function flatten(root: WorldNode = world): Record<string, FlatNode> {
  const out: Record<string, FlatNode> = {};
  const walk = (n: WorldNode, parent: string | null, depth: number) => {
    const { children, ...rest } = n;
    out[n.id] = { ...rest, parent, depth, children: (children ?? []).map((c) => c.id) };
    for (const c of children ?? []) walk(c, n.id, depth + 1);
  };
  walk(root, null, 0);
  return out;
}
