import type { QuizBank } from "@/content/types";

export const owaspQuiz: QuizBank = {
  "broken-access-control": [
    {
      "q": "A logged-in user changes /api/invoices/1041 to /api/invoices/1042 and sees another customer's invoice. What is the best fix?",
      "options": [
        "Hide the invoice links in the user interface so that users cannot find other ids",
        "Make the query filter by the owner taken from the session, and return the same 404 for missing and not-yours",
        "Replace the sequential ids with longer random ones and keep the same query",
        "Block the IP address of any user who requests an invoice that is not theirs"
      ],
      "answer": 1,
      "explain": "Authorization must be enforced on the server for every request. An unguessable id helps, but is not a control."
    },
    {
      "q": "Which default makes a forgotten route safe?",
      "options": [
        "Allow by default, and block the routes that are known to be sensitive",
        "Deny by default",
        "Log by default, so every request leaves a trace for later review",
        "Cache by default, so repeated requests never reach the application"
      ],
      "answer": 1,
      "explain": "With deny by default, a route nobody wrote a rule for is forbidden instead of open."
    },
    {
      "q": "Why is hiding the admin button in the UI not access control?",
      "options": [
        "Because buttons are slow to render and users would notice the delay",
        "Because attackers call the endpoint directly, so the server must check the role",
        "Because browsers cache buttons and show them to the wrong users",
        "Because hiding elements breaks accessibility tools for some people"
      ],
      "answer": 1,
      "explain": "The client is under the attacker's control. Only a server-side check counts."
    }
  ],
  "security-misconfiguration": [
    {
      "q": "Which setting is a typical misconfiguration in production?",
      "options": [
        "HSTS enabled, so the browser always uses HTTPS for the domain",
        "Debug mode left on, exposing stack traces and a console",
        "Secrets kept in a secret manager and read when the service starts",
        "Roles that follow least privilege and are reviewed every quarter"
      ],
      "answer": 1,
      "explain": "Debug features reveal internals and sometimes allow code execution. Turn them off outside development."
    },
    {
      "q": "How do you catch a regression to an unsafe default most reliably?",
      "options": [
        "Read the configuration manually once a year, during the audit",
        "Scan infrastructure code and images in CI and fail the build",
        "Ask developers to be careful whenever they touch the configuration",
        "Disable the scanners that are noisy, so that the pipeline stays green"
      ],
      "answer": 1,
      "explain": "Configuration is code. Automated scanning on every change catches drift early and consistently."
    },
    {
      "q": "Why is a wildcard CORS origin with credentials dangerous?",
      "options": [
        "It slows the site down because every response carries extra headers",
        "Any website can make authenticated requests as the visitor and read the answers",
        "It breaks HTTPS for any visitor who uses an older browser",
        "It disables cookies for every other site the visitor has open"
      ],
      "answer": 1,
      "explain": "Origins should be an explicit allow-list when credentials are involved."
    }
  ],
  "supply-chain-failures": [
    {
      "q": "Why should CI actions be pinned to a full commit SHA?",
      "options": [
        "SHAs are shorter than tags, so the workflow file is easier to read",
        "A tag or branch can be moved to different code, a commit SHA cannot",
        "It makes the build faster because the action is fetched from a cache",
        "Git requires every reference to be a full commit hash"
      ],
      "answer": 1,
      "explain": "Mutable references let an upstream change run in your pipeline, with your secrets, unnoticed."
    },
    {
      "q": "What does an SBOM mainly help you answer?",
      "options": [
        "How fast the build is, and which step takes the longest",
        "Whether you are affected when a vulnerability in a component is announced",
        "Who wrote each line of code, and when it was last changed",
        "Which cloud region is the cheapest for running the workloads"
      ],
      "answer": 1,
      "explain": "An inventory of components turns a long search into a quick query."
    },
    {
      "q": "What is dependency confusion?",
      "options": [
        "Using too many libraries, so that updates become impossible to follow",
        "A build pulling a public package that has the same name as an internal one",
        "Two libraries with incompatible licenses in the same application",
        "A circular import between two modules of the same package"
      ],
      "answer": 1,
      "explain": "Scoped names and a private registry that takes priority prevent the swap."
    }
  ],
  "cryptographic-failures": [
    {
      "q": "Which is the right way to store passwords?",
      "options": [
        "MD5 with a salt, because the salt prevents precomputed attacks",
        "SHA-256 of the password, because it is a strong and standard hash",
        "Argon2id, scrypt or bcrypt through a maintained library",
        "AES encryption with a key shared by the servers, so passwords can be recovered"
      ],
      "answer": 2,
      "explain": "Passwords need a slow, salted, purpose-built hash. Encryption is reversible, fast hashes are cheap to brute force."
    },
    {
      "q": "Which source is acceptable for a password-reset token?",
      "options": [
        "Math.random(), which is fast and well tested in every runtime",
        "A timestamp with the user id, which is unique for each request",
        "The operating system's cryptographic random generator",
        "The user id plus a counter that grows with every request"
      ],
      "answer": 2,
      "explain": "Security tokens must be unpredictable, which only a CSPRNG guarantees."
    },
    {
      "q": "Why prefer authenticated encryption such as AES-GCM over plain AES-CBC?",
      "options": [
        "It is the only mode that works with TLS connections",
        "It detects tampering with the ciphertext",
        "It produces smaller output than the other modes",
        "It does not need a key, so there is nothing to protect"
      ],
      "answer": 1,
      "explain": "Without authentication an attacker can modify ciphertext and sometimes learn the plaintext."
    }
  ],
  "injection": [
    {
      "q": "What is the primary defense against SQL injection?",
      "options": [
        "Escape the quotes by hand before building the query",
        "Parameterized queries, so values never become part of the SQL text",
        "Use a longer and more complex database password",
        "Hide the error messages so that attackers learn nothing"
      ],
      "answer": 1,
      "explain": "The query structure is fixed before the data arrives. Validation and least privilege are extra layers."
    },
    {
      "q": "A service must run an external program with a user-provided host name. What is safest?",
      "options": [
        "Build a shell string with the host name and run it through the shell",
        "Pass an argument array without a shell, after validating the value against an allow-list",
        "Remove the semicolons from the input and run the command",
        "Run the program as root so that it always has the access it needs"
      ],
      "answer": 1,
      "explain": "Without a shell there is nothing to interpret metacharacters. The allow-list adds defense in depth."
    },
    {
      "q": "XSS is a form of injection into which interpreter?",
      "options": [
        "The SQL engine of the database behind the application",
        "The operating system shell of the web server",
        "The browser's HTML and JavaScript engine",
        "The DNS resolver used by the browser"
      ],
      "answer": 2,
      "explain": "Escape output by context, keep auto-escaping on, and use a Content-Security-Policy."
    }
  ],
  "insecure-design": [
    {
      "q": "What distinguishes an insecure design from an implementation bug?",
      "options": [
        "Insecure designs are always found in the database layer",
        "The code does exactly what the design says, and the design itself allows abuse",
        "Insecure designs only affect mobile applications",
        "Implementation bugs are always more serious than design flaws"
      ],
      "answer": 1,
      "explain": "Clean code cannot fix a missing control. The fix starts earlier: threat models and abuse cases."
    },
    {
      "q": "What is an abuse case?",
      "options": [
        "A complaint that a user sends to the support team",
        "A user story written from the attacker's point of view, which yields a requirement and a test",
        "The report that a penetration test delivers at the end",
        "A type of firewall rule that blocks suspicious requests"
      ],
      "answer": 1,
      "explain": "Writing what an attacker wants makes missing controls visible before code exists."
    },
    {
      "q": "Where should the price of an order be calculated?",
      "options": [
        "In the browser, so the user sees the total immediately",
        "In a hidden form field, filled in by the page",
        "On the server, from trusted catalog data",
        "In the mobile app, which can calculate it offline"
      ],
      "answer": 2,
      "explain": "Anything the client sends can be changed. The server is the source of truth."
    }
  ],
  "authentication-failures": [
    {
      "q": "Why must the session id change after a successful login?",
      "options": [
        "To save memory on the server by discarding the old session data",
        "To prevent session fixation, where an attacker planted the old id",
        "To log the user out of the other devices as a side effect",
        "Because cookies expire at the moment of login"
      ],
      "answer": 1,
      "explain": "If the id is unchanged, whoever knew it before login shares the authenticated session."
    },
    {
      "q": "What must a service do with a JWT before trusting its claims?",
      "options": [
        "Decode it and read the payload to find out who the user is",
        "Verify the signature with a pinned algorithm, and check issuer, audience and expiry",
        "Check that the value is valid Base64 and well formed",
        "Store it in localStorage so that the page can reuse it"
      ],
      "answer": 1,
      "explain": "Decoding is not verifying. Accepting alg none or skipping the signature lets anyone forge tokens."
    },
    {
      "q": "Which control best reduces the impact of credential stuffing?",
      "options": [
        "Complex password rules, with symbols and numbers",
        "Throttling, breached-password checks and multi-factor authentication",
        "Renaming the login URL so that bots cannot find it",
        "A longer cookie lifetime, so users log in less often"
      ],
      "answer": 1,
      "explain": "Stuffing uses real, valid passwords from other leaks, so complexity does not help. Rate limits and a second factor do."
    }
  ],
  "integrity-failures": [
    {
      "q": "Why is pickle.loads on data from a cookie dangerous?",
      "options": [
        "It is slow, so it makes the whole application slower",
        "Crafted bytes can run arbitrary code during deserialization",
        "It cannot read strings, so the data is always corrupted",
        "It only works on Windows, so it fails on other servers"
      ],
      "answer": 1,
      "explain": "Native object serialization can instantiate arbitrary types. Use data-only formats and validate them."
    },
    {
      "q": "What does Subresource Integrity protect against?",
      "options": [
        "Slow networks that delay the loading of third-party scripts",
        "A third-party script being replaced with a modified file",
        "Cross-site request forgery against the pages that load the script",
        "Expired certificates on the server that hosts the script"
      ],
      "answer": 1,
      "explain": "The browser refuses a file whose hash does not match the integrity attribute."
    },
    {
      "q": "State that must travel through the client, such as a preference blob, should be:",
      "options": [
        "Compressed, so that the client cannot read or change it",
        "Signed and verified on the server, or kept on the server instead",
        "Encoded as Base64, so that it is hard to edit by hand",
        "Placed in a hidden form field, so that users do not see it"
      ],
      "answer": 1,
      "explain": "Encoding is not protection. A signature (HMAC) detects tampering."
    }
  ],
  "logging-alerting-failures": [
    {
      "q": "What makes a log useful for security?",
      "options": [
        "It contains the full request body, including every field the user typed",
        "Structured events with who, what, where from and outcome, sent off the host quickly",
        "It is stored only on the application server, where it is easy to read",
        "It is rotated every hour, so that old data never piles up"
      ],
      "answer": 1,
      "explain": "Consistent fields enable alerts and investigation. A local-only log disappears when the host is compromised."
    },
    {
      "q": "Which should never be written to logs?",
      "options": [
        "The request id, because it can be used to identify a user",
        "Passwords and tokens",
        "The HTTP status code, because it reveals which pages exist",
        "The timestamp, because it shows when the user was active"
      ],
      "answer": 1,
      "explain": "A log store full of secrets becomes the best target in the company. Redact at the logger."
    },
    {
      "q": "Why does the 2025 category name include alerting?",
      "options": [
        "Because logs are expensive and teams should keep fewer of them",
        "Because a log nobody is notified about does not stop an attack in time",
        "Because alerts replace logs, which are no longer needed",
        "Because auditors require an alerting system for every application"
      ],
      "answer": 1,
      "explain": "Detection needs both the record and a rule that pages someone, tested end to end."
    }
  ],
  "exceptional-conditions": [
    {
      "q": "An authorization service times out. What should the calling code do?",
      "options": [
        "Allow the request, so that users are not blocked by a failure in the service",
        "Deny and log the failure (fail closed)",
        "Retry forever, until the authorization service answers",
        "Return the exception text to the caller so it can decide"
      ],
      "answer": 1,
      "explain": "A security decision that cannot be made is a no. Failing open turns every outage into a bypass."
    },
    {
      "q": "What should the client see when an unexpected error occurs?",
      "options": [
        "The full stack trace, to help the user report the problem",
        "A generic message and a correlation id, with details kept in the logs",
        "The SQL query that failed, so the team can reproduce it",
        "Nothing: the connection is dropped without any message"
      ],
      "answer": 1,
      "explain": "Internals help attackers. The id lets support find the details safely."
    },
    {
      "q": "Debit succeeds, credit throws. How do you avoid losing money?",
      "options": [
        "Catch the error and ignore it, so the user sees no failure",
        "Perform both steps in one transaction so they succeed or fail together",
        "Run the credit step twice to make sure it is applied",
        "Add a short sleep between the two steps"
      ],
      "answer": 1,
      "explain": "Atomicity prevents partial state. Add idempotency keys so retries are safe."
    }
  ]
};
