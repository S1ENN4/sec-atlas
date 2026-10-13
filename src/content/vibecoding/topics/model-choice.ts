import type { Topic } from "@/content/types";

export const modelChoice: Topic = {
  domain: "vibecoding",
  slug: "model-choice",
  title: "Choosing a model: frontier, cheap and open",
  short: "Claude, GPT, Gemini, DeepSeek and local models: quality, cost, speed and where your code goes",
  tagline:
    "The best model for a task is the cheapest one that passes your tests. Price, speed and privacy matter as much as benchmark scores, and DeepSeek-style models make that trade-off concrete.",
  kind: "pratica",
  stage: "choose",
  tools: ["OpenRouter", "Ollama", "llama.cpp / vLLM", "LiteLLM", "OpenCode", "Claude Code"],
  sections: [
    {
      heading: "Think in tiers, not brands",
      bullets: [
        "Frontier models (the top offerings from Anthropic, OpenAI, Google): best at long, ambiguous, multi-file work and at recovering from mistakes. Highest price per token. Use for planning, hard bugs and security-sensitive code.",
        "Fast and small variants from the same vendors: much cheaper and quicker, good for edits with a clear instruction, tests, renames and summaries.",
        "Open-weight and low-cost models (DeepSeek, Qwen, Kimi, GLM and others): often close to frontier on coding benchmarks at a fraction of the price, and some can run on your own hardware. Quality varies by task and by harness, so measure on your code.",
        "Local models: nothing leaves the machine; useful for private code and offline work. Limited by your hardware, so usually smaller and slower than hosted ones.",
      ],
    },
    {
      heading: "About DeepSeek in particular",
      body: [
        "DeepSeek is a model family, not a coding tool. You use it through a harness that can reach it: its own API, a router such as OpenRouter, a cloud host, or a local runtime if you run the open weights yourself. The same model can behave quite differently depending on the harness.",
        "Two questions decide whether it suits your project. First, quality: run your own tasks and tests rather than trusting a leaderboard. Second, data: when you use the vendor's hosted service, your code and prompts are processed under that service's privacy terms and jurisdiction. Many companies restrict or forbid sending proprietary code to some hosted services. Read the current policy, check your company's rules, and consider a host you trust or running the open weights yourself when the code is sensitive.",
      ],
    },
    {
      heading: "A routing policy that works",
      body: [
        "Do not pick one model for everything. Use a strong model to plan and to review, a cheaper one to carry out well-specified edits, and tests as the judge. Many harnesses let you set a default model and override it per agent or per task. The example below is illustrative: the exact keys differ by tool.",
      ],
      code: [
        {
          language: "yaml",
          filename: "routing-policy.example.yml (illustrative, not a real tool's schema)",
          code: "planning:     { model: frontier,   why: \"ambiguity and architecture\" }\nimplementing: { model: fast-or-open, why: \"clear spec, tests verify\" }\nreview:       { model: frontier-from-a-different-vendor, why: \"independent second opinion\" }\nsensitive-code:\n  allowed_providers: [\"self-hosted\", \"company-approved-cloud\"]\n  forbidden: [\"consumer chat endpoints\", \"unreviewed third-party routers\"]",
        },
      ],
    },
    {
      heading: "Measure before you commit",
      bullets: [
        "Build a small private benchmark from real tasks in your repository (a bug fix, a feature, a refactor) with tests that decide pass or fail.",
        "Compare cost per solved task, not price per token: a cheap model that needs three attempts can cost more than a strong one that succeeds once.",
        "Track failure modes: invented APIs, broken edits, giving up early, ignoring instructions.",
        "Re-run when a new model appears or your harness changes; results go stale in months.",
        "Check data handling for every provider in the chain, including routers that forward your prompts elsewhere.",
      ],
    },
  ],
};
