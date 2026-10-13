import type { Topic } from "@/content/types";

export const agentToolsCompared: Topic = {
  domain: "vibecoding",
  slug: "agent-tools-compared",
  title: "Coding agents compared",
  short: "Claude Code, OpenCode, OMP, OMO, herdr and the rest: what each is and how they differ",
  tagline:
    "Some of these are harnesses, some are plugins that sit on a harness, and some are not agents at all. Sorting them into the right layer explains most of the differences.",
  kind: "pratica",
  stage: "choose",
  tools: ["Claude Code", "OpenCode", "oh-my-pi (OMP)", "Oh My OpenAgent (OMO)", "herdr", "Codex CLI", "Cursor", "Aider"],
  sections: [
    {
      heading: "How to read this page",
      body: [
        "This is a snapshot as of October 2026, built from each project's own documentation and public descriptions. The field moves fast: names, defaults, licenses and features change, so confirm details on the project page before you commit to a tool. The links are in the sources list of this domain.",
        "A tool belongs to one of three kinds. A harness runs the agent loop (Claude Code, OpenCode, OMP, Codex CLI, Aider). An orchestration layer adds roles and multi-agent behavior on top of a harness (OMO on OpenCode). A workspace manager does not run an agent at all; it organizes several agents' terminals (herdr). An editor product bundles a harness in an IDE (Cursor).",
      ],
    },
    {
      heading: "The tools",
      bullets: [
        "Claude Code (Anthropic): a terminal agent, also in IDE extensions, a desktop app and the web. Deeply integrated with Anthropic models. Strong permission system, project memory in CLAUDE.md, hooks, skills, subagents, MCP, plan mode. Choose it when you want the most polished, vendor-supported experience with Claude models.",
        "OpenCode: an open-source, provider-agnostic terminal agent (MIT licensed, built by the team behind SST). Reaches many providers, including local models, has build and plan agents, LSP integration, MCP, and a client/server design so the terminal UI is only one frontend. Choose it when you want freedom to switch models and providers.",
        "oh-my-pi (OMP): an open-source terminal agent that began as a fork of the minimal Pi agent and kept adding features: structured edits, language-server and debugger operations, browser access, plugins and subagents, many providers. Choose it when you want a heavily featured, hackable harness and like to tune your tools.",
        "Oh My OpenAgent (OMO, formerly oh-my-opencode): a plugin for OpenCode, not a standalone agent. It adds a team of specialized agents (a main coordinator plus planner, executor and researcher roles), an autonomous mode and parallel work. Choose it when you already use OpenCode and want orchestration out of the box.",
        "herdr: a terminal agent multiplexer written in Rust. It runs several agents (Claude Code, OpenCode, Codex and others) in real terminal panes in one persistent workspace, shows each agent's state (working, blocked, done, idle), survives disconnects and works over SSH. It does not replace an agent; it organizes them. Choose it when you run many agents at once.",
        "Codex CLI (OpenAI): an open-source terminal agent for OpenAI models, using AGENTS.md for project instructions. Choose it for the OpenAI ecosystem.",
        "Cursor: an AI-first editor built on VS Code with chat, inline edits and agents. Choose it when you prefer a graphical IDE to a terminal.",
        "Aider: a long-standing terminal pair programmer that works directly with git and commits its changes. Choose it for a small, git-centered, predictable workflow.",
      ],
    },
    {
      heading: "What actually differs",
      bullets: [
        "Layer: harness, orchestration plugin, workspace manager or IDE. Comparing OMO with herdr is comparing different things.",
        "Provider freedom: vendor-tied (deeper integration) versus many providers (flexibility and price shopping).",
        "Autonomy and permissions: how much runs without asking, and how granular the rules are.",
        "Editing method: whole-file rewrite versus structured or targeted edits, which changes reliability on large files.",
        "Extensibility: hooks, plugins, skills, MCP, custom agents.",
        "Parallelism: one agent at a time, subagents, or many independent sessions you manage.",
        "Interface: terminal, IDE, desktop, web, or a headless mode for scripts and CI.",
      ],
    },
    {
      heading: "They compose",
      body: [
        "These are not mutually exclusive. A common setup is OpenCode as the harness, OMO for orchestration, and herdr to keep several sessions visible. Another is Claude Code for the main work and a second agent from another vendor for independent review. Pick the smallest set that covers your workflow; every extra layer is another thing that can break, leak a secret or change behavior after an update.",
      ],
    },
  ],
};
