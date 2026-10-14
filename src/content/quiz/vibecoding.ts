import type { QuizBank } from "@/content/types";

export const vibecodingQuiz: QuizBank = {
  "vibe-spectrum": [
    {
      "q": "Which rule best guides how much autonomy to give an AI coding tool?",
      "options": [
        "Always the maximum, because every pause for review slows the work down",
        "Match autonomy to blast radius and to your ability to verify the result",
        "Never more than autocomplete, because anything else is too risky",
        "Whatever autonomy the tool offers by default, since the vendor tested it"
      ],
      "answer": 1,
      "explain": "Cheap, reversible work can run unattended. Authentication, payments and infrastructure need plans, diffs and review."
    },
    {
      "q": "Which task is the best fit for pure vibecoding without reading the code?",
      "options": [
        "The login flow of the product, which is small and well understood",
        "A payment webhook, because the vendor documents the format in detail",
        "A throwaway script that renames files on your laptop",
        "A change to the cloud permissions of the production account"
      ],
      "answer": 2,
      "explain": "The result is cheap to check and the damage of a mistake is tiny. The others hold data, money or access."
    },
    {
      "q": "As code generation gets cheap, which skill becomes more valuable?",
      "options": [
        "Typing speed, because the agent needs fast and accurate instructions",
        "Specifying problems precisely, reviewing diffs critically and writing tests that prove the result",
        "Memorizing syntax, so that you can write code without the tool",
        "Choosing the longest prompt, since more words give better results"
      ],
      "answer": 1,
      "explain": "Generation is no longer the bottleneck. Judging and verifying the output is."
    }
  ],
  "harness-and-model": [
    {
      "q": "What is a harness in the context of coding agents?",
      "options": [
        "The neural network that predicts the next token from the context",
        "The program that gives the model tools, context and permissions and runs the loop",
        "A cloud region where the model weights are stored and served",
        "A type of GPU designed to run language models"
      ],
      "answer": 1,
      "explain": "Claude Code, OpenCode, oh-my-pi and Codex CLI are harnesses. The model is a separate layer."
    },
    {
      "q": "Why can the same model feel better in one tool than in another?",
      "options": [
        "Models change at random between sessions, so the experience varies",
        "The harness controls editing method, context loaded, tools and error recovery",
        "The color theme and the font used in the tool's interface",
        "Only the price differs, since every tool uses the same prompts"
      ],
      "answer": 1,
      "explain": "The differences are mostly in how the harness presents the task and applies changes."
    },
    {
      "q": "OpenRouter is best described as:",
      "options": [
        "A coding agent that edits files in your repository",
        "A provider layer that routes requests to many models",
        "A text editor with built-in AI completion",
        "A git host that stores repositories and runs pipelines"
      ],
      "answer": 1,
      "explain": "It is a way to reach models. You still need a harness to use it for coding."
    }
  ],
  "agent-tools-compared": [
    {
      "q": "What is Oh My OpenAgent (OMO)?",
      "options": [
        "A standalone coding agent written in Rust that runs in the terminal",
        "A plugin for OpenCode that adds specialized agents and multi-agent orchestration",
        "A terminal multiplexer that keeps several sessions open",
        "A language model released by a research lab"
      ],
      "answer": 1,
      "explain": "It extends the OpenCode harness. It was formerly called oh-my-opencode."
    },
    {
      "q": "What does herdr do?",
      "options": [
        "Trains and fine-tunes coding models on your repository",
        "Organizes several agents in persistent terminal panes and shows each one's state",
        "Replaces git with a system built for agents",
        "Scans dependencies for known vulnerabilities"
      ],
      "answer": 1,
      "explain": "It is a multiplexer for agents. It does not run the agent loop itself."
    },
    {
      "q": "Which pair is a model and a harness, in that order?",
      "options": [
        "Claude Code, DeepSeek",
        "DeepSeek, OpenCode",
        "OpenCode, herdr",
        "OMO, Claude Code"
      ],
      "answer": 1,
      "explain": "DeepSeek is a model family. OpenCode is a harness that can reach it through a provider."
    }
  ],
  "model-choice": [
    {
      "q": "What is the right way to compare two models for your work?",
      "options": [
        "Pick the one at the top of a public leaderboard, since it is independently tested",
        "Run real tasks from your repository with tests and compare cost per solved task",
        "Choose the one with the cheaper price per token",
        "Choose the newest release, because it is usually the best"
      ],
      "answer": 1,
      "explain": "A cheap model that needs three attempts can cost more than a strong one that succeeds once."
    },
    {
      "q": "What is the main privacy question when using a hosted model service?",
      "options": [
        "How attractive and easy to use the vendor's website is",
        "Where your code and prompts are processed and under what terms, and whether your company allows it",
        "Whether the service supports dark mode and keyboard shortcuts",
        "How many users the service has and how long it has existed"
      ],
      "answer": 1,
      "explain": "Check the provider's policy and your company rules. Self-hosting open weights is an option for sensitive code."
    },
    {
      "q": "A sensible routing policy is to:",
      "options": [
        "Use one strong model for every step, so the results stay consistent",
        "Use a strong model for planning and review and a cheaper one for well-specified edits, with tests as judge",
        "Always use the cheapest model, and fix its mistakes by hand",
        "Switch models at random, to avoid depending on a single vendor"
      ],
      "answer": 1,
      "explain": "Spend where ambiguity is high and save where a test can decide."
    }
  ],
  "when-to-use-what": [
    {
      "q": "Many independent tasks need to be done at once. What is the safest setup?",
      "options": [
        "Let every agent edit the same working directory, and merge the changes at the end",
        "Separate git worktrees, one per agent, with human review of each branch",
        "Give every agent production access, so that none of them is blocked",
        "Disable the approvals, so the agents can work without interruption"
      ],
      "answer": 1,
      "explain": "Worktrees isolate changes and each result arrives as a branch you can review."
    },
    {
      "q": "For code that handles authentication, how should an agent be used?",
      "options": [
        "Full autonomy with no review, since the tests will catch any problem",
        "For a draft and for tests, followed by line-by-line review from someone who knows the area",
        "Not at all, ever, because agents can never be trusted with it",
        "Only with the cheapest model, to keep the cost of mistakes low"
      ],
      "answer": 1,
      "explain": "Agents help, but the risk is high enough that an expert must read the result."
    },
    {
      "q": "The agent keeps repeating the same failed fix. What is the best response?",
      "options": [
        "Let it loop longer, since each attempt learns from the previous one",
        "Shrink the task, reset the context or switch model",
        "Turn off the tests that keep failing so that it can continue",
        "Give it more permissions so that it can try other approaches"
      ],
      "answer": 1,
      "explain": "Loops are a sign the task or context is wrong. Fresh, smaller attempts usually work better."
    }
  ],
  "context-engineering": [
    {
      "q": "What belongs in AGENTS.md or CLAUDE.md?",
      "options": [
        "The entire source code, so the agent always has the full picture",
        "Short, specific notes: commands, conventions and boundaries a new teammate would need",
        "Secrets and API keys that the agent needs to run the project",
        "A long list of rules that the agent must memorize before starting"
      ],
      "answer": 1,
      "explain": "Keep it short. Long files get ignored and secrets must never be there."
    },
    {
      "q": "A rule must never be broken (for example, never push to main). How do you enforce it?",
      "options": [
        "Write it in the instructions file and trust the agent to follow it",
        "Enforce it with permissions, hooks or CI, in addition to documenting it",
        "Hope the model remembers it every time it works on the project",
        "Repeat it in every prompt that you send to the agent"
      ],
      "answer": 1,
      "explain": "Prose is a request. Permissions and gates are controls."
    },
    {
      "q": "Why ask for a plan before the agent edits code?",
      "options": [
        "To waste time on a step that the agent could skip safely",
        "Correcting a plan is cheaper than correcting a large diff",
        "Plans are required by git before any commit can be created",
        "It makes the model smarter during the editing step"
      ],
      "answer": 1,
      "explain": "Plan mode lets you check the approach before any file changes."
    }
  ],
  "parallel-agents": [
    {
      "q": "What does a git worktree provide for parallel agents?",
      "options": [
        "A faster CPU that each agent can use while it runs its tasks",
        "A separate working directory and branch of the same repository per agent",
        "Automatic merges of the agents' changes into the main branch",
        "A cloud sandbox where the agents run without touching your machine"
      ],
      "answer": 1,
      "explain": "Isolation prevents collisions and gives you a branch to review."
    },
    {
      "q": "What is the main limit on running many agents at once?",
      "options": [
        "Disk space, because every agent needs its own copy of the repository",
        "Your ability to review the results",
        "The number of git branches that the repository can hold",
        "The number of terminal windows the machine can keep open"
      ],
      "answer": 1,
      "explain": "Unreviewed output is review debt. Parallelism helps only as far as you can verify."
    },
    {
      "q": "Which is NOT isolated by a worktree?",
      "options": [
        "The source files each agent is working with",
        "The branch each agent is working on",
        "A shared database or external API",
        "The working directory each agent uses"
      ],
      "answer": 2,
      "explain": "Databases, ports and external services are shared. Use a sandbox and scoped credentials."
    }
  ],
  "verification-loop": [
    {
      "q": "An agent says all tests pass. What should you do?",
      "options": [
        "Merge, since the agent ran the whole suite and reported success",
        "Run the tests yourself and read the diff, including changes to test files",
        "Ask it again, to be sure that the answer is consistent",
        "Delete the tests that take the longest, so the next run is faster"
      ],
      "answer": 1,
      "explain": "Generated code and summaries look confident. Check the evidence."
    },
    {
      "q": "Which is a typical failure of generated tests?",
      "options": [
        "They are too fast to be trusted, so they miss slow problems",
        "They assert on mocks, update snapshots to match a bug or are deleted to turn the build green",
        "They use too few comments, which makes them hard to maintain",
        "They run in parallel, which hides failures between tests"
      ],
      "answer": 1,
      "explain": "Protect test files and CI config with review so tests stay an independent check."
    },
    {
      "q": "Why run the same CI gates on agent-written and human-written changes?",
      "options": [
        "To slow everyone down and make sure every change gets the same delay",
        "The checks protect the codebase whoever wrote the change, and agents produce more changes with plausible errors",
        "Because agents are always right, so the checks confirm what is known",
        "Because humans are always wrong and need stricter checks than agents"
      ],
      "answer": 1,
      "explain": "Gates are author-agnostic. They are the reliable part of the loop."
    }
  ],
  "agent-security": [
    {
      "q": "What is prompt injection against a coding agent?",
      "options": [
        "A faster way to write prompts using templates and shortcuts",
        "Instructions hidden in content the agent reads, which it may follow as if the user wrote them",
        "A syntax error that appears when a prompt is built incorrectly",
        "A type of unit test that checks how the model answers"
      ],
      "answer": 1,
      "explain": "The model cannot reliably separate your request from text it found in a README, page or tool result."
    },
    {
      "q": "What is slopsquatting?",
      "options": [
        "Compressing logs so that they take less space in the repository",
        "Registering a malicious package under a name that an AI invented, so installs of that name get malware",
        "A rate limiting technique that slows down repeated requests",
        "A git merge strategy that squashes many commits into one"
      ],
      "answer": 1,
      "explain": "Verify every dependency the agent adds: it must exist, be the one intended and pass scans."
    },
    {
      "q": "Which setup best limits the damage of a compromised or misled agent?",
      "options": [
        "Full admin credentials, so that the agent never gets blocked and can finish its task",
        "A container with only the project mounted, no cloud credentials, narrow command permissions and approvals for risky actions",
        "Running the agent as root, so that it has the access that it needs",
        "Disabling logs, so that sensitive data never reaches a file"
      ],
      "answer": 1,
      "explain": "Least privilege and isolation limit what a mistaken or manipulated agent can reach."
    }
  ]
};
