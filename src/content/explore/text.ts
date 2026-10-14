// Prose of the explorable map. English is the source; pt/es are overlays
// (unit "explore", strict: every string must be translated and fresh).
// Keep ids in sync with ./world.ts (validate-content R12 checks it).

export interface NodeText {
  title: string;
  summary: string;
  points: string[];
  where?: string;
}

export interface ChallengeText {
  prompt: string;
  why: string;
  hint: string;
}

export const exploreText = {
  ui: {
    pageTitle: "explore",
    description:
      "An explorable map of how code reaches production: open the repository, the CI workflow, the scanners and the runtime, and see where each security control lives.",
    eyebrow: "explorable map",
    heading: "From commit to production",
    intro:
      "Start at the trailhead and open any place. Each one has more inside: files, tools, checks and small challenges. Go back whenever you like. What you explore is remembered in this browser.",
    trailhead: "trailhead",
    start: "start here",
    back: "back",
    backTo: "Back to {name}",
    enter: "open",
    explored: "{done} of {total} places explored",
    pathAria: "Where you are",
    childrenTitle: "Inside {name}",
    childrenHint: "Open one to go deeper.",
    leaf: "End of this trail.",
    nextOnTrail: "next on the trail",
    whereTitle: "where it lives",
    pointsTitle: "what to know",
    studyTitle: "study the topic",
    codeTitle: "example",
    copy: "copy",
    copied: "copied",
    visited: "explored",
    stageAria: "Map",
    kinds: {
      place: "place",
      file: "file",
      tool: "tool",
      check: "check",
      artifact: "artifact",
      concept: "concept",
    },
    missionsTitle: "Missions",
    missionsHint: "Pick a guided trail. The map points at your next stop.",
    missionActive: "Mission: {name}",
    missionStep: "step {n} of {total}",
    missionGo: "take me there",
    missionLeave: "leave mission",
    missionStart: "start",
    missionAgain: "again",
    missionDone: "Mission complete: {name}",
    missionDoneBody: "You walked the whole trail. Pick another mission or keep exploring.",
    missionTarget: "next stop",
    challengeTitle: "challenge",
    challengeSelect: "Select the risky lines ({n} to find), then check your answer.",
    challengeCheck: "check my answer",
    challengeClear: "clear",
    challengeCorrect: "Correct.",
    challengeWrong: "Not quite: you found {right} of {n} risky lines and marked {extra} safe ones.",
    challengeShow: "show the answer",
    challengeSolved: "solved",
    lineAria: "Line {n}",
    reset: "reset exploration",
    keys: "Esc or Backspace goes back one level.",
  },

  nodes: {
    pipeline: {
      title: "From commit to production",
      summary:
        "A change travels from a developer's laptop to real users. Security controls sit at every stop; this map shows where each one lives and what it does.",
      points: [
        "Controls are layered: a mistake missed at one stop should be caught at the next.",
        "Most of the pipeline is configuration in files, and files can be reviewed like code.",
        "Open a place to go inside, or pick a mission to be guided.",
      ],
    },
    dev: {
      title: "Developer machine",
      summary: "Where the change starts. Cheap, fast checks here stop mistakes before they ever leave the laptop.",
      points: [
        "Fast feedback beats late findings: a secret caught here never reaches the repository history.",
        "Local checks can be skipped, so they are a convenience and never the only control.",
        "Everything here is mirrored by a server-side check later.",
      ],
    },
    precommit: {
      title: "Pre-commit hooks",
      where: "repository root, runs on every git commit",
      summary: "A small config that runs scanners (secrets, private keys, huge files) before a commit is even created.",
      points: [
        "Install once with pre-commit install; hooks run on the staged files only.",
        "Developers can bypass hooks with --no-verify, so repeat the check in CI.",
        "Keep hooks fast, a few seconds at most. Slow hooks get disabled.",
      ],
    },
    "signed-commits": {
      title: "Signed commits",
      summary: "A cryptographic signature proves who authored a commit, instead of trusting a name typed into git config.",
      points: [
        "Sign with an SSH key, GPG or Sigstore gitsign; GitHub shows a Verified badge.",
        "Branch rules can require signed commits.",
        "A signature proves authorship, not that the code is safe.",
      ],
    },
    repo: {
      title: "Git repository",
      where: "GitHub: repository settings and the .github folder",
      summary: "The source of truth. It holds the code, the pipeline definitions and the rules about who may change them.",
      points: [
        "Whoever can change the workflow files controls what runs with your secrets.",
        "Protect the default branch and treat .github/ as production code.",
        "Almost everything here is configuration you can review in a pull request.",
      ],
    },
    "branch-protection": {
      title: "Branch protection",
      where: "GitHub, Settings, Branches (or rulesets)",
      summary: "Rules for the main branch: required reviews, required status checks and no force-pushes.",
      points: [
        "Require at least one review and block approving your own change.",
        "Make the scanner jobs required status checks, so a failed scan blocks the merge.",
        "Include administrators, or the rule has a back door.",
      ],
    },
    codeowners: {
      title: "CODEOWNERS",
      summary: "A file that maps paths to the people or teams who must approve changes to them.",
      points: [
        "Put pipelines, authentication code and infrastructure under the security team.",
        "Combine it with branch protection: require review from code owners.",
        "Name teams, not individuals, so it survives people changing jobs.",
      ],
    },
    dependabot: {
      title: "Automated updates",
      summary: "A bot opens pull requests when dependencies, actions or base images have new versions.",
      points: [
        "Cover every ecosystem you use, including github-actions and docker.",
        "Small, frequent updates are easier to review than a yearly jump.",
        "Security updates are separate from version updates and should be merged fast.",
      ],
    },
    "secret-push": {
      title: "Push protection",
      where: "GitHub, Settings, Code security",
      summary: "The server refuses a push that contains a recognised secret, before it lands in the history.",
      points: [
        "It blocks known token formats from the major providers.",
        "A leaked secret still counts as leaked: rotate it even if you removed the commit.",
        "It complements scanning in CI, which can look for your own custom patterns.",
      ],
    },
    ci: {
      title: "CI workflow",
      summary:
        "One YAML file in the repository tells GitHub Actions what to run on every change. The security checks live right here, next to the build.",
      points: [
        "The file is code: review it, give it an owner and limit what it can do.",
        "Each job runs on its own machine, with its own permissions and secrets.",
        "Open the branches below to see the checks and the classic mistakes.",
      ],
    },
    "ci-trigger": {
      title: "Triggers",
      summary: "The on: block decides who can start a run and with what privileges. Some triggers run untrusted code with trusted secrets.",
      points: [
        "pull_request runs fork code with a read-only token and no secrets, which is safe by default.",
        "pull_request_target and workflow_run run in the context of the base repository, with secrets and a write token.",
        "Never check out and run pull request code from a privileged trigger.",
      ],
    },
    "ci-permissions": {
      title: "Token permissions",
      summary: "Every run gets a GITHUB_TOKEN. Its scope decides how much damage a compromised step can do.",
      points: [
        "Set permissions to contents: read at the top, then grant more per job.",
        "write-all hands every step, third-party actions included, full write access.",
        "Prefer short-lived OIDC credentials over stored cloud keys.",
      ],
    },
    "ci-pinning": {
      title: "Pinned actions",
      summary: "uses: points at someone else's code. A moving tag or branch means that code can change under you.",
      points: [
        "Pin third-party actions to a full 40-character commit SHA and keep the version in a comment.",
        "Tags can be moved, and a branch such as main changes with every push.",
        "Dependabot can bump pinned SHAs for you.",
      ],
    },
    "ci-injection": {
      title: "Script injection",
      summary: "Expressions in double braces are pasted into the shell script before it runs, so attacker-controlled text becomes commands.",
      points: [
        "Pull request titles, branch names, issue bodies and commit messages are attacker-controlled.",
        "Pass the value through an environment variable and quote it in the script.",
        "Better still, use an action or script file that takes the value as an argument.",
      ],
    },
    sast: {
      title: "SAST",
      summary: "Static analysis reads the source code without running it and flags insecure patterns such as injection or unsafe deserialization.",
      points: [
        "It runs on every pull request, so findings appear where the code is reviewed.",
        "It sees code paths, not the running app, so expect false positives that need triage.",
        "Start with a small, high-confidence ruleset and grow it.",
      ],
    },
    "sast-tool": {
      title: "CodeQL or Semgrep",
      summary: "Two common engines: CodeQL queries a database built from your code, while Semgrep matches patterns and is quick to customise.",
      points: [
        "Upload results as SARIF so they show up in the Security tab and on the pull request.",
        "The security-extended suites find more, at the price of more noise.",
        "Write a custom rule for patterns that are specific to your codebase.",
      ],
    },
    "sast-triage": {
      title: "Triaging a finding",
      summary: "A finding is a question, not a verdict. Someone has to decide whether it is real, reachable and worth fixing now.",
      points: [
        "Follow the data flow from source to sink: can attacker input actually get there?",
        "Mark false positives with a reason, so the same alert never comes back.",
        "Fix the real ones in the same pull request and track the rest with an owner and a due date.",
      ],
    },
    "sast-gate": {
      title: "Quality gate",
      summary: "A rule that turns findings into a decision: block the merge, warn, or just record.",
      points: [
        "Block only on new high-severity findings; do not fail builds because of old debt.",
        "Roll out in warn mode first, then enforce once the noise is under control.",
        "Make the gate a required status check, otherwise it is only a suggestion.",
      ],
    },
    sca: {
      title: "Dependency scanning",
      summary: "Software composition analysis checks the libraries you use against databases of known vulnerabilities and licences.",
      points: [
        "Most of your running code is someone else's, so scan the lockfile and not only the manifest.",
        "Dependency review on a pull request catches a bad package before it is merged.",
        "Look at reachability and fix availability before panicking about every CVE.",
      ],
    },
    "secrets-scan": {
      title: "Secrets scanning",
      summary: "Searches the code and its history for API keys, tokens and private keys that should never be committed.",
      points: [
        "Scan the full history once, then every new commit.",
        "A found secret is compromised: revoke and rotate first, clean the history second.",
        "Use a secrets manager so the code only holds a reference.",
      ],
    },
    "iac-scan": {
      title: "IaC scanning",
      summary: "Reads Terraform, Kubernetes manifests and Dockerfiles for risky settings before anything is created.",
      points: [
        "It catches public buckets, open security groups and privileged containers at review time.",
        "The same rules can run locally, in CI and again at deploy time.",
        "Treat the policy files as code, with owners and tests.",
      ],
    },
    build: {
      title: "Build and artifact",
      summary: "The pipeline turns source into something that can run, usually a container image, and stores it.",
      points: [
        "What you scan, sign and deploy should be the exact same artifact, identified by its digest.",
        "Builds should be reproducible and run on clean, short-lived runners.",
        "Evidence about the artifact (signature, SBOM, provenance) travels with it.",
      ],
    },
    dockerfile: {
      title: "Dockerfile",
      summary: "The recipe for the image. Small choices here decide how big the attack surface is.",
      points: [
        "Use a pinned, minimal base image and a multi-stage build.",
        "Run as a non-root user and keep secrets out of the layers.",
        "Scan the image, not only the code: the base layers have vulnerabilities too.",
      ],
    },
    registry: {
      title: "Registry and signing",
      where: "container registry (GHCR, ECR and similar)",
      summary: "The image is pushed to a registry and signed, so later stages can verify who built it.",
      points: [
        "Reference images by digest, not by a mutable tag.",
        "Keyless signing with Sigstore uses the workflow's OIDC identity, so there is no private key to leak.",
        "Verification only helps if something enforces it at deploy time.",
      ],
    },
    sbom: {
      title: "SBOM and provenance",
      summary: "An SBOM lists every component inside the artifact; provenance records how and where it was built.",
      points: [
        "When a new CVE lands, the SBOM answers whether you are affected in minutes.",
        "Attach both to the image as signed attestations.",
        "SLSA levels describe how trustworthy the build process itself is.",
      ],
    },
    deploy: {
      title: "Deploy",
      summary: "The change is released to an environment. Access here is the most valuable thing an attacker can reach.",
      points: [
        "Production deploys should use short-lived credentials and need an approval.",
        "The same artifact moves from staging to production; do not rebuild it.",
        "Infrastructure changes deserve the same review as application code.",
      ],
    },
    envs: {
      title: "Environments and approvals",
      summary: "Deployment environments hold secrets, required reviewers and branch rules, separate from the code.",
      points: [
        "Scope secrets to the environment so a test job cannot read production ones.",
        "Require reviewers for production and restrict which branches can deploy.",
        "Use OIDC to assume a cloud role instead of storing long-lived keys.",
      ],
    },
    iac: {
      title: "Infrastructure as code",
      summary: "Servers, networks and permissions are defined in files and applied by the pipeline.",
      points: [
        "Run plan on the pull request and review the diff, not only the code.",
        "Check the plan against policy before it is applied.",
        "Keep state files private: they can contain secrets.",
      ],
    },
    admission: {
      title: "Admission policy",
      where: "Kubernetes cluster, admission controller",
      summary: "The cluster itself refuses workloads that break the rules, such as unsigned images or privileged pods.",
      points: [
        "This is the last gate: it works even if someone bypasses the pipeline.",
        "Start in audit mode, then switch to enforce.",
        "Verifying signatures here closes the loop with the signing step.",
      ],
    },
    runtime: {
      title: "Runtime",
      summary: "The service is live and facing real traffic. Prevention is never perfect, so this stop is about blocking, seeing and responding.",
      points: [
        "Assume something will get through, and make sure you would notice.",
        "Runtime controls protect the app while a real fix is still being built.",
        "What you learn here feeds back into the earlier stops.",
      ],
    },
    waf: {
      title: "WAF and edge",
      where: "CDN or load balancer in front of the app",
      summary: "A web application firewall filters hostile requests before they reach the app.",
      points: [
        "Good for virtual patching while a real fix is built.",
        "Start in log-only mode and tune before you block.",
        "It reduces risk; it does not replace fixing the code.",
      ],
    },
    "runtime-secrets": {
      title: "Secrets manager",
      where: "cloud secrets manager or vault",
      summary: "The app fetches credentials at runtime from a managed store, instead of reading them from files or variables baked into the image.",
      points: [
        "Rotate automatically and give each workload access to only its own secrets.",
        "Audit logs show who read what, and when.",
        "Short-lived, scoped credentials limit the damage of a leak.",
      ],
    },
    detect: {
      title: "Detection and logging",
      where: "log pipeline and SIEM",
      summary: "Logs, metrics and alerts show what the system is doing, so an attack becomes visible instead of silent.",
      points: [
        "Log security events (logins, permission changes, deploys) in one central place.",
        "Alerts need an owner and a runbook, or they become noise.",
        "Test your detections with realistic attack steps.",
      ],
    },
    feedback: {
      title: "Feedback loop",
      summary: "What the runtime and the scanners find goes back to the start: a ticket, a fix, a new rule, a better pipeline.",
      points: [
        "Track time to fix, not just the number of findings.",
        "Turn each incident into a check, so it cannot happen the same way twice.",
        "Share findings with developers in the tools they already use.",
      ],
    },
  } satisfies Record<string, NodeText>,

  missions: {
    "follow-commit": {
      title: "Follow a commit",
      intro: "Walk the whole route from a laptop to production, one stop at a time.",
    },
    "stop-leaks": {
      title: "Stop a secret leak",
      intro: "Find every place a leaked key can be caught, from the laptop to the live app.",
    },
    "harden-pipeline": {
      title: "Harden the pipeline",
      intro: "Spot the risky lines in the four classic CI mistakes.",
    },
    "trust-dependencies": {
      title: "Trust your dependencies",
      intro: "From the update bot to the cluster gate: how a risky package is stopped.",
    },
  },

  challenges: {
    "ci-trigger": {
      prompt: "This workflow runs for pull requests from forks. Which lines make it dangerous?",
      why: "pull_request_target runs with the base repository's secrets and a write token (line 3). Checking out the pull request's head commit (line 10) and then running it means an outside contributor's code executes with those privileges. Use pull_request for untrusted code, or split the work so privileged steps never run it.",
      hint: "Two lines: the trigger, and where untrusted code is fetched.",
    },
    "ci-permissions": {
      prompt: "A release workflow only needs to publish a package. Which line grants far more than that?",
      why: "permissions: write-all gives every step, third-party actions included, write access to the repository, packages, issues and more. Declare contents: read globally and add only what each job needs.",
      hint: "One line.",
    },
    "ci-pinning": {
      prompt: "Which steps use a reference that can change without you noticing?",
      why: "A branch (line 6) moves with every push, and a version tag (line 7) can be re-pointed by its owner, or by an attacker who takes over the repository. Only the full commit SHA on line 5 is immutable.",
      hint: "One is a branch, one is a tag.",
    },
    "ci-injection": {
      prompt: "Which step lets a pull request title run as shell commands?",
      why: "On line 6 the expression is substituted into the script text before the shell runs it, so a title that contains shell syntax becomes part of the command. Lines 7 to 9 pass the title as an environment variable, which the shell treats as plain data.",
      hint: "Look for an expression inside run.",
    },
    dockerfile: {
      prompt: "Which lines make this image less safe?",
      why: "latest is an unpinned, moving base (line 1). ADD from a URL downloads unverified code at build time (line 4). A password in ENV is stored in the image layers, readable by anyone who can pull it (line 6). There is also no USER instruction, so the process runs as root.",
      hint: "Three lines: a base tag, a download and a secret.",
    },
  } satisfies Record<string, ChallengeText>,
};

export type ExploreText = typeof exploreText;
