import type { QuizBank } from "@/content/types";

export const owaspQuiz: QuizBank = {
  "broken-access-control": [
    {
      q: "A logged-in user changes /api/invoices/1041 to /api/invoices/1042 and sees another customer's invoice. What is the best fix?",
      options: [
        "Hide the invoice links in the user interface",
        "Make the query filter by the owner taken from the session, and return the same 404 for missing and not-yours",
        "Use a longer random id and keep the same query",
        "Block the IP address of the user",
      ],
      answer: 1,
      explain: "Authorization must be enforced on the server for every request. An unguessable id helps, but is not a control.",
    },
    {
      q: "Which default makes a forgotten route safe?",
      options: ["Allow by default", "Deny by default", "Log by default", "Cache by default"],
      answer: 1,
      explain: "With deny by default, a route nobody wrote a rule for is forbidden instead of open.",
    },
    {
      q: "Why is hiding the admin button in the UI not access control?",
      options: [
        "Because buttons are slow",
        "Because attackers call the endpoint directly, so the server must check the role",
        "Because browsers cache buttons",
        "Because it breaks accessibility",
      ],
      answer: 1,
      explain: "The client is under the attacker's control. Only a server-side check counts.",
    },
  ],
  "security-misconfiguration": [
    {
      q: "Which setting is a typical misconfiguration in production?",
      options: ["HSTS enabled", "Debug mode left on, exposing stack traces and a console", "Secrets in a secret manager", "Least-privilege roles"],
      answer: 1,
      explain: "Debug features reveal internals and sometimes allow code execution. Turn them off outside development.",
    },
    {
      q: "How do you catch a regression to an unsafe default most reliably?",
      options: [
        "Read the configuration once a year",
        "Scan infrastructure code and images in CI and fail the build",
        "Ask developers to be careful",
        "Disable the scanners that are noisy",
      ],
      answer: 1,
      explain: "Configuration is code. Automated scanning on every change catches drift early and consistently.",
    },
    {
      q: "Why is a wildcard CORS origin with credentials dangerous?",
      options: [
        "It slows the site down",
        "Any website can make authenticated requests as the visitor and read the answers",
        "It breaks HTTPS",
        "It disables cookies",
      ],
      answer: 1,
      explain: "Origins should be an explicit allow-list when credentials are involved.",
    },
  ],
  "supply-chain-failures": [
    {
      q: "Why should CI actions be pinned to a full commit SHA?",
      options: [
        "SHAs are shorter than tags",
        "A tag or branch can be moved to different code, a commit SHA cannot",
        "It makes the build faster",
        "It is required by Git",
      ],
      answer: 1,
      explain: "Mutable references let an upstream change run in your pipeline, with your secrets, unnoticed.",
    },
    {
      q: "What does an SBOM mainly help you answer?",
      options: [
        "How fast the build is",
        "Whether you are affected when a vulnerability in a component is announced",
        "Who wrote each line of code",
        "Which cloud region is cheapest",
      ],
      answer: 1,
      explain: "An inventory of components turns a long search into a quick query.",
    },
    {
      q: "What is dependency confusion?",
      options: [
        "Using too many libraries",
        "A build pulling a public package that has the same name as an internal one",
        "Two libraries with incompatible licenses",
        "A circular import",
      ],
      answer: 1,
      explain: "Scoped names and a private registry that takes priority prevent the swap.",
    },
  ],
  "cryptographic-failures": [
    {
      q: "Which is the right way to store passwords?",
      options: ["MD5 with a salt", "SHA-256 of the password", "Argon2id, scrypt or bcrypt through a maintained library", "AES encryption with a shared key"],
      answer: 2,
      explain: "Passwords need a slow, salted, purpose-built hash. Encryption is reversible, fast hashes are cheap to brute force.",
    },
    {
      q: "Which source is acceptable for a password-reset token?",
      options: ["Math.random()", "A timestamp", "The operating system's cryptographic random generator", "The user id plus a counter"],
      answer: 2,
      explain: "Security tokens must be unpredictable, which only a CSPRNG guarantees.",
    },
    {
      q: "Why prefer authenticated encryption such as AES-GCM over plain AES-CBC?",
      options: [
        "It is the only one that works with TLS",
        "It detects tampering with the ciphertext",
        "It produces smaller output",
        "It does not need a key",
      ],
      answer: 1,
      explain: "Without authentication an attacker can modify ciphertext and sometimes learn the plaintext.",
    },
  ],
  injection: [
    {
      q: "What is the primary defense against SQL injection?",
      options: [
        "Escape quotes by hand",
        "Parameterized queries, so values never become part of the SQL text",
        "A longer database password",
        "Hide error messages",
      ],
      answer: 1,
      explain: "The query structure is fixed before the data arrives. Validation and least privilege are extra layers.",
    },
    {
      q: "A service must run an external program with a user-provided host name. What is safest?",
      options: [
        "Build a shell string and run it",
        "Pass an argument array without a shell, after validating the value against an allow-list",
        "Remove the semicolons from the input",
        "Run it as root so it always works",
      ],
      answer: 1,
      explain: "Without a shell there is nothing to interpret metacharacters. The allow-list adds defense in depth.",
    },
    {
      q: "XSS is a form of injection into which interpreter?",
      options: ["The SQL engine", "The operating system shell", "The browser's HTML and JavaScript engine", "The DNS resolver"],
      answer: 2,
      explain: "Escape output by context, keep auto-escaping on, and use a Content-Security-Policy.",
    },
  ],
  "insecure-design": [
    {
      q: "What distinguishes an insecure design from an implementation bug?",
      options: [
        "Insecure designs are always in the database",
        "The code does exactly what the design says, and the design itself allows abuse",
        "Insecure designs only affect mobile apps",
        "Bugs are more serious",
      ],
      answer: 1,
      explain: "Clean code cannot fix a missing control. The fix starts earlier: threat models and abuse cases.",
    },
    {
      q: "What is an abuse case?",
      options: [
        "A user complaint",
        "A user story written from the attacker's point of view, which yields a requirement and a test",
        "A penetration test report",
        "A type of firewall rule",
      ],
      answer: 1,
      explain: "Writing what an attacker wants makes missing controls visible before code exists.",
    },
    {
      q: "Where should the price of an order be calculated?",
      options: ["In the browser", "In a hidden form field", "On the server, from trusted catalog data", "In the mobile app"],
      answer: 2,
      explain: "Anything the client sends can be changed. The server is the source of truth.",
    },
  ],
  "authentication-failures": [
    {
      q: "Why must the session id change after a successful login?",
      options: [
        "To save memory",
        "To prevent session fixation, where an attacker planted the old id",
        "To log the user out of other devices",
        "Because cookies expire at login",
      ],
      answer: 1,
      explain: "If the id is unchanged, whoever knew it before login shares the authenticated session.",
    },
    {
      q: "What must a service do with a JWT before trusting its claims?",
      options: [
        "Decode it and read the payload",
        "Verify the signature with a pinned algorithm, and check issuer, audience and expiry",
        "Check that it is Base64",
        "Store it in localStorage",
      ],
      answer: 1,
      explain: "Decoding is not verifying. Accepting alg none or skipping the signature lets anyone forge tokens.",
    },
    {
      q: "Which control best reduces the impact of credential stuffing?",
      options: [
        "Complex password rules",
        "Throttling, breached-password checks and multi-factor authentication",
        "Renaming the login URL",
        "Longer cookie lifetime",
      ],
      answer: 1,
      explain: "Stuffing uses real, valid passwords from other leaks, so complexity does not help. Rate limits and a second factor do.",
    },
  ],
  "integrity-failures": [
    {
      q: "Why is pickle.loads on data from a cookie dangerous?",
      options: [
        "It is slow",
        "Crafted bytes can run arbitrary code during deserialization",
        "It cannot read strings",
        "It only works on Windows",
      ],
      answer: 1,
      explain: "Native object serialization can instantiate arbitrary types. Use data-only formats and validate them.",
    },
    {
      q: "What does Subresource Integrity protect against?",
      options: [
        "Slow networks",
        "A third-party script being replaced with a modified file",
        "Cross-site request forgery",
        "Expired certificates",
      ],
      answer: 1,
      explain: "The browser refuses a file whose hash does not match the integrity attribute.",
    },
    {
      q: "State that must travel through the client, such as a preference blob, should be:",
      options: ["Compressed", "Signed and verified on the server, or kept on the server instead", "Base64-encoded", "Placed in a hidden field"],
      answer: 1,
      explain: "Encoding is not protection. A signature (HMAC) detects tampering.",
    },
  ],
  "logging-alerting-failures": [
    {
      q: "What makes a log useful for security?",
      options: [
        "It contains the full request body",
        "Structured events with who, what, where from and outcome, sent off the host quickly",
        "It is stored only on the application server",
        "It is rotated every hour",
      ],
      answer: 1,
      explain: "Consistent fields enable alerts and investigation. A local-only log disappears when the host is compromised.",
    },
    {
      q: "Which should never be written to logs?",
      options: ["Request id", "Passwords and tokens", "HTTP status code", "Timestamp"],
      answer: 1,
      explain: "A log store full of secrets becomes the best target in the company. Redact at the logger.",
    },
    {
      q: "Why does the 2025 category name include alerting?",
      options: [
        "Because logs are expensive",
        "Because a log nobody is notified about does not stop an attack in time",
        "Because alerts replace logs",
        "Because auditors require it",
      ],
      answer: 1,
      explain: "Detection needs both the record and a rule that pages someone, tested end to end.",
    },
  ],
  "exceptional-conditions": [
    {
      q: "An authorization service times out. What should the calling code do?",
      options: ["Allow the request so users are not blocked", "Deny and log the failure (fail closed)", "Retry forever", "Return the exception text"],
      answer: 1,
      explain: "A security decision that cannot be made is a no. Failing open turns every outage into a bypass.",
    },
    {
      q: "What should the client see when an unexpected error occurs?",
      options: [
        "The stack trace, to help debugging",
        "A generic message and a correlation id, with details kept in the logs",
        "The SQL query that failed",
        "Nothing, the connection is dropped",
      ],
      answer: 1,
      explain: "Internals help attackers. The id lets support find the details safely.",
    },
    {
      q: "Debit succeeds, credit throws. How do you avoid losing money?",
      options: [
        "Catch the error and ignore it",
        "Perform both steps in one transaction so they succeed or fail together",
        "Run the credit twice",
        "Add a sleep between the steps",
      ],
      answer: 1,
      explain: "Atomicity prevents partial state. Add idempotency keys so retries are safe.",
    },
  ],
};
