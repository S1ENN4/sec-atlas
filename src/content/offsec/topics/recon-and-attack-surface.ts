import type { Topic } from "@/content/types";

export const reconAndAttackSurface: Topic = {
  domain: "offsec",
  slug: "recon-and-attack-surface",
  title: "Reconnaissance and attack surface",
  short: "finding what is exposed: assets, services and forgotten systems, from the attacker's and the defender's side",
  tagline:
    "You cannot defend what you do not know you have. Attackers start by mapping the target; defenders who run the same discovery first find the forgotten server before it is used against them.",
  kind: "tecnica",
  stage: "discover",
  tools: ["nmap", "amass / subfinder", "httpx", "Shodan / Censys", "certificate transparency (crt.sh)", "masscan"],
  sections: [
    {
      heading: "What recon covers",
      bullets: [
        "Passive: gathering information without touching the target's systems, such as public records, DNS data, certificate transparency logs, search engines and leaked-credential reports.",
        "Active: interacting with the target to learn more, such as port scans and service probes. Only within scope, and at a rate agreed in the rules of engagement.",
        "Assets: domains, subdomains, IP ranges, cloud resources, applications, APIs and third-party services.",
        "People and process (when in scope): public information about roles and technology that shapes how an attacker would approach.",
      ],
    },
    {
      heading: "Mapping your own surface",
      body: ["Run this against assets you own or are authorized to test. The same commands show an attacker what is visible, and show a defender what should be turned off."],
      code: [
        {
          language: "bash",
          filename: "surface-discovery.sh (authorized targets only)",
          code: "# 1. subdomains from passive sources\nsubfinder -d example.com -silent > subs.txt\n\n# 2. which of them answer on the web, with title and technology\nhttpx -l subs.txt -title -tech-detect -status-code -silent > web.txt\n\n# 3. open ports and service versions on an in-scope host, at a polite rate\nnmap -sV -T3 --top-ports 1000 --max-rate 100 -oA scans/web01 203.0.113.10\n\n# 4. certificate transparency: names that were ever issued a certificate\ncurl -s 'https://crt.sh/?q=%25.example.com&output=json' | jq -r '.[].name_value' | sort -u",
        },
      ],
    },
    {
      heading: "What to look for",
      bullets: [
        "Forgotten assets: old staging servers, test domains, retired products still answering.",
        "Exposed administrative interfaces and databases, and services that should not be on the internet at all.",
        "Outdated versions and default configurations revealed by banners.",
        "Cloud resources open to the world: storage, snapshots, dashboards.",
        "Subdomains that point to services you no longer control (subdomain takeover).",
        "Secrets and internal details in public code, documents and error pages.",
      ],
    },
    {
      heading: "Defender's view",
      body: [
        "Treat this as continuous asset management, not a one-off test. Keep an authoritative inventory, run external discovery on a schedule, compare it with the inventory, and investigate every difference. Reduce the surface: close what is not needed, put administrative access behind a VPN or zero-trust gateway, and remove dangling DNS records.",
      ],
      bullets: [
        "Alert when a new internet-facing asset appears that is not in the inventory.",
        "Assign an owner to every asset; an unowned asset is a risk.",
        "Retire things properly: remove DNS, certificates and cloud resources together.",
      ],
    },
  ],
};
