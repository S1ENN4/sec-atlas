import type { Topic } from "@/content/types";

export const sreReliability: Topic = {
  domain: "devops",
  slug: "sre-reliability",
  title: "Reliability: SLOs, error budgets and incidents",
  short: "defining how reliable is reliable enough, and learning from every failure",
  tagline:
    "Perfect reliability is infinitely expensive and nobody needs it. SRE turns \"be reliable\" into a number you can budget, alert on and trade against new features.",
  kind: "conceito",
  stage: "operate",
  tools: ["Prometheus / Sloth (SLO rules)", "PagerDuty / Opsgenie", "Statuspage", "incident.io / FireHydrant", "blameless postmortem templates", "chaos engineering tools"],
  sections: [
    {
      heading: "SLI, SLO and error budget",
      bullets: [
        "SLI (service level indicator): a measurement of the service as users experience it, such as the fraction of requests that succeed fast enough.",
        "SLO (service level objective): the target for an SLI over a window, for example 99.9% of requests succeed within 300 ms over 30 days.",
        "SLA (service level agreement): a contract with consequences, usually looser than the internal SLO.",
        "Error budget: the allowed unreliability (100% minus the SLO). While budget remains, ship fast; when it is spent, slow down and invest in reliability.",
      ],
    },
    {
      heading: "Why it changes decisions",
      body: [
        "The budget ends the argument between \"ship more\" and \"be more stable\" by making it a shared, measurable trade. It also tells you what to alert on: page when you are burning the budget fast enough to exhaust it early, and file a ticket when the burn is slow.",
      ],
      code: [
        {
          language: "promql",
          filename: "availability SLI and a fast-burn alert",
          code: "# SLI: ratio of good requests over 5 minutes\nsum(rate(http_requests_total{status!~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))\n\n# fast burn for a 99.9% SLO: error ratio above 14.4x the allowed rate\n(1 - (sum(rate(http_requests_total{status!~\"5..\"}[1h])) / sum(rate(http_requests_total[1h])))) > (14.4 * 0.001)",
        },
      ],
    },
    {
      heading: "Incident response",
      bullets: [
        "Declare early and name roles: an incident commander who coordinates, someone who investigates, someone who communicates.",
        "Mitigate first, diagnose second: roll back, fail over, turn off the flag.",
        "Communicate on a schedule, even when there is nothing new to say.",
        "Keep a timeline as you go; it is the raw material for the review.",
        "Hold a blameless postmortem: ask how the system allowed the failure, not who made the mistake. End with specific, owned actions.",
      ],
    },
    {
      heading: "Reducing risk before it happens",
      bullets: [
        "Remove toil: automate repetitive manual operations so people have time for engineering.",
        "Test failure on purpose with game days and fault injection.",
        "Capacity planning and load testing before the traffic arrives.",
        "Runbooks for known failures, kept in step with the system.",
        "Graceful degradation: when a dependency fails, do less, not nothing.",
      ],
    },
  ],
};
