import type { Topic } from "@/content/types";

export const vibeSpectrum: Topic = {
  domain: "vibecoding",
  slug: "vibe-spectrum",
  title: "The vibecoding spectrum",
  short: "from autocomplete to autonomous agents, and where each one fits",
  tagline:
    "\"Vibecoding\" names a way of working, not a tool: you describe what you want and steer by results instead of reading every line. It is excellent for some jobs and reckless for others, and knowing which is the skill.",
  kind: "conceito",
  stage: "understand",
  tools: ["Claude Code", "OpenCode", "Cursor", "GitHub Copilot", "Aider", "Codex CLI"],
  sections: [
    {
      heading: "What it is",
      body: [
        "The term vibe coding was popularized by Andrej Karpathy in early 2025 for a style of programming where you \"fully give in to the vibes\": you tell an AI what to build, accept what it writes, run it, and describe the next change, without scrutinizing the code. In everyday use the word now covers the whole range of AI-assisted programming, from a suggestion in the editor to an agent that works for an hour on its own.",
        "This section of the knowledge base is about that range: what the tools are, how they differ, how to get reliable results, and how to keep the result safe. Treat the tool names as a snapshot (as of October 2026); the ideas underneath change much more slowly.",
      ],
    },
    {
      heading: "The spectrum",
      body: ["Each step gives the AI more autonomy and the human less line-by-line control. Moving right is faster and riskier."],
      bullets: [
        "Autocomplete: the editor suggests the next line or block. You read every suggestion. Low risk, modest gain.",
        "Chat and edit: you ask for a function or a refactor in a side panel and apply the diff. You review the diff.",
        "Agent in the loop: the tool reads the repository, edits several files, runs commands and tests, and asks for approval at risky steps. You review the result and the plan.",
        "Autonomous or parallel agents: one or many agents work on separate tasks with little supervision and return finished branches. You review pull requests, not keystrokes.",
        "Pure vibecoding: you do not read the code at all and judge only by running the program. Fine for a throwaway script; wrong for anything that holds data, money or other people.",
      ],
    },
    {
      heading: "Where it works, where it does not",
      bullets: [
        "Great: prototypes, internal tools, scripts, tests, boilerplate, migrations with a clear rule, exploring an unfamiliar codebase, first drafts of documentation.",
        "Good with care: features in an existing codebase that has tests and conventions the agent can follow.",
        "Dangerous without expert review: authentication, authorization, cryptography, payments, anything parsing untrusted input, infrastructure and permission changes.",
        "Bad fit: problems you cannot verify. If you cannot tell whether the output is right, speed is only a faster way to be wrong.",
      ],
    },
    {
      heading: "The skill that remains",
      body: [
        "As generation gets cheap, the scarce skills are the ones around it: describing the problem precisely, splitting it into checkable steps, reading a diff critically, writing the test that proves the result, and knowing the failure modes of the stack. Experienced engineers often get more out of these tools, because they can steer and verify. Beginners get speed but cannot yet tell good output from plausible output, so the learning loop is: generate, read, ask why, and test.",
      ],
    },
    {
      heading: "A simple rule of thumb",
      body: [
        "Match autonomy to blast radius and to your ability to verify. A script that renames files on your laptop can run with full autonomy. A change to the login flow needs a plan you approved, a diff you read, tests you wrote or reviewed, and a second pair of eyes.",
      ],
    },
  ],
};
