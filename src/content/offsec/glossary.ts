import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "engagements",
    title: "engagements",
    entries: [
      {
        term: "Rules of engagement",
        aka: "RoE",
        meaning: "The agreed document that turns permission into practical limits: scope, time window, forbidden actions, rate, emergency contacts and how findings are reported.",
        topic: "engagement-scoping-and-ethics",
      },
      {
        term: "Scope",
        meaning: "The list of systems, accounts and activities that may be tested, and those explicitly excluded. Anything outside it is not authorized.",
        topic: "engagement-scoping-and-ethics",
      },
      {
        term: "Coordinated disclosure",
        aka: "responsible disclosure",
        meaning: "Reporting a vulnerability privately to its owner and allowing reasonable time to fix before any public detail.",
        topic: "engagement-scoping-and-ethics",
      },
      {
        term: "Penetration test",
        aka: "pentest",
        meaning: "A time-boxed attempt to exploit weaknesses within an agreed scope, to show what an attacker could actually do.",
        topic: "pentest-methodology",
      },
      {
        term: "Black, gray and white box",
        meaning: "How much the tester knows in advance: nothing, some (such as accounts and documentation), or everything including source code.",
        topic: "pentest-methodology",
      },
      {
        term: "PTES",
        aka: "Penetration Testing Execution Standard",
        meaning: "A description of the phases of a penetration test, from pre-engagement to reporting.",
        topic: "pentest-methodology",
      },
    ],
  },
  {
    id: "techniques",
    title: "techniques",
    entries: [
      {
        term: "Attack surface",
        meaning: "Everything an attacker can reach and try: internet-facing assets, services, interfaces and the people who use them.",
        topic: "recon-and-attack-surface",
      },
      {
        term: "Passive and active recon",
        meaning: "Passive gathers information without touching the target; active probes it directly and must stay within scope and rate limits.",
        topic: "recon-and-attack-surface",
      },
      {
        term: "Subdomain takeover",
        meaning: "A DNS record pointing to a cloud or SaaS resource that no longer exists, which someone else can claim and serve content from your domain.",
        topic: "recon-and-attack-surface",
      },
      {
        term: "BOLA",
        aka: "broken object level authorization",
        meaning: "An API accepts an object id and returns the object without checking that the caller may access it. The API form of an IDOR.",
        topic: "web-and-api-testing",
      },
      {
        term: "Mass assignment",
        meaning: "An API binds client-supplied fields onto an object, letting a caller set fields (such as a role) that they should not control.",
        topic: "web-and-api-testing",
      },
      {
        term: "Attack path",
        meaning: "A chain of permissions, credentials and trusts that leads from a foothold to something valuable. Defenders map and cut these paths.",
        topic: "privilege-escalation-paths",
      },
      {
        term: "Privilege escalation",
        meaning: "Gaining more rights than initially granted, through a flaw, a misconfiguration or a stolen credential.",
        topic: "privilege-escalation-paths",
      },
    ],
  },
  {
    id: "exercises",
    title: "exercises and reporting",
    entries: [
      {
        term: "Red team",
        meaning: "An objective-based, usually covert simulation of a realistic adversary that tests the organization's people, process and technology.",
        topic: "red-team-and-adversary-emulation",
      },
      {
        term: "Purple team",
        meaning: "A collaborative exercise where attackers and defenders work together in the open, checking detection technique by technique and fixing gaps immediately.",
        topic: "red-team-and-adversary-emulation",
      },
      {
        term: "Adversary emulation",
        meaning: "Reproducing the documented behavior of a specific threat actor to test whether defenses would catch it.",
        topic: "red-team-and-adversary-emulation",
      },
      {
        term: "DMARC",
        meaning: "An email authentication policy that tells receivers what to do with messages that fail SPF or DKIM checks for your domain, and where to send reports.",
        topic: "social-engineering-and-phishing",
      },
      {
        term: "CVSS",
        aka: "Common Vulnerability Scoring System",
        meaning: "A standard for scoring the technical severity of a vulnerability. It needs adjusting for your context before it sets priority.",
        topic: "reporting-and-remediation",
      },
      {
        term: "Retest",
        meaning: "Verifying that a fix really closes a finding, not only the exact request that was reported.",
        topic: "reporting-and-remediation",
      },
    ],
  },
];
