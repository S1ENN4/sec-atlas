import type { PipelineStage } from "@/content/types";

// Four phases of working well with AI coding tools: UNDERSTAND what the tools
// are, CHOOSE the harness and model for the job, DRIVE them with good context
// and parallel work, and VERIFY the result and the agent's own security.

export const pipeline: PipelineStage[] = [
  {
    id: "understand",
    index: "01",
    name: "understand",
    description: "what these tools really are",
    items: [
      { label: "the spectrum from autocomplete to agents", slug: "vibe-spectrum" },
      { label: "model, harness and provider", slug: "harness-and-model" },
    ],
    gate: "you can say which layer a tool belongs to and how much autonomy fits the task",
  },
  {
    id: "choose",
    index: "02",
    name: "choose",
    description: "the right tool and model for the job",
    items: [
      { label: "Claude Code, OpenCode, OMP, OMO, herdr", slug: "agent-tools-compared" },
      { label: "frontier, cheap and open models", slug: "model-choice" },
      { label: "a decision guide", slug: "when-to-use-what" },
    ],
    gate: "tool and model chosen by task and risk, not by habit",
  },
  {
    id: "drive",
    index: "03",
    name: "drive",
    description: "give context, split the work",
    items: [
      { label: "instructions, plans, skills and small tasks", slug: "context-engineering" },
      { label: "worktrees and many agents", slug: "parallel-agents" },
    ],
    gate: "each task is small, specified and has a check that decides success",
  },
  {
    id: "verify",
    index: "04",
    name: "verify",
    description: "trust only what you can check",
    items: [
      { label: "tests, diffs and CI gates", slug: "verification-loop" },
      { label: "permissions, sandboxes and injection", slug: "agent-security" },
      { label: "human review before merge" },
    ],
    gate: "nothing merges unverified, and the agent cannot reach what it should not",
  },
];
