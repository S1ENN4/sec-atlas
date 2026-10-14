import type { Topic } from "@/content/types";

export const securityStrategyAndBudget: Topic = {
  domain: "grc",
  slug: "security-strategy-and-budget",
  title: "Security strategy, roadmap and budget",
  short: "what a CISO decides: priorities, a multi-year plan, a budget and the trade-offs behind them",
  tagline:
    "A strategy is a choice about what not to do. With limited people and money, the job is to put them where they reduce the most risk for the business, and to explain why.",
  kind: "conceito",
  stage: "lead",
  tools: ["risk register", "NIST CSF profiles (current and target)", "OKRs", "roadmap tools", "business cases", "maturity assessments"],
  sections: [
    {
      heading: "Start from the business",
      body: [
        "Security exists to let the business take risks safely, so a strategy begins with the company's goals, its crown jewels (the assets whose loss would hurt most), its obligations and its risk appetite. A fintech, a hospital and a media company defend different things. Understand how the company makes money, what would stop it, and who the plausible adversaries are.",
      ],
    },
    {
      heading: "From assessment to roadmap",
      bullets: [
        "Assess the current state against a framework: where are we strong, where are the gaps?",
        "Define the target state for the next one to three years, based on risk, not on the maximum.",
        "Prioritize the gap closure by risk reduction per effort and by dependencies; foundations (asset inventory, identity, logging, backups) usually come first.",
        "Sequence into a roadmap with themes, owners, milestones and measures of success; leave room for the unexpected.",
        "Say what you will not do, and which risks you accept for now, in writing.",
        "Review quarterly; update when the business or the threats change.",
      ],
      code: [
        {
          language: "markdown",
          filename: "roadmap-2027.md",
          code: "## Theme 1: Know and control access (Q1-Q2)\nGoal: phishing-resistant MFA for all staff and admins; privileged access just-in-time.\nMeasure: share of accounts on phishing-resistant MFA (target 95%).\nOwner: head of IT security. Budget: identity platform upgrade.\n\n## Theme 2: See and respond faster (Q2-Q4)\nGoal: central logging for all critical systems; 24x7 detection with a managed partner.\nMeasure: mean time to contain high-severity incidents (target under 4 hours).\n\n## Theme 3: Recover (Q3)\nGoal: immutable backups; quarterly restore tests of tier-1 systems.\n\n## Accepted for now (with owner and review date)\nLegacy billing system without MFA, isolated network segment; review 2027-06.",
        },
      ],
    },
    {
      heading: "Budget and the business case",
      bullets: [
        "Explain spending as risk reduction: which risk, by how much, at what cost, compared with the alternative (including insurance).",
        "Distinguish run costs (people, licenses) from change costs (projects), and plan for the people to operate what you buy.",
        "Buy fewer, better-integrated tools and use what you already own before adding more; unused tools are cost without protection.",
        "Include people: hiring, training and retention are often the best use of money.",
        "Show outcomes from previous spend; credibility compounds.",
      ],
    },
    {
      heading: "Leading the function",
      bullets: [
        "Build trusted relationships with engineering, legal, finance and the executive team before the crisis.",
        "Make decisions visible and risk acceptance explicit and owned by the business.",
        "Hire for a mix of skills and grow people; protect the team from burnout, since incidents are demanding.",
        "Own the answer to \"are we secure?\" honestly: you cannot promise zero risk, but you can show a well-managed one.",
      ],
    },
  ],
};
