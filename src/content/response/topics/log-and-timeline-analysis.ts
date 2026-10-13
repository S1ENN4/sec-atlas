import type { Topic } from "@/content/types";

export const logAndTimelineAnalysis: Topic = {
  domain: "response",
  slug: "log-and-timeline-analysis",
  title: "Log analysis and building a timeline",
  short: "turning scattered logs into the story of what the attacker did and when",
  tagline:
    "Every investigation ends as a timeline: first access, what they touched, how they moved, what they took. The quality of that timeline depends on clean timestamps and good pivots.",
  kind: "tecnica",
  stage: "detect",
  tools: ["SIEM (Splunk, Elastic, Sentinel)", "jq", "Timesketch", "Sigma", "CloudTrail / audit logs", "Plaso (log2timeline)"],
  sections: [
    {
      heading: "Start with clean time",
      bullets: [
        "Convert every timestamp to UTC before you compare anything. Time zones and daylight saving cause most timeline errors.",
        "Note clock skew: a host with a wrong clock shifts its whole story. Compare a shared event across sources to measure the offset.",
        "Record the source, the field and the time resolution for each event; a log with only minute resolution cannot order events within the minute.",
        "Keep raw copies and work on copies.",
      ],
    },
    {
      heading: "Pivoting",
      body: ["An investigation moves by pivoting: take one known fact and ask what else shares it. Each pivot narrows or widens the scope."],
      bullets: [
        "From an IP to every account that signed in from it, and every request it made.",
        "From an account to its sessions, its devices, the resources it touched, and the changes it made.",
        "From a host to its parent and child processes, network connections and files created.",
        "From a file hash to every host where it appeared.",
        "From the first malicious event backwards: how did the access begin?",
      ],
    },
    {
      heading: "Example: a compromised cloud identity",
      body: ["Pull everything one identity did from CloudTrail, in order, and look for firsts: a new source address, a new region, a sensitive API call."],
      code: [
        {
          language: "bash",
          filename: "cloudtrail-pivot.sh",
          code: "# every action by the suspect identity, in time order\njq -r '.Records[]\n  | select(.userIdentity.arn // \"\" | test(\"build-bot\"))\n  | [.eventTime, .eventName, .awsRegion, .sourceIPAddress, (.errorCode // \"ok\")] | @tsv' \\\n  cloudtrail/*.json | sort\n\n# which source addresses did this identity use?\njq -r '.Records[] | select(.userIdentity.arn // \"\" | test(\"build-bot\")) | .sourceIPAddress' \\\n  cloudtrail/*.json | sort | uniq -c | sort -rn",
        },
        {
          language: "python",
          filename: "merge_timeline.py",
          code: "import csv, heapq\nfrom datetime import datetime, timezone\n\ndef load(path, source, ts_field, fmt):\n    with open(path, newline=\"\") as f:\n        for row in csv.DictReader(f):\n            ts = datetime.strptime(row[ts_field], fmt).replace(tzinfo=timezone.utc)\n            yield ts, source, row.get(\"message\", \"\")\n\nstreams = [\n    load(\"idp.csv\", \"idp\", \"time\", \"%Y-%m-%dT%H:%M:%SZ\"),\n    load(\"proxy.csv\", \"proxy\", \"ts\", \"%Y-%m-%d %H:%M:%S\"),\n]\nfor ts, source, msg in heapq.merge(*(sorted(s) for s in streams)):\n    print(ts.isoformat(), source, msg)",
        },
      ],
    },
    {
      heading: "Turn findings into detections",
      body: ["When you find a technique the attacker used, write a rule so it is caught next time. Sigma is a vendor-neutral format that converts to many SIEM query languages."],
      code: [
        {
          language: "yaml",
          filename: "suspicious-encoded-powershell.yml (Sigma)",
          code: "title: PowerShell launched with an encoded command\nstatus: experimental\nlogsource:\n  category: process_creation\n  product: windows\ndetection:\n  selection:\n    Image|endswith: '\\powershell.exe'\n    CommandLine|contains:\n      - ' -enc '\n      - ' -EncodedCommand '\n  condition: selection\nfalsepositives:\n  - Some management tools use encoded commands; baseline them first\nlevel: medium",
        },
      ],
    },
    {
      heading: "Habits",
      bullets: [
        "Write the timeline as you go, with the evidence for each line.",
        "Separate facts from hypotheses and mark which is which.",
        "Look for the absence of logs too: a gap can be the attacker's cleanup.",
        "Keep a list of questions you cannot yet answer, and of logs you wish you had; that list improves your logging.",
      ],
    },
  ],
};
