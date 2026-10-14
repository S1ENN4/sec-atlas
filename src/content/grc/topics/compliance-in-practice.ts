import type { Topic } from "@/content/types";

export const complianceInPractice: Topic = {
  domain: "grc",
  slug: "compliance-in-practice",
  title: "Compliance in practice: controls, evidence and audits",
  short: "turning requirements into controls with an owner, collecting evidence continuously and passing audits calmly",
  tagline:
    "Audits are painful when evidence is gathered by panic in the last week. They are routine when controls have owners and evidence is produced automatically all year.",
  kind: "pratica",
  stage: "prove",
  tools: ["GRC platforms (Vanta, Drata, OneTrust)", "policy-as-code", "cloud config and audit logs", "ticketing systems", "evidence repositories", "internal audit"],
  sections: [
    {
      heading: "From requirement to control",
      bullets: [
        "Requirement: what a standard or law demands, in its own words.",
        "Control: what you actually do to meet it, written so that it can be tested (who, what, how often).",
        "Owner: the person accountable for the control working, not the compliance team.",
        "Evidence: proof that the control operated during the period, such as a configuration export, a log, a ticket, an approval.",
        "Test: a periodic check that the control works, by its owner and by independent review.",
      ],
    },
    {
      heading: "Continuous evidence",
      body: ["Wherever a control is technical, let the system produce the evidence. Version-controlled policy, configuration and access reviews leave a trail by design."],
      code: [
        {
          language: "bash",
          filename: "collect-evidence.sh",
          code: "DATE=$(date -u +%F)\nmkdir -p evidence/$DATE\n\n# who has admin access to the cloud account\naws iam list-entities-for-policy --policy-arn arn:aws:iam::aws:policy/AdministratorAccess \\\n  > evidence/$DATE/aws-admin-principals.json\n\n# is MFA enforced for console users\naws iam generate-credential-report >/dev/null && aws iam get-credential-report --query Content --output text \\\n  | base64 -d > evidence/$DATE/iam-credential-report.csv\n\n# branch protection on the main repository\ngh api repos/example/app/branches/main/protection > evidence/$DATE/branch-protection.json\n\nsha256sum evidence/$DATE/* > evidence/$DATE/SHA256SUMS",
        },
      ],
    },
    {
      heading: "The audit",
      bullets: [
        "Scope and period are agreed first; know what is in and out.",
        "Auditors ask for a sample of evidence for each control. Organize it by control, with names and dates that make sense.",
        "Be honest about exceptions: a documented gap with an action plan is far better than one the auditor finds.",
        "Findings become risk register entries and tracked work with owners and dates.",
        "Keep one point of contact and a calm cadence; surprise requests usually mean missing evidence.",
      ],
    },
    {
      heading: "Avoiding checkbox security",
      bullets: [
        "Ask of each control what risk it reduces. If nobody can say, question it.",
        "Prefer automated checks over screenshots and annual attestations.",
        "Use one control to satisfy several frameworks instead of one process per standard.",
        "Share the compliance calendar with engineering so that requests are planned work, not interruptions.",
      ],
    },
  ],
};
