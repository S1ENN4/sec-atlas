// Configuration labs (pick safer settings, then run an attack suite) and the
// tabletop (decisions with consequences). Prose lives in text.ts (lab.exercises).
import { attackExercises, type LabExercise } from "./lab";

export interface HardenOption {
  id: string;
  /** vulnerable: the original flaw. safe: the right fix. strict: blocks attacks but breaks real work. */
  kind: "vulnerable" | "safe" | "strict";
  code: string;
}
export interface HardenChoice {
  id: string;
  options: HardenOption[];
}
export interface HardenTest {
  id: string;
  type: "attack" | "legit";
  /** Choices this test depends on. An attack is blocked when any is safe or strict; legit work passes when none is strict. */
  deps: string[];
}
export interface HardenExercise {
  kind: "harden";
  id: "ci" | "iam" | "bucket";
  node: string;
  language: string;
  /** Code with {choiceId} placeholders, one per line. */
  template: string;
  choices: HardenChoice[];
  tests: HardenTest[];
}

export const hardenExercises: HardenExercise[] = [
  {
    kind: "harden",
    id: "ci",
    node: "a-ci",
    language: "yaml",
    template: `name: deploy
on:
  {trigger}
permissions: {perms}
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          {checkout}
      - {title}
      - {action}`,
    choices: [
      {
        id: "trigger",
        options: [
          { id: "pr-target", kind: "vulnerable", code: "pull_request_target:" },
          { id: "pr", kind: "safe", code: "pull_request:" },
          { id: "manual", kind: "strict", code: "workflow_dispatch:" },
        ],
      },
      {
        id: "perms",
        options: [
          { id: "write-all", kind: "vulnerable", code: "write-all" },
          { id: "read-only", kind: "safe", code: "{ contents: read }" },
          { id: "none", kind: "strict", code: "{}" },
        ],
      },
      {
        id: "checkout",
        options: [
          { id: "head-sha", kind: "vulnerable", code: "ref: ${{ github.event.pull_request.head.sha }}" },
          { id: "default-ref", kind: "safe", code: "# default ref: safe with the pull_request trigger" },
          { id: "fixed-main", kind: "strict", code: "ref: main" },
        ],
      },
      {
        id: "title",
        options: [
          { id: "inline", kind: "vulnerable", code: 'run: echo "Deploying ${{ github.event.pull_request.title }}"' },
          { id: "env", kind: "safe", code: 'env:\n  TITLE: ${{ github.event.pull_request.title }}\nrun: echo "Deploying $TITLE"' },
        ],
      },
      {
        id: "action",
        options: [
          { id: "at-main", kind: "vulnerable", code: "uses: aws-actions/configure-aws-credentials@main" },
          { id: "pinned", kind: "safe", code: "uses: aws-actions/configure-aws-credentials@<40-char-sha> # v4" },
        ],
      },
    ],
    tests: [
      { id: "a1", type: "attack", deps: ["trigger"] },
      { id: "a2", type: "attack", deps: ["perms"] },
      { id: "a3", type: "attack", deps: ["checkout", "trigger"] },
      { id: "a4", type: "attack", deps: ["title"] },
      { id: "a5", type: "attack", deps: ["action"] },
      { id: "l1", type: "legit", deps: ["trigger"] },
      { id: "l2", type: "legit", deps: ["perms"] },
      { id: "l3", type: "legit", deps: ["checkout"] },
    ],
  },
  {
    kind: "harden",
    id: "iam",
    node: "a-iam",
    language: "json",
    template: `{
  "Version": "2012-10-17",
  "Statement": [
    {tiles},
    {secrets},
    {passrole}
  ]
}`,
    choices: [
      {
        id: "tiles",
        options: [
          { id: "s3-all", kind: "vulnerable", code: '{ "Effect": "Allow", "Action": "s3:*", "Resource": "arn:aws:s3:::atlas-tiles-prod/*" }' },
          { id: "s3-get", kind: "safe", code: '{ "Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::atlas-tiles-prod/*" }' },
          { id: "s3-deny", kind: "strict", code: '{ "Effect": "Deny", "Action": "s3:*", "Resource": "*" }' },
        ],
      },
      {
        id: "secrets",
        options: [
          { id: "sm-all", kind: "vulnerable", code: '{ "Effect": "Allow", "Action": "secretsmanager:*", "Resource": "*" }' },
          {
            id: "sm-scoped",
            kind: "safe",
            code: '{ "Effect": "Allow", "Action": "secretsmanager:GetSecretValue", "Resource": "arn:aws:secretsmanager:eu-west-1:123456789012:secret:atlas/api-*" }',
          },
          { id: "sm-deny", kind: "strict", code: '{ "Effect": "Deny", "Action": "secretsmanager:*", "Resource": "*" }' },
        ],
      },
      {
        id: "passrole",
        options: [
          { id: "pass-all", kind: "vulnerable", code: '{ "Effect": "Allow", "Action": "iam:PassRole", "Resource": "*" }' },
          { id: "pass-none", kind: "safe", code: '{ "Effect": "Deny", "Action": "iam:PassRole", "Resource": "*" }' },
        ],
      },
    ],
    tests: [
      { id: "a1", type: "attack", deps: ["tiles"] },
      { id: "a2", type: "attack", deps: ["secrets"] },
      { id: "a3", type: "attack", deps: ["passrole"] },
      { id: "l1", type: "legit", deps: ["tiles"] },
      { id: "l2", type: "legit", deps: ["secrets"] },
    ],
  },
  {
    kind: "harden",
    id: "bucket",
    node: "a-tiles",
    language: "hcl",
    template: `resource "aws_s3_bucket_policy" "tiles" {
  bucket = aws_s3_bucket.tiles.id
  policy = jsonencode({
    Statement = [{
      Effect    = "Allow"
      {principal}
      {action}
      Resource  = "arn:aws:s3:::atlas-tiles-prod/*"
    }]
  })
}`,
    choices: [
      {
        id: "principal",
        options: [
          { id: "anyone", kind: "vulnerable", code: 'Principal = "*"' },
          { id: "cdn", kind: "safe", code: 'Principal = { Service = "cloudfront.amazonaws.com" }' },
          { id: "nobody", kind: "strict", code: 'Principal = { AWS = "arn:aws:iam::123456789012:root" }' },
        ],
      },
      {
        id: "action",
        options: [
          { id: "all-actions", kind: "vulnerable", code: 'Action    = "s3:*"' },
          { id: "get-only", kind: "safe", code: 'Action    = "s3:GetObject"' },
          { id: "list-only", kind: "strict", code: 'Action    = "s3:ListBucket"' },
        ],
      },
    ],
    tests: [
      { id: "a1", type: "attack", deps: ["action", "principal"] },
      { id: "a2", type: "attack", deps: ["principal"] },
      { id: "l1", type: "legit", deps: ["action", "principal"] },
    ],
  },
];

/** Evaluate a configuration lab for the option picked per choice. */
export function evaluateHarden(ex: HardenExercise, picked: Record<string, string>) {
  const kindOf = (choiceId: string) => ex.choices.find((c) => c.id === choiceId)!.options.find((o) => o.id === picked[choiceId])!.kind;
  return ex.tests.map((t) => {
    const kinds = t.deps.map(kindOf);
    const pass = t.type === "attack" ? kinds.some((k) => k !== "vulnerable") : kinds.every((k) => k !== "strict");
    return { id: t.id, type: t.type, pass };
  });
}

/** Fill the {placeholders} of a template, keeping the indentation of multi-line options. */
export function renderTemplate(ex: HardenExercise, picked: Record<string, string>) {
  const marks: { line: number; kind: HardenOption["kind"] }[] = [];
  const out: string[] = [];
  for (const line of ex.template.split("\n")) {
    const m = /^(.*?)\{(\w+)\}(,?)$/.exec(line);
    if (!m) {
      out.push(line);
      continue;
    }
    const choice = ex.choices.find((c) => c.id === m[2])!;
    const opt = choice.options.find((o) => o.id === picked[choice.id])!;
    const parts = opt.code.split("\n");
    parts.forEach((part, i) => {
      const pad = i === 0 ? m[1] : " ".repeat(m[1].length);
      out.push(`${pad}${part}${i === parts.length - 1 ? m[3] : ""}`);
      marks.push({ line: out.length, kind: opt.kind });
    });
  }
  return { code: out.join("\n"), marks };
}

export const initialPick = (ex: HardenExercise) => Object.fromEntries(ex.choices.map((c) => [c.id, c.options[0].id]));

// --- tabletop: decisions with consequences ----------------------------------------

export interface TabletopStep {
  id: string;
  options: { id: string; score: 0 | 1 | 2 }[];
}
export interface TabletopExercise {
  kind: "tabletop";
  id: "tabletop";
  node: string;
  steps: TabletopStep[];
  /** Minimum total score to solve. */
  pass: number;
}

export const tabletopExercise: TabletopExercise = {
  kind: "tabletop",
  id: "tabletop",
  node: "a-alert",
  pass: 8,
  steps: [
    { id: "s1", options: [{ id: "revoke", score: 2 }, { id: "wait", score: 0 }, { id: "delete-repo", score: 0 }] },
    { id: "s2", options: [{ id: "preserve", score: 2 }, { id: "clean-logs", score: 0 }, { id: "rewrite", score: 1 }] },
    { id: "s3", options: [{ id: "rotate-all", score: 2 }, { id: "nothing-else", score: 0 }, { id: "only-key", score: 1 }] },
    { id: "s4", options: [{ id: "query-logs", score: 2 }, { id: "notify-all", score: 1 }, { id: "assume-none", score: 0 }] },
    { id: "s5", options: [{ id: "controls", score: 2 }, { id: "be-careful", score: 0 }, { id: "wiki", score: 1 }] },
  ],
};

export type AnyExercise = LabExercise | HardenExercise | TabletopExercise;
export const allExercises: AnyExercise[] = [...attackExercises, ...hardenExercises, tabletopExercise];
