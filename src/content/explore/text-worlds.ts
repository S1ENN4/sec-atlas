// Prose for the cloud, SOC and web-app worlds (English source; pt/es are overlays).
import type { ChallengeText, NodeText } from "./text";

export const worldsNodes = {
  // ---- cloud ---------------------------------------------------------------
  cloud: {
    title: "Cloud security",
    summary: "In the cloud, almost everything is an API call. This map follows who can do what, where it can run, and how you would know.",
    points: [
      "Identity is the new perimeter: a stolen key beats any firewall.",
      "Most cloud breaches are misconfigurations, not exotic exploits.",
      "Guardrails and logging catch what individual teams miss.",
    ],
  },
  "c-identity": {
    title: "Identity and access",
    summary: "Who or what can call which API. This is where most cloud incidents begin and where the cheapest fixes live.",
    points: [
      "Every human and every workload should have its own identity.",
      "Permissions are code too: review them like code.",
      "Short-lived credentials beat long-lived keys.",
    ],
  },
  "c-iam-policies": {
    title: "IAM policies",
    summary: "A JSON document that says which actions are allowed on which resources. Wildcards are convenient and dangerous.",
    points: [
      "Name the exact actions and the exact resources.",
      "Deny rules and conditions can narrow a broad grant.",
      "A policy that works is not necessarily a policy that is safe.",
    ],
  },
  "c-roles": {
    title: "Roles and short-lived credentials",
    summary: "Workloads assume a role and receive temporary credentials, so there is no static key to leak.",
    points: [
      "Prefer roles over IAM users with access keys.",
      "Federate people through single sign-on instead of local users.",
      "Limit who may assume a role with trust policies and conditions.",
    ],
  },
  "c-mfa": {
    title: "MFA and the root account",
    summary: "The most powerful identity in an account needs the strongest protection.",
    points: [
      "Lock the root account away: strong MFA, no access keys, used only for rare tasks.",
      "Require MFA for people, with phishing-resistant methods where possible.",
      "Alert on any use of the root account.",
    ],
  },
  "c-least-priv": {
    title: "Least privilege in practice",
    summary: "Start narrow and widen with evidence, instead of starting wide and hoping to tighten later.",
    points: [
      "Use access analysis to see which permissions are never used.",
      "Remove unused roles and keys on a schedule.",
      "Separate duties: the person who deploys is not the person who approves.",
    ],
  },
  "c-network": {
    title: "Network",
    summary: "Where traffic may flow. Good network design limits how far an attacker can move once inside.",
    points: [
      "Default to deny and open only what a service needs.",
      "Keep sensitive systems off the public internet.",
      "Network rules complement identity rules; they do not replace them.",
    ],
  },
  "c-vpc": {
    title: "Segmentation",
    summary: "Split the network into separate zones so a compromise in one does not reach everything.",
    points: [
      "Separate public, application and data subnets.",
      "Use separate accounts or projects for production and development.",
      "Control traffic between zones, not only in and out.",
    ],
  },
  "c-sg": {
    title: "Security groups",
    summary: "Stateful firewall rules attached to workloads. A single rule opened to the whole internet is a common way in.",
    points: [
      "Open management ports (SSH, RDP) to nobody, or to a tiny trusted range.",
      "Prefer a managed session service over a public bastion.",
      "Review rules that allow 0.0.0.0/0 on anything but web ports.",
    ],
  },
  "c-endpoints": {
    title: "Private endpoints",
    summary: "Reach cloud services over the private network instead of the public internet.",
    points: [
      "Traffic to storage and databases stays inside your network.",
      "Endpoint policies can restrict which resources are reachable.",
      "It reduces exposure, but still needs identity controls.",
    ],
  },
  "c-data": {
    title: "Data",
    summary: "What you are really protecting. Storage mistakes are the classic cloud headline.",
    points: [
      "Know where sensitive data lives.",
      "Block public access by default, at the account level.",
      "Encrypt, but remember encryption does not fix bad access rules.",
    ],
  },
  "c-buckets": {
    title: "Object storage",
    summary: "Buckets are easy to create and easy to expose. Public access blocks are the safety net.",
    points: [
      "Turn on every public access block, ideally for the whole account.",
      "Use policies and presigned links instead of public buckets.",
      "Log access to buckets that hold sensitive data.",
    ],
  },
  "c-encryption": {
    title: "Encryption and keys",
    summary: "Data encrypted at rest and in transit, with keys you control and can audit.",
    points: [
      "Use a managed key service and separate key admins from key users.",
      "Rotate keys and log every use.",
      "Encryption protects against lost disks and some insiders, not against a stolen identity.",
    ],
  },
  "c-backups": {
    title: "Backups and recovery",
    summary: "The best answer to ransomware or a deleted account is a backup the attacker cannot touch.",
    points: [
      "Keep copies in a separate account with write-once or versioned storage.",
      "Test restores, not only backups.",
      "Protect backup deletion as carefully as production.",
    ],
  },
  "c-workloads": {
    title: "Workloads",
    summary: "The code that runs: virtual machines, containers and functions. They inherit the identity and network you give them.",
    points: [
      "Run with the least identity and the narrowest network possible.",
      "Treat images as supply chain: know where they came from.",
      "Patch or replace, do not hand-edit running servers.",
    ],
  },
  "c-pod": {
    title: "Pod security",
    summary: "Settings in a Kubernetes pod decide how much of the node a container can touch.",
    points: [
      "Privileged containers and host networking remove the isolation you rely on.",
      "Run as a non-root user and drop capabilities.",
      "Enforce these rules with an admission policy, not with good intentions.",
    ],
  },
  "c-image-trust": {
    title: "Image trust",
    summary: "Only run images you built, scanned and signed.",
    points: [
      "Pull from your own registry and pin by digest.",
      "Verify signatures when the workload is admitted.",
      "Rebuild regularly to pick up base image fixes.",
    ],
  },
  "c-visibility": {
    title: "Logging and detection",
    summary: "You cannot respond to what you cannot see. Cloud audit logs record who did what.",
    points: [
      "Turn on audit logging everywhere and store it somewhere attackers cannot edit.",
      "Detect risky API calls, not only network traffic.",
      "Review posture continuously, not once a year.",
    ],
  },
  "c-cloudtrail": {
    title: "Audit trail",
    summary: "A record of every API call: who, from where, and what changed.",
    points: [
      "Enable it for all regions and all accounts, centrally.",
      "Turn on log file validation so tampering is detectable.",
      "Send logs to a separate, locked-down account.",
    ],
  },
  "c-cspm": {
    title: "Posture management",
    summary: "A scanner that compares your real configuration with a benchmark and flags the drift.",
    points: [
      "Catches public buckets, open ports and missing encryption fast.",
      "Prioritise findings by exposure and data sensitivity.",
      "Fix at the source (the infrastructure code), not by hand.",
    ],
  },
  "c-alerts": {
    title: "Alerts on risky calls",
    summary: "Some API calls deserve an immediate human look: disabling logging, creating keys, opening a bucket.",
    points: [
      "Start with a short list of high-signal events.",
      "Give each alert an owner and a runbook.",
      "Test the alert by causing the event in a safe account.",
    ],
  },
  "c-guardrails": {
    title: "Guardrails",
    summary: "Rules set at the organisation level that no single team can switch off.",
    points: [
      "Guardrails prevent; posture tools detect.",
      "Keep them few, clear and well tested.",
      "Give teams a safe path (paved road) so guardrails feel helpful.",
    ],
  },
  "c-scp": {
    title: "Service control policies",
    summary: "Organisation-wide limits on what accounts may ever do, whatever their own policies say.",
    points: [
      "Block regions you do not use, and block turning off logging.",
      "An SCP never grants access; it only caps it.",
      "Roll out in a test group first: a wrong deny can break production.",
    ],
  },
  "c-iac-policy": {
    title: "Policy as code",
    summary: "Rules written as code and checked in the pipeline before infrastructure is created.",
    points: [
      "The same rule can run on a pull request and in the cluster.",
      "Give clear failure messages so developers can fix things alone.",
      "Version and test the rules like any other code.",
    ],
  },

  // ---- SOC -----------------------------------------------------------------
  soc: {
    title: "From signal to response",
    summary: "The life of an alert in a security operations centre: collect, detect, triage, investigate, contain and learn.",
    points: [
      "Each stage feeds the next, and the last feeds the first.",
      "Speed matters, but so does being right.",
      "Open a stop to see what happens there.",
    ],
  },
  "s-telemetry": {
    title: "Telemetry",
    summary: "The raw signals: logs, network data and endpoint events. Detection is only as good as the data behind it.",
    points: [
      "Collect what you would need to answer a question later.",
      "Quality and consistent time stamps matter more than volume.",
      "Know your blind spots.",
    ],
  },
  "s-logs": {
    title: "What to collect",
    summary: "Authentication, process execution, network flows, cloud audit logs and application errors cover most investigations.",
    points: [
      "Start from the questions an investigator asks, then work back to the logs.",
      "Keep enough history to cover slow attacks.",
      "Protect the logs from the people being logged.",
    ],
  },
  "s-edge": {
    title: "Edge telemetry",
    summary: "CDN, WAF and load balancer logs show attacks before they reach the application.",
    points: [
      "Good for spotting scans, bots and application-layer floods.",
      "Combine with application logs to see what got through.",
      "Sample carefully: rare events are the interesting ones.",
    ],
  },
  "s-normalize": {
    title: "Normalise and enrich",
    summary: "Map different sources to common field names and add context such as asset owner and user role.",
    points: [
      "A shared schema lets one rule work across many sources.",
      "Enrichment turns an IP address into who and what it is.",
      "Keep the original event so nothing is lost.",
    ],
  },
  "s-detect": {
    title: "Detection engineering",
    summary: "Writing, testing and maintaining the rules that turn telemetry into alerts.",
    points: [
      "Treat detections as code: version, review, test.",
      "Every rule needs a reason, an owner and a response.",
      "Measure what a rule catches and what it costs in noise.",
    ],
  },
  "s-sigma": {
    title: "A detection rule",
    summary: "Sigma is a vendor-neutral format for describing what to look for in logs, which can be translated to many platforms.",
    points: [
      "A rule has a log source, selection logic and a condition.",
      "Document known false positives right in the rule.",
      "The level should reflect how confident and how serious a match is.",
    ],
  },
  "s-tuning": {
    title: "Tuning",
    summary: "Reducing false positives without blinding yourself.",
    points: [
      "Exclude narrow, well-understood cases instead of loosening the whole rule.",
      "Track alert volume and the share that turn out to matter.",
      "Retire rules that never help.",
    ],
  },
  "s-coverage": {
    title: "Coverage and ATT&CK",
    summary: "Map your detections to attacker techniques to see what you would miss.",
    points: [
      "Coverage is not the same as quality: one weak rule per technique is thin.",
      "Prioritise techniques that threat intelligence says are used against you.",
      "Test with emulation to confirm rules actually fire.",
    ],
  },
  "s-triage": {
    title: "Triage",
    summary: "Deciding quickly whether an alert is real, how serious it is and who should handle it.",
    points: [
      "Fast and consistent beats perfect.",
      "Good context cuts triage time sharply.",
      "Escalate early when impact is unclear.",
    ],
  },
  "s-severity": {
    title: "Severity and priority",
    summary: "Severity says how bad it could be; priority says what to do first, given everything else on the queue.",
    points: [
      "Combine asset value, confidence and attacker progress.",
      "Agree the scale in advance so people do not argue during an incident.",
      "Revisit severity as new facts arrive.",
    ],
  },
  "s-context": {
    title: "Context and enrichment",
    summary: "Who owns this asset? Is it new? Has this user done this before? Is the indicator known?",
    points: [
      "Pull context automatically into the alert.",
      "Threat intelligence is a clue, not a verdict.",
      "Ask the asset owner when the logs cannot answer.",
    ],
  },
  "s-runbooks": {
    title: "Runbooks",
    summary: "Written steps for common situations, so response is calm, consistent and fast.",
    points: [
      "Put the order of steps in the document, because order matters.",
      "Preserve evidence before you change anything.",
      "Review runbooks after every real incident.",
    ],
  },
  "s-investigate": {
    title: "Investigation",
    summary: "Working out what happened, how far it went and how it got in.",
    points: [
      "Build a timeline from several sources.",
      "Keep notes and evidence as you go.",
      "Separate facts from guesses.",
    ],
  },
  "s-timeline": {
    title: "Timeline analysis",
    summary: "Ordering events from many systems in one sequence reveals the story.",
    points: [
      "Normalise time zones and clock drift first.",
      "Look for the earliest event, not only the loudest one.",
      "Write the timeline down for the report.",
    ],
  },
  "s-hunt": {
    title: "Threat hunting",
    summary: "Proactively searching for activity that detections missed, driven by a hypothesis.",
    points: [
      "Start from how an attacker would behave, not from a tool.",
      "Every hunt should end in a finding or a new detection.",
      "Document what you looked at, even when you found nothing.",
    ],
  },
  "s-forensics": {
    title: "Forensics basics",
    summary: "Collecting and handling evidence so it can be trusted later.",
    points: [
      "Capture volatile data (memory, connections) before powering off.",
      "Work on copies and record who touched what and when.",
      "Hash evidence so changes are detectable.",
    ],
  },
  "s-contain": {
    title: "Containment",
    summary: "Stopping the damage from spreading, without destroying the evidence you need.",
    points: [
      "Contain first, eradicate later.",
      "Pick the least disruptive action that works.",
      "Coordinate with the business before taking systems offline.",
    ],
  },
  "s-isolate": {
    title: "Isolating a host",
    summary: "Cut the machine from the network while keeping it powered on and available to investigators.",
    points: [
      "Endpoint tools can quarantine a host in seconds.",
      "Leave the host running to keep memory intact.",
      "Tell the user, and offer a replacement.",
    ],
  },
  "s-creds": {
    title: "Credentials and sessions",
    summary: "If an account may be compromised, assume its secrets are too.",
    points: [
      "Revoke sessions and tokens, then reset passwords and keys.",
      "Rotate any secret the host could read.",
      "Review what the account did before it was cut off.",
    ],
  },
  "s-ransom": {
    title: "Ransomware",
    summary: "A special case where speed, backups and communication decide the outcome.",
    points: [
      "Isolate quickly, and protect backups and identity systems first.",
      "Do not wipe systems before capturing evidence.",
      "Have decision makers and legal involved early.",
    ],
  },
  "s-learn": {
    title: "Lessons and metrics",
    summary: "Closing the loop so the next incident is smaller.",
    points: [
      "Hold a blameless review soon after the incident.",
      "Turn lessons into detections, runbooks and fixes.",
      "Track a few metrics that reflect speed and quality.",
    ],
  },
  "s-postmortem": {
    title: "Blameless review",
    summary: "A structured look at what happened and why, focused on systems rather than people.",
    points: [
      "Describe the timeline, the impact and what helped or hurt.",
      "End with owned, dated actions.",
      "Share it widely, so other teams learn too.",
    ],
  },
  "s-metrics": {
    title: "Metrics that matter",
    summary: "Time to detect and time to respond show how well the machine works.",
    points: [
      "Measure median and slowest cases, not only the average.",
      "Pair speed with quality, such as how many alerts were real.",
      "Use targets to guide improvement, never to punish.",
    ],
  },

  // ---- web app -------------------------------------------------------------
  webapp: {
    title: "A web request, hop by hop",
    summary: "Follow a request from the browser to the data and back. At each hop sits a different class of weakness from the OWASP Top 10.",
    points: [
      "The same request crosses many trust boundaries.",
      "Each hop needs its own defence; no single layer is enough.",
      "Open a hop to see the risk and spot it in code.",
    ],
  },
  "w-browser": {
    title: "Browser",
    summary: "The client runs code and holds sessions. Anything the user can change, an attacker can change too.",
    points: [
      "Never trust input that comes from the client.",
      "Browser defences (CSP, cookies flags) limit the damage of mistakes.",
      "Output must be encoded for where it is placed.",
    ],
  },
  "w-xss": {
    title: "Cross-site scripting",
    summary: "Attacker-controlled text gets interpreted as markup or script in another user's browser.",
    points: [
      "Insert text with textContent, not as HTML.",
      "Encode output for its context (HTML, attribute, URL, script).",
      "A strict content security policy is a strong second layer.",
    ],
  },
  "w-csrf": {
    title: "Cross-site request forgery",
    summary: "A malicious page makes the browser send a request that carries the victim's cookies.",
    points: [
      "SameSite cookies stop most cases by default.",
      "Add anti-forgery tokens for state-changing requests.",
      "Never change state with GET requests.",
    ],
  },
  "w-headers": {
    title: "Security headers",
    summary: "Response headers that tell the browser which protections to enforce.",
    points: [
      "CSP limits where scripts and frames may load from.",
      "HSTS makes the browser insist on HTTPS.",
      "nosniff and a strict referrer policy remove small leaks.",
    ],
  },
  "w-edge": {
    title: "Edge and gateway",
    summary: "The first server the request meets: TLS termination, caching, rate limits and filtering.",
    points: [
      "A good place for broad, cheap protections.",
      "It cannot know your business rules.",
      "Make sure nothing can reach the app by skipping the edge.",
    ],
  },
  "w-tls": {
    title: "TLS",
    summary: "Encryption in transit between the browser and the server, and between internal services too.",
    points: [
      "Use modern versions and let certificates renew automatically.",
      "Redirect to HTTPS and use HSTS.",
      "Do not skip certificate checks in internal clients.",
    ],
  },
  "w-ratelimit": {
    title: "Rate limiting",
    summary: "Limits on how fast a client may call, which slows guessing, scraping and abuse.",
    points: [
      "Limit by account and by address, not only by address.",
      "Be stricter on login, reset and expensive endpoints.",
      "Return clear errors so good clients can back off.",
    ],
  },
  "w-waf": {
    title: "Web application firewall",
    summary: "Filters known-bad request patterns before they reach the app.",
    points: [
      "Useful for virtual patching and bot noise.",
      "Tune in log-only mode first.",
      "It is a net, not a substitute for secure code.",
    ],
  },
  "w-auth": {
    title: "Authentication and sessions",
    summary: "Proving who the user is and remembering it safely across requests.",
    points: [
      "Offer MFA and protect against credential stuffing.",
      "Sessions need expiry, rotation and safe cookies.",
      "Handle password reset as carefully as login.",
    ],
  },
  "w-passwords": {
    title: "Passwords and login",
    summary: "Store only slow hashes, and make guessing expensive.",
    points: [
      "Use a modern password hashing function with a unique salt.",
      "Block known-breached passwords and throttle attempts.",
      "Give the same response whether or not the account exists.",
    ],
  },
  "w-session": {
    title: "Session cookies",
    summary: "The cookie that keeps a user logged in is worth as much as the password while it lasts.",
    points: [
      "Secure keeps it on HTTPS, HttpOnly hides it from scripts.",
      "SameSite limits cross-site sending.",
      "Short lifetimes and server-side revocation limit theft.",
    ],
  },
  "w-jwt": {
    title: "Tokens (JWT)",
    summary: "Signed tokens carry claims between services. They are easy to misuse.",
    points: [
      "Always verify the signature and the algorithm you expect.",
      "Keep lifetimes short and plan for revocation.",
      "Do not put secrets in a token: it is signed, not hidden.",
    ],
  },
  "w-app": {
    title: "Application logic",
    summary: "Where your own rules live, and where most serious bugs are found.",
    points: [
      "Check authorisation on every request, on the server.",
      "Keep data separate from code and commands.",
      "Fail safely and do not leak details in errors.",
    ],
  },
  "w-idor": {
    title: "Broken access control",
    summary: "The app returns a record because the id was valid, without asking whether this user may see it.",
    points: [
      "Authentication is not authorisation: check ownership every time.",
      "Filter queries by the current user, so the wrong row never loads.",
      "Test with two accounts and swap the ids.",
    ],
  },
  "w-sqli": {
    title: "Injection",
    summary: "Untrusted input becomes part of a query or command, and the interpreter obeys it.",
    points: [
      "Use parameterised queries, never string concatenation.",
      "Validate input as a second line of defence.",
      "The same idea applies to shells, LDAP, templates and more.",
    ],
  },
  "w-design": {
    title: "Insecure design",
    summary: "Some flaws are not bugs but missing thinking: a flow that was never meant to resist abuse.",
    points: [
      "Model threats before building the feature.",
      "Write abuse cases next to use cases.",
      "Paved patterns (auth, upload, payments) prevent repeat mistakes.",
    ],
  },
  "w-deser": {
    title: "Integrity failures",
    summary: "Trusting data or code without checking where it came from, such as unsafe deserialization or unsigned updates.",
    points: [
      "Do not deserialize untrusted data into rich objects.",
      "Verify signatures on updates and artifacts.",
      "Protect the pipeline that builds what you ship.",
    ],
  },
  "w-errors": {
    title: "Exceptional conditions",
    summary: "What happens when something goes wrong decides whether it is a nuisance or a vulnerability.",
    points: [
      "Fail closed: on error, deny.",
      "Do not show stack traces or internals to users.",
      "Log the details privately with an id the user can quote.",
    ],
  },
  "w-data": {
    title: "Data and secrets",
    summary: "Where the valuable things live, and the keys that open them.",
    points: [
      "Collect less, keep it shorter.",
      "Encrypt in transit and at rest.",
      "Keep secrets out of code and images.",
    ],
  },
  "w-crypto": {
    title: "Cryptographic failures",
    summary: "Weak or missing encryption, bad key handling, or home-made cryptography.",
    points: [
      "Use well-reviewed libraries and current algorithms.",
      "Never invent your own scheme.",
      "Manage keys separately from the data they protect.",
    ],
  },
  "w-secrets": {
    title: "Secrets management",
    summary: "API keys, passwords and certificates need a home that is not the repository.",
    points: [
      "Fetch secrets at runtime from a managed store.",
      "Rotate regularly and after any suspicion.",
      "Scan for leaks in code and history.",
    ],
  },
  "w-supply": {
    title: "Dependencies and build",
    summary: "Most of the running code is not yours, and neither is every tool that built it.",
    points: [
      "Know what you depend on, and keep it current.",
      "Lock versions and verify what you download.",
      "Treat the build system as a target.",
    ],
  },
  "w-deps": {
    title: "Vulnerable components",
    summary: "A known flaw in a library is a flaw in your app until you update or mitigate it.",
    points: [
      "Scan lockfiles and review updates promptly.",
      "Prefer fewer, well-maintained dependencies.",
      "Keep an SBOM so you can answer which apps are affected.",
    ],
  },
  "w-config": {
    title: "Misconfiguration",
    summary: "Default accounts, open consoles, verbose errors and permissive settings.",
    points: [
      "Harden defaults and remove what you do not use.",
      "Use the same reviewed configuration in every environment.",
      "Scan configuration continuously.",
    ],
  },
  "w-logging": {
    title: "Logging and alerting",
    summary: "Without logs and alerts, an attack can last for months unnoticed.",
    points: [
      "Log logins, access control failures and input validation failures.",
      "Make sure someone is alerted, and knows what to do.",
      "Never log secrets or full personal data.",
    ],
  },
} satisfies Record<string, NodeText>;

export const worldsMissions = {
  "lock-front-door": { title: "Lock the front door", intro: "Fix the classic cloud mistakes: identity, network and storage." },
  "see-everything": { title: "See everything", intro: "Turn on the audit trail, check posture, alert on risky calls and cap what accounts may do." },
  "triage-an-alert": { title: "Triage an alert", intro: "From severity and context to the runbook and a safe containment step." },
  "build-a-detection": { title: "Build a detection", intro: "From the data you collect to a tested, tuned rule." },
  "owasp-walk": { title: "Walk the request", intro: "Follow one request through every hop and meet the OWASP Top 10." },
  "break-the-app": { title: "Break the app", intro: "Find the line that lets an attacker in: script, query and access control." },
};

export const worldsChallenges = {
  "c-iam-policies": {
    prompt: "This policy is attached to a web app's role. Which lines grant far more than the app needs?",
    why: "Action s3:* (line 6) allows every S3 action, including deleting buckets and changing their policies, and Resource * (line 7) applies it to every bucket in the account. Name the few actions needed, such as s3:GetObject, and the exact bucket ARN.",
    hint: "Two lines: an action wildcard and a resource wildcard.",
  },
  "c-sg": {
    prompt: "This group is attached to an internet-facing web server. Which line opens something that should not be public?",
    why: "Line 9 lets the whole internet try to reach SSH on port 22, which invites brute force and exploitation. Use a managed session service, or allow only a VPN or bastion range. Port 443 open to everyone (line 16) is normal for a public web server.",
    hint: "One line, and it is not the web port.",
  },
  "c-buckets": {
    prompt: "This bucket holds customer reports. Which lines remove its safety net?",
    why: "The four public access block settings (lines 7 to 10) are all false, so one wrong ACL or bucket policy can expose every report to the internet. Set all four to true. Encryption (lines 13 to 20) is good but does not stop public reads.",
    hint: "Four lines, all with the same value.",
  },
  "c-pod": {
    prompt: "Which lines should an admission policy reject in this pod?",
    why: "hostNetwork: true (line 6) shares the node's network with the container, privileged: true (line 11) gives it almost full access to the host, and runAsUser: 0 (line 12) runs it as root. Together they make a container escape trivial.",
    hint: "Three lines: network, privilege and user.",
  },
  "s-runbooks": {
    prompt: "This ransomware runbook has steps that destroy evidence or keep the attacker working. Which lines are wrong?",
    why: "Rebooting (line 3) erases memory, where the encryption key and the attacker's tools may still be. Deleting the binary (line 4) destroys evidence before it is captured. Letting the user keep working on an infected machine (line 5) spreads damage. The preserve step should come before any cleanup.",
    hint: "Three steps: one loses memory, one deletes evidence, one keeps the host in use.",
  },
  "w-xss": {
    prompt: "A page greets the visitor using a name from the URL. Which line allows script injection?",
    why: "innerHTML (line 3) parses the string as HTML, so a name such as an image tag with an onerror handler would run script in the visitor's browser. textContent (line 4) treats it as plain text.",
    hint: "Compare the last two lines.",
  },
  "w-idor": {
    prompt: "A logged-in user requests an invoice by id. Which line is missing the safety check?",
    why: "Line 2 loads any invoice by its id. requireLogin only proves who the user is, not that the invoice is theirs, so anyone can read others' invoices by changing the number. Load it with the owner in the filter, for example findOne with the id and the current user.",
    hint: "The route requires login. What does the query not ask?",
  },
  "w-sqli": {
    prompt: "Which line lets a visitor change the meaning of this query?",
    why: "Line 4 pastes the name into the SQL text, so input like a quote followed by an always-true condition changes the query. Use a parameter placeholder and pass the value separately, so the database never reads it as SQL.",
    hint: "Look for string concatenation.",
  },
} satisfies Record<string, ChallengeText>;
