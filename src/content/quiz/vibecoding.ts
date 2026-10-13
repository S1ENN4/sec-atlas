import type { QuizBank } from "@/content/types";

export const vibecodingQuiz: QuizBank = {
  "vibe-spectrum": [
    {
      q: "Which rule best guides how much autonomy to give an AI coding tool?",
      options: [
        "Always the maximum, to go faster",
        "Match autonomy to blast radius and to your ability to verify the result",
        "Never more than autocomplete",
        "Whatever the tool defaults to",
      ],
      answer: 1,
      explain: "Cheap, reversible work can run unattended. Authentication, payments and infrastructure need plans, diffs and review.",
    },
    {
      q: "Which task is the best fit for pure vibecoding without reading the code?",
      options: ["The login flow", "A payment webhook", "A throwaway script that renames files on your laptop", "A change to cloud permissions"],
      answer: 2,
      explain: "The result is cheap to check and the damage of a mistake is tiny. The others hold data, money or access.",
    },
    {
      q: "As code generation gets cheap, which skill becomes more valuable?",
      options: [
        "Typing speed",
        "Specifying problems precisely, reviewing diffs critically and writing tests that prove the result",
        "Memorizing syntax",
        "Choosing the longest prompt",
      ],
      answer: 1,
      explain: "Generation is no longer the bottleneck. Judging and verifying the output is.",
    },
  ],
  "harness-and-model": [
    {
      q: "What is a harness in the context of coding agents?",
      options: [
        "The neural network that predicts tokens",
        "The program that gives the model tools, context and permissions and runs the loop",
        "A cloud region",
        "A type of GPU",
      ],
      answer: 1,
      explain: "Claude Code, OpenCode, oh-my-pi and Codex CLI are harnesses. The model is a separate layer.",
    },
    {
      q: "Why can the same model feel better in one tool than in another?",
      options: [
        "Models change at random",
        "The harness controls editing method, context loaded, tools and error recovery",
        "Because of the color theme",
        "Only the price differs",
      ],
      answer: 1,
      explain: "The differences are mostly in how the harness presents the task and applies changes.",
    },
    {
      q: "OpenRouter is best described as:",
      options: ["A coding agent", "A provider layer that routes requests to many models", "A text editor", "A git host"],
      answer: 1,
      explain: "It is a way to reach models. You still need a harness to use it for coding.",
    },
  ],
  "agent-tools-compared": [
    {
      q: "What is Oh My OpenAgent (OMO)?",
      options: [
        "A standalone coding agent in Rust",
        "A plugin for OpenCode that adds specialized agents and multi-agent orchestration",
        "A terminal multiplexer",
        "A model from a Chinese lab",
      ],
      answer: 1,
      explain: "It extends the OpenCode harness. It was formerly called oh-my-opencode.",
    },
    {
      q: "What does herdr do?",
      options: [
        "Trains coding models",
        "Organizes several agents in persistent terminal panes and shows each one's state",
        "Replaces git",
        "Scans dependencies",
      ],
      answer: 1,
      explain: "It is a multiplexer for agents. It does not run the agent loop itself.",
    },
    {
      q: "Which pair is a model and a harness, in that order?",
      options: ["Claude Code, DeepSeek", "DeepSeek, OpenCode", "OpenCode, herdr", "OMO, Claude Code"],
      answer: 1,
      explain: "DeepSeek is a model family. OpenCode is a harness that can reach it through a provider.",
    },
  ],
  "model-choice": [
    {
      q: "What is the right way to compare two models for your work?",
      options: [
        "Pick the one at the top of a public leaderboard",
        "Run real tasks from your repository with tests and compare cost per solved task",
        "Choose the cheaper price per token",
        "Choose the newest",
      ],
      answer: 1,
      explain: "A cheap model that needs three attempts can cost more than a strong one that succeeds once.",
    },
    {
      q: "What is the main privacy question when using a hosted model service?",
      options: [
        "How pretty the website is",
        "Where your code and prompts are processed and under what terms, and whether your company allows it",
        "Whether it supports dark mode",
        "How many users it has",
      ],
      answer: 1,
      explain: "Check the provider's policy and your company rules. Self-hosting open weights is an option for sensitive code.",
    },
    {
      q: "A sensible routing policy is to:",
      options: [
        "Use one model for every step",
        "Use a strong model for planning and review and a cheaper one for well-specified edits, with tests as judge",
        "Always use the cheapest model",
        "Switch models randomly",
      ],
      answer: 1,
      explain: "Spend where ambiguity is high and save where a test can decide.",
    },
  ],
  "when-to-use-what": [
    {
      q: "Many independent tasks need to be done at once. What is the safest setup?",
      options: [
        "One agent editing the same working directory",
        "Separate git worktrees, one per agent, with human review of each branch",
        "Give every agent production access",
        "Disable approvals",
      ],
      answer: 1,
      explain: "Worktrees isolate changes and each result arrives as a branch you can review.",
    },
    {
      q: "For code that handles authentication, how should an agent be used?",
      options: [
        "Full autonomy with no review",
        "For a draft and for tests, followed by line-by-line review from someone who knows the area",
        "Not at all, ever",
        "Only with the cheapest model",
      ],
      answer: 1,
      explain: "Agents help, but the risk is high enough that an expert must read the result.",
    },
    {
      q: "The agent keeps repeating the same failed fix. What is the best response?",
      options: [
        "Let it loop longer",
        "Shrink the task, reset the context or switch model",
        "Turn off the tests",
        "Give it more permissions",
      ],
      answer: 1,
      explain: "Loops are a sign the task or context is wrong. Fresh, smaller attempts usually work better.",
    },
  ],
  "context-engineering": [
    {
      q: "What belongs in AGENTS.md or CLAUDE.md?",
      options: [
        "The entire source code",
        "Short, specific notes: commands, conventions and boundaries a new teammate would need",
        "Secrets and API keys",
        "A long list of rules the agent must memorize",
      ],
      answer: 1,
      explain: "Keep it short. Long files get ignored and secrets must never be there.",
    },
    {
      q: "A rule must never be broken (for example, never push to main). How do you enforce it?",
      options: [
        "Write it in the instructions file only",
        "Enforce it with permissions, hooks or CI, in addition to documenting it",
        "Hope the model remembers",
        "Repeat it in every prompt",
      ],
      answer: 1,
      explain: "Prose is a request. Permissions and gates are controls.",
    },
    {
      q: "Why ask for a plan before the agent edits code?",
      options: [
        "To waste time",
        "Correcting a plan is cheaper than correcting a large diff",
        "Plans are required by git",
        "It makes the model smarter",
      ],
      answer: 1,
      explain: "Plan mode lets you check the approach before any file changes.",
    },
  ],
  "parallel-agents": [
    {
      q: "What does a git worktree provide for parallel agents?",
      options: [
        "A faster CPU",
        "A separate working directory and branch of the same repository per agent",
        "Automatic merges",
        "A cloud sandbox",
      ],
      answer: 1,
      explain: "Isolation prevents collisions and gives you a branch to review.",
    },
    {
      q: "What is the main limit on running many agents at once?",
      options: [
        "Disk space",
        "Your ability to review the results",
        "The number of git branches",
        "Terminal colors",
      ],
      answer: 1,
      explain: "Unreviewed output is review debt. Parallelism helps only as far as you can verify.",
    },
    {
      q: "Which is NOT isolated by a worktree?",
      options: ["Source files", "The branch", "A shared database or external API", "The working directory"],
      answer: 2,
      explain: "Databases, ports and external services are shared. Use a sandbox and scoped credentials.",
    },
  ],
  "verification-loop": [
    {
      q: "An agent says all tests pass. What should you do?",
      options: [
        "Merge",
        "Run the tests yourself and read the diff, including changes to test files",
        "Ask it again",
        "Delete the tests",
      ],
      answer: 1,
      explain: "Generated code and summaries look confident. Check the evidence.",
    },
    {
      q: "Which is a typical failure of generated tests?",
      options: [
        "They are too fast",
        "They assert on mocks, update snapshots to match a bug or are deleted to turn the build green",
        "They use too few comments",
        "They run in parallel",
      ],
      answer: 1,
      explain: "Protect test files and CI config with review so tests stay an independent check.",
    },
    {
      q: "Why run the same CI gates on agent-written and human-written changes?",
      options: [
        "To slow everyone down",
        "The checks protect the codebase whoever wrote the change, and agents produce more changes with plausible errors",
        "Agents are always right",
        "Humans are always wrong",
      ],
      answer: 1,
      explain: "Gates are author-agnostic. They are the reliable part of the loop.",
    },
  ],
  "agent-security": [
    {
      q: "What is prompt injection against a coding agent?",
      options: [
        "A faster way to prompt",
        "Instructions hidden in content the agent reads, which it may follow as if the user wrote them",
        "A syntax error",
        "A type of unit test",
      ],
      answer: 1,
      explain: "The model cannot reliably separate your request from text it found in a README, page or tool result.",
    },
    {
      q: "What is slopsquatting?",
      options: [
        "Compressing logs",
        "Registering a malicious package under a name that an AI invented, so installs of that name get malware",
        "A rate limiting technique",
        "A git merge strategy",
      ],
      answer: 1,
      explain: "Verify every dependency the agent adds: it must exist, be the one intended and pass scans.",
    },
    {
      q: "Which setup best limits the damage of a compromised or misled agent?",
      options: [
        "Full admin credentials so it never gets blocked",
        "A container with only the project mounted, no cloud credentials, narrow command permissions and approvals for risky actions",
        "Running as root",
        "Disabling logs",
      ],
      answer: 1,
      explain: "Least privilege and isolation limit what a mistaken or manipulated agent can reach.",
    },
  ],
};
