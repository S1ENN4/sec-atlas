import type { QuizBank } from "@/content/types";

export const devopsQuiz: QuizBank = {
  "linux-and-networking": [
    {
      "q": "A service is unreachable. What is the sensible order of checks?",
      "options": [
        "Reinstall the server first, since a clean system removes any hidden cause",
        "Name resolution, port reachability, whether the service listens, certificate validity, then logs",
        "Restart every related service and check whether the symptom goes away",
        "Open the firewall to all traffic and then narrow it down again"
      ],
      "answer": 1,
      "explain": "Work from the outside in and read before you change. Most causes are DNS, certificates, ports or the service itself."
    },
    {
      "q": "Why run a service as its own unprivileged user?",
      "options": [
        "It makes the program faster, because the kernel skips permission checks",
        "A compromise then has only that user's access, not root's",
        "Only root is allowed to open network ports on a modern system",
        "Systemd refuses to start any service that runs as root"
      ],
      "answer": 1,
      "explain": "Least privilege limits the damage of any bug or intrusion."
    },
    {
      "q": "Many strange outages with tokens or certificates come from:",
      "options": [
        "Too much RAM installed on the machine, which confuses the scheduler",
        "Clock skew between machines",
        "Too many log files filling up the disk of the authentication server",
        "A slow disk on the machine that stores the certificates"
      ],
      "answer": 1,
      "explain": "Validity windows depend on the time. Keep clocks synchronized."
    }
  ],
  "git-workflows": [
    {
      "q": "What is the main idea of trunk-based development?",
      "options": [
        "Keep a long-lived branch for every feature and merge each one when it is complete",
        "Merge small, short-lived changes into main often, hiding unfinished work behind flags",
        "Never use branches, so that everyone commits straight to one shared file",
        "Merge only once per release, after a long stabilization period"
      ],
      "answer": 1,
      "explain": "Small frequent merges reduce conflicts and keep main always releasable."
    },
    {
      "q": "What does CODEOWNERS do?",
      "options": [
        "Encrypts the repository so that only the owners can read it",
        "Requests review from the people or teams who own the paths a pull request changes",
        "Deletes old branches that were merged more than 30 days ago",
        "Signs every commit made to the paths owned by each team"
      ],
      "answer": 1,
      "explain": "It encodes ownership so the right reviewers are asked automatically."
    },
    {
      "q": "A secret was committed to the repository and then deleted in the next commit. What must you do?",
      "options": [
        "Nothing: once the file is deleted in a later commit, the secret is gone",
        "Rotate the secret, because it remains in history",
        "Rename the file so that scanners no longer match its name",
        "Force-push the branch without the commit and tell nobody"
      ],
      "answer": 1,
      "explain": "Anyone with a clone or a cached copy can read it. Treat it as exposed."
    }
  ],
  "container-images": [
    {
      "q": "What does a multi-stage Docker build achieve?",
      "options": [
        "Faster downloads from the registry, because layers are fetched in parallel",
        "A smaller runtime image without compilers and dev dependencies",
        "Encrypted layers, so the image cannot be inspected by other users",
        "Automatic scaling of the containers according to the load"
      ],
      "answer": 1,
      "explain": "Build tools stay in the build stage and only what the app needs reaches the final image."
    },
    {
      "q": "Why deploy by image digest instead of a tag?",
      "options": [
        "Digests are shorter and easier to read than a version tag",
        "A tag can move to different content, a digest identifies exact content",
        "Container registries refuse to serve tags that are older than a year",
        "Kubernetes does not support tags in deployment manifests"
      ],
      "answer": 1,
      "explain": "Exactness makes deployments and rollbacks reproducible."
    },
    {
      "q": "Where should an application's persistent state live?",
      "options": [
        "In the container's writable layer, which is kept between restarts",
        "In volumes, databases or object storage outside the container",
        "Inside the image, so every instance starts with the same data",
        "In environment variables that are loaded when the container starts"
      ],
      "answer": 1,
      "explain": "Containers are disposable. State inside one disappears with it."
    }
  ],
  "delivery-lifecycle": [
    {
      "q": "What does \"build once, deploy many\" mean?",
      "options": [
        "Compile the code again for every environment, so that each one gets its own build",
        "The same artifact is promoted through all environments, and only configuration changes",
        "Deploy to many regions at the same time with the same pipeline",
        "Run the build only on Fridays, when the team has time to review it"
      ],
      "answer": 1,
      "explain": "What you tested is exactly what you ship."
    },
    {
      "q": "What is the difference between continuous delivery and continuous deployment?",
      "options": [
        "None: the two terms describe the same practice in different tools",
        "Delivery keeps every change ready to deploy, deployment releases each passing change automatically",
        "Delivery is for databases and deployment is for application code",
        "Deployment requires manual approval for every step, while delivery does not"
      ],
      "answer": 1,
      "explain": "Both automate the path. Deployment also removes the final manual release step."
    },
    {
      "q": "How should DORA measures be used?",
      "options": [
        "As targets used to rank and reward individual developers",
        "As signals for conversations about the delivery system",
        "Only by auditors, who compare them with industry standards",
        "They should be ignored, because delivery cannot be measured"
      ],
      "answer": 1,
      "explain": "A measure that becomes a target gets gamed. Use them to find bottlenecks."
    }
  ],
  "ci-pipelines": [
    {
      "q": "Which ordering gives the fastest useful feedback?",
      "options": [
        "Slowest tests first, so that the most important failures appear early",
        "Cheap checks (lint, unit tests) first, then slower ones",
        "Deploy first and test afterwards, since the pipeline is automated",
        "Random order, so that no check always benefits from running first"
      ],
      "answer": 1,
      "explain": "Fail fast and cheap so people learn quickly."
    },
    {
      "q": "A test fails one run in ten. What is the right response?",
      "options": [
        "Add automatic retries and move on, since the test passes most of the time",
        "Quarantine and fix it, because flaky tests train people to ignore failures",
        "Delete the test, because nobody remembers why it was written",
        "Run it ten times in a row and accept the majority result"
      ],
      "answer": 1,
      "explain": "Retries hide the problem. A pipeline people do not trust stops being a gate."
    },
    {
      "q": "What should the cache for dependencies be keyed on?",
      "options": [
        "The date of the run, so the cache renews itself every day",
        "The lockfile contents",
        "The branch name only, since each branch has its own dependencies",
        "The name of the runner that executes the job"
      ],
      "answer": 1,
      "explain": "The key changes exactly when the dependencies change."
    }
  ],
  "release-strategies": [
    {
      "q": "What is the key advantage of a canary release?",
      "options": [
        "It needs no monitoring, because only a few users see the new version",
        "A bad version reaches only a small share of users before it is caught",
        "It doubles the capacity by running two complete copies at once",
        "It avoids using a database during the rollout"
      ],
      "answer": 1,
      "explain": "Gradual exposure limits the blast radius and gives time to compare metrics."
    },
    {
      "q": "Why make database changes backward compatible (expand, migrate, contract)?",
      "options": [
        "To save disk space by removing columns as soon as they are unused",
        "So that the old and new code both work during a rollout and a rollback is possible",
        "To avoid backups, since old data stays in the new tables",
        "To rename tables more often without affecting the application"
      ],
      "answer": 1,
      "explain": "Schema and code deploy at different times. Compatibility removes the one-way door."
    },
    {
      "q": "What do feature flags separate?",
      "options": [
        "Code and tests, so that the tests can run without the code",
        "Deploying code from releasing a feature",
        "The development and the operations teams, so each can deploy alone",
        "Branches and tags in the version control system"
      ],
      "answer": 1,
      "explain": "You can ship dark and switch on gradually, and off instantly."
    }
  ],
  "infrastructure-as-code": [
    {
      "q": "Why must the Terraform state be stored remotely, locked and encrypted?",
      "options": [
        "It is too large to keep in the same repository as the code",
        "It can contain secrets and concurrent applies can corrupt it",
        "Git cannot store JSON files, which is the state format",
        "State is optional and only used by large teams"
      ],
      "answer": 1,
      "explain": "Remote state with locking avoids races and keeps sensitive values protected."
    },
    {
      "q": "What is the purpose of running terraform plan in a pull request?",
      "options": [
        "To apply the changes to production immediately, without waiting",
        "To let reviewers see exactly what will be created, changed or destroyed",
        "To format and validate the code before it is committed",
        "To download the providers and modules that the code needs"
      ],
      "answer": 1,
      "explain": "The plan is the review artifact. Read what is replaced or destroyed."
    },
    {
      "q": "What is drift?",
      "options": [
        "A syntax error in the configuration files that blocks the apply",
        "Real infrastructure differing from what the code says, usually from manual changes",
        "An apply that takes much longer than the previous ones",
        "A provider upgrade that changes the resources it manages"
      ],
      "answer": 1,
      "explain": "Detect it on a schedule and fix it so the code stays the source of truth."
    }
  ],
  "kubernetes-basics": [
    {
      "q": "What does a readiness probe decide?",
      "options": [
        "Whether the pod is restarted when it stops responding",
        "Whether the pod receives traffic",
        "Which node of the cluster the pod is scheduled to run on",
        "How much memory the pod is allowed to use"
      ],
      "answer": 1,
      "explain": "Readiness controls traffic. Liveness controls restarts."
    },
    {
      "q": "Why set resource requests and limits?",
      "options": [
        "They are decorative fields that the scheduler ignores",
        "Scheduling needs requests, and limits stop one pod from starving its neighbors",
        "They speed up image pulls by reserving network bandwidth",
        "They encrypt the memory used by the container"
      ],
      "answer": 1,
      "explain": "Without them one misbehaving pod can take down others on the node."
    },
    {
      "q": "How should changes normally reach a cluster?",
      "options": [
        "With ad hoc kubectl edit commands made by whoever is on call",
        "Through version control and an automated pipeline or GitOps controller",
        "By connecting to the nodes over SSH and editing the manifests there",
        "Through the web dashboard only, so that every change is logged"
      ],
      "answer": 1,
      "explain": "A reviewed, versioned source of truth makes changes repeatable and reversible."
    }
  ],
  "observability": [
    {
      "q": "What should most alerts be based on?",
      "options": [
        "Every possible cause, such as the CPU use of each pod",
        "Symptoms users feel, such as errors and latency",
        "The volume of logs produced by each service",
        "The free space on each disk in the cluster"
      ],
      "answer": 1,
      "explain": "Alerting on symptoms reduces noise and catches problems whatever their cause."
    },
    {
      "q": "Which signal is the best tool for \"where is this request slow?\"",
      "options": [
        "Metrics, which show how the average latency changes over time",
        "Distributed traces",
        "Billing reports, which show which service costs more",
        "Git history, which shows which commit changed the code last"
      ],
      "answer": 1,
      "explain": "Traces show the path and time spent in each service."
    },
    {
      "q": "Why avoid a metric label such as user id?",
      "options": [
        "It is personal data, and metric systems are not allowed to store it",
        "Unbounded cardinality can overwhelm the metrics system",
        "Labels must be numbers, and an id is a string",
        "Prometheus forbids labels that contain strings"
      ],
      "answer": 1,
      "explain": "Each distinct value creates a new series. Use logs or traces for per-user detail."
    }
  ],
  "sre-reliability": [
    {
      "q": "What is an error budget?",
      "options": [
        "Money set aside to pay for the cost of outages and refunds",
        "The allowed unreliability, 100% minus the SLO",
        "The list of known bugs that the team plans to fix",
        "The schedule that the QA team follows before each release"
      ],
      "answer": 1,
      "explain": "While budget remains, ship; when it is spent, invest in reliability."
    },
    {
      "q": "In an incident, what comes first?",
      "options": [
        "Finding out who caused it, so that the right person can fix it",
        "Mitigating the impact (roll back, fail over, turn off a flag) and then diagnosing",
        "Writing the postmortem while the details are still fresh",
        "Waiting for more data before taking any action"
      ],
      "answer": 1,
      "explain": "Restore service first. Root cause analysis can follow."
    },
    {
      "q": "What defines a blameless postmortem?",
      "options": [
        "No person is mentioned by name in any part of the document",
        "It asks how the system allowed the failure and ends with owned actions, not with punishment",
        "It is never written, so that nobody feels accused",
        "It is kept private and shared only with the managers"
      ],
      "answer": 1,
      "explain": "Blame hides information. Learning needs people to describe what happened honestly."
    }
  ]
};
