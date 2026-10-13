import type { Topic } from "@/content/types";

export const socialEngineeringAndPhishing: Topic = {
  domain: "offsec",
  slug: "social-engineering-and-phishing",
  title: "Social engineering and phishing defense",
  short: "the human attack surface: how it works, how to simulate it ethically, and the controls that work",
  tagline:
    "People are not the weakest link; they are the target of a skilled adversary who exploits trust and urgency. Technical controls that do not depend on perfect human judgment are the strongest defense.",
  kind: "pratica",
  stage: "attack",
  tools: ["DMARC / SPF / DKIM", "phishing-resistant MFA (FIDO2, passkeys)", "secure email gateway", "GoPhish (authorized simulations)", "reporting button and triage queue", "DNS and URL filtering"],
  sections: [
    {
      heading: "How attacks work",
      bullets: [
        "Phishing: a deceptive message (email, SMS, chat) that gets the victim to click, enter credentials or run something.",
        "Spear phishing and business email compromise: researched, targeted messages, often impersonating an executive or a supplier to redirect a payment.",
        "Vishing and smishing: the same by phone call or text message, including fake support calls.",
        "Pretexting: an invented scenario that makes a request seem legitimate.",
        "MFA fatigue and adversary-in-the-middle kits: pushing repeated approval prompts, or relaying a live login to steal the session.",
        "Physical: tailgating, dropped devices, impersonating staff.",
      ],
    },
    {
      heading: "Controls that do not depend on perfect judgment",
      bullets: [
        "Phishing-resistant multi-factor authentication (FIDO2 security keys or passkeys): the credential only works on the real site, so a lookalike page gets nothing.",
        "Email authentication so that nobody can forge your domain: SPF, DKIM and DMARC at an enforcing policy.",
        "Filtering and sandboxing of attachments and links, and external-sender banners.",
        "Process controls for money and access: a second channel to confirm payment changes, approval rules for sensitive requests.",
        "Least privilege and endpoint detection, so that one click does not become a breach.",
      ],
      code: [
        {
          language: "text",
          filename: "DNS records (example.com)",
          code: "example.com.            TXT  \"v=spf1 include:_spf.mail-provider.example -all\"\n_dmarc.example.com.     TXT  \"v=DMARC1; p=reject; rua=mailto:dmarc-reports@example.com; adkim=s; aspf=s\"\nselector1._domainkey.example.com.  TXT  \"v=DKIM1; k=rsa; p=<public key>\"",
        },
      ],
    },
    {
      heading: "Simulations, done ethically",
      bullets: [
        "Only with written authorization, defined scope and approval from HR and legal; many jurisdictions have rules about employee testing.",
        "Aim at learning, not punishment: never name and shame, and do not use scenarios that are cruel (fake bonuses, fake layoffs, family emergencies).",
        "Measure what matters: the report rate and time to report matter more than the click rate. A culture where people report quickly is a detection control.",
        "Make reporting easy: one button, a fast and friendly response, and thanks for reports (including false alarms).",
        "Give short, specific, just-in-time guidance to those who click instead of mandatory long training.",
      ],
    },
    {
      heading: "Preparing for the day it works",
      body: [
        "Assume someone will eventually enter credentials on a fake page. Make that survivable: phishing-resistant MFA, session and token revocation procedures, mailbox rule review, detection of anomalous sign-ins, and a rehearsed response for compromised accounts and payment fraud.",
      ],
    },
  ],
};
