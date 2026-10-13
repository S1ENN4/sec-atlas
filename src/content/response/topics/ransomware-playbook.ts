import type { Topic } from "@/content/types";

export const ransomwarePlaybook: Topic = {
  domain: "response",
  slug: "ransomware-playbook",
  title: "Ransomware response playbook",
  short: "contain fast, preserve evidence, recover from backups and decide with legal and leadership",
  tagline:
    "Ransomware is a business crisis with a technical core. The teams that recover well had working backups, practiced the playbook and made the hard decisions before the pressure.",
  kind: "pratica",
  stage: "respond",
  tools: ["EDR", "immutable backups", "network segmentation", "Active Directory tooling", "CISA #StopRansomware guidance", "out-of-band communications"],
  sections: [
    {
      heading: "What happens",
      body: [
        "Modern ransomware attacks are usually human-operated. An attacker gets in (stolen credentials, an exposed service, a phishing link), explores, steals data, removes or corrupts backups, and then encrypts as many systems as possible at once, often outside working hours. Many groups also threaten to publish stolen data, so restoring files does not end the incident.",
      ],
    },
    {
      heading: "First hours",
      bullets: [
        "Isolate affected systems from the network (do not power them off if you can avoid it; memory may hold keys and evidence).",
        "Declare a major incident, open the out-of-band channel, and bring in legal, communications, executives and your insurer or retainer.",
        "Protect backups: disconnect or lock the backup system now, before it is encrypted or wiped.",
        "Identify the scope: which systems, which accounts, which data, and whether domain-level credentials are compromised.",
        "Preserve evidence: ransom note, sample encrypted files, logs, memory and disk images of key systems.",
        "Reset privileged credentials and tokens in a controlled way, from a clean machine.",
      ],
    },
    {
      heading: "Recovery",
      bullets: [
        "Rebuild from known-good: restore from backups verified as clean and from before the attacker's earliest access.",
        "Recover in priority order: identity infrastructure first, then the services the business needs most.",
        "Do not reconnect restored systems until the entry point is closed and persistence is removed, or you will be encrypted again.",
        "Monitor closely after each system returns: the attacker may still hold a foothold.",
        "Test restores before you need them. A backup that has never been restored is an assumption.",
      ],
    },
    {
      heading: "The payment question",
      body: [
        "Whether to pay is a business and legal decision, not a technical one, and it should be considered with counsel, the insurer and law enforcement. Payment does not guarantee a working decryptor or that stolen data will be deleted, and it may carry legal exposure, such as sanctions on the recipient. Settle your position in advance as policy, so that it is not invented under pressure.",
      ],
    },
    {
      heading: "Reduce the odds and the damage",
      code: [
        {
          language: "yaml",
          filename: "ransomware-readiness.yml",
          code: "backups:\n  offline_or_immutable_copy: true       # an attacker with admin cannot delete it\n  restore_test_frequency: quarterly\n  scope: [domain-controllers, databases, file-servers, config-repos]\nidentity:\n  mfa_for_admins_and_remote_access: true\n  tiered_admin_accounts: true           # no domain admin logins on workstations\n  service_account_review: quarterly\nnetwork:\n  segmentation: [workstations, servers, backup, management]\n  rdp_exposed_to_internet: false\ndetection:\n  edr_coverage: \"all servers and endpoints\"\n  alert_on: [mass_file_rename, shadow_copy_deletion, backup_service_stop]\nrunbook:\n  out_of_band_comms: \"phone tree and secondary chat, stored offline\"\n  decision_owner_for_payment: \"CEO with legal counsel\"",
        },
      ],
      bullets: [
        "Patch internet-facing systems and remove exposed remote-access services.",
        "Multi-factor authentication for remote access and for every administrative account.",
        "Least privilege and tiered administration so one stolen credential does not reach everything.",
        "Rehearse the playbook with a tabletop exercise, including the decision to take systems offline.",
      ],
    },
  ],
};
