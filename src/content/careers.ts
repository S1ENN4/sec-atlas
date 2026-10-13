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
        topics: ["appsec/cicd", "appsec/shift-left", "appsec/secrets", "cloudsec/iam"],
        outside: ["Linux, networking and shell scripting", "Git and at least one CI system", "Docker basics: images, layers, registries"],
        project: "Build a CI pipeline for a small service that lints, tests, scans for secrets and publishes an image.",
      },
      {
        level: 2,
        goal: "Automate the main checks and secure the infrastructure that runs the code.",
        topics: ["appsec/sast", "appsec/sca", "appsec/dast", "seceng/iac-seguro", "seceng/cicd-hardening", "cloudsec/containers"],
        outside: ["Terraform or another IaC tool, written for real", "Observability basics: metrics, logs, alerts", "A cloud provider's core services"],
        project: "Provision a small environment with IaC, scan the code and the plan, and deploy with short-lived credentials instead of stored keys.",
      },
      {
        level: 3,
        goal: "Treat security as a platform that teams adopt.",
        topics: ["appsec/sbom", "appsec/devsecops", "seceng/policy-as-code", "cloudsec/kubernetes", "seceng/plataforma-como-produto"],
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
      "A DevOps or platform engineer builds and runs the systems teams use to ship and operate software: pipelines, environments, clusters, observability and the tooling around them. Security is part of the job but not all of it. This knowledge base covers the security slice of the role; the operational core is listed as outside it.",
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
        topics: ["appsec/cicd", "cloudsec/network", "cloudsec/iam", "cloudsec/logging-detection"],
        outside: ["Linux administration and shell scripting", "Git, branching and release workflows", "Containers and how they differ from VMs"],
        project: "Containerize a small app, write its pipeline and deploy it to a cloud VM you provisioned by script.",
      },
      {
        level: 2,
        goal: "Describe infrastructure as code and run it safely.",
        topics: ["cloudsec/containers", "seceng/iac-seguro", "seceng/cicd-hardening"],
        outside: ["Terraform or Pulumi in depth, with remote state and modules", "Kubernetes fundamentals: workloads, services, config", "Monitoring and alerting stacks"],
        project: "Recreate the same environment from scratch with IaC in one command, and destroy it just as cleanly.",
      },
      {
        level: 3,
        goal: "Run reliable platforms at scale and treat them as products.",
        topics: ["cloudsec/kubernetes", "seceng/confiabilidade-em-escala", "seceng/observabilidade-plataforma", "seceng/plataforma-como-produto"],
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
        topics: ["ai-agents/mcp", "ai-agents/agent-frameworks", "ai-agents/orchestration", "ai-agents/llm-as-judge", "ai-agents/regression-evals", "seceng/ia-na-seguranca"],
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
];

export const roleById = (id: string) => roles.find((r) => r.id === id);
