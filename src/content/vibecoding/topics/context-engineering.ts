import type { Topic } from "@/content/types";

export const contextEngineering: Topic = {
  domain: "vibecoding",
  slug: "context-engineering",
  title: "Context engineering for coding agents",
  short: "project instructions, plans, skills and small tasks: how to get reliable output",
  tagline:
    "Agents do not remember your project; they read what you put in front of them. Good results come from what the model sees: clear instructions, the right files, a plan, and tasks small enough to verify.",
  kind: "tecnica",
  stage: "drive",
  tools: ["AGENTS.md", "CLAUDE.md", "Model Context Protocol (MCP)", "Claude Code skills and hooks", "OpenCode agents", "Plan mode"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Context engineering is deciding what goes into the model's context window and in what shape. More text is not better: a long, noisy context makes the model miss instructions and costs more. The aim is the smallest context that contains everything needed to do the task right.",
      ],
    },
    {
      heading: "A project instructions file",
      body: [
        "Most harnesses read a file at the repository root at the start of every session. AGENTS.md has become a common convention across tools; Claude Code reads CLAUDE.md (which can point to AGENTS.md). Put in it what an experienced new teammate would need on day one, and keep it short.",
      ],
      code: [
        {
          language: "markdown",
          filename: "AGENTS.md",
          code: "# Project notes for coding agents\n\n## Commands\n- Install: `npm ci`\n- Test (run before every commit): `npm test`\n- Lint and types: `npm run lint && npm run typecheck`\n\n## Conventions\n- TypeScript strict. No `any`. Prefer small pure functions.\n- Database access only through `src/db/*`; never build SQL by string concatenation.\n- New endpoints need an authorization check and a test for \"user B cannot read user A's data\".\n\n## Boundaries\n- Do not edit `infra/` or `.github/workflows/` without asking.\n- Never read or print `.env` or anything under `secrets/`.\n- Ask before adding a dependency.",
        },
      ],
    },
    {
      heading: "Working method",
      bullets: [
        "Plan first: ask for a plan (many tools have a read-only plan mode), edit it, then approve. Fixing a plan is cheaper than fixing code.",
        "Small tasks: one change per session or branch, with a test that decides success. Large vague tasks produce large vague diffs.",
        "Point to examples: \"follow the pattern in src/users/handler.ts\" beats a paragraph of description.",
        "State the check: tell the agent how to verify its own work (run this test, this linter, this command).",
        "Reset often: start a fresh session when the context gets long or the agent gets confused, carrying over only the decisions.",
        "Give tools, not essays: connect an MCP server or a script for a repeated need (query the staging database read-only, open a ticket) instead of pasting data into chat.",
      ],
    },
    {
      heading: "Skills, hooks and subagents",
      body: [
        "Beyond the instructions file, harnesses offer extension points. Skills package a procedure the agent loads only when relevant. Hooks run your code at fixed moments (before a tool runs, after an edit), which is the reliable place to enforce rules the model might forget, such as formatting or blocking a dangerous command. Subagents run a focused task in their own context and return a summary, which keeps the main conversation clean. Treat anything an agent can run as code with your permissions, and review it like code.",
      ],
    },
    {
      heading: "Common mistakes",
      bullets: [
        "A giant instructions file full of rules the agent ignores. Short and specific wins.",
        "Rules that are only prose. If it must never happen, enforce it with permissions, hooks or CI, not a sentence.",
        "Secrets in the instructions or in pasted logs.",
        "Letting context fill with failed attempts. Start over with what you learned.",
        "Trusting the agent's claim that tests pass without running them yourself.",
      ],
    },
  ],
};
