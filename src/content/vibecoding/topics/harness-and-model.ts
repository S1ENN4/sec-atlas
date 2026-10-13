import type { Topic } from "@/content/types";

export const harnessAndModel: Topic = {
  domain: "vibecoding",
  slug: "harness-and-model",
  title: "Model, harness and provider",
  short: "the three layers behind every AI coding tool, and why the same model behaves differently",
  tagline:
    "A coding agent is not just a model. It is a model plus a harness (the program that gives it tools, context and rules) reached through a provider. Most confusion in this field comes from mixing the three.",
  kind: "conceito",
  stage: "understand",
  tools: ["Claude Code", "OpenCode", "oh-my-pi (OMP)", "OpenRouter", "Ollama"],
  sections: [
    {
      heading: "The three layers",
      bullets: [
        "Model: the neural network that predicts the next step (Claude, GPT, Gemini, DeepSeek, Qwen, and others). It reads text in and produces text out, including requests to call tools.",
        "Harness: the program around the model. It builds the prompt, gives the model tools (read a file, edit, run a command, search, call an MCP server), applies permissions, manages context, and loops until the task ends. Claude Code, OpenCode, oh-my-pi and Codex CLI are harnesses.",
        "Provider: where the model runs and how you reach it: the vendor's own API, a cloud (Bedrock, Vertex, Azure), a router (OpenRouter), or your own machine (Ollama, llama.cpp, vLLM).",
      ],
    },
    {
      heading: "Why the same model feels different in two tools",
      body: [
        "The harness decides what the model sees and what it can do. Two tools using the same model can differ a lot in how they edit files (whole-file rewrite versus targeted edits), how much of the repository they load, whether they use a language server to find definitions, how they recover from a failed command, and how they compress a long conversation. Reports of big quality differences between tools on the same model usually trace back to these details, not to the model.",
        "The reverse also holds: a harness tuned for one model family may underperform with another, because prompts and tool formats are adjusted to each model's habits.",
      ],
    },
    {
      heading: "What a harness actually does",
      bullets: [
        "Assembles context: system prompt, project instructions (CLAUDE.md or AGENTS.md), open files, search results, conversation history.",
        "Exposes tools with a schema: read, write, edit, shell, search, fetch, and any MCP server you connect.",
        "Enforces permissions: which commands run without asking, which paths are off limits, whether to sandbox.",
        "Runs the loop: model proposes a tool call, harness executes it, result goes back to the model, repeat until done or stopped.",
        "Manages cost and context: caching, summarizing old turns, switching to a cheaper model for small steps.",
      ],
    },
    {
      heading: "Why this matters when you choose",
      body: [
        "Choose the harness for the workflow (terminal or IDE, permission model, parallel work, extensibility) and the model for the job (quality, speed, price, privacy). Harnesses that support many providers let you change the model without relearning the tool; harnesses tied to one vendor can go deeper in integration. Neither is universally better. The next topics compare the common tools and the model trade-offs.",
      ],
    },
  ],
};
