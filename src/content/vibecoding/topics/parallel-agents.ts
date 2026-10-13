import type { Topic } from "@/content/types";

export const parallelAgents: Topic = {
  domain: "vibecoding",
  slug: "parallel-agents",
  title: "Orchestration and parallel agents",
  short: "git worktrees, multiplexers like herdr and layers like OMO: running many agents without chaos",
  tagline:
    "One agent is a pair programmer. Several agents are a small team, and a team needs isolation, a way to see who is doing what, and a human who reviews the merges.",
  kind: "pratica",
  stage: "drive",
  tools: ["git worktree", "herdr", "tmux", "Oh My OpenAgent (OMO)", "Claude Code subagents", "GitHub pull requests"],
  sections: [
    {
      heading: "Why run agents in parallel",
      body: [
        "Many tasks are independent: a bug fix, a test backfill, a documentation pass, a dependency upgrade. Running them at the same time turns waiting into throughput. The limits are not compute but attention and conflicts: you must review every result, and two agents editing the same files will collide.",
      ],
    },
    {
      heading: "Isolation with git worktrees",
      body: [
        "A git worktree gives each agent its own working directory and branch from the same repository, so they cannot overwrite each other's files and each result arrives as a branch you can review and merge.",
      ],
      code: [
        {
          language: "bash",
          filename: "one worktree per task",
          code: "# from the main checkout\ngit worktree add ../app-fix-login   -b agent/fix-login\ngit worktree add ../app-add-tests   -b agent/add-tests\ngit worktree add ../app-upgrade-dep -b agent/upgrade-dep\n\n# start one agent in each directory (any harness), then review each branch\ngit -C ../app-fix-login diff main --stat\n\n# clean up after merging\ngit worktree remove ../app-fix-login",
        },
      ],
    },
    {
      heading: "Seeing and managing many sessions",
      bullets: [
        "A terminal multiplexer such as tmux keeps sessions alive and lets you switch between them.",
        "herdr is a multiplexer built for agents: real terminal panes for each agent in one persistent workspace, a sidebar that shows which agents are working, blocked on you, or done, detach and reattach, and use over SSH. It organizes agents; it does not replace them.",
        "Some harnesses have built-in subagents: the main agent delegates a focused job to a helper with its own context and gets back a summary.",
        "Orchestration plugins such as Oh My OpenAgent (OMO) on OpenCode add predefined roles (a coordinator, a planner, executors, researchers) and a mode where the team works through a task with little supervision.",
      ],
    },
    {
      heading: "Patterns that work",
      bullets: [
        "Planner, implementer, reviewer: one agent plans, another implements, a third reviews, ideally on a different model for an independent view.",
        "Fan-out: split a large mechanical change by directory or module and run one agent per slice.",
        "Research in parallel: several read-only agents investigate different questions and report back; none of them edits.",
        "Always finish with a human merge: agents open pull requests, CI runs, a person decides.",
      ],
    },
    {
      heading: "Risks and limits",
      bullets: [
        "Review debt: ten agents make ten diffs. If you cannot review them, you are only creating unread code.",
        "Cost: parallel and autonomous modes burn tokens quickly. Set budgets and watch usage.",
        "Shared resources: databases, ports and external APIs are not isolated by a worktree.",
        "Blast radius: an agent with broad permissions running unattended can do broad damage. Use a sandbox or container, scoped credentials and no production access.",
        "More layers, more trust: every plugin and orchestration tool runs with your permissions. Pin versions and read what you install.",
      ],
    },
  ],
};
