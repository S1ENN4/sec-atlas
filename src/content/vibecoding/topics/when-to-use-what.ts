import type { Topic } from "@/content/types";

export const whenToUseWhat: Topic = {
  domain: "vibecoding",
  slug: "when-to-use-what",
  title: "When to use what",
  short: "a decision guide from the task to the tool, model and amount of autonomy",
  tagline:
    "Start from the task and its risk, not from the tool you like. A small decision table covers most days.",
  kind: "conceito",
  stage: "choose",
  tools: ["Claude Code", "OpenCode", "Cursor", "herdr", "Aider", "Oh My OpenAgent (OMO)"],
  sections: [
    {
      heading: "Start with the task",
      bullets: [
        "A quick question about code, or a small edit in a file you have open: IDE chat or inline edit (Cursor, Copilot) or a terminal agent in plan mode.",
        "A feature across several files in a repository with tests: a terminal agent (Claude Code, OpenCode, OMP, Codex CLI) with approvals on for writes and shell.",
        "A large mechanical change (rename, migration, upgrade): an agent with strong edit tools and a clear rule, run in a branch with the test suite as judge.",
        "Many independent tasks: several agents in separate git worktrees, organized with a multiplexer such as herdr, or an orchestration layer such as OMO on OpenCode.",
        "A throwaway prototype or script: full autonomy is fine. Run it in a sandbox or a scratch directory.",
        "Security-sensitive code (authentication, payments, crypto, parsing): use the agent for a draft and for tests, then review line by line with a person who knows the area.",
        "Unfamiliar codebase: ask the agent to map and explain first, read-only, before any change.",
      ],
    },
    {
      heading: "Match autonomy to risk",
      body: [
        "Think of two dials. Autonomy is how much the agent does without asking. Risk is the damage a wrong change can cause. Keep the product of the two small: high autonomy only where mistakes are cheap and reversible (a branch, a sandbox, a script), and approvals where they are not (production config, credentials, data migrations, deletions).",
      ],
    },
    {
      heading: "Choosing the harness",
      bullets: [
        "Want one polished, vendor-supported experience: Claude Code (Claude models) or Codex CLI (OpenAI models).",
        "Want to swap models and providers freely, or run local models: OpenCode or OMP.",
        "Want built-in roles and autonomous multi-agent work on OpenCode: add OMO.",
        "Run several sessions at once and lose track of them: herdr or tmux.",
        "Prefer a graphical IDE: Cursor or an IDE extension.",
        "Want tiny, git-first, predictable commits: Aider.",
      ],
    },
    {
      heading: "Signs you chose wrong",
      bullets: [
        "You keep accepting changes you did not read.",
        "The agent loops, repeating the same failed fix: shrink the task or change the model.",
        "Costs surprise you: set limits, use cheaper models for easy steps, keep context small.",
        "You cannot explain what the code does: stop and read it before building more on top.",
        "Each new tool layer adds another thing to configure and trust: remove what you do not use.",
      ],
    },
  ],
};
