import type { Topic } from "@/content/types";

export const threatHunting: Topic = {
  domain: "response",
  slug: "threat-hunting",
  title: "Threat hunting",
  short: "looking for attackers that your alerts missed, starting from a hypothesis",
  tagline:
    "Detection waits for a rule to fire. Hunting assumes something may already be inside and searches for the evidence, then turns what it finds into permanent detections.",
  kind: "pratica",
  stage: "detect",
  tools: ["MITRE ATT&CK", "SIEM / data lake queries", "EDR telemetry search", "Jupyter notebooks", "Sigma", "osquery"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Threat hunting is a proactive, human-driven search through your telemetry for activity that automated detections did not flag. A hunt is not a random trawl: it starts from a hypothesis about how an attacker could be operating in your environment, tests it against data, and ends with either a finding or a documented negative result and a better detection.",
      ],
    },
    {
      heading: "The hunt cycle",
      bullets: [
        "Hypothesis: a specific, testable statement, for example \"an attacker who stole a cloud key would call the secrets API from a new network\".",
        "Data: identify which logs could confirm or refute it, and whether you collect them. Missing data is itself a finding.",
        "Query and analyze: run searches, baseline normal, and investigate the outliers.",
        "Conclude: confirmed activity becomes an incident; benign patterns are documented; gaps become tasks.",
        "Operationalize: convert the hunt into an automated detection and track its false positive rate.",
      ],
    },
    {
      heading: "Where hypotheses come from",
      bullets: [
        "ATT&CK techniques that matter for your environment and have weak detection coverage.",
        "Threat intelligence about groups that target your industry and the techniques they use.",
        "Recent incidents (yours and public ones) and what they revealed about blind spots.",
        "Anomalies: rare parent-child processes, unusual logon times, first-seen tools and destinations.",
      ],
    },
    {
      heading: "Example hunts",
      body: ["Two classic patterns written as generic SQL over normalized event tables; translate them to your platform's language."],
      code: [
        {
          language: "sql",
          filename: "office-spawning-a-shell.sql",
          code: "-- Hypothesis: a malicious document launches a script interpreter\nSELECT ts, host, user, parent_image, image, command_line\nFROM process_events\nWHERE lower(parent_image) LIKE '%\\winword.exe'\n  AND (lower(image) LIKE '%\\cmd.exe' OR lower(image) LIKE '%\\powershell.exe'\n       OR lower(image) LIKE '%\\wscript.exe' OR lower(image) LIKE '%\\mshta.exe')\n  AND ts > now() - interval '30 days'\nORDER BY ts DESC;",
        },
        {
          language: "sql",
          filename: "rare-outbound-destinations.sql",
          code: "-- Hypothesis: beaconing to a destination few hosts ever contact\nSELECT dest_domain, count(DISTINCT host) AS hosts, count(*) AS connections\nFROM proxy_events\nWHERE ts > now() - interval '14 days'\nGROUP BY dest_domain\nHAVING count(DISTINCT host) <= 2 AND count(*) > 200\nORDER BY connections DESC;",
        },
      ],
    },
    {
      heading: "Doing it well",
      bullets: [
        "Write down each hunt: hypothesis, data, queries, result. Hunts are reusable knowledge.",
        "Measure the program: hunts completed, detections created, gaps found. Finding nothing is a valid outcome.",
        "Baseline before you flag: rare is not the same as malicious.",
        "Collaborate with detection engineers and responders; the output of a hunt is their input.",
        "Stay inside authorization and privacy rules when querying user activity.",
      ],
    },
  ],
};
