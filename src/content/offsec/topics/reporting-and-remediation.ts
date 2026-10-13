import type { Topic } from "@/content/types";

export const reportingAndRemediation: Topic = {
  domain: "offsec",
  slug: "reporting-and-remediation",
  title: "Reporting findings and driving remediation",
  short: "the report is the product: clear impact, reproducible evidence and fixes people can apply",
  tagline:
    "A finding that nobody understands or acts on has no value. The best testers write so that an executive sees the risk and an engineer can fix it in an afternoon.",
  kind: "pratica",
  stage: "report",
  tools: ["CVSS calculator", "Dradis / PlexTrac / Serpico", "Markdown and PDF tooling", "issue trackers", "retest checklist", "OWASP risk rating methodology"],
  sections: [
    {
      heading: "Structure of a report",
      bullets: [
        "Executive summary: for non-technical readers. What was tested, the overall risk in plain language, the few things that matter most and what to do first.",
        "Scope and method: what was in and out of scope, the dates, the approach and any limitations (what you could not test).",
        "Findings: one entry each, ordered by severity, with a unique id.",
        "Strategic recommendations: patterns behind the findings (for example, no central authorization layer) and how to fix the cause, not just the instances.",
        "Appendices: evidence, tool output and the methodology details.",
      ],
    },
    {
      heading: "A good finding",
      body: ["Each finding should stand on its own and be reproducible by someone who was not there."],
      code: [
        {
          language: "markdown",
          filename: "finding-template.md",
          code: "## F-01  Broken object-level authorization on /api/invoices/{id}\n\n**Severity:** High (CVSS v3.1 8.1, AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N)\n**Affected:** https://api.example.com/v2/invoices/{id}\n**Category:** OWASP API Security: Broken Object Level Authorization\n\n### Summary\nAny authenticated user can read and modify any customer's invoices by changing the id.\n\n### Impact\nAn attacker with a free account can read all customers' billing data and alter invoice totals. Affects every customer.\n\n### Steps to reproduce\n1. Log in as tester-a and note an invoice id (1041).\n2. Log in as tester-b and send `GET /api/invoices/1041`.\n3. The response is 200 with tester-a's invoice.\n\n### Evidence\nevidence/F-01-request.txt, evidence/F-01-response.txt\n\n### Remediation\nAuthorize on the server by ownership for every request (scope the query by the authenticated user). Return the same 404 for \"not found\" and \"not yours\". Add a regression test with two users.\n\n### References\nOWASP Top 10 A01 Broken Access Control",
        },
      ],
    },
    {
      heading: "Rating risk",
      body: [
        "CVSS gives a consistent technical score, but it ignores your context. Adjust severity by real exploitability, the value of the data and systems affected, whether controls compensate, and whether the issue is already being exploited. Explain the reasoning in the report so that the client can prioritize, instead of copying the scanner's number.",
      ],
    },
    {
      heading: "After the report",
      bullets: [
        "Walk the client's engineers through the critical findings; a conversation resolves doubts faster than a document.",
        "Agree on owners and dates, and track fixes in the client's own issue tracker.",
        "Retest: verify each fix actually closes the issue and report the result. Fixes that only block the exact test case are common.",
        "Handle the data: deliver the report securely, and delete or return client data as agreed.",
        "Feed lessons back: recurring root causes should become design guidance, tests and training.",
      ],
    },
  ],
};
