// Career roadmaps. Authored in ENGLISH (the source of truth); pt and es are
// translations under src/content/i18n (unit "careers", strict: all three
// languages must be complete and fresh).
//
// A roadmap has three stages that mirror the Journey levels. `topics` are
// knowledge-base topics ("<domain>/<slug>", validated by rule R11); `outside`
// is what the role needs that this knowledge base does not (yet) cover: it is
// listed honestly instead of pretending the KB is the whole path. Certifications
// are EXAMPLES, not endorsements or requirements.

export interface RoleStage {
  level: 1 | 2 | 3;
  goal: string;
  topics: string[];
  outside: string[];
  project: string;
}

export interface Role {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  dayToDay: string[];
  stages: RoleStage[];
  portfolio: string[];
  certs: string[];
  /** Shown instead of a certification list when no mature certification exists. */
  certsNote?: string;
  adjacent: string[];
}

export const roles: Role[] = [
  {
    id: "appsec-engineer",
    title: "AppSec Engineer",
    tagline: "Make the software your company ships hard to break, without slowing the people who write it.",
    summary:
      "An application security engineer finds and prevents vulnerabilities in the code and design of products, and builds the checks, guidance and habits that let developers fix them early. The job sits between security and engineering: half technical depth, half influence.",
    dayToDay: [
      "Review designs and pull requests for security problems, and explain the fix instead of just blocking.",
      "Run and tune SAST, SCA, DAST and secret scanning in the pipeline, keeping the noise low enough that developers trust them.",
      "Triage findings by real risk, not by scanner severity, and track them to closure.",
      "Threat-model new features with the team before the code exists.",
      "Respond when something slips through: reproduce, assess impact, help ship the fix.",
    ],
    stages: [
      {
        level: 1,
        goal: "Understand how software is delivered and where security fits.",
        topics: ["appsec/shift-left", "appsec/cicd", "appsec/secrets", "owasp/broken-access-control", "owasp/injection", "owasp/authentication-failures"],
        outside: ["How the web works: HTTP, sessions, authentication and authorization", "The OWASP Top 10 and one programming language you can read well", "Git and a pull-request workflow"],
        project: "Add secret scanning and a pre-commit hook to one of your own repositories, and document what it catches.",
      },
      {
        level: 2,
        goal: "Operate the core checks and judge their results.",
        topics: ["appsec/sast", "appsec/sca", "appsec/threat-modeling", "appsec/dast", "owasp/insecure-design", "owasp/cryptographic-failures", "owasp/security-misconfiguration"],
        outside: ["Reading code in the stack you protect", "Manual testing with an intercepting proxy", "Writing a clear, actionable vulnerability report"],
        project: "Run SAST, SCA and DAST against a deliberately vulnerable app, triage every finding and write up which ones are real.",
      },
      {
        level: 3,
        goal: "Run an application security program, not just tools.",
        topics: ["appsec/sbom", "appsec/devsecops", "seceng/cicd-hardening", "seceng/policy-as-code"],
        outside: ["Secure design reviews on real systems", "Vulnerability management metrics and prioritization", "Teaching and influencing developers at scale"],
        project: "Design a pipeline gate policy (what blocks, what warns, what is exempt) and measure its false-positive rate over a month.",
      },
    ],
    portfolio: [
      "A write-up of a threat model for a small real system, with the mitigations you chose and why.",
      "A pipeline repository showing SAST, SCA and secret scanning with tuned rules and a documented exception process.",
      "A short guide for developers: the five vulnerability classes that matter most in your stack and how to avoid them.",
    ],
    certs: ["OSWE (OffSec)", "CSSLP (ISC2)", "GIAC GWEB"],
    adjacent: ["devsecops-engineer", "cloud-security-engineer"],
  },
  {
    id: "devsecops-engineer",
    title: "DevSecOps Engineer",
    tagline: "Build the delivery pipeline so that the secure way is also the easy way.",
    summary:
      "A DevSecOps engineer automates security into how software is built, shipped and run: pipelines, infrastructure as code, containers and cloud controls. Where an AppSec engineer focuses on code and design, DevSecOps focuses on the machinery that carries it to production.",
    dayToDay: [
      "Own the CI/CD security controls: scanning stages, gates, signing, short-lived credentials.",
      "Review infrastructure as code and enforce policy before it reaches the cloud.",
      "Harden container images, clusters and runners, and keep them patched.",
      "Turn manual security reviews into automated, versioned checks that run on every change.",
      "Measure friction (build time, false positives) and remove it, so teams do not route around the controls.",
    ],
    stages: [
      {
        level: 1,
        goal: "Know the pipeline, the identity model and the shift-left idea.",
        topics: ["appsec/cicd", "appsec/shift-left", "appsec/secrets", "cloudsec/iam", "devops/git-workflows", "devops/delivery-lifecycle"],
        outside: ["Linux, networking and shell scripting", "Git and at least one CI system", "Docker basics: images, layers, registries"],
        project: "Build a CI pipeline for a small service that lints, tests, scans for secrets and publishes an image.",
      },
      {
        level: 2,
        goal: "Automate the main checks and secure the infrastructure that runs the code.",
        topics: ["appsec/sast", "appsec/sca", "appsec/dast", "seceng/iac-seguro", "seceng/cicd-hardening", "cloudsec/containers", "devops/ci-pipelines", "devops/infrastructure-as-code", "devops/container-images"],
        outside: ["Terraform or another IaC tool, written for real", "Observability basics: metrics, logs, alerts", "A cloud provider's core services"],
        project: "Provision a small environment with IaC, scan the code and the plan, and deploy with short-lived credentials instead of stored keys.",
      },
      {
        level: 3,
        goal: "Treat security as a platform that teams adopt.",
        topics: ["appsec/sbom", "appsec/devsecops", "seceng/policy-as-code", "cloudsec/kubernetes", "seceng/plataforma-como-produto", "devops/kubernetes-basics", "devops/release-strategies"],
        outside: ["Site reliability practices: SLOs, incident response, release engineering", "Supply chain integrity: signing and provenance", "Developer experience as a discipline"],
        project: "Publish a paved-road template (pipeline + IaC module + policy) and measure how many teams adopt it and how long onboarding takes.",
      },
    ],
    portfolio: [
      "A repository with a hardened pipeline: pinned dependencies, short-lived cloud credentials, signed artifacts.",
      "A set of policy-as-code rules with tests, showing what each one prevents.",
      "A before/after write-up of a pipeline where you removed friction and kept (or improved) coverage.",
    ],
    certs: ["CKS (CNCF)", "AWS Certified Security – Specialty", "Azure Security Engineer Associate (AZ-500)"],
    adjacent: ["appsec-engineer", "devops-platform-engineer"],
  },
  {
    id: "devops-platform-engineer",
    title: "DevOps / Platform Engineer",
    tagline: "Make shipping software fast, repeatable and safe, for every team in the company.",
    summary:
      "A DevOps or platform engineer builds and runs the systems teams use to ship and operate software: pipelines, environments, clusters, observability and the tooling around them. Security is part of the job but not all of it. This knowledge base covers the delivery foundations and the security slice of the role; deeper operations and platform work is listed as outside it.",
    dayToDay: [
      "Build and maintain CI/CD, environments and the infrastructure behind them.",
      "Keep platforms reliable: monitoring, capacity, upgrades, on-call.",
      "Make the default path for developers fast and safe, and document it.",
      "Automate toil and standardize how services are built and deployed.",
      "Work with security so controls fit the platform instead of fighting it.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn the foundations of delivery, identity, networking and logs.",
        topics: ["devops/linux-and-networking", "devops/git-workflows", "devops/container-images", "devops/delivery-lifecycle", "appsec/cicd", "cloudsec/network", "cloudsec/iam", "cloudsec/logging-detection"],
        outside: ["Linux administration and shell scripting", "Git, branching and release workflows", "Containers and how they differ from VMs"],
        project: "Containerize a small app, write its pipeline and deploy it to a cloud VM you provisioned by script.",
      },
      {
        level: 2,
        goal: "Describe infrastructure as code and run it safely.",
        topics: ["devops/ci-pipelines", "devops/infrastructure-as-code", "cloudsec/containers", "seceng/iac-seguro", "seceng/cicd-hardening"],
        outside: ["Terraform or Pulumi in depth, with remote state and modules", "Kubernetes fundamentals: workloads, services, config", "Monitoring and alerting stacks"],
        project: "Recreate the same environment from scratch with IaC in one command, and destroy it just as cleanly.",
      },
      {
        level: 3,
        goal: "Run reliable platforms at scale and treat them as products.",
        topics: ["devops/kubernetes-basics", "devops/release-strategies", "devops/observability", "devops/sre-reliability", "cloudsec/kubernetes", "seceng/confiabilidade-em-escala", "seceng/observabilidade-plataforma", "seceng/plataforma-como-produto"],
        outside: ["SRE practice: SLOs, error budgets, incident management", "Cost awareness (FinOps) and capacity planning", "Multi-environment and multi-region design"],
        project: "Define SLOs for a service, build the dashboards and alerts for them, and run a game day to test the runbook.",
      },
    ],
    portfolio: [
      "An infrastructure repository that builds a complete environment from nothing, with documentation anyone can follow.",
      "A platform write-up: what you standardized, what you left flexible and how teams reacted.",
      "A post-incident review (real or simulated) with timeline, causes and the changes that followed.",
    ],
    certs: ["CKA (CNCF)", "HashiCorp Terraform Associate", "AWS Certified DevOps Engineer – Professional"],
    adjacent: ["devsecops-engineer", "cloud-security-engineer"],
  },
  {
    id: "cloud-security-engineer",
    title: "Cloud Security Engineer",
    tagline: "Keep cloud environments configured, monitored and recoverable as they grow.",
    summary:
      "A cloud security engineer designs and verifies the controls of cloud environments: identities, networks, data protection, workloads and detection. The work is mostly about preventing misconfiguration at scale and noticing quickly when something drifts or is abused.",
    dayToDay: [
      "Design least-privilege identity and access, and review the permissions that creep in over time.",
      "Segment networks and protect data with encryption and well-managed keys.",
      "Watch posture continuously and fix drift before it becomes an incident.",
      "Secure containers and Kubernetes clusters, and watch workloads at runtime.",
      "Build the logging and response playbooks used when an account is compromised.",
    ],
    stages: [
      {
        level: 1,
        goal: "Get identity, network and logging right: they underpin everything.",
        topics: ["cloudsec/iam", "cloudsec/network", "cloudsec/logging-detection"],
        outside: ["Core services of one cloud provider (compute, storage, networking)", "Networking fundamentals: TCP/IP, DNS, TLS", "The shared responsibility model"],
        project: "Set up a small cloud account with least-privilege roles, a private network and centralized audit logs.",
      },
      {
        level: 2,
        goal: "Protect data, secrets and workloads, and verify posture continuously.",
        topics: ["cloudsec/kms-crypto", "cloudsec/secrets-cloud", "cloudsec/containers", "cloudsec/cspm", "cloudsec/zero-trust"],
        outside: ["A second cloud provider, to see which ideas are universal", "Scripting for automation (Python or similar)", "Compliance frameworks at a high level"],
        project: "Write checks for five common misconfigurations, run them against your account and fix what they find.",
      },
      {
        level: 3,
        goal: "Defend clusters and respond when something goes wrong.",
        topics: ["cloudsec/kubernetes", "cloudsec/cwpp", "cloudsec/incident-response", "seceng/iac-seguro", "seceng/policy-as-code"],
        outside: ["Cloud forensics and evidence handling", "Multi-account landing-zone design", "Threat modeling cloud architectures"],
        project: "Simulate a leaked access key, contain it using your own runbook and write the post-incident review.",
      },
    ],
    portfolio: [
      "A reference architecture for a secure account structure, with the reasoning behind each control.",
      "Infrastructure-as-code modules that make the secure configuration the default.",
      "A runbook for a compromised credential, tested in a sandbox account.",
    ],
    certs: ["AWS Certified Security – Specialty", "Azure Security Engineer Associate (AZ-500)", "Google Professional Cloud Security Engineer"],
    adjacent: ["devsecops-engineer", "detection-soc-engineer"],
  },
  {
    id: "detection-soc-engineer",
    title: "Detection / SOC Engineer",
    tagline: "Turn raw telemetry into decisions: detect abuse quickly, act with care and measure the result.",
    summary:
      "A detection or SOC engineer builds and runs the pipeline from logs to action: collecting telemetry, writing and tuning detections, operating controls such as WAF and rate limiting, and measuring how well the whole thing works. It is engineering with a stopwatch: speed, precision and cost all matter.",
    dayToDay: [
      "Maintain the telemetry pipeline and watch it for gaps, lag and silent failures.",
      "Write, test and tune detections for credential stuffing, scraping, injection and abuse.",
      "Operate WAF, rate limiting and bot controls: observe first, shadow next, enforce last.",
      "Run runbooks during incidents, then turn what you learned into new detections and hardening.",
      "Report precision, recall and response times, and use them to decide what to tune next.",
    ],
    stages: [
      {
        level: 1,
        goal: "Know what attacks look like in logs and how telemetry is collected.",
        topics: ["secops/ataques-l7", "secops/telemetria-borda", "cloudsec/logging-detection"],
        outside: ["HTTP in depth: headers, cookies, status codes", "SQL or a similar query language, used daily", "The MITRE ATT&CK framework as a vocabulary"],
        project: "Take a sample access log, write queries that expose three attack patterns and document the signature of each.",
      },
      {
        level: 2,
        goal: "Write detections and operate edge controls safely.",
        topics: ["secops/detection-engineering", "secops/waf", "secops/rate-limiting", "secops/bot-management"],
        outside: ["A scripting language for glue and testing", "Statistics basics: baselines, z-scores, moving averages", "A real WAF or CDN account to practice on"],
        project: "Ship a detection through observation, shadow and enforcement, and report its false-positive rate at each stage.",
      },
      {
        level: 3,
        goal: "Scale the pipeline, automate the response and prove it works.",
        topics: ["secops/escala-telemetria", "secops/runbooks-e-hardening", "secops/slos-soc", "secops/defesa-em-camadas", "cloudsec/incident-response", "seceng/automacao-soar"],
        outside: ["Data engineering for telemetry: partitioning, aggregation, cost", "On-call and incident command", "Presenting results to leadership"],
        project: "Define SLOs for triage and containment, build the dashboard and run a tabletop exercise against them.",
      },
    ],
    portfolio: [
      "A detection library with tests: positive cases (attacks) and negative cases (normal traffic).",
      "A runbook with an escalation ladder (challenge, short block, longer block) and TTLs on every action.",
      "A one-page report of precision, recall and time to contain for a month of operation.",
    ],
    certs: ["GIAC Certified Detection Analyst (GCDA)", "Splunk Core Certified Power User", "Elastic Certified Analyst"],
    adjacent: ["cloud-security-engineer", "appsec-engineer"],
  },
  {
    id: "ai-security-engineer",
    title: "AI Security Engineer",
    tagline: "Secure systems that read untrusted text, call tools and act on the world.",
    summary:
      "An AI security engineer protects applications built on language models and agents: retrieval pipelines, tool calling, protocols such as MCP, and the evaluation that tells you whether they are safe to ship. The field is young and moves fast, so the job rewards fundamentals and careful measurement over memorized tricks.",
    dayToDay: [
      "Threat-model LLM features: what untrusted input reaches the model and what the model can do with it.",
      "Review retrieval and tool-calling designs for injection, data leakage and excessive agency.",
      "Design guardrails and permission boundaries around agents, and test that they hold.",
      "Build evaluation sets and regression tests so a prompt or model change cannot silently weaken safety.",
      "Assess third-party tools and servers that agents are allowed to use.",
    ],
    stages: [
      {
        level: 1,
        goal: "Understand how language models, embeddings and chunking behave.",
        topics: ["ai-agents/llm", "ai-agents/embeddings", "ai-agents/chunking"],
        outside: ["Python and calling a model API", "Basic machine learning vocabulary", "Prompt injection as a concept, and why it is hard to fully prevent"],
        project: "Build a tiny retrieval app, then write down every place where untrusted text reaches the model.",
      },
      {
        level: 2,
        goal: "Secure retrieval, tool calling and the guardrails around them.",
        topics: ["ai-agents/vector-db", "ai-agents/retrieval", "ai-agents/rag", "ai-agents/tool-calling", "ai-agents/guardrails", "ai-agents/evals"],
        outside: ["Access control applied to retrieved documents", "Structured outputs and schema validation", "Application security fundamentals for the surrounding service"],
        project: "Plant a malicious instruction in a document, watch your app obey it, then fix it with permissions and validation.",
      },
      {
        level: 3,
        goal: "Govern agents, third-party tools and quality over time.",
        topics: ["ai-agents/mcp", "ai-agents/agent-frameworks", "ai-agents/orchestration", "ai-agents/llm-as-judge", "ai-agents/regression-evals", "seceng/ia-na-seguranca", "vibecoding/agent-security", "vibecoding/verification-loop"],
        outside: ["Supply-chain review of tools, plugins and servers", "Red-teaming methodology for AI systems", "Policy and risk management frameworks for AI"],
        project: "Build a regression suite from real failures and wire it as a gate that blocks prompt or model changes that make it worse.",
      },
    ],
    portfolio: [
      "A threat model of an agent that can read email and call tools, with the permission boundaries you would impose.",
      "An evaluation suite for prompt-injection resistance that runs in CI.",
      "A review of a third-party tool server: what access it asks for, what could go wrong and what you would restrict.",
    ],
    certs: [],
    certsNote: "There is no mature, widely recognized certification yet: prefer public work such as OWASP LLM Top 10 exercises, written reviews and open evaluation suites.",
    adjacent: ["appsec-engineer", "detection-soc-engineer"],
  },
  {
    id: "security-architect",
    title: "Security Architect",
    tagline: "Design security once, as patterns that hundreds of teams can reuse.",
    summary:
      "A security architect defines how identity, networks, cloud and data fit together without creating gaps. The work is systems thinking: principles such as zero trust and least privilege turned into reference architectures, guardrails and decisions that engineering teams can follow without a queue.",
    dayToDay: [
      "Review the design of new systems and major changes, and threat-model them with the team.",
      "Define reusable patterns: landing zones, identity and authorization services, paved pipelines.",
      "Write down decisions and their trade-offs so the reasoning outlives the meeting.",
      "Handle exceptions with owners and expiry dates, and fold recurring ones back into the pattern.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn the principles, the vocabulary and the building blocks.",
        topics: ["grc/security-frameworks", "grc/risk-management", "cloudsec/iam", "cloudsec/network"],
        outside: ["Networking fundamentals: TCP/IP, DNS, TLS, routing", "Operating systems and how cloud platforms are built"],
        project: "Draw the architecture of a small system and list its trust boundaries, data flows and the controls at each one.",
      },
      {
        level: 2,
        goal: "Design reusable patterns and verify them with threat modeling.",
        topics: ["grc/security-architecture", "cloudsec/zero-trust", "appsec/threat-modeling", "cloudsec/kms-crypto"],
        outside: ["At least one cloud provider's architecture guidance", "Identity protocols: OAuth 2.0, OpenID Connect, SAML"],
        project: "Write an architecture decision record for service-to-service authentication, with alternatives and consequences.",
      },
      {
        level: 3,
        goal: "Govern architecture at scale and tie it to the business.",
        topics: ["seceng/plataforma-como-produto", "grc/security-strategy-and-budget", "seceng/policy-as-code"],
        outside: ["Enterprise architecture frameworks and how decisions get made", "Communicating trade-offs to executives"],
        project: "Publish a landing-zone reference with guardrails as code, and measure how many teams adopt it.",
      },
    ],
    portfolio: [
      "A reference architecture for a multi-account cloud setup, with the reasoning behind each control.",
      "Three architecture decision records that show real trade-offs and a rejected alternative.",
    ],
    certs: ["CISSP (ISC2)", "SABSA", "AWS Certified Security – Specialty"],
    adjacent: ["cloud-security-engineer", "ciso"],
  },
  {
    id: "incident-responder",
    title: "Incident Responder",
    tagline: "Stop the damage, keep the evidence, and bring the business back.",
    summary:
      "An incident responder is the first call when something goes wrong: a compromised account, a malware outbreak, ransomware. The work combines calm decision-making under pressure with solid technical skills in logs, endpoints and cloud, and a habit of writing everything down.",
    dayToDay: [
      "Triage alerts and decide quickly whether something is a real incident and how serious it is.",
      "Contain compromised accounts, hosts and cloud resources while preserving evidence.",
      "Build the timeline from logs and coordinate with legal, communications and engineering.",
      "Run the post-incident review and turn lessons into detections, playbooks and fixes.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn the lifecycle, the roles and how attackers are described.",
        topics: ["response/ir-lifecycle", "response/threat-intelligence"],
        outside: ["Operating system and network fundamentals", "A SIEM or log search tool"],
        project: "Write an incident record template and a severity scale, and run a tabletop exercise on a phishing scenario.",
      },
      {
        level: 2,
        goal: "Triage, scope and contain with proportion.",
        topics: ["response/triage-and-containment", "response/log-and-timeline-analysis", "response/ransomware-playbook", "cloudsec/logging-detection"],
        outside: ["Endpoint detection and response tooling", "Scripting for log analysis (Python, jq, SQL)"],
        project: "Investigate a simulated leaked cloud key from logs only, then write the containment steps and timeline.",
      },
      {
        level: 3,
        goal: "Preserve and analyze evidence, and automate the repeatable.",
        topics: ["response/digital-forensics-basics", "cloudsec/incident-response", "seceng/automacao-soar"],
        outside: ["Memory and disk forensics tools", "Legal basics: evidence handling, breach notification duties"],
        project: "Automate one containment action with an approval step and an audit trail, and test it in a lab.",
      },
    ],
    portfolio: [
      "A redacted post-incident review with timeline, root cause, what worked and the changes that followed.",
      "A ransomware playbook adapted to a fictional company, with decision points and owners.",
    ],
    certs: ["GCIH (GIAC)", "BTL1 (Security Blue Team)", "CompTIA CySA+"],
    adjacent: ["threat-hunter", "forensics-malware-analyst"],
  },
  {
    id: "threat-hunter",
    title: "Threat Hunter",
    tagline: "Assume they are already inside, and go find the evidence.",
    summary:
      "A threat hunter searches telemetry for attacker activity that automated detections missed. Each hunt starts from a hypothesis, uses data and queries to test it, and ends with a finding or a documented gap, and with a new detection. It is investigative, analytical work.",
    dayToDay: [
      "Form hypotheses from threat intelligence, recent incidents and gaps in detection coverage.",
      "Query large volumes of telemetry and baseline what is normal before flagging what is rare.",
      "Escalate confirmed findings to incident response with the evidence collected.",
      "Turn each hunt into an automated detection and measure its false positives.",
    ],
    stages: [
      {
        level: 1,
        goal: "Understand adversary behavior and the response process hunts feed.",
        topics: ["response/threat-intelligence", "response/ir-lifecycle", "cloudsec/logging-detection"],
        outside: ["How operating systems and networks behave normally", "The MITRE ATT&CK framework in depth"],
        project: "Map five ATT&CK techniques to the log sources that would reveal them in your environment, and mark the gaps.",
      },
      {
        level: 2,
        goal: "Build timelines and pivot across data sources.",
        topics: ["response/log-and-timeline-analysis", "response/triage-and-containment"],
        outside: ["SQL and the query language of your SIEM", "Basic statistics: baselines and outliers"],
        project: "Write three queries that surface suspicious behavior in a sample dataset and document the false positives.",
      },
      {
        level: 3,
        goal: "Run hunts end to end and measure the program.",
        topics: ["response/threat-hunting", "offsec/red-team-and-adversary-emulation"],
        outside: ["Data engineering for telemetry at scale", "Notebooks and automation for repeatable hunts"],
        project: "Run a hunt against an emulated technique, write the detection it produced and report the coverage gained.",
      },
    ],
    portfolio: [
      "A hunt report: hypothesis, data, queries, results and the detection you shipped.",
      "A coverage map of techniques versus detections, with the gaps ranked.",
    ],
    certs: ["GCTI (GIAC)", "GCFA (GIAC)", "eCTHP (INE)"],
    adjacent: ["incident-responder", "detection-soc-engineer"],
  },
  {
    id: "forensics-malware-analyst",
    title: "Forensics and Malware Analyst",
    tagline: "Reconstruct what happened from the evidence, and explain what the code does.",
    summary:
      "A forensics analyst collects and examines evidence from memory, disks, logs and cloud services to rebuild an attack, following strict handling rules so it can stand up in a dispute. A malware analyst studies suspicious files to learn what they do and how to detect them. The two roles often work together.",
    dayToDay: [
      "Acquire evidence in the right order and prove it was not altered.",
      "Analyze memory and disk artifacts and rebuild the timeline of an intrusion.",
      "Triage suspicious files in an isolated lab and write detections for what you find.",
      "Write reports that separate observation from interpretation and state the limits honestly.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn the incident process and where evidence comes from.",
        topics: ["response/ir-lifecycle"],
        outside: ["Operating system internals: Windows and Linux", "File systems and how data is stored and deleted"],
        project: "Set up an isolated lab with snapshots and practice taking and verifying a disk image of your own test machine.",
      },
      {
        level: 2,
        goal: "Work from logs and scope an intrusion before deep analysis.",
        topics: ["response/log-and-timeline-analysis", "response/triage-and-containment"],
        outside: ["Windows event logs and common persistence locations", "Scripting for parsing and automation"],
        project: "Build a combined timeline from three log sources of a simulated intrusion and mark each event with its evidence.",
      },
      {
        level: 3,
        goal: "Analyze evidence and samples, and produce detections.",
        topics: ["response/digital-forensics-basics", "response/malware-analysis-basics"],
        outside: ["Reverse engineering with a disassembler", "Memory forensics tooling"],
        project: "Analyze a public sample in your lab and publish a short report with indicators and a YARA rule.",
      },
    ],
    portfolio: [
      "A forensic report on a public case image, with method, findings and limits.",
      "A malware analysis write-up with static and dynamic findings and the detections that came out of it.",
    ],
    certs: ["GCFE / GCFA (GIAC)", "GREM (GIAC)", "EnCE (OpenText)"],
    adjacent: ["incident-responder", "threat-hunter"],
  },
  {
    id: "pentester",
    title: "Penetration Tester",
    tagline: "Break things on purpose, with permission, and leave them stronger.",
    summary:
      "A penetration tester performs authorized, scoped tests to find and demonstrate weaknesses in applications, networks and cloud environments. The craft is method plus judgment: knowing what to test, proving impact with the least access needed, and writing a report that gets fixed.",
    dayToDay: [
      "Agree on scope and rules of engagement before touching anything.",
      "Map the attack surface and test authentication, authorization and input handling.",
      "Demonstrate impact safely and record reproducible evidence.",
      "Write findings with clear remediation and verify fixes in a retest.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn the ethics, the method and the most common web weaknesses.",
        topics: ["offsec/engagement-scoping-and-ethics", "offsec/pentest-methodology", "owasp/broken-access-control", "owasp/injection"],
        outside: ["How the web works: HTTP, sessions, cookies, APIs", "Linux command line and one scripting language"],
        project: "Set up a deliberately vulnerable lab you own, write a rules-of-engagement document for it and find two issues.",
      },
      {
        level: 2,
        goal: "Test applications and APIs methodically and report well.",
        topics: ["offsec/recon-and-attack-surface", "offsec/web-and-api-testing", "offsec/reporting-and-remediation", "owasp/authentication-failures", "owasp/security-misconfiguration"],
        outside: ["An intercepting proxy such as Burp Suite or ZAP", "Network scanning and service enumeration"],
        project: "Test a vulnerable API with two accounts, write three findings in the template and retest after fixing them.",
      },
      {
        level: 3,
        goal: "Chain weaknesses and understand the defender's view.",
        topics: ["offsec/privilege-escalation-paths", "owasp/insecure-design"],
        outside: ["Active Directory and cloud attack paths in a lab", "Reading source code for security flaws"],
        project: "Map an attack path in a lab environment, write how it would be detected, and propose the fix.",
      },
    ],
    portfolio: [
      "Two redacted or lab-based reports using a clear finding template with evidence and remediation.",
      "Write-ups of lab or CTF challenges that explain the method, not only the answer.",
    ],
    certs: ["OSCP (OffSec)", "PNPT (TCM Security)", "GPEN (GIAC)", "eJPT (INE)"],
    adjacent: ["appsec-engineer", "red-teamer"],
  },
  {
    id: "red-teamer",
    title: "Red Team Operator",
    tagline: "Simulate a real adversary to find out whether the defense would notice.",
    summary:
      "A red team operator runs goal-driven, authorized simulations of realistic adversaries, testing people, process and detection as much as technology. The best red teams work toward a stronger blue team: they share techniques, measure what was detected and help close the gaps.",
    dayToDay: [
      "Plan an exercise from threat intelligence about adversaries relevant to the organization.",
      "Emulate techniques in a controlled, authorized way with safety stops and deconfliction.",
      "Record each technique, its time and the telemetry it should create.",
      "Run the debrief with defenders and turn the gaps into detections and fixes.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn the rules, the ethics and the structure of an engagement.",
        topics: ["offsec/engagement-scoping-and-ethics", "offsec/pentest-methodology"],
        outside: ["Networking and operating system fundamentals", "Programming and scripting for tooling"],
        project: "Write rules of engagement and a deconfliction process for a fictional exercise.",
      },
      {
        level: 2,
        goal: "Understand reconnaissance, the human surface and adversary behavior.",
        topics: ["offsec/recon-and-attack-surface", "offsec/social-engineering-and-phishing", "response/threat-intelligence"],
        outside: ["MITRE ATT&CK in depth", "Active Directory and cloud identity basics"],
        project: "Choose a public threat actor report and turn it into an ordered technique plan with expected telemetry.",
      },
      {
        level: 3,
        goal: "Run emulation exercises and improve detection together with the defenders.",
        topics: ["offsec/privilege-escalation-paths", "offsec/red-team-and-adversary-emulation"],
        outside: ["Safe adversary emulation tooling and lab infrastructure", "Evasion concepts from the defender's perspective"],
        project: "Run a purple-team session in a lab, log which techniques were detected and write the detections for the gaps.",
      },
    ],
    portfolio: [
      "A purple-team report with the technique log, detection results and the improvements made.",
      "An emulation plan for a public threat actor, with ATT&CK mappings and expected telemetry.",
    ],
    certs: ["CRTO (Zero-Point Security)", "OSEP (OffSec)", "GPEN (GIAC)"],
    adjacent: ["pentester", "threat-hunter"],
  },
  {
    id: "third-party-risk-analyst",
    title: "Third-Party Risk Analyst",
    tagline: "Judge how much to trust the suppliers your company depends on.",
    summary:
      "A third-party risk analyst assesses the security of vendors, partners and software the company relies on, because their weaknesses become yours. The work blends security knowledge, contracts and process: tiering suppliers, reviewing evidence, and following up until the risk is accepted or reduced.",
    dayToDay: [
      "Keep an inventory of vendors and tier them by criticality.",
      "Review questionnaires, audit reports and technical evidence for critical suppliers.",
      "Negotiate security terms with legal and procurement, such as breach notification and audit rights.",
      "Track findings and reassess suppliers on a schedule or after an incident.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn risk thinking and the standards suppliers are measured against.",
        topics: ["grc/risk-management", "grc/security-frameworks"],
        outside: ["Basic contract and procurement concepts", "Privacy law basics for your jurisdictions"],
        project: "Tier ten fictional vendors by criticality and write the review depth each one would receive.",
      },
      {
        level: 2,
        goal: "Assess suppliers and the software supply chain.",
        topics: ["grc/third-party-risk", "grc/compliance-in-practice", "owasp/supply-chain-failures", "appsec/sca"],
        outside: ["Reading SOC 2 and ISO 27001 reports critically", "Security questionnaires and how to challenge vague answers"],
        project: "Review a public SOC 2 style report and write a one-page risk summary with follow-up questions.",
      },
      {
        level: 3,
        goal: "Use software inventories and metrics to monitor suppliers continuously.",
        topics: ["appsec/sbom", "grc/security-metrics"],
        outside: ["Security ratings services and their limits", "Incident handling when a supplier is breached"],
        project: "Define a supplier risk dashboard with a handful of metrics and the decision each one informs.",
      },
    ],
    portfolio: [
      "A tiering model and review checklist for suppliers, with the reasoning for each tier.",
      "A sample supplier assessment with findings, requested actions and a residual risk rating.",
    ],
    certs: ["CTPRP (Shared Assessments)", "ISO 27001 Lead Auditor", "CISA (ISACA)"],
    adjacent: ["grc-compliance-manager", "security-architect"],
  },
  {
    id: "grc-compliance-manager",
    title: "GRC and Compliance Manager",
    tagline: "Turn requirements and risks into controls that work and can be proven.",
    summary:
      "A governance, risk and compliance manager maps the company's technology risks, aligns the program with frameworks and regulation, and makes sure controls have owners and evidence. The goal is real risk reduction that also satisfies auditors, translated into reports that leadership can use.",
    dayToDay: [
      "Maintain the risk register and drive treatment decisions with risk owners.",
      "Map controls to frameworks such as ISO 27001, NIST CSF and PCI DSS.",
      "Plan and run audits, with evidence collected continuously.",
      "Report risk and program metrics to executives in business terms.",
    ],
    stages: [
      {
        level: 1,
        goal: "Learn risk management and the main frameworks.",
        topics: ["grc/risk-management", "grc/security-frameworks"],
        outside: ["The regulations that apply to your sector and countries", "Basic auditing concepts"],
        project: "Build a small risk register with ten risks, each with an owner, a rating and a treatment.",
      },
      {
        level: 2,
        goal: "Make controls operate and produce evidence.",
        topics: ["grc/compliance-in-practice", "grc/security-metrics", "grc/third-party-risk"],
        outside: ["A GRC platform or evidence tooling", "Interviewing control owners and testing controls"],
        project: "Map one control to three frameworks and define how its evidence is produced automatically.",
      },
      {
        level: 3,
        goal: "Connect compliance to engineering and to strategy.",
        topics: ["seceng/policy-as-code", "grc/security-strategy-and-budget"],
        outside: ["Business case writing and budget cycles", "Internal audit and assurance practice"],
        project: "Write a one-page board summary of the risk posture with three decisions you need from leadership.",
      },
    ],
    portfolio: [
      "A control mapping across frameworks, with owners and evidence sources.",
      "A sample quarterly risk report for executives, with trends and requested decisions.",
    ],
    certs: ["CISA (ISACA)", "CRISC (ISACA)", "ISO 27001 Lead Implementer"],
    adjacent: ["ciso", "third-party-risk-analyst"],
  },
  {
    id: "ciso",
    title: "CISO",
    tagline: "Own the security strategy, the budget and the answer to the question: are we safe?",
    summary:
      "The chief information security officer leads the security function and answers to the executive team and the board. The job is less about tools and more about decisions: where to put limited people and money, which risks the business accepts, and how to lead the company through a crisis. It requires technical credibility and business fluency.",
    dayToDay: [
      "Set the strategy and roadmap from the business goals and the main risks.",
      "Decide and defend the budget, and report the program's results to executives and the board.",
      "Make risk acceptance explicit and owned by the right executive.",
      "Lead the organization during a serious incident, including communication.",
    ],
    stages: [
      {
        level: 1,
        goal: "Build the foundations of risk, frameworks and incident handling.",
        topics: ["grc/risk-management", "grc/security-frameworks", "response/ir-lifecycle"],
        outside: ["Hands-on technical depth in at least one security domain", "Basic finance: budgets, cost of risk, return on spend"],
        project: "Write a one-page security vision for a fictional company: its crown jewels, top risks and three priorities.",
      },
      {
        level: 2,
        goal: "Design the program and learn to measure and explain it.",
        topics: ["grc/security-architecture", "grc/security-metrics", "grc/third-party-risk"],
        outside: ["Executive communication and storytelling with data", "The legal and regulatory landscape for your business"],
        project: "Define ten metrics that tie to decisions and draft the first board dashboard.",
      },
      {
        level: 3,
        goal: "Lead: strategy, budget, crisis and culture.",
        topics: ["grc/security-strategy-and-budget", "grc/crisis-communication-and-culture"],
        outside: ["People leadership: hiring, retention, managing managers", "Negotiation and influence across the executive team"],
        project: "Draft a two-year roadmap with a budget and a list of the risks accepted for now, and run a crisis tabletop with executives.",
      },
    ],
    portfolio: [
      "A strategy and roadmap document with priorities, trade-offs and measures of success.",
      "A crisis communication plan with templates and a tabletop exercise report.",
    ],
    certs: ["CISM (ISACA)", "CISSP (ISC2)", "executive programs such as an MBA or a security leadership course"],
    adjacent: ["grc-compliance-manager", "security-architect"],
  },
];

export const roleById = (id: string) => roles.find((r) => r.id === id);
