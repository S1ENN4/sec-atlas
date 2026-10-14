import type { Topic } from "@/content/types";

export const securityMetrics: Topic = {
  domain: "grc",
  slug: "security-metrics",
  title: "Security metrics and reporting to leadership",
  short: "measuring outcomes, not activity, and telling the board a story it can act on",
  tagline:
    "A number that cannot change a decision is decoration. Good security metrics show whether risk is going down, how fast the team responds, and where leadership must act.",
  kind: "pratica",
  stage: "prove",
  tools: ["dashboards (Grafana, Looker)", "risk register", "KRIs and KPIs", "vulnerability management data", "incident timelines", "board reporting templates"],
  sections: [
    {
      heading: "Activity versus outcome",
      bullets: [
        "Activity metrics count work (scans run, trainings completed, tickets closed). They show effort, not safety.",
        "Outcome metrics show results (time to remediate critical issues, share of assets covered by logging, time to detect and contain incidents).",
        "KPIs describe how well a process performs; KRIs (key risk indicators) warn that risk is rising (growing backlog of critical findings, rising exposure of unsupported systems).",
        "Prefer a few metrics tied to decisions over a long list nobody reads.",
      ],
    },
    {
      heading: "Useful measures",
      bullets: [
        "Detection and response: mean time to detect, to contain and to recover, by severity.",
        "Vulnerability management: time to fix critical and exploited vulnerabilities; share of internet-facing assets in the inventory; age of the oldest critical finding.",
        "Coverage: percentage of assets with endpoint protection, logging, backups tested, multi-factor authentication.",
        "Resilience: restore tests passed, tabletop exercises run and actions closed.",
        "Third parties: share of critical vendors assessed in the last year.",
        "Risk: number and trend of risks above appetite, and how many have a funded plan.",
      ],
      code: [
        {
          language: "yaml",
          filename: "metrics-definition.yml",
          code: "- name: critical_vuln_time_to_remediate\n  definition: \"days from detection to verified fix, for critical findings on internet-facing assets\"\n  source: vulnerability-scanner + ticketing\n  target: \"<= 7 days, 90th percentile\"\n  owner: head-of-appsec\n  review: monthly\n  decision_it_informs: \"whether to add engineering capacity to the remediation backlog\"",
        },
      ],
    },
    {
      heading: "Reporting to executives and the board",
      bullets: [
        "Lead with the answer: are we getting safer, and what do you need from us?",
        "Translate to business terms: money, customers, regulatory exposure, downtime, not technical counts.",
        "Show trends and targets, not isolated numbers, and explain changes honestly, including bad news.",
        "Tie asks to decisions: a budget, a policy, an owner for a risk acceptance.",
        "Keep it brief (one page and a few slides) and consistent, so changes are visible quarter to quarter.",
        "Report incidents and near misses with what was learned and fixed.",
      ],
    },
    {
      heading: "Pitfalls",
      bullets: [
        "Gaming: when a metric becomes a target for individuals, people optimize the number, not the risk.",
        "Vanity numbers: blocked attacks and scans completed say little about safety.",
        "False precision: a risk score of 7.3 is not more accurate than \"high\".",
        "Changing definitions silently: trends become meaningless; version your metric definitions.",
      ],
    },
  ],
};
