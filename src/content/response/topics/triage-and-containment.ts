import type { Topic } from "@/content/types";

export const triageAndContainment: Topic = {
  domain: "response",
  slug: "triage-and-containment",
  title: "Triage, scoping and containment",
  short: "decide what happened and how big it is, then stop the bleeding without destroying evidence",
  tagline:
    "The first hour is about two questions: how far has this gone, and what is the least damaging way to stop it? Answer them in the right order and keep the evidence intact.",
  kind: "pratica",
  stage: "respond",
  tools: ["EDR (CrowdStrike, Defender, SentinelOne)", "AWS CLI / cloud consoles", "SIEM", "network isolation (VLAN, security groups)", "IdP admin console", "forensic snapshots"],
  sections: [
    {
      heading: "Triage questions",
      bullets: [
        "What is the alert, and is it true? Rule out a false positive quickly with a second data source.",
        "What is affected: which hosts, identities, accounts, services and data?",
        "When did it start? The first alert is rarely the first event; look backwards.",
        "What does the attacker have now: credentials, persistence, a foothold in the cloud?",
        "Is data leaving, and is the activity ongoing?",
        "What is the business impact, and what severity does that imply?",
      ],
    },
    {
      heading: "Containment options",
      body: ["Choose the smallest action that stops the harm. Short-term containment buys time; long-term containment prepares a clean recovery."],
      bullets: [
        "Identity: reset credentials, revoke sessions and tokens, disable the account or access key, require re-authentication with a second factor.",
        "Endpoint: network-isolate the host through the EDR (it stays powered on and reachable by your tools), rather than powering it off and losing memory.",
        "Network: block known-bad addresses and domains, tighten egress, move the system to a quarantine segment.",
        "Cloud: deny-all policy on the compromised role, quarantine security group on the instance, snapshot the volume before changes.",
        "Application: disable the vulnerable feature or route with a WAF rule while a fix is built.",
      ],
    },
    {
      heading: "Cloud example: contain a leaked access key",
      body: ["Contain first, preserve second, investigate third. The commands below deactivate the key, deny further actions and snapshot a suspect volume; adapt names and ids, and record every command in the incident timeline."],
      code: [
        {
          language: "bash",
          filename: "contain-leaked-key.sh",
          code: "# 1. stop the key from working (keep it; do not delete, you need it as evidence)\naws iam update-access-key --user-name build-bot --access-key-id AKIAEXAMPLEKEY --status Inactive\n\n# 2. deny everything for the user while you investigate\naws iam attach-user-policy --user-name build-bot --policy-arn arn:aws:iam::aws:policy/AWSDenyAll\n\n# 3. isolate a suspect instance with a security group that allows nothing\naws ec2 modify-instance-attribute --instance-id i-0abc123 --groups sg-0quarantine\n\n# 4. preserve its disk before any cleanup\naws ec2 create-snapshot --volume-id vol-0abc123 --description \"INC-2026-0142 evidence\" \\\n  --tag-specifications 'ResourceType=snapshot,Tags=[{Key=incident,Value=INC-2026-0142}]'",
        },
      ],
    },
    {
      heading: "Mistakes to avoid",
      bullets: [
        "Wiping or reimaging before taking evidence: you lose the answer to how they got in.",
        "Containing only the host you found: the attacker has other footholds, so scope first or contain widely at once.",
        "Resetting one password but leaving active sessions, tokens, API keys and mailbox rules in place.",
        "Tipping off the attacker by changing things piecemeal over days; coordinate containment into one decisive window.",
        "Forgetting to record who did what and when.",
      ],
    },
  ],
};
