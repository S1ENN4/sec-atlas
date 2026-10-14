// World: from a signal to a response, the life of an alert in a SOC.
import type { Mission, WorldNode } from "./world";

export const socWorld: WorldNode = {
  id: "soc",
  kind: "place",
  children: [
    {
      id: "s-telemetry",
      kind: "place",
      topics: ["secops/telemetria-borda", "secops/escala-telemetria"],
      children: [
        { id: "s-logs", kind: "concept", topics: ["secops/telemetria-borda", "cloudsec/logging-detection"] },
        { id: "s-edge", kind: "tool", topics: ["secops/telemetria-borda", "secops/waf"] },
        { id: "s-normalize", kind: "concept", topics: ["secops/escala-telemetria"] },
      ],
    },
    {
      id: "s-detect",
      kind: "place",
      topics: ["secops/detection-engineering"],
      children: [
        {
          id: "s-sigma",
          kind: "file",
          path: "rules/powershell_download.yml",
          topics: ["secops/detection-engineering"],
          code: {
            lang: "yaml",
            text: `title: Suspicious PowerShell download
logsource:
  product: windows
  category: process_creation
detection:
  selection:
    Image|endswith: '\\powershell.exe'
    CommandLine|contains:
      - 'DownloadString'
      - 'Invoke-WebRequest'
  condition: selection
falsepositives:
  - Admin scripts
level: high`,
          },
        },
        { id: "s-tuning", kind: "concept", topics: ["secops/detection-engineering", "secops/slos-soc"] },
        { id: "s-coverage", kind: "concept", topics: ["secops/detection-engineering", "response/threat-intelligence"] },
      ],
    },
    {
      id: "s-triage",
      kind: "place",
      topics: ["response/triage-and-containment"],
      children: [
        { id: "s-severity", kind: "concept", topics: ["response/triage-and-containment"] },
        { id: "s-context", kind: "concept", topics: ["response/triage-and-containment", "response/threat-intelligence"] },
        {
          id: "s-runbooks",
          kind: "file",
          path: "runbooks/ransomware-containment.md",
          topics: ["secops/runbooks-e-hardening", "response/ransomware-playbook"],
          code: {
            lang: "text",
            text: `# Ransomware containment runbook (draft)
1. Disconnect the host from the network
2. Reboot the host to stop the encryption process
3. Delete the malware binary from disk
4. Tell the user to keep working while we investigate
5. Revoke the user's active sessions and rotate their credentials
6. Preserve a disk image and memory capture before cleanup`,
          },
          risky: [3, 4, 5],
        },
      ],
    },
    {
      id: "s-investigate",
      kind: "place",
      topics: ["response/log-and-timeline-analysis", "response/digital-forensics-basics"],
      children: [
        { id: "s-timeline", kind: "concept", topics: ["response/log-and-timeline-analysis"] },
        { id: "s-hunt", kind: "concept", topics: ["response/threat-hunting"] },
        { id: "s-forensics", kind: "concept", topics: ["response/digital-forensics-basics", "response/malware-analysis-basics"] },
      ],
    },
    {
      id: "s-contain",
      kind: "place",
      topics: ["response/triage-and-containment", "response/ir-lifecycle"],
      children: [
        { id: "s-isolate", kind: "check", topics: ["response/triage-and-containment"] },
        { id: "s-creds", kind: "check", topics: ["response/triage-and-containment", "cloudsec/iam"] },
        { id: "s-ransom", kind: "concept", topics: ["response/ransomware-playbook"] },
      ],
    },
    {
      id: "s-learn",
      kind: "place",
      topics: ["response/ir-lifecycle", "secops/slos-soc"],
      children: [
        { id: "s-postmortem", kind: "concept", topics: ["response/ir-lifecycle", "grc/crisis-communication-and-culture"] },
        { id: "s-metrics", kind: "concept", topics: ["secops/slos-soc", "grc/security-metrics"] },
      ],
    },
  ],
};

export const socMissions: Mission[] = [
  { id: "triage-an-alert", steps: ["s-severity", "s-context", "s-runbooks", "s-isolate"] },
  { id: "build-a-detection", steps: ["s-logs", "s-normalize", "s-sigma", "s-tuning", "s-coverage"] },
];
