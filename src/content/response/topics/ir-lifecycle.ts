import type { Topic } from "@/content/types";

export const irLifecycle: Topic = {
  domain: "response",
  slug: "ir-lifecycle",
  title: "The incident response lifecycle",
  short: "prepare, detect, contain, eradicate, recover and learn: the loop every incident follows",
  tagline:
    "An incident is not the moment to invent a process. Teams that respond well decided roles, severity levels and communication channels long before something broke.",
  kind: "conceito",
  stage: "prepare",
  tools: ["NIST SP 800-61", "PagerDuty / Opsgenie", "Slack or Teams incident channel", "ticketing and case management", "TheHive", "runbooks in version control"],
  sections: [
    {
      heading: "The phases",
      body: ["NIST's incident handling guide describes a cycle that most programs adopt in some form. Treat it as a loop, not a line: what you learn feeds preparation."],
      bullets: [
        "Preparation: policy, an on-call rota, tools and access in place, logging that answers questions, practiced playbooks, contact lists (legal, communications, vendors, regulators).",
        "Detection and analysis: recognize that something is wrong, decide whether it is an incident, scope it, and assign a severity.",
        "Containment: stop it from spreading or getting worse, with the least disruption that works, while preserving evidence.",
        "Eradication and recovery: remove the attacker's access and the cause, restore systems from known-good state, and watch closely as they come back.",
        "Post-incident activity: a blameless review, lessons, and changes to detection, controls and playbooks.",
      ],
    },
    {
      heading: "Roles and communication",
      bullets: [
        "Incident commander: owns the response, makes decisions, and does not do the hands-on work.",
        "Technical leads: investigate and contain, one per workstream (endpoint, identity, cloud, network).",
        "Communications: internal updates on a schedule, and external messages to customers, partners and regulators, approved by legal.",
        "Scribe: keeps a timeline with timestamps in UTC of what was seen and done and by whom.",
        "Use one channel as the source of truth, and one out-of-band channel in case the main one is compromised.",
      ],
    },
    {
      heading: "Severity and a record",
      body: ["Agree on severity levels in advance so people do not argue about them during the event, and open a record the moment you declare."],
      code: [
        {
          language: "yaml",
          filename: "incident-record.yml",
          code: "id: INC-2026-0142\ndeclared_at: 2026-10-13T14:05:00Z      # always UTC\nseverity: SEV2                          # SEV1 customer data or core outage; SEV2 contained but serious; SEV3 minor\ncommander: a.silva\nsummary: Suspicious sign-ins to the admin console from a new country\nscope:\n  affected: [identity-provider, admin-console]\n  data_at_risk: none confirmed\ntimeline:\n  - { at: 2026-10-13T13:52:00Z, event: \"Alert fired: impossible travel\", by: detection }\n  - { at: 2026-10-13T14:05:00Z, event: \"Incident declared\", by: a.silva }\nnext_update: 2026-10-13T15:00:00Z",
        },
      ],
    },
    {
      heading: "Principles that hold in every incident",
      bullets: [
        "Preserve evidence before you change things: snapshot, copy logs, record what you did.",
        "Contain proportionally: shutting down production is sometimes right and often an overreaction.",
        "Assume the attacker is watching: do not announce the plan on the channel they may be reading.",
        "Decide with incomplete information, then update as facts arrive.",
        "Write it down as you go; memory under stress is unreliable.",
        "Practice with tabletop exercises so the first time is not the real one.",
      ],
    },
  ],
};
