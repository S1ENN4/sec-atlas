import type { Topic } from "@/content/types";

export const linuxAndNetworking: Topic = {
  domain: "devops",
  slug: "linux-and-networking",
  title: "Linux and networking essentials",
  short: "processes, permissions, services, DNS, TCP and TLS: the ground every other tool stands on",
  tagline:
    "Containers, clouds and pipelines all run on Linux and talk over TCP/IP. When something breaks at 3 a.m., these fundamentals are what let you find out why.",
  kind: "tecnica",
  stage: "foundations",
  tools: ["systemd / journalctl", "ss and curl", "dig", "strace", "tcpdump", "openssl s_client"],
  sections: [
    {
      heading: "What you need to know",
      bullets: [
        "Processes and signals: every program is a process with a user, a parent and a state; SIGTERM asks it to stop, SIGKILL forces it.",
        "Files and permissions: owner, group and mode bits decide who can read, write or execute; the principle of least privilege starts here.",
        "Services: systemd starts, restarts and logs long-running programs; journalctl reads their logs.",
        "The network stack: an IP address identifies a host, a port identifies a service, TCP gives reliable streams, UDP gives datagrams.",
        "DNS turns names into addresses, and most mysterious outages are DNS, certificates or time.",
        "TLS wraps a connection so it is encrypted and the server is authenticated by a certificate chain.",
      ],
    },
    {
      heading: "A debugging routine",
      body: ["Move from the outside in: is the name resolving, is the port reachable, is the service listening, is the certificate valid, what do the logs say."],
      code: [
        {
          language: "bash",
          filename: "triage.sh",
          code: "dig +short api.example.com                      # does the name resolve, and to what?\ncurl -sv --max-time 5 https://api.example.com/health   # connect, TLS and HTTP in one go\nss -ltnp | grep :8080                           # is anything listening on this host?\nsystemctl status myapp --no-pager               # is the service running?\njournalctl -u myapp --since \"10 min ago\" -n 100 # what did it say?\nopenssl s_client -connect api.example.com:443 -servername api.example.com </dev/null 2>/dev/null | openssl x509 -noout -dates",
        },
      ],
    },
    {
      heading: "Permissions and a service unit",
      body: ["A service should run as its own unprivileged user with only the access it needs. systemd can enforce much of that for you."],
      code: [
        {
          language: "ini",
          filename: "/etc/systemd/system/myapp.service",
          code: "[Unit]\nDescription=My app\nAfter=network-online.target\n\n[Service]\nUser=myapp\nGroup=myapp\nExecStart=/opt/myapp/bin/myapp\nRestart=on-failure\nNoNewPrivileges=true\nProtectSystem=strict\nProtectHome=true\nReadWritePaths=/var/lib/myapp\n\n[Install]\nWantedBy=multi-user.target",
        },
      ],
    },
    {
      heading: "Habits",
      bullets: [
        "Learn to read before you change: logs, status and metrics first, edits second.",
        "Never run a service as root if it does not need to.",
        "Keep clocks synchronized (NTP): expired tokens and certificates are often a clock problem.",
        "Write down the commands that worked. A runbook starts as a shell history.",
      ],
    },
  ],
};
