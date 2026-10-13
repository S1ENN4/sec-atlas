import type { Topic } from "@/content/types";

export const redTeamAndAdversaryEmulation: Topic = {
  domain: "offsec",
  slug: "red-team-and-adversary-emulation",
  title: "Red team, purple team and adversary emulation",
  short: "testing whether people and detection can stop a realistic adversary, not just whether a bug exists",
  tagline:
    "A penetration test asks what is vulnerable. A red team asks whether you would notice and stop a determined adversary pursuing a goal. The point is to improve detection and response, not to win.",
  kind: "conceito",
  stage: "attack",
  tools: ["MITRE ATT&CK", "Atomic Red Team", "MITRE Caldera", "threat intelligence reports", "purple-team exercise tracker", "detection coverage maps"],
  sections: [
    {
      heading: "How they differ",
      bullets: [
        "Penetration test: broad coverage of weaknesses in a defined scope, usually announced to the defenders, time-boxed, with a list of findings.",
        "Red team: objective-based (for example, reach the customer database or take over the identity provider), covert, longer, and aimed at the whole organization: people, process and technology.",
        "Purple team: red and blue work together in the open. The red side runs a technique, the blue side checks whether it was detected, and they fix gaps on the spot. The fastest way to improve detection.",
        "Adversary emulation: a red or purple exercise that reproduces the documented behavior of a specific threat actor that is relevant to you.",
      ],
    },
    {
      heading: "Running an exercise",
      body: ["Agree on objectives and rules first, run the technique chain, then spend the most time on what was and was not detected."],
      bullets: [
        "Pick the adversary and scenario from threat intelligence: who targets your sector, and which techniques do they use.",
        "Define objectives and success criteria, a small control group that knows (the white cell), and the rules: forbidden actions, safety stops and a deconfliction process so a real incident is never mistaken for the exercise.",
        "Emulate techniques in order, using their ATT&CK identifiers, and record for each: what was done, when, and which telemetry it should create.",
        "Debrief openly: which steps were prevented, detected, alerted, investigated and contained, and how long each took.",
        "Turn gaps into work: new detections, hardening and playbook changes, then re-test.",
      ],
    },
    {
      heading: "A purple-team log",
      body: ["A simple table keeps the exercise honest and turns into a coverage map."],
      code: [
        {
          language: "text",
          filename: "purple-team-log.csv",
          code: "attack_id,technique,executed_at_utc,expected_telemetry,detected,alert_fired,time_to_detect,action\nT1059.001,PowerShell execution,2026-11-05T10:02Z,process_creation + script block log,yes,yes,2m,tune alert severity\nT1003,Credential dumping attempt,2026-11-05T10:20Z,access to LSASS,partial,no,n/a,add EDR rule + Sigma detection\nT1021.001,Remote Desktop lateral movement,2026-11-05T10:45Z,logon type 10 + new source,no,no,n/a,enable logging on the jump host; write detection",
        },
      ],
    },
    {
      heading: "Principles",
      bullets: [
        "The goal is a stronger defense. A red team that never shares its techniques with the blue team is wasting the exercise.",
        "Realism with safety: emulate behavior without causing harm, and keep controls to stop the exercise instantly.",
        "Use public frameworks and benign test procedures for emulation, not custom malware, unless the scope and legal basis explicitly cover it.",
        "Legal and ethical rules from the first topic apply here with extra force: authorization, scope, minimal data handling and honest reporting.",
        "Measure improvement over time: detection coverage, time to detect, time to contain.",
      ],
    },
  ],
};
