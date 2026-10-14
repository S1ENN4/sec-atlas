// World: a message going down the network stack (the OSI model), layer by layer.
import type { Mission, WorldNode } from "./world";

export const netWorld: WorldNode = {
  id: "net",
  kind: "place",
  children: [
    {
      id: "n-physical",
      kind: "place",
      topics: ["devops/linux-and-networking"],
      children: [
        { id: "n-wifi", kind: "concept", topics: ["cloudsec/network"] },
        { id: "n-physical-access", kind: "concept", topics: ["grc/security-architecture"] },
      ],
    },
    {
      id: "n-datalink",
      kind: "place",
      topics: ["cloudsec/network"],
      children: [
        { id: "n-arp", kind: "concept", topics: ["devops/linux-and-networking", "offsec/recon-and-attack-surface"] },
        { id: "n-vlan", kind: "concept", topics: ["cloudsec/network", "cloudsec/zero-trust"] },
        { id: "n-8021x", kind: "check", topics: ["cloudsec/zero-trust"] },
      ],
    },
    {
      id: "n-network",
      kind: "place",
      topics: ["cloudsec/network", "devops/linux-and-networking"],
      children: [
        { id: "n-ip", kind: "concept", topics: ["devops/linux-and-networking", "cloudsec/network"] },
        { id: "n-icmp", kind: "concept", topics: ["devops/linux-and-networking"] },
        { id: "n-bgp", kind: "concept", topics: ["secops/ataques-l7", "cloudsec/network"] },
        {
          id: "n-firewall",
          kind: "file",
          path: "/etc/iptables/rules.v4",
          topics: ["cloudsec/network", "seceng/policy-as-code"],
          code: {
            lang: "text",
            text: `*filter
:INPUT DROP [0:0]
:FORWARD DROP [0:0]
:OUTPUT ACCEPT [0:0]
-A INPUT -i lo -j ACCEPT
-A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
-A INPUT -p tcp --dport 22 -j ACCEPT
-A INPUT -p tcp --dport 443 -j ACCEPT
-A INPUT -p tcp --dport 3306 -j ACCEPT
-A INPUT -p icmp -j ACCEPT
COMMIT`,
          },
          risky: [7, 9],
        },
      ],
    },
    {
      id: "n-transport",
      kind: "place",
      topics: ["devops/linux-and-networking", "secops/rate-limiting"],
      children: [
        { id: "n-tcp", kind: "concept", topics: ["devops/linux-and-networking", "secops/ataques-l7"] },
        {
          id: "n-scans",
          kind: "file",
          path: "tcpdump output",
          topics: ["offsec/recon-and-attack-surface", "response/log-and-timeline-analysis"],
          code: {
            lang: "text",
            text: `10:01:02.100 IP 203.0.113.9.51514 > 10.0.0.5.22: Flags [S], seq 1001
10:01:02.101 IP 203.0.113.9.51515 > 10.0.0.5.23: Flags [S], seq 1002
10:01:02.102 IP 203.0.113.9.51516 > 10.0.0.5.80: Flags [S], seq 1003
10:01:02.102 IP 10.0.0.5.80 > 203.0.113.9.51516: Flags [S.], seq 7001, ack 1004
10:01:02.103 IP 203.0.113.9.51517 > 10.0.0.5.443: Flags [S], seq 1004
10:01:05.220 IP 198.51.100.7.40022 > 10.0.0.5.443: Flags [S], seq 55
10:01:05.221 IP 10.0.0.5.443 > 198.51.100.7.40022: Flags [S.], seq 90, ack 56
10:01:05.221 IP 198.51.100.7.40022 > 10.0.0.5.443: Flags [.], ack 91`,
          },
          risky: [1, 2, 3, 5],
        },
        { id: "n-amplification", kind: "concept", topics: ["secops/ataques-l7", "secops/rate-limiting"] },
      ],
    },
    {
      id: "n-session",
      kind: "place",
      topics: ["owasp/authentication-failures"],
      children: [
        { id: "n-hijack", kind: "concept", topics: ["owasp/authentication-failures"] },
        { id: "n-vpn", kind: "tool", topics: ["cloudsec/zero-trust", "cloudsec/network"] },
      ],
    },
    {
      id: "n-presentation",
      kind: "place",
      topics: ["owasp/cryptographic-failures"],
      children: [
        {
          id: "n-tls",
          kind: "file",
          path: "/etc/nginx/conf.d/shop.conf",
          topics: ["owasp/cryptographic-failures", "devops/linux-and-networking"],
          code: {
            lang: "nginx",
            text: `server {
  listen 443 ssl;
  server_name shop.example.com;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
  ssl_ciphers ALL:!aNULL;
  ssl_certificate /etc/ssl/shop.crt;
  ssl_certificate_key /etc/ssl/shop.key;
  add_header Strict-Transport-Security "max-age=31536000" always;
}`,
          },
          risky: [4, 5],
        },
        { id: "n-certs", kind: "concept", topics: ["owasp/cryptographic-failures", "cloudsec/kms-crypto"] },
      ],
    },
    {
      id: "n-application",
      kind: "place",
      topics: ["secops/waf", "owasp/security-misconfiguration"],
      children: [
        {
          id: "n-dns",
          kind: "file",
          path: "/etc/bind/named.conf.options",
          topics: ["devops/linux-and-networking", "owasp/security-misconfiguration"],
          code: {
            lang: "text",
            text: `options {
  directory "/var/cache/bind";
  recursion yes;
  allow-recursion { any; };
  allow-transfer { any; };
  dnssec-validation auto;
};`,
          },
          risky: [4, 5],
        },
        { id: "n-http", kind: "concept", topics: ["secops/waf", "owasp/injection"] },
        {
          id: "n-email",
          kind: "file",
          path: "DNS TXT records",
          topics: ["offsec/social-engineering-and-phishing"],
          code: {
            lang: "text",
            text: `example.com.         TXT  "v=spf1 include:_spf.mail.example ~all"
_dmarc.example.com.  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"`,
          },
        },
      ],
    },
  ],
};

export const netMissions: Mission[] = [
  { id: "walk-the-stack", steps: ["n-physical", "n-datalink", "n-network", "n-transport", "n-session", "n-presentation", "n-application"] },
  { id: "harden-the-edge", steps: ["n-firewall", "n-tls", "n-dns"] },
  { id: "read-the-wire", steps: ["n-tcp", "n-scans", "n-amplification"] },
];
