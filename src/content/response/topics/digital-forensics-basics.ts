import type { Topic } from "@/content/types";

export const digitalForensicsBasics: Topic = {
  domain: "response",
  slug: "digital-forensics-basics",
  title: "Digital forensics fundamentals",
  short: "collecting evidence in the right order, proving it was not altered, and reading what it shows",
  tagline:
    "Forensics is the discipline of evidence: collect it so it cannot be disputed, analyze copies instead of originals, and document every step so another examiner reaches the same result.",
  kind: "tecnica",
  stage: "investigate",
  tools: ["Volatility 3", "Autopsy / The Sleuth Kit", "KAPE", "FTK Imager / dc3dd", "Plaso / Timesketch", "hash tools (sha256sum)"],
  sections: [
    {
      heading: "Principles",
      bullets: [
        "Preserve: change as little as possible, and prove integrity with cryptographic hashes taken at collection.",
        "Work on copies: acquire a forensic image and analyze the image, never the original.",
        "Order of volatility: collect the most fragile evidence first. Memory, then running processes and network connections, then temporary files, then disk, then logs and backups.",
        "Chain of custody: a written record of who held the evidence, when, and what was done to it. It is what makes evidence credible in a dispute.",
        "Document everything: commands, times (in UTC), tools and versions, and your reasoning.",
        "Legal and privacy: have authority to collect, and handle personal data as the law and policy require. Involve counsel when a case may go to court.",
      ],
    },
    {
      heading: "Acquiring evidence",
      body: ["Use a hardware or software write blocker for physical media, capture memory before powering a system down, and hash the result. The commands below are the standard pattern; real cases often use dedicated acquisition tools."],
      code: [
        {
          language: "bash",
          filename: "acquire-disk.sh",
          code: "# image a disk read-only (use a write blocker on physical media)\nsudo dd if=/dev/sdb of=case42/evidence01.img bs=4M conv=noerror,sync status=progress\n\n# prove integrity: record the hash at collection and re-verify later\nsha256sum case42/evidence01.img | tee case42/evidence01.img.sha256\nsha256sum -c case42/evidence01.img.sha256\n\n# make a working copy and analyze that, never the original image\ncp case42/evidence01.img case42/work01.img",
        },
        {
          language: "text",
          filename: "chain-of-custody.txt",
          code: "Case: INC-2026-0142    Item: evidence01.img (disk of web-prod-03)\nSHA-256: <hash recorded at acquisition>\n\n2026-10-13 15:10Z  collected by A. Silva, write-blocked, dc3dd v7.2\n2026-10-13 16:00Z  transferred to evidence locker, sealed bag #118 (A. Silva -> M. Souza)\n2026-10-14 09:05Z  checked out for analysis (M. Souza), hash re-verified OK\n2026-10-14 17:30Z  returned to locker, hash re-verified OK",
        },
      ],
    },
    {
      heading: "What to look at",
      bullets: [
        "Memory: running and hidden processes, network connections, loaded modules and injected code, credentials in memory.",
        "Disk: file system timeline, deleted files, recently run programs, persistence locations (startup items, scheduled tasks, services).",
        "Windows artifacts: event logs, registry hives, prefetch, amcache and shimcache, browser history.",
        "Linux artifacts: shell history, auth and system logs, cron jobs, SSH keys, modified binaries.",
        "Cloud and SaaS: audit logs and configuration state; the evidence often lives in the provider's logs, not on a disk.",
      ],
      code: [
        {
          language: "bash",
          filename: "memory-analysis.sh (Volatility 3)",
          code: "vol -f mem.raw windows.pslist          # running processes\nvol -f mem.raw windows.pstree          # parent-child relationships\nvol -f mem.raw windows.cmdline         # command lines\nvol -f mem.raw windows.netscan         # network connections and listeners\nvol -f mem.raw windows.malfind         # memory regions that look like injected code",
        },
      ],
    },
    {
      heading: "Reporting",
      body: [
        "A forensic report states what was examined, how, what was found, and what it means, separating observation from interpretation. Write so a reader who was not there can follow the reasoning and reproduce it. State limits honestly: what you could not determine and why.",
      ],
    },
  ],
};
