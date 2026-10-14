// World: a web request, hop by hop, with the OWASP Top 10 along the way.
import type { Mission, WorldNode } from "./world";

export const webappWorld: WorldNode = {
  id: "webapp",
  kind: "place",
  children: [
    {
      id: "w-browser",
      kind: "place",
      topics: ["owasp/injection"],
      children: [
        {
          id: "w-xss",
          kind: "file",
          path: "static/app.js",
          topics: ["owasp/injection"],
          code: {
            lang: "js",
            text: `const params = new URLSearchParams(location.search);
const name = params.get("name");
document.getElementById("welcome").innerHTML = "Hello, " + name;
document.getElementById("footer").textContent = "Hello, " + name;`,
          },
          risky: [3],
        },
        { id: "w-csrf", kind: "concept", topics: ["owasp/broken-access-control", "owasp/authentication-failures"] },
        {
          id: "w-headers",
          kind: "file",
          path: "response headers",
          topics: ["owasp/security-misconfiguration"],
          code: {
            lang: "http",
            text: `Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin`,
          },
        },
      ],
    },
    {
      id: "w-edge",
      kind: "place",
      topics: ["secops/waf", "secops/rate-limiting"],
      children: [
        { id: "w-tls", kind: "check", topics: ["owasp/cryptographic-failures"] },
        { id: "w-ratelimit", kind: "check", topics: ["secops/rate-limiting", "secops/bot-management"] },
        { id: "w-waf", kind: "tool", topics: ["secops/waf", "secops/ataques-l7"] },
      ],
    },
    {
      id: "w-auth",
      kind: "place",
      topics: ["owasp/authentication-failures"],
      children: [
        { id: "w-passwords", kind: "concept", topics: ["owasp/authentication-failures"] },
        {
          id: "w-session",
          kind: "file",
          path: "Set-Cookie header",
          topics: ["owasp/authentication-failures", "owasp/security-misconfiguration"],
          code: {
            lang: "http",
            text: `Set-Cookie: session=3f9a1c...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600`,
          },
        },
        { id: "w-jwt", kind: "concept", topics: ["owasp/authentication-failures", "owasp/integrity-failures"] },
      ],
    },
    {
      id: "w-app",
      kind: "place",
      topics: ["owasp/broken-access-control", "owasp/injection", "owasp/insecure-design"],
      children: [
        {
          id: "w-idor",
          kind: "file",
          path: "routes/invoices.js",
          topics: ["owasp/broken-access-control"],
          code: {
            lang: "js",
            text: `app.get("/api/invoices/:id", requireLogin, async (req, res) => {
  const invoice = await db.invoices.findById(req.params.id);
  if (!invoice) return res.sendStatus(404);
  res.json(invoice);
});`,
          },
          risky: [2],
        },
        {
          id: "w-sqli",
          kind: "file",
          path: "routes/users.js",
          topics: ["owasp/injection"],
          code: {
            lang: "js",
            text: `app.get("/users", async (req, res) => {
  const name = req.query.name;
  const rows = await db.query(
    "SELECT id, email FROM users WHERE name = '" + name + "'"
  );
  res.json(rows);
});`,
          },
          risky: [4],
        },
        { id: "w-design", kind: "concept", topics: ["owasp/insecure-design", "appsec/threat-modeling"] },
        { id: "w-deser", kind: "concept", topics: ["owasp/integrity-failures"] },
        { id: "w-errors", kind: "concept", topics: ["owasp/exceptional-conditions"] },
      ],
    },
    {
      id: "w-data",
      kind: "place",
      topics: ["owasp/cryptographic-failures"],
      children: [
        { id: "w-crypto", kind: "concept", topics: ["owasp/cryptographic-failures"] },
        { id: "w-secrets", kind: "concept", topics: ["appsec/secrets", "cloudsec/secrets-cloud"] },
      ],
    },
    {
      id: "w-supply",
      kind: "place",
      topics: ["owasp/supply-chain-failures", "appsec/sca"],
      children: [
        { id: "w-deps", kind: "concept", topics: ["owasp/supply-chain-failures", "appsec/sca"] },
        { id: "w-config", kind: "concept", topics: ["owasp/security-misconfiguration"] },
      ],
    },
    { id: "w-logging", kind: "concept", topics: ["owasp/logging-alerting-failures", "secops/detection-engineering"] },
  ],
};

export const webappMissions: Mission[] = [
  { id: "owasp-walk", steps: ["w-browser", "w-edge", "w-auth", "w-app", "w-data", "w-supply", "w-logging"] },
  { id: "break-the-app", steps: ["w-xss", "w-sqli", "w-idor"] },
];
