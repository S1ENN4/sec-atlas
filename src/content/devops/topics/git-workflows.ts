import type { Topic } from "@/content/types";

export const gitWorkflows: Topic = {
  domain: "devops",
  slug: "git-workflows",
  title: "Git workflows and code review",
  short: "branching, pull requests, protected branches and ownership as the front door of delivery",
  tagline:
    "Every change enters production through version control. How you branch, review and merge decides how fast you can ship and how safely you can undo.",
  kind: "tecnica",
  stage: "foundations",
  tools: ["git", "GitHub / GitLab", "CODEOWNERS", "pre-commit", "Conventional Commits", "git worktree"],
  sections: [
    {
      heading: "Branching models",
      bullets: [
        "Trunk-based development: short-lived branches (hours or a day or two) merged into main frequently, with feature flags hiding unfinished work. Best for fast feedback and continuous delivery.",
        "Feature branches with pull requests: the common middle ground. Keep branches small and short.",
        "Long-lived release branches (Gitflow style): useful when you must maintain several released versions at once; slower and more merge-heavy.",
        "Whatever the model, main must always be releasable, and every change reaches it through a reviewed pull request.",
      ],
    },
    {
      heading: "What a good pull request is",
      bullets: [
        "Small: a reviewer can understand it in minutes. Large changes hide mistakes.",
        "One purpose, with a description of why, not only what.",
        "Green CI before review starts, so humans spend time on design and risk, not typos.",
        "Reviewed by someone who owns the area: CODEOWNERS automates the request.",
        "Merged with a clear history (squash or rebase merge) so that a revert is one command.",
      ],
    },
    {
      heading: "Make the rules automatic",
      body: ["Rules that live only in a wiki get forgotten. Encode ownership in the repository and enforce branch protection in the platform."],
      code: [
        {
          language: "text",
          filename: ".github/CODEOWNERS",
          code: "# the last matching pattern wins\n*                    @example/engineering\n/infra/              @example/platform\n/.github/workflows/  @example/platform @example/security\n/src/auth/           @example/security",
        },
        {
          language: "bash",
          filename: "protect main with the GitHub CLI (requires admin rights)",
          code: "gh api -X PUT repos/example/app/branches/main/protection --input - <<'EOF'\n{\n  \"required_status_checks\": { \"strict\": true, \"contexts\": [\"verify\"] },\n  \"enforce_admins\": true,\n  \"required_pull_request_reviews\": { \"required_approving_review_count\": 1, \"require_code_owner_reviews\": true },\n  \"restrictions\": null\n}\nEOF",
        },
      ],
    },
    {
      heading: "Habits that pay off",
      bullets: [
        "Commit early and often on your branch; clean up before merging.",
        "Never rewrite history on a shared branch.",
        "Sign commits or tags for releases when provenance matters.",
        "Keep secrets out of history: a secret committed once must be rotated, not just deleted.",
        "Revert first, investigate second, when main breaks.",
      ],
    },
  ],
};
