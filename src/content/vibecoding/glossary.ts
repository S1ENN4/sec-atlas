import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "layers",
    title: "layers and terms",
    entries: [
      {
        term: "Vibe coding",
        meaning:
          "A style of programming where you describe what you want and steer by running the result, without reading every line. The term was popularized in early 2025 and now often names AI-assisted programming in general.",
        topic: "vibe-spectrum",
      },
      {
        term: "Model",
        meaning: "The neural network that predicts the next step. It produces text, including requests to call tools. It is not the tool you type into.",
        topic: "harness-and-model",
      },
      {
        term: "Harness",
        aka: "agent harness · scaffold",
        meaning:
          "The program around the model: builds the prompt, exposes tools, enforces permissions and runs the loop. Claude Code, OpenCode, oh-my-pi and Codex CLI are harnesses.",
        topic: "harness-and-model",
      },
      {
        term: "Provider",
        meaning: "Where a model runs and how you reach it: the vendor API, a cloud, a router such as OpenRouter, or your own machine.",
        topic: "harness-and-model",
      },
      {
        term: "Open-weight model",
        meaning: "A model whose trained weights are published, so you can run it yourself. Not always the same as open source: check the license.",
        topic: "model-choice",
      },
    ],
  },
  {
    id: "tools",
    title: "tools",
    entries: [
      {
        term: "OMP",
        aka: "oh-my-pi",
        meaning:
          "An open-source terminal coding agent that began as a fork of the minimal Pi agent and added structured edits, language-server and debugger operations, browser access, plugins and subagents.",
        topic: "agent-tools-compared",
      },
      {
        term: "OMO",
        aka: "Oh My OpenAgent · oh-my-opencode",
        meaning: "A plugin for OpenCode that adds a team of specialized agents and an autonomous multi-agent mode. It extends a harness; it is not one.",
        topic: "agent-tools-compared",
      },
      {
        term: "herdr",
        meaning:
          "A terminal multiplexer for AI coding agents. It keeps several agents in real terminal panes, shows their status and persists across disconnects. It organizes agents instead of replacing them.",
        topic: "parallel-agents",
      },
      {
        term: "Git worktree",
        meaning: "An extra working directory with its own branch for the same repository. Gives each agent an isolated place to work.",
        topic: "parallel-agents",
      },
    ],
  },
  {
    id: "working-well",
    title: "working well and safely",
    entries: [
      {
        term: "AGENTS.md",
        meaning:
          "A file at the repository root with instructions for coding agents (commands, conventions, boundaries). A common convention across tools; Claude Code reads CLAUDE.md.",
        topic: "context-engineering",
      },
      {
        term: "MCP",
        aka: "Model Context Protocol",
        meaning:
          "An open protocol for connecting agents to tools and data sources through servers. Every server you connect extends what the agent can do, so it also extends the attack surface.",
        topic: "context-engineering",
      },
      {
        term: "Plan mode",
        meaning: "A read-only mode where the agent explores and proposes a plan for approval before it edits anything.",
        topic: "context-engineering",
      },
      {
        term: "Prompt injection",
        meaning:
          "Instructions hidden in content the agent reads (a README, a web page, a tool result) that the model may follow as if you had written them.",
        topic: "agent-security",
      },
      {
        term: "Slopsquatting",
        meaning: "Registering a package under a name an AI invented, so that an agent or developer who installs it without checking gets malware.",
        topic: "agent-security",
      },
      {
        term: "Verification loop",
        meaning: "The checks every change must pass before it is trusted: tests that decide, a diff you read, CI gates and independent review.",
        topic: "verification-loop",
      },
    ],
  },
];
