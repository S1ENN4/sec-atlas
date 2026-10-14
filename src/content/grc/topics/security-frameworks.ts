import type { Topic } from "@/content/types";

export const securityFrameworks: Topic = {
  domain: "grc",
  slug: "security-frameworks",
  title: "Security frameworks and standards",
  short: "ISO 27001, NIST CSF, CIS Controls and PCI DSS: what each is for and how to choose",
  tagline:
    "Frameworks are shared vocabularies for what good looks like. Pick one as the backbone, map the others to it, and never confuse passing an audit with being secure.",
  kind: "conceito",
  stage: "design",
  tools: ["ISO/IEC 27001", "NIST Cybersecurity Framework (CSF)", "CIS Critical Security Controls", "PCI DSS", "SOC 2", "control-mapping spreadsheets"],
  sections: [
    {
      heading: "The main ones",
      bullets: [
        "ISO/IEC 27001: a certifiable standard for an information security management system (ISMS): scope, risk assessment, a set of controls and continual improvement. Certification is by an external auditor.",
        "NIST Cybersecurity Framework (CSF): a voluntary framework organized in functions (Govern, Identify, Protect, Detect, Respond, Recover) that is popular for describing and communicating a program's maturity. Not certifiable.",
        "CIS Critical Security Controls: a prioritized, practical list of safeguards, grouped into implementation levels so small teams know where to start.",
        "PCI DSS: a mandatory standard from the card networks for organizations that store, process or transmit payment card data, with specific technical and process requirements.",
        "SOC 2: an attestation report by an auditor on a service provider's controls relating to security and related criteria; widely requested by customers.",
        "Privacy laws (such as the EU's GDPR and Brazil's LGPD) are legal obligations rather than frameworks, but they drive security requirements for personal data.",
      ],
    },
    {
      heading: "Choosing and combining",
      body: [
        "Start from what is required: contracts, regulation and customers decide which ones you must meet. Use one framework as the internal backbone, often NIST CSF or ISO 27001, use CIS Controls to prioritize the practical work, and map the rest onto it so that one control satisfies many requirements. Controls that implement the same idea (for example, multi-factor authentication) appear in all of them under different numbers.",
      ],
      code: [
        {
          language: "yaml",
          filename: "control-mapping.yml",
          code: "- control: MFA required for all administrative and remote access\n  owner: it-security\n  maps_to:\n    nist_csf: PR.AA\n    cis_controls: \"6\"\n    iso_27001: A.8.5\n    pci_dss: \"8.4\"\n  evidence: [idp-policy-export, quarterly-access-review]",
        },
      ],
    },
    {
      heading: "Reading a framework without getting lost",
      bullets: [
        "Start with the structure (functions, domains, control families), not the full text.",
        "Read each control for its intent: what risk is it meant to reduce?",
        "Implement the intent in a way that fits your technology; the wording rarely names your tools.",
        "Note what is out of scope for you and record why, so an auditor sees a decision rather than an omission.",
      ],
    },
    {
      heading: "Compliance is not security",
      bullets: [
        "A framework sets a floor and a language. It does not know your threats, your architecture or your weakest system.",
        "Audits sample the past; attackers test the present. Passing last quarter's audit says little about today.",
        "Scoping can hide risk: a narrow certification scope covers only part of the business.",
        "Use frameworks to drive real improvement: take the gaps and put them in the risk register with owners.",
      ],
    },
  ],
};
