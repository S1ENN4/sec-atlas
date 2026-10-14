import type { Topic } from "@/content/types";

export const crisisCommunicationAndCulture: Topic = {
  domain: "grc",
  slug: "crisis-communication-and-culture",
  title: "Crisis communication and security culture",
  short: "what to say, to whom and when during an incident, and how culture decides everything before it",
  tagline:
    "In a serious incident the technical response is half of the work; the other half is telling the truth, on time, to the right people. And the culture you built beforehand decides whether people report problems or hide them.",
  kind: "pratica",
  stage: "lead",
  tools: ["crisis communication plan", "pre-approved message templates", "legal counsel and PR retainer", "regulatory notification checklists", "tabletop exercises", "security champions program"],
  sections: [
    {
      heading: "Audiences and obligations",
      bullets: [
        "Employees: what happened, what to do and not do, and where to ask. Silence breeds rumor.",
        "Customers and partners: what is affected, what they should do and when you will update them next.",
        "Regulators: many laws require notification within a set time after you become aware of certain breaches, especially of personal data. Know the deadlines in your jurisdictions before an incident.",
        "Executives and the board: impact, decisions needed and the current plan.",
        "Law enforcement, insurers and vendors, as appropriate.",
        "The public and the press, through one designated spokesperson.",
      ],
    },
    {
      heading: "Principles",
      bullets: [
        "Be honest and timely: say what you know, what you do not know yet, and when you will update. Do not guess, and do not hide.",
        "One source of truth and one voice: all external statements are approved by legal and communications and consistent with each other.",
        "Do not blame: not the attacker's cleverness, not the employee who clicked, not the vendor, until facts are established.",
        "Give people something to do: concrete steps (change passwords, watch for fraud) beat generic reassurance.",
        "Update on a promised schedule, even when the update is that nothing has changed.",
        "Prepare: templates, contact lists and decision rights written in calm times and rehearsed in tabletop exercises with executives.",
      ],
    },
    {
      heading: "A message skeleton",
      code: [
        {
          language: "text",
          filename: "customer-notice-template.txt",
          code: "Subject: Security incident affecting [service]\n\nWhat happened: On [date] we detected [plain description]. We [contained it on date].\nWhat information was involved: [specific categories; say what was NOT affected, only if confirmed].\nWhat we are doing: [containment, investigation with external experts, improvements].\nWhat you can do: [concrete steps].\nWhat happens next: we will update you by [date/time]. Contact: [channel and name].\nWe are sorry for the concern this causes.",
        },
      ],
    },
    {
      heading: "Culture decides the first hour",
      bullets: [
        "Blameless reporting: people who report a mistake quickly must be thanked, not punished. The first report is often what saves the day.",
        "Make the secure way the easy way: tools and defaults, not long policies nobody reads.",
        "Security champions in engineering and business teams, who bring security closer to daily work.",
        "Short, relevant, respectful awareness content that explains why, using real examples from your company.",
        "Leaders model the behavior: executives follow the same rules (MFA, reporting, approvals).",
        "Measure culture: report rates, time to report, participation in exercises, and survey trust in the security team.",
      ],
    },
  ],
};
