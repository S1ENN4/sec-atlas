// English UI strings: the single source for every piece of interface text.
// Add a key here, then translate it with `npm run i18n -- pending <locale>` +
// `apply`. Placeholders use {name}; plurals use <key>_one / <key>_other.
// Do not put prose that belongs to content (topics, quizzes...) here.
//
// This unit is STRICT: every key must exist and be fresh in every locale or the
// build fails (rule R9).

export const ui = {
  meta: {
    siteName: "appsec/kb",
    title: "appsec/kb — interactive map of software security",
    description:
      "Interactive security knowledge base: AppSec, CloudSec, AI agents, SecOps and security engineering, with study paths, attack scenarios and quizzes. Static content, no tracking.",
    ogTitle: "Software security, mapped by domain.",
    ogTagline: "AppSec · CloudSec · SecOps · Engineering · AI agents",
  },

  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main",
    external: "opens in a new tab",
  },

  nav: {
    explore: "Explore",
    careers: "Careers",
    learn: "Learn",
    project: "Project",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    allDomains: "All domains",
    topicsCount_one: "{n} topic",
    topicsCount_other: "{n} topics",
    groups: {
      build: "Applications & delivery",
      cloud: "Cloud & infrastructure",
      operate: "Operations & detection",
      ai: "AI",
    },
    learnItems: {
      journey: "Journey",
      journeyDesc: "A guided map from the basics to advanced, with your progress.",
      paths: "Study paths",
      pathsDesc: "Curated orders for a goal, with progress saved in your browser.",
      scenarios: "Attack scenarios",
      scenariosDesc: "Follow an incident step by step and see which control stops each move.",
      glossary: "Glossary",
      glossaryDesc: "Acronyms, standards and concepts in one place.",
    },
    projectItems: {
      manifesto: "Manifesto",
      manifestoDesc: "Why this project exists.",
      about: "About",
      aboutDesc: "Who builds it and how.",
      changelog: "What's new",
      changelogDesc: "Public record of changes and corrections.",
      sources: "Sources",
      sourcesDesc: "Primary references per domain.",
      security: "Security",
      securityDesc: "How this site practices what it teaches.",
      repo: "Source code",
      repoDesc: "Open source on GitHub.",
    },
  },

  lang: {
    label: "Language",
    switchTo: "Switch language",
  },

  search: {
    button: "Search",
    buttonAria: "Search (Ctrl+K)",
    dialog: "Search the knowledge base",
    placeholder: "Search topics, terms and pages…",
    loading: "Loading…",
    failed: "Could not load the search index.",
    empty: "Nothing found for “{query}”.",
    results: "Results",
    open: "open",
    onMapHint: "shift+enter on the map",
    navigate: "↑↓ navigate",
    viewOnMap: "View {title} on the map",
    kindTopic: "Topic",
    kindTerm: "Term",
    kindPage: "Page",
  },

  footer: {
    tagline: "educational content by {name}",
    about: "about",
    manifesto: "manifesto",
    changelog: "what's new",
    sources: "sources",
    linkedin: "linkedin",
    sourceCode: "open source (MIT / CC BY-SA)",
    counts: "{items}",
    privacy: "100% static · no tracking · no cookies",
    localOnly: "your progress stays in this browser",
  },

  kinds: {
    tecnica: "technique",
    pratica: "practice",
    conceito: "concept",
    appsecTecnica: "testing technique",
    agentsPratica: "component",
  },

  notice: {
    partial:
      "Parts of this page are not translated yet and appear in {language}. The original text is always the reference.",
    languagePt: "Portuguese",
    languageEn: "English",
  },

  domainPage: {
    hint: "$ click a card for details · ctrl+k to search",
    mapTitle: "concept map",
    topicsTitle: "topics",
    stageLabel: "stage: {stage}",
  },

  topicPage: {
    back: "back to the map",
    connections: "connections on the map",
    stageBadge: "stage: {stage}",
  },

  toolbar: {
    markStudied: "mark as studied",
    studied: "studied",
    copyLink: "copy link",
    linkCopied: "link copied",
    print: "print / PDF",
  },

  quiz: {
    title: "test what you learned",
    best: "best: {best}/{total}",
    question: "question {n} of {total}",
    right: "Correct. ",
    wrong: "Not quite. ",
    next: "next",
    seeResult: "see result",
    retry: "retry",
    perfect: "Perfect. This topic is in the bag.",
    good: "Good! The topic was marked as studied.",
    again: "Worth rereading the topic and trying again.",
    loading: "Loading questions…",
    failed: "Could not load the questions right now.",
    none: "There are no questions for this topic yet.",
  },

  bridges: {
    title: "in other domains",
  },

  pathNav: {
    trail: "trail",
    previous: "previous",
    next: "next",
    trailAria: "Trail: {title}",
  },

  sourcesNote: {
    updated: "updated on {date}",
    aiNote: "content produced with AI assistance, under review",
    sources: "sources to go deeper",
    report: "report an error",
  },

  pipeline: {
    gate: "gate: {gate}",
  },

  graph: {
    viewMode: "View mode",
    viewMap: "map",
    viewList: "list",
    allRelations: "all relations",
    kindShow: "show this type",
    kindHide: "hide this type",
    legend: "animated lines = pipeline flow · hover or click a card to see its relations",
    nodeDetails: "{name} (details)",
    stageEyebrow: "stage {index}",
    stageAria: "Stage {name}",
    detailsAria: "Details: {title}",
    closeDetails: "Close details",
    alsoInStage: "also appears in another stage",
    relations: "relations",
    openTopic: "open topic",
    mark: "mark",
    studied: "studied",
    copyLink: "link",
    copied: "copied",
    also: "also: {items}",
    crossCutting: "cross-cutting layers",
    gate: "gate: {gate}",
  },

  hub: {
    badge: "knowledge base · software security",
    title: "Software security,",
    titleAccent: "mapped by domain.",
    lead: "Each domain is an independent graph: concepts, pipeline, connections and glossary. {n} ready maps, all at the same level of depth.",
    manifestoLink: "read the manifesto: why this project exists",
    statDomains: "domains",
    statLive: "live",
    statDraft: "draft",
    openMap: "open map",
    notify: "notify me",
    exploreTitle: "ways to explore",
    explore: {
      journey: {
        title: "Guided journey",
        body: "A map that teaches from the basics to advanced, unlocking as you learn.",
      },
      careers: {
        title: "Careers",
        body: "Roadmaps for AppSec, DevSecOps, DevOps and more: what the work is and how to get there.",
      },
      paths: {
        title: "Study paths",
        body: "A thoughtful order for each goal, with progress saved in your browser.",
      },
      scenarios: {
        title: "Follow the attack",
        body: "Follow an incident step by step and discover which control stops each move.",
      },
    },
  },

  profileStrip: {
    aria: "About the author",
    about: "about",
    site: "Site",
  },

  progress: {
    title: "your progress",
    studiedOf: "{done}/{total} topics studied",
    perfectQuizzes: "{perfect}/{n} perfect quizzes",
    savedLocally: "saved only in this browser",
    reset: "reset",
    confirm: "delete everything?",
    yes: "yes",
    no: "no",
    progressIn: "Progress in {name}",
  },

  paths: {
    pageTitle: "study paths",
    description: "Suggested orders for studying AppSec, CloudSec, AI agents, SecOps and engineering, with progress saved in your browser.",
    eyebrow: "guided study",
    heading: "Study paths",
    intro:
      "Not sure where to start? Each path is a deliberate order: one topic prepares the next. Mark what you have studied (or pass a topic quiz) and your progress shows up here and on the maps.",
    levelBeginner: "beginner",
    levelIntermediate: "intermediate",
    progressAria: "Progress on the path {title}",
    studiedSr: "(studied)",
    start: "start path",
    continue: "continue",
    done: "path completed",
  },

  glossary: {
    pageTitle: "glossary",
    description:
      "All the terminology in one place: OWASP Top 10, CVE, CWE, IAM, zero trust, CSPM, CWPP, WAF and the rest.",
    eyebrow: "reference",
    heading: "Glossary",
    intro:
      "All the alphabet soup in one place: acronyms, identifiers, frameworks and concepts: what each one means and how it connects to the rest. Terms from every domain live here, with a domain filter when you want to focus.",
    placeholder: "filter terms… (e.g. cve, iam, cspm, sbom)",
    filterAria: "filter glossary terms",
    domainAria: "filter by domain",
    all: "all",
    nothing: "nothing found for “{query}”.",
    nothingIn: "nothing found for “{query}” in {domain}.",
  },

  scenarios: {
    pageTitle: "attack scenarios",
    description: "Follow an incident step by step and discover which control stops each move of the attacker.",
    eyebrow: "follow the attack",
    heading: "Attack scenarios",
    intro:
      "Instead of seeing each control in isolation, follow an incident from start to finish. At each step, try to guess which control kicks in before revealing the answer.",
    tablistAria: "Scenarios",
    stagesAria: "Pipeline stages",
    step: "step {n} of {total}",
    reveal: "what stops this?",
    nextStep: "next step",
    finish: "finish",
    end: "end of the scenario",
    layersIntro: "The layers that came into play, in order:",
    layersOutro: "No single layer solves it: the value is in each one covering the blind spot of the previous.",
    replay: "replay",
  },

  changelog: {
    pageTitle: "what's new",
    description: "What changed in this map: new content, features and corrections.",
    eyebrow: "public record",
    heading: "What's new",
    intro: "What changed around here: new content, features and corrections. Security moves fast, and a living site must show that it is alive.",
  },

  sourcesPage: {
    pageTitle: "sources",
    description: "Primary references per domain to go deeper on each subject: OWASP, NIST, CIS and official documentation.",
    eyebrow: "references",
    heading: "Sources",
    intro: "The map summarizes and connects ideas; the primary sources below are where to go deeper and where to check any claim.",
  },

  about: {
    pageTitle: "about",
    description: "{name}: {headline}. Who made this map, why it exists and how it was built.",
    eyebrow: "about",
    skillsAria: "Skills",
    experience: "experience",
    education: "education",
    certifications: "certifications",
    whyTitle: "why this project exists",
    why1: "Security tools are usually presented in isolation: SAST here, SCA there, IAM somewhere else. What is missing is the map: where each control fits, what it covers, what it lets through and how the pieces complete each other.",
    why2: "That is why each domain is a navigable graph, with study paths, attack scenarios that show the layers in action and quizzes to make it stick. It is a more visual way to learn and, at the same time, a sample of how the project was designed and built.",
    behindTitle: "technical behind the scenes",
    behind: {
      minimalTitle: "Minimal surface",
      minimalBody: "A 100% static site: no backend, database, forms or cookies. A restrictive CSP and the other headers are versioned in the repository.",
      validatedTitle: "Content validated at build",
      validatedBody: "A validator runs before the build and fails if a topic loses its place on the map, a quiz is incomplete or a path points to a topic that does not exist.",
      budgetTitle: "Performance budget",
      budgetBody: "The build fails if the bundle size goes over its limits. Client JS was reduced by keeping topic content on the server and loading quizzes and search on demand.",
      a11yTitle: "Accessibility and motion",
      a11yBody: "Keyboard navigation on the map, screen-reader labels, visible focus and respect for prefers-reduced-motion.",
      privacyTitle: "Privacy by default",
      privacyBody: "No tracking. The only data kept is your study progress, in the learner's own browser, and it can be erased whenever you want.",
      i18nTitle: "Translations without drift",
      i18nBody: "English is the source of truth. Every translation stores a hash of the text it came from, so when the original changes the translation is flagged and the build fails until it is updated.",
    },
    securityLead: "The full checklist, with the real CSP and trade-offs, is at",
    contentTitle: "about the content",
    contentMore: "Changes and corrections are recorded in",
    ctaTitle: "Shall we talk?",
    ctaBody: "If this map was useful, or if you want to talk about software security, the best way to reach me is LinkedIn.",
    ctaButton: "open my LinkedIn",
  },

  manifesto: {
    pageTitle: "manifesto",
    description:
      "Why this project exists: security knowledge that is open, visual, verifiable and easy to access, made for people and for agents.",
    ogTitle: "Manifesto: security knowledge should be open and easy to find",
    ogDescription: "Why the way we learn security needs to change, and what this project does differently.",
    eyebrow: "manifesto",
    titleA: "Security knowledge should be",
    titleB: "open, visual and easy to find.",
    lead: "The dominant way of teaching security is failing the people who learn. This project is a concrete bet on another path, and showing beats promising: everything on this page already exists and you can check it in the code.",
    ctaStudy: "start studying",
    ctaCode: "see the code",

    problemEyebrow: "01 · the problem",
    problemTitle: "How we learn security is broken.",
    problemIntro: "This is an opinion, formed by someone who learned, works and teaches in the field. Five failures that keep repeating:",
    problems: {
      p1Title: "Memorizing lists instead of understanding connections",
      p1Body: "SAST, DAST, WAF, IAM, each in its own chapter. Nobody shows where a control fits, what it lets through and which other control covers that gap.",
      p2Title: "Knowledge behind walls",
      p2Body: "Expensive courses, loose PDFs, three-hour videos with no search. The people who most need to learn are often the ones with the least access.",
      p3Title: "Material that ages in silence",
      p3Body: "No date, no source, no channel to correct it. In security, outdated and wrong information is a risk, not just an annoyance.",
      p4Title: "Theory without scenario",
      p4Body: "You learn the name of the control, not the moment it fails. The attacker does not follow the book chapter.",
      p5Title: "Assessment that measures memory",
      p5Body: "Memorizing the acronym is easy and proves nothing. What matters is reasoning about an incident you have never seen.",
    },

    principlesEyebrow: "02 · what I stand for",
    principlesTitle: "Knowledge is better when it circulates.",
    principlesIntro: "Security is a team sport: the more people understand, the harder it is to attack. That is why six principles guide the project:",
    principles: {
      openTitle: "Open",
      openBody: "Code under MIT, content under CC BY-SA 4.0. Anyone can read, copy, adapt, translate and correct it. No login, no subscription.",
      accessTitle: "Easy to access",
      accessBody: "A fast static site with no cookies and no tracking that works on your phone. Search on a shortcut (Ctrl+K), a list view per stage and keyboard navigation.",
      visualTitle: "Visual",
      visualBody: "Each domain is a map: what exists, where it fits in the pipeline and how it connects. The structure is part of the explanation.",
      verifiableTitle: "Verifiable",
      verifiableBody: "Primary sources, an update date, a public record of corrections and a validator that fails the build when something is incomplete or points to nothing.",
      practicalTitle: "Practical",
      practicalBody: "Step-by-step attack scenarios and quizzes that ask for reasoning. You find out which layer stops each move of the attacker.",
      evolvingTitle: "Built to evolve",
      evolvingBody: "People and coding agents contribute through the same path, with the same guardrails and human review at the end.",
    },

    notionEyebrow: "03 · why not just a Notion",
    notionTitle: "Notes are a start. Structured knowledge is another category.",
    notionIntroA: "Notion is great at what it was built for: taking notes, organizing and collaborating. The comparison below is about another task:",
    notionIntroStrong: "publishing structured, verifiable knowledge",
    notionIntroB: ", where the tool helps maintain quality instead of depending only on the author's discipline.",
    tableCaption: "Comparison between a generic notes workspace and this project",
    colCriterion: "criterion",
    colNotes: "notes workspace (e.g. Notion)",
    colKb: "appsec/kb",
    advantage: "advantage",
    limitation: "limitation",
    rows: {
      structure: "Structure",
      structureNotes: "Structure by convention: templates help, but nothing forces you to follow them",
      structureKb: "Typed topics: sections, sources, quiz and map position are required",
      connections: "Connections",
      connectionsNotes: "Flexible links and relations, with no guarantee of consistency between pages",
      connectionsKb: "A graph with typed relations; the build fails if a connection points to nothing",
      quality: "Quality",
      qualityNotes: "No automatic content verification",
      qualityKb: "A validator (9 rules) and CI on every PR, plus a size budget",
      history: "History and review",
      historyNotes: "Per-page history; peer review depends on a manual process",
      historyKb: "Git: every change is a reviewable commit, with authorship and reason",
      ownership: "Ownership",
      ownershipNotes: "Data lives on the platform (you can export it, but the platform is the source of truth)",
      ownershipKb: "Files in your repository, an open license, fork in one click",
      access: "Access",
      accessNotes: "Public reading is possible; collaborating depends on a workspace and permissions",
      accessKb: "Public and static: opens anywhere, no account",
      learning: "Learning",
      learningNotes: "Focused on reading and note-taking; no native paths, scenarios or quizzes",
      learningKb: "Paths, scenarios, quizzes and progress saved only in your browser",
      realtime: "Real-time collaborative editing",
      realtimeNotes: "Excellent: it is its strong point",
      realtimeKb: "Not the goal: here collaboration happens through pull requests",
    },

    agentsEyebrow: "04 · made for people and for agents",
    agentsTitle: "An MCP server so coding agents can evolve the project.",
    agentsIntro: "The repository ships a local MCP (Model Context Protocol) server with no dependencies. An agent connects, learns the rules, reads what already exists, scaffolds a topic and runs the same validator CI runs, with the same quality limits a person would have.",
    agentsCanTitle: "What the agent can do",
    toolMap: "map what already exists",
    toolRead: "read and find content",
    toolGuide: "load the project rules",
    toolScaffold: "scaffold a new topic",
    toolValidate: "run the validator",
    freshTitle: "Every new session starts from the same point",
    freshBody1: "The project rules come from the server itself (instructions and the contribution guide), so a new session does not depend on old context: it connects, reads the guide and knows what to do and what the build requires.",
    freshBody2: "The guardrails live on the project side: {code} only creates a new file, refuses suspicious paths and never overwrites, and the build does not pass with incomplete content.",
    configCaption: ".mcp.json (already in the repository)",
    agentsNoteStrong: "Agents propose, people review.",
    agentsNote: "AI-assisted contributions are welcome, as long as the author verifies every claim and declares the use in the pull request. The goal is to speed up writing without giving up accuracy.",

    finalTitle: "Learn, correct, improve.",
    finalBody: "If you study security, start with a path. If you work in it, the most valuable way to help is to find what is wrong and say so. If you build with agents, connect the server and propose a topic.",
    ctaPaths: "study paths",
    ctaScenarios: "follow an attack",
    ctaContribute: "how to contribute",
    signature: "— {name}.",
    aboutMe: "about me",
  },

  domains: {
    appsec: {
      name: "AppSec",
      badge: "knowledge base · devsecops",
      title: "Software security,",
      titleAccent: "mapped.",
      lead: "An interactive map of the concepts that protect a pipeline: SAST, DAST, SCA, secrets scanning, SBOM and CI/CD: what each one does, where it fits and how they connect.",
      pitch:
        "SAST, DAST, SCA, secrets, SBOM and the pipeline: the interactive map that shows each check and where it enters the delivery flow.",
      mapIntro:
        "Organized by the pipeline: each check sits in the column of its stage. Animated lines are the CI/CD flow; dashed ones are relations between concepts.",
      pipelineTitle: "end-to-end pipeline",
      pipelineIntro:
        "The path of a commit to production, and the check that lives at each step. Each chip opens the matching topic.",
      loop: "A new CVE in a dependency already in use → continuous SCA opens a PR → the pipeline starts again at 01",
    },
    cloudsec: {
      name: "CloudSec",
      badge: "knowledge base · cloudsec",
      title: "Cloud security,",
      titleAccent: "mapped.",
      lead: "An interactive map of cloud security: identity, network, workloads, posture, cryptography and detection: what each piece does, where it lives and how it connects.",
      pitch:
        "Cloud posture, IAM, segmentation and supply chain: its own graph, in the same style as AppSec.",
      mapIntro:
        "Each control sits in the column of the phase it acts in. Animated lines are the cloud security cycle; dashed ones are relations between concepts.",
      pipelineTitle: "cloud security cycle",
      pipelineIntro:
        "From asset inventory to incident response: the control lives in every phase. Each chip opens the matching topic.",
      loop: "",
    },
    "ai-agents": {
      name: "Agents",
      badge: "knowledge base · agents",
      title: "AI agents,",
      titleAccent: "mapped.",
      lead: "From chunking to guardrails: how a modern agent is built, with the data pipeline (RAG), the action loop (frameworks, tool calling, MCP) and the evaluation mesh that decides whether it can ship.",
      pitch:
        "Security for agents and AI workloads: RAG, tool calling, MCP, guardrails. A complete map.",
      mapIntro:
        "Each concept sits in the column of the phase it acts in. Animated lines are the AI pipeline flow; dashed ones are layers that inform several phases (RAG, LLM, MCP, guardrails).",
      pipelineTitle: "AI pipeline",
      pipelineIntro:
        "From the raw document to the guardrail metric: the path of data and quality. Each chip opens the matching topic.",
      loop: "",
    },
    secops: {
      name: "SecOps",
      badge: "knowledge base · secops",
      title: "L7 defense and SecOps,",
      titleAccent: "mapped.",
      lead: "An interactive map of edge security operations: telemetry, detection, WAF, rate limiting, bots and the metrics that prove it works, from log to block.",
      pitch:
        "L7 edge defense in practice: WAF, rate limiting, bots, detection and SLOs, from log to block, and the metric that proves it works.",
      mapIntro:
        "Each control sits in the column of the phase it acts in. Animated lines are the defense cycle; dashed ones are relations between concepts.",
      pipelineTitle: "defense cycle",
      pipelineIntro:
        "From raw data to the metric: the control lives in every phase. Each chip opens the matching topic.",
      loop: "",
    },
    seceng: {
      name: "Engineering",
      badge: "knowledge base · engineering",
      title: "Security engineering,",
      titleAccent: "mapped.",
      lead: "An interactive map of the engineering behind security: IaC, policy as code, hardened pipelines, reliability at scale, automation and AI, from code to platform.",
      pitch:
        "Building the security platform: IaC and policy as code, hardened CI/CD, reliability at scale, automation and AI with their feet on the ground.",
      mapIntro:
        "Each control sits in the column of the phase it acts in. Animated lines are the engineering cycle; dashed ones are relations between concepts.",
      pipelineTitle: "engineering cycle",
      pipelineIntro:
        "From definition as code to automation: the control lives in every phase. Each chip opens the matching topic.",
      loop: "",
    },
  },
} as const;
