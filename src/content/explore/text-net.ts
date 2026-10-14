// Prose for the network (OSI) world. English source; pt/es are overlays.
import type { ChallengeText, NodeText } from "./text";

export const netNodes = {
  net: {
    title: "A message down the stack",
    summary: "The OSI model splits networking into seven layers. Each one adds something to the message, and each one has its own attacks and its own controls.",
    points: [
      "A problem at one layer is invisible to controls at other layers.",
      "Lower layers are about reach, higher layers are about meaning.",
      "Open a layer to see what lives there and how it fails.",
    ],
  },
  "n-physical": {
    title: "1. Physical",
    summary: "Cables, radio and ports: the bits on the medium. Whoever can touch it can often listen to it.",
    points: [
      "Physical access usually defeats software controls.",
      "Radio carries signals beyond your walls.",
      "Hardware itself is part of the supply chain.",
    ],
  },
  "n-wifi": {
    title: "Wireless",
    summary: "Wi-Fi puts the network in the air, where anyone nearby can try to join or listen.",
    points: [
      "Use WPA3 or WPA2 with a strong passphrase, and enterprise authentication for staff.",
      "Separate guest and device networks from the corporate one.",
      "Watch for rogue access points that imitate yours.",
    ],
  },
  "n-physical-access": {
    title: "Physical access",
    summary: "Unattended ports, unlocked server rooms and stolen devices skip every control above.",
    points: [
      "Lock rooms and cabinets, and disable unused wall ports.",
      "Encrypt disks so a lost laptop is only a lost laptop.",
      "Log and review who enters sensitive areas.",
    ],
  },
  "n-datalink": {
    title: "2. Data link",
    summary: "Frames between devices on the same local network, addressed by MAC addresses and organised by switches.",
    points: [
      "Local networks trust their neighbours by default.",
      "Switches and VLANs decide who shares a segment.",
      "Attacks here need a foothold on the local network.",
    ],
  },
  "n-arp": {
    title: "ARP spoofing",
    summary: "ARP answers have no authentication, so a neighbour can claim to be the gateway and sit in the middle.",
    points: [
      "The attacker reads or changes traffic between victims and the router.",
      "Switch features such as dynamic ARP inspection can block it.",
      "End-to-end encryption limits what a man in the middle can see.",
    ],
  },
  "n-vlan": {
    title: "VLANs and segmentation",
    summary: "Virtual LANs split one physical network into separate broadcast domains.",
    points: [
      "Put servers, users, guests and devices in different segments.",
      "A VLAN separates traffic but a router or firewall must still enforce rules between them.",
      "Turn off unused trunk negotiation to prevent VLAN hopping.",
    ],
  },
  "n-8021x": {
    title: "Port authentication",
    summary: "802.1X makes a device prove who it is before the switch or access point lets it onto the network.",
    points: [
      "Credentials or certificates decide which segment a device lands in.",
      "Unknown devices can be put in a quarantine network.",
      "It stops a stranger from simply plugging in.",
    ],
  },
  "n-network": {
    title: "3. Network",
    summary: "IP addresses and routing: getting a packet from one network to another, across many hops.",
    points: [
      "Routers forward packets; firewalls decide which ones are allowed.",
      "Source addresses can be forged, so do not trust them alone.",
      "Most cloud network rules live at this layer and the next.",
    ],
  },
  "n-ip": {
    title: "IP and routing",
    summary: "Every host has an address, and routers pick the next hop towards the destination.",
    points: [
      "Private ranges are not reachable from the internet, but are not a security boundary by themselves.",
      "Filter spoofed source addresses at the network edge.",
      "Know your routes: a surprise route is a surprise path for traffic.",
    ],
  },
  "n-icmp": {
    title: "ICMP",
    summary: "The control messages behind ping and traceroute. Useful for diagnosis and also for mapping a network.",
    points: [
      "Blocking all ICMP breaks things such as path MTU discovery.",
      "Allow the types you need and rate-limit the rest.",
      "Unusual ICMP volume or payloads can signal tunnelling or scanning.",
    ],
  },
  "n-bgp": {
    title: "BGP and route hijacking",
    summary: "BGP tells the internet which networks live where. A false announcement can pull traffic through the wrong place.",
    points: [
      "Hijacks and leaks can blackhole or intercept traffic for a whole network.",
      "Route validation (RPKI) helps others reject bogus announcements.",
      "End-to-end TLS keeps intercepted traffic unreadable.",
    ],
  },
  "n-firewall": {
    title: "Packet filtering",
    summary: "Rules that accept or drop packets by address, port and state. The default should be to drop.",
    points: [
      "Start from deny and allow only what a host needs.",
      "Keep management and database ports off the public internet.",
      "Review rules regularly: they only grow if nobody prunes them.",
    ],
  },
  "n-transport": {
    title: "4. Transport",
    summary: "Ports and connections. TCP gives reliable streams, UDP gives fast, connectionless datagrams.",
    points: [
      "A port identifies a service on a host.",
      "State (open, closed, filtered) is what scanners measure.",
      "Many denial-of-service attacks live here.",
    ],
  },
  "n-tcp": {
    title: "TCP handshake",
    summary: "A connection starts with SYN, SYN-ACK, ACK. Servers keep half-open state until the third step arrives.",
    points: [
      "A SYN flood fills that state with fake attempts.",
      "SYN cookies and rate limits keep a server standing under a flood.",
      "Knowing the normal handshake makes odd traffic easy to spot.",
    ],
  },
  "n-scans": {
    title: "Port scanning",
    summary: "Probing many ports to see which services answer. The first step of most attacks, and visible in the logs.",
    points: [
      "A scan is one source touching many ports in a short time.",
      "Only what is open and reachable can be attacked: shrink it.",
      "Alert on scans, but expect internet background noise.",
    ],
  },
  "n-amplification": {
    title: "UDP amplification",
    summary: "Attackers send small spoofed requests to open servers, which send big replies to the victim.",
    points: [
      "Open DNS resolvers, NTP and similar services are common amplifiers.",
      "Do not run open resolvers, and filter spoofed traffic.",
      "Upstream scrubbing absorbs the flood you cannot.",
    ],
  },
  "n-session": {
    title: "5. Session",
    summary: "Opening, maintaining and closing conversations. In practice this layer is handled by applications and tunnels.",
    points: [
      "A session is only as strong as the secret that identifies it.",
      "Tunnels extend a private network over a public one.",
      "Expiry and re-authentication limit stolen sessions.",
    ],
  },
  "n-hijack": {
    title: "Session hijacking",
    summary: "If an attacker gets a session identifier, they can act as the user without the password.",
    points: [
      "Tokens leak through logs, URLs, unencrypted links and scripts.",
      "Bind sessions to context where it makes sense, and keep them short.",
      "Let users and admins see and end active sessions.",
    ],
  },
  "n-vpn": {
    title: "VPNs and tunnels",
    summary: "An encrypted tunnel that carries traffic across an untrusted network.",
    points: [
      "A VPN protects the path, not the endpoints at either end.",
      "A flat VPN gives a stolen laptop the whole network: limit access per user.",
      "Zero-trust access replaces broad network access with per-application access.",
    ],
  },
  "n-presentation": {
    title: "6. Presentation",
    summary: "How data is represented and protected: encoding, compression and encryption. TLS is the one you meet most.",
    points: [
      "Encryption turns an untrusted network into an acceptable one.",
      "Weak settings quietly remove that protection.",
      "Certificates tie a name to a key.",
    ],
  },
  "n-tls": {
    title: "TLS configuration",
    summary: "Which versions and ciphers a server accepts decides how strong its encryption really is.",
    points: [
      "Allow only TLS 1.2 and 1.3, with modern ciphers.",
      "Enable HSTS, so browsers never fall back to plain HTTP.",
      "Use a tested configuration generator rather than inventing one.",
    ],
  },
  "n-certs": {
    title: "Certificates and PKI",
    summary: "A certificate says a key belongs to a name, vouched for by a certificate authority.",
    points: [
      "Automate renewal: expired certificates cause outages.",
      "Protect private keys, and revoke or replace them when exposed.",
      "Certificate transparency logs reveal certificates issued for your names.",
    ],
  },
  "n-application": {
    title: "7. Application",
    summary: "The protocols people and programs actually use: HTTP, DNS, email and more. Most attacks you read about happen here.",
    points: [
      "Lower layers deliver the message, this layer gives it meaning.",
      "Network controls cannot judge whether a valid request is a harmful one.",
      "Application firewalls and secure code work at this layer.",
    ],
  },
  "n-dns": {
    title: "DNS",
    summary: "Turns names into addresses. It is everywhere, rarely monitored and often misconfigured.",
    points: [
      "An open resolver can be abused for amplification attacks.",
      "Zone transfers should go only to your secondary servers.",
      "Log DNS: it reveals malware, tunnelling and lookalike domains.",
    ],
  },
  "n-http": {
    title: "HTTP",
    summary: "The protocol of the web. Requests are text that the application must treat as untrusted.",
    points: [
      "Every header, parameter and cookie is attacker-controlled.",
      "A WAF filters known-bad patterns but cannot replace secure code.",
      "Follow one request in the web request map to see the OWASP risks.",
    ],
  },
  "n-email": {
    title: "Email authentication",
    summary: "SPF, DKIM and DMARC let a receiver check that mail claiming to come from your domain really did.",
    points: [
      "SPF lists which servers may send for your domain.",
      "DKIM signs messages, and DMARC says what to do when checks fail.",
      "Move DMARC gradually from monitoring to rejecting.",
    ],
  },
} satisfies Record<string, NodeText>;

export const netMissions = {
  "walk-the-stack": { title: "Walk down the stack", intro: "Visit all seven layers, from the cable to the application." },
  "harden-the-edge": { title: "Harden the edge", intro: "Fix a firewall, a TLS configuration and a DNS server." },
  "read-the-wire": { title: "Read the wire", intro: "Understand the handshake, spot a scan and see how amplification works." },
};

export const netChallenges = {
  "n-firewall": {
    prompt: "This host serves a public website. Which rules expose services that should not be open to everyone?",
    why: "Port 22 (line 7) lets the whole internet try to log in over SSH, and port 3306 (line 9) exposes the database. Restrict SSH to a VPN or bastion address and keep the database reachable only from the application servers. Port 443 is the website and ICMP is fine in a limited form.",
    hint: "Two rules: one for administration, one for a database.",
  },
  "n-scans": {
    prompt: "One address is probing this server. Which lines are its probes?",
    why: "Lines 1, 2, 3 and 5 are SYN packets from the same source (203.0.113.9) to ports 22, 23, 80 and 443 within three milliseconds: a scan. Lines 6 to 8 are one ordinary handshake from another address, and line 4 is the server answering the scan on its open port.",
    hint: "Four lines: one source, many ports, almost no time.",
  },
  "n-tls": {
    prompt: "Which lines weaken this server's encryption?",
    why: "Line 4 still accepts TLS 1.0 and 1.1, which are obsolete and have known weaknesses. Line 5 allows every cipher except anonymous ones, including weak and legacy ones. Allow TLS 1.2 and 1.3 only, and an explicit list of modern ciphers.",
    hint: "Two lines: versions and ciphers.",
  },
  "n-dns": {
    prompt: "This DNS server is reachable from the internet. Which lines are dangerous?",
    why: "allow-recursion { any; } (line 4) makes it an open resolver that attackers can use for amplification attacks. allow-transfer { any; } (line 5) lets anyone download the whole zone, a map of your hosts. Limit recursion to your own networks and transfers to your secondary servers.",
    hint: "Two lines that both say any.",
  },
} satisfies Record<string, ChallengeText>;
