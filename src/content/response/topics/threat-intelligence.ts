import type { Topic } from "@/content/types";

export const threatIntelligence: Topic = {
  domain: "response",
  slug: "threat-intelligence",
  title: "Threat intelligence",
  short: "knowing who attacks you and how, and using that to decide what to defend first",
  tagline:
    "A list of bad IP addresses is data. Intelligence is knowing which adversaries target you, what they do, and what that means for your priorities, with a confidence level attached.",
  kind: "conceito",
  stage: "prepare",
  tools: ["MITRE ATT&CK", "MISP", "STIX / TAXII", "OpenCTI", "VirusTotal", "ISACs and CERT advisories"],
  sections: [
    {
      heading: "Levels of intelligence",
      bullets: [
        "Strategic: trends and risks for leadership (which threat actors target your sector, why, with what impact).",
        "Operational: how a campaign works, so defenders can anticipate it: infrastructure, timing, techniques.",
        "Tactical: the techniques, tools and procedures (TTPs) an adversary uses, mapped to a framework such as ATT&CK.",
        "Technical: indicators of compromise (IOCs) such as hashes, domains, addresses and file names. Cheap to use and quick to expire.",
      ],
    },
    {
      heading: "Indicators versus behavior",
      body: [
        "The Pyramid of Pain ranks indicators by how much it hurts an attacker when you block them. Hash values and IP addresses are trivial to change; domain names are a little harder; tools and, above all, tactics and techniques are costly to replace. Defending against behavior (TTPs) lasts longer than blocking lists of indicators, so use IOCs for fast triage and TTPs for durable detection.",
      ],
    },
    {
      heading: "Evaluating a source",
      bullets: [
        "Who produced it and from what evidence? Primary observation beats repeated claims.",
        "How fresh is it? Many indicators are useful for days, not years.",
        "Is it relevant to your environment, technology and industry?",
        "What is the confidence, and is it stated? Good intelligence says how sure it is.",
        "Is it actionable: can you detect, block or hunt with it today?",
      ],
    },
    {
      heading: "A shareable indicator",
      body: ["STIX is a standard language for describing intelligence objects, and TAXII is a protocol to exchange them. A minimal indicator in STIX 2.1 looks like this."],
      code: [
        {
          language: "json",
          filename: "indicator.json (STIX 2.1)",
          code: "{\n  \"type\": \"indicator\",\n  \"spec_version\": \"2.1\",\n  \"id\": \"indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f\",\n  \"created\": \"2026-10-01T10:00:00.000Z\",\n  \"modified\": \"2026-10-01T10:00:00.000Z\",\n  \"name\": \"C2 address seen in intrusion INC-2026-0142\",\n  \"pattern\": \"[ipv4-addr:value = '203.0.113.9']\",\n  \"pattern_type\": \"stix\",\n  \"valid_from\": \"2026-10-01T00:00:00Z\",\n  \"confidence\": 70,\n  \"labels\": [\"malicious-activity\"]\n}",
        },
      ],
    },
    {
      heading: "Putting it to work",
      bullets: [
        "Feed vetted indicators to detection and blocking, with an expiry date for each.",
        "Map adversary behavior to ATT&CK, check your coverage, and prioritize gaps for the actors that matter to you.",
        "Brief leadership with a few clear messages and the decisions they imply, not a data dump.",
        "Share what you can: industry sharing groups (ISACs) and trusted peers make everyone's detection better.",
        "Handle sensitive intelligence with the sharing markings (such as TLP) it came with.",
      ],
    },
  ],
};
