import type { QuizBank } from "@/content/types";

export const devopsQuiz: QuizBank = {
  "linux-and-networking": [
    {
      q: "A service is unreachable. What is the sensible order of checks?",
      options: [
        "Reinstall the server first",
        "Name resolution, port reachability, whether the service listens, certificate validity, then logs",
        "Restart everything and hope",
        "Change the firewall to allow all",
      ],
      answer: 1,
      explain: "Work from the outside in and read before you change. Most causes are DNS, certificates, ports or the service itself.",
    },
    {
      q: "Why run a service as its own unprivileged user?",
      options: [
        "It makes the program faster",
        "A compromise then has only that user's access, not root's",
        "Root cannot open network ports",
        "Systemd requires it",
      ],
      answer: 1,
      explain: "Least privilege limits the damage of any bug or intrusion.",
    },
    {
      q: "Many strange outages with tokens or certificates come from:",
      options: ["Too much RAM", "Clock skew between machines", "Too many log files", "A slow keyboard"],
      answer: 1,
      explain: "Validity windows depend on the time. Keep clocks synchronized.",
    },
  ],
  "git-workflows": [
    {
      q: "What is the main idea of trunk-based development?",
      options: [
        "Keep long-lived branches for every feature",
        "Merge small, short-lived changes into main often, hiding unfinished work behind flags",
        "Never use branches",
        "Merge only once per release",
      ],
      answer: 1,
      explain: "Small frequent merges reduce conflicts and keep main always releasable.",
    },
    {
      q: "What does CODEOWNERS do?",
      options: [
        "Encrypts the repository",
        "Requests review from the people or teams who own the paths a pull request changes",
        "Deletes old branches",
        "Signs commits",
      ],
      answer: 1,
      explain: "It encodes ownership so the right reviewers are asked automatically.",
    },
    {
      q: "A secret was committed to the repository and then deleted in the next commit. What must you do?",
      options: [
        "Nothing, it is gone",
        "Rotate the secret, because it remains in history",
        "Rename the file",
        "Force-push and tell nobody",
      ],
      answer: 1,
      explain: "Anyone with a clone or a cached copy can read it. Treat it as exposed.",
    },
  ],
  "container-images": [
    {
      q: "What does a multi-stage Docker build achieve?",
      options: [
        "Faster internet",
        "A smaller runtime image without compilers and dev dependencies",
        "Encrypted layers",
        "Automatic scaling",
      ],
      answer: 1,
      explain: "Build tools stay in the build stage and only what the app needs reaches the final image.",
    },
    {
      q: "Why deploy by image digest instead of a tag?",
      options: [
        "Digests are shorter",
        "A tag can move to different content, a digest identifies exact content",
        "Registries require digests",
        "Tags are not supported in Kubernetes",
      ],
      answer: 1,
      explain: "Exactness makes deployments and rollbacks reproducible.",
    },
    {
      q: "Where should an application's persistent state live?",
      options: [
        "In the container's writable layer",
        "In volumes, databases or object storage outside the container",
        "In the image",
        "In environment variables",
      ],
      answer: 1,
      explain: "Containers are disposable. State inside one disappears with it.",
    },
  ],
  "delivery-lifecycle": [
    {
      q: "What does \"build once, deploy many\" mean?",
      options: [
        "Compile separately for every environment",
        "The same artifact is promoted through all environments, and only configuration changes",
        "Deploy to many regions at once",
        "Build only on Fridays",
      ],
      answer: 1,
      explain: "What you tested is exactly what you ship.",
    },
    {
      q: "What is the difference between continuous delivery and continuous deployment?",
      options: [
        "None",
        "Delivery keeps every change ready to deploy, deployment releases each passing change automatically",
        "Delivery is for databases",
        "Deployment requires manual approval for every step",
      ],
      answer: 1,
      explain: "Both automate the path. Deployment also removes the final manual release step.",
    },
    {
      q: "How should DORA measures be used?",
      options: [
        "As targets to rank individual developers",
        "As signals for conversations about the delivery system",
        "Only by auditors",
        "They should be ignored",
      ],
      answer: 1,
      explain: "A measure that becomes a target gets gamed. Use them to find bottlenecks.",
    },
  ],
  "ci-pipelines": [
    {
      q: "Which ordering gives the fastest useful feedback?",
      options: [
        "Slowest tests first",
        "Cheap checks (lint, unit tests) first, then slower ones",
        "Deploy first, test later",
        "Random order",
      ],
      answer: 1,
      explain: "Fail fast and cheap so people learn quickly.",
    },
    {
      q: "A test fails one run in ten. What is the right response?",
      options: [
        "Add automatic retries and move on",
        "Quarantine and fix it, because flaky tests train people to ignore failures",
        "Delete CI",
        "Run it ten times",
      ],
      answer: 1,
      explain: "Retries hide the problem. A pipeline people do not trust stops being a gate.",
    },
    {
      q: "What should the cache for dependencies be keyed on?",
      options: ["The date", "The lockfile contents", "The branch name only", "The runner name"],
      answer: 1,
      explain: "The key changes exactly when the dependencies change.",
    },
  ],
  "release-strategies": [
    {
      q: "What is the key advantage of a canary release?",
      options: [
        "It needs no monitoring",
        "A bad version reaches only a small share of users before it is caught",
        "It doubles capacity",
        "It avoids databases",
      ],
      answer: 1,
      explain: "Gradual exposure limits the blast radius and gives time to compare metrics.",
    },
    {
      q: "Why make database changes backward compatible (expand, migrate, contract)?",
      options: [
        "To save disk space",
        "So that the old and new code both work during a rollout and a rollback is possible",
        "To avoid backups",
        "To rename tables more often",
      ],
      answer: 1,
      explain: "Schema and code deploy at different times. Compatibility removes the one-way door.",
    },
    {
      q: "What do feature flags separate?",
      options: ["Code and tests", "Deploying code from releasing a feature", "Dev and ops teams", "Branches and tags"],
      answer: 1,
      explain: "You can ship dark and switch on gradually, and off instantly.",
    },
  ],
  "infrastructure-as-code": [
    {
      q: "Why must the Terraform state be stored remotely, locked and encrypted?",
      options: [
        "It is large",
        "It can contain secrets and concurrent applies can corrupt it",
        "Git cannot store JSON",
        "State is optional",
      ],
      answer: 1,
      explain: "Remote state with locking avoids races and keeps sensitive values protected.",
    },
    {
      q: "What is the purpose of running terraform plan in a pull request?",
      options: [
        "To apply changes immediately",
        "To let reviewers see exactly what will be created, changed or destroyed",
        "To format code",
        "To download providers",
      ],
      answer: 1,
      explain: "The plan is the review artifact. Read what is replaced or destroyed.",
    },
    {
      q: "What is drift?",
      options: [
        "A syntax error",
        "Real infrastructure differing from what the code says, usually from manual changes",
        "A slow apply",
        "A provider upgrade",
      ],
      answer: 1,
      explain: "Detect it on a schedule and fix it so the code stays the source of truth.",
    },
  ],
  "kubernetes-basics": [
    {
      q: "What does a readiness probe decide?",
      options: [
        "Whether the pod is restarted",
        "Whether the pod receives traffic",
        "Which node it runs on",
        "How much memory it gets",
      ],
      answer: 1,
      explain: "Readiness controls traffic. Liveness controls restarts.",
    },
    {
      q: "Why set resource requests and limits?",
      options: [
        "They are decorative",
        "Scheduling needs requests, and limits stop one pod from starving its neighbors",
        "They speed up images",
        "They encrypt memory",
      ],
      answer: 1,
      explain: "Without them one misbehaving pod can take down others on the node.",
    },
    {
      q: "How should changes normally reach a cluster?",
      options: [
        "Ad hoc kubectl edit commands",
        "Through version control and an automated pipeline or GitOps controller",
        "By SSH to the nodes",
        "Through the dashboard only",
      ],
      answer: 1,
      explain: "A reviewed, versioned source of truth makes changes repeatable and reversible.",
    },
  ],
  observability: [
    {
      q: "What should most alerts be based on?",
      options: [
        "Every cause, such as one pod's CPU",
        "Symptoms users feel, such as errors and latency",
        "Log volume",
        "Disk color",
      ],
      answer: 1,
      explain: "Alerting on symptoms reduces noise and catches problems whatever their cause.",
    },
    {
      q: "Which signal is the best tool for \"where is this request slow?\"",
      options: ["Metrics", "Distributed traces", "Billing reports", "Git history"],
      answer: 1,
      explain: "Traces show the path and time spent in each service.",
    },
    {
      q: "Why avoid a metric label such as user id?",
      options: [
        "It is private",
        "Unbounded cardinality can overwhelm the metrics system",
        "Labels must be numbers",
        "Prometheus forbids strings",
      ],
      answer: 1,
      explain: "Each distinct value creates a new series. Use logs or traces for per-user detail.",
    },
  ],
  "sre-reliability": [
    {
      q: "What is an error budget?",
      options: [
        "Money set aside for outages",
        "The allowed unreliability, 100% minus the SLO",
        "A list of known bugs",
        "A QA schedule",
      ],
      answer: 1,
      explain: "While budget remains, ship; when it is spent, invest in reliability.",
    },
    {
      q: "In an incident, what comes first?",
      options: [
        "Finding who caused it",
        "Mitigating the impact (roll back, fail over, turn off a flag) and then diagnosing",
        "Writing the postmortem",
        "Waiting for more data",
      ],
      answer: 1,
      explain: "Restore service first. Root cause analysis can follow.",
    },
    {
      q: "What defines a blameless postmortem?",
      options: [
        "Nobody is mentioned",
        "It asks how the system allowed the failure and ends with owned actions, not with punishment",
        "It is never written",
        "It is private to managers",
      ],
      answer: 1,
      explain: "Blame hides information. Learning needs people to describe what happened honestly.",
    },
  ],
};
