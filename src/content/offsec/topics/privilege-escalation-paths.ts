import type { Topic } from "@/content/types";

export const privilegeEscalationPaths: Topic = {
  domain: "offsec",
  slug: "privilege-escalation-paths",
  title: "Attack paths and privilege escalation",
  short: "how small misconfigurations chain into full compromise, and how defenders find the chain first",
  tagline:
    "Attackers rarely need a zero-day. They chain ordinary weaknesses (a reused credential, an over-broad permission, a trust relationship) until they reach something valuable. The defender's advantage is to map those paths before they are used.",
  kind: "conceito",
  stage: "attack",
  tools: ["BloodHound (Active Directory attack paths)", "PMapper / Prowler / Cloudsplaining (cloud IAM)", "PingCastle", "MITRE ATT&CK", "Atomic Red Team", "privilege access management (PAM)"],
  sections: [
    {
      heading: "The idea of a path",
      body: [
        "After initial access, an attacker looks for a route from where they are to what they want: higher privileges, other systems, sensitive data. Each step uses a permission, a stored credential, a trust or a misconfiguration. Seen as a graph, the environment has many such paths, and shortening or cutting them is the defender's job. This topic describes the concepts and the defenses, not step-by-step attack procedures.",
      ],
    },
    {
      heading: "Common building blocks",
      bullets: [
        "Credential exposure: passwords and tokens in files, scripts, memory, shell history and configuration, reused across systems.",
        "Over-privilege: accounts and roles with far more permission than their task needs, including admins who log in to ordinary workstations.",
        "Trust relationships: a system trusted by many others (a build server, a management host) becomes a pivot to all of them.",
        "Weak service accounts: long-lived, highly privileged, with passwords that never rotate.",
        "Misconfigured delegation or permissions: in Active Directory, in Kubernetes RBAC, and in cloud IAM, where the right to pass or assume a role can be the right to become it.",
        "Unpatched local flaws: a low-privileged foothold turning into administrator through a known vulnerability.",
      ],
    },
    {
      heading: "Example: a cloud permission that is more than it looks",
      body: ["A policy that lets a user pass any role to a compute service, combined with the right to create that service, lets the user run code as the most privileged role. The fix is to scope what can be passed."],
      code: [
        {
          language: "json",
          filename: "risky-policy.json",
          code: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    { \"Effect\": \"Allow\", \"Action\": [\"iam:PassRole\", \"lambda:CreateFunction\", \"lambda:InvokeFunction\"], \"Resource\": \"*\" }\n  ]\n}",
        },
        {
          language: "json",
          filename: "scoped-policy.json",
          code: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"iam:PassRole\",\n      \"Resource\": \"arn:aws:iam::123456789012:role/app-lambda-low-privilege\",\n      \"Condition\": { \"StringEquals\": { \"iam:PassedToService\": \"lambda.amazonaws.com\" } }\n    },\n    { \"Effect\": \"Allow\", \"Action\": [\"lambda:CreateFunction\", \"lambda:InvokeFunction\"], \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:app-*\" }\n  ]\n}",
        },
      ],
    },
    {
      heading: "Defending against chains",
      bullets: [
        "Map the paths yourself: run an attack-path tool (BloodHound for Active Directory, a cloud IAM analyzer for cloud) and treat the shortest paths to your crown jewels as priority fixes.",
        "Tiered administration: privileged accounts only log in to privileged systems, never to workstations or servers at a lower tier.",
        "Least privilege and just-in-time access: no standing admin rights, short elevations with approval and logging.",
        "Protect and rotate credentials: secret managers, managed or group service accounts, no secrets in files.",
        "Segment the network and reduce trust between systems; do not let one host reach everything.",
        "Detect the steps: alert on privilege changes, new role assumptions, unusual authentication patterns and credential access.",
        "Validate detection by emulating techniques safely (for example with Atomic Red Team) in a lab or with approval.",
      ],
    },
  ],
};
