import type { Topic } from "@/content/types";

export const verificationLoop: Topic = {
  domain: "vibecoding",
  slug: "verification-loop",
  title: "The verification loop",
  short: "tests, diffs, review and CI gates: trusting AI output only as far as you can check it",
  tagline:
    "Generated code looks confident whether it is right or wrong. The only reliable defense is a loop that checks it: tests that decide, a diff you read, and gates that run no matter who wrote the code.",
  kind: "tecnica",
  stage: "verify",
  tools: ["pytest / Jest / go test", "Semgrep", "CodeQL", "pre-commit", "GitHub Actions", "mutation testing (Stryker, mutmut)"],
  sections: [
    {
      heading: "What it is",
      body: [
        "A verification loop is the set of checks every change passes before it is trusted, whoever wrote it. With AI-written code the loop matters more, because the volume is higher and the errors are plausible: invented function names, quietly changed behavior, tests rewritten to pass, missing edge cases.",
      ],
    },
    {
      heading: "Layers of checking",
      bullets: [
        "Tests first: write or approve the test before the implementation, so a failing test defines done. Have the agent run it and show the output.",
        "Read the diff: not the agent's summary, the actual change. Look at what it touched beyond the request, deleted tests, loosened assertions, new dependencies and changed configuration.",
        "Automated gates in CI: lint, types, unit and integration tests, SAST, dependency scanning and secret scanning. These run on every pull request regardless of author.",
        "Independent review: ask a different model, or a person, to review with fresh context and no memory of the author's reasoning.",
        "Run it: for anything user-facing, execute the real flow instead of trusting that the code compiles.",
      ],
    },
    {
      heading: "Common failure modes of generated code",
      bullets: [
        "Hallucinated APIs and packages: the call or library does not exist, or exists under a different name (and an attacker may have registered the invented name).",
        "Tests that prove nothing: assertions on mocks, snapshots updated to match the bug, or tests deleted to turn the build green.",
        "Happy-path only: no handling of empty input, timeouts, concurrency or hostile input.",
        "Insecure defaults: string-built SQL, disabled TLS verification, wide CORS, hard-coded secrets, missing authorization checks.",
        "Scope creep: unrelated refactors mixed into the change, which hide the real diff.",
      ],
    },
    {
      heading: "A gate you can copy",
      body: ["Make the checks mandatory and automatic. The workflow below runs on every pull request and blocks the merge when any step fails; it is the same for human and agent authors."],
      code: [
        {
          language: "yaml",
          filename: ".github/workflows/verify.yml",
          code: "name: verify\non: pull_request\npermissions:\n  contents: read\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@<full-commit-sha>\n      - uses: actions/setup-node@<full-commit-sha>\n        with: { node-version: 22 }\n      - run: npm ci --ignore-scripts\n      - run: npm run lint && npm run typecheck\n      - run: npm test -- --coverage\n      - run: npx semgrep --config p/owasp-top-ten --error src/\n      - run: npx osv-scanner --lockfile=package-lock.json",
        },
        {
          language: "bash",
          filename: "pre-commit (local, fast)",
          code: "# .pre-commit-config.yaml runs these before every commit, including agent commits\ngitleaks protect --staged --redact\nnpm run lint --silent\nnpm test --silent -- --bail",
        },
      ],
    },
    {
      heading: "Habits",
      bullets: [
        "Never accept a change you could not explain to a teammate.",
        "Keep changes small enough to review in minutes.",
        "Protect the tests: require review for edits to test files and to CI configuration.",
        "Ask the agent to list assumptions and what it did not test.",
        "Measure test quality, not only coverage: mutation testing shows whether tests would catch a broken change.",
      ],
    },
  ],
};
