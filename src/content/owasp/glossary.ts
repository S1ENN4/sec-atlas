import type { GlossaryGroup } from "@/content/types";

export const glossary: GlossaryGroup[] = [
  {
    id: "access-and-identity",
    title: "access and identity",
    entries: [
      {
        term: "IDOR",
        aka: "insecure direct object reference · BOLA",
        meaning:
          "The request names an object (an id) and the server returns it without checking that the caller may see it. The most common form of broken access control, and in APIs it is called broken object level authorization.",
        topic: "broken-access-control",
      },
      {
        term: "Deny by default",
        meaning: "Access is forbidden unless a rule explicitly allows it, so a forgotten route fails closed instead of open.",
        topic: "broken-access-control",
      },
      {
        term: "Credential stuffing",
        meaning:
          "Replaying leaked e-mail and password pairs from other breaches against your login. It works because people reuse passwords, so the defense is throttling, breached-password checks and a second factor.",
        topic: "authentication-failures",
      },
      {
        term: "Session fixation",
        meaning: "An attacker plants a known session id in the victim's browser; if the app keeps that id after login, the attacker shares the session. Regenerate the id on login.",
        topic: "authentication-failures",
      },
      {
        term: "Passkey",
        aka: "WebAuthn",
        meaning: "A phishing-resistant login based on a key pair stored on the user's device; the site holds only the public key, so there is no password to steal or stuff.",
        topic: "authentication-failures",
      },
    ],
  },
  {
    id: "data-and-input",
    title: "data and input",
    entries: [
      {
        term: "SQL injection",
        aka: "SQLi",
        meaning: "Input concatenated into a SQL string is parsed as part of the query. Parameterized queries send the values separately and remove the problem.",
        topic: "injection",
      },
      {
        term: "XSS",
        aka: "cross-site scripting",
        meaning: "Injection into a web page: untrusted input is rendered as HTML or script in another user's browser. Escape on output by context and add a Content-Security-Policy.",
        topic: "injection",
      },
      {
        term: "Prepared statement",
        aka: "parameterized query",
        meaning: "A query whose structure is fixed before any value is supplied, so the database cannot confuse data with instructions.",
        topic: "injection",
      },
      {
        term: "Argon2id",
        meaning: "A memory-hard password hashing function with a built-in salt. Slowness is the point: it makes each guess expensive for an attacker.",
        topic: "cryptographic-failures",
      },
      {
        term: "CSPRNG",
        aka: "cryptographically secure random number generator",
        meaning: "The operating system's source of unpredictable bytes (secrets in Python, crypto.randomBytes in Node, crypto/rand in Go). Use it for tokens and keys, never Math.random.",
        topic: "cryptographic-failures",
      },
      {
        term: "Authenticated encryption",
        aka: "AEAD",
        meaning: "Encryption that also detects tampering (AES-GCM, ChaCha20-Poly1305). Encryption alone does not stop an attacker from modifying ciphertext.",
        topic: "cryptographic-failures",
      },
    ],
  },
  {
    id: "design-and-supply-chain",
    title: "design and supply chain",
    entries: [
      {
        term: "Threat model",
        meaning: "A structured answer to four questions: what are we building, what can go wrong, what will we do about it, and did we do a good job.",
        topic: "insecure-design",
      },
      {
        term: "Abuse case",
        meaning: "A user story written from the attacker's side. Each one produces a requirement and a test.",
        topic: "insecure-design",
      },
      {
        term: "SBOM",
        aka: "software bill of materials",
        meaning: "A machine-readable inventory of the components in a build. It answers \"are we affected?\" within minutes when a new vulnerability is announced.",
        topic: "supply-chain-failures",
      },
      {
        term: "Dependency confusion",
        meaning: "Tricking a build into pulling a public package with the same name as an internal one. Use scoped names and a private registry that wins.",
        topic: "supply-chain-failures",
      },
      {
        term: "Subresource Integrity",
        aka: "SRI",
        meaning: "A hash in a script or link tag that makes the browser refuse the file if it does not match, so a compromised CDN cannot change your page.",
        topic: "integrity-failures",
      },
      {
        term: "Insecure deserialization",
        meaning: "Rebuilding objects from untrusted bytes with a format that can instantiate arbitrary types (Java serialization, pickle). The bytes can trigger code execution.",
        topic: "integrity-failures",
      },
    ],
  },
  {
    id: "operations",
    title: "operations and failure",
    entries: [
      {
        term: "Fail closed",
        aka: "fail secure",
        meaning: "When a security check cannot decide (timeout, error), the answer is deny. The opposite, failing open, turns every outage into an access-control bypass.",
        topic: "exceptional-conditions",
      },
      {
        term: "Log injection",
        meaning: "User input containing newlines or control characters forges log entries. Encode input or use structured (JSON) logging.",
        topic: "logging-alerting-failures",
      },
      {
        term: "Correlation id",
        aka: "request id",
        meaning: "A unique id attached to a request and to every log line it creates, shown to the user in error messages so support can find the details without leaking them.",
        topic: "logging-alerting-failures",
      },
      {
        term: "Security misconfiguration",
        meaning: "Correct software running with unsafe settings: debug on, default credentials, public storage, permissive CORS, missing headers.",
        topic: "security-misconfiguration",
      },
      {
        term: "CORS",
        aka: "cross-origin resource sharing",
        meaning: "A browser mechanism that lets a server say which other origins may read its responses. A wildcard origin combined with credentials is a misconfiguration.",
        topic: "security-misconfiguration",
      },
    ],
  },
];
