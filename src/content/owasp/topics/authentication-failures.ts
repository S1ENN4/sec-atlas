import type { Topic } from "@/content/types";

export const authenticationFailures: Topic = {
  domain: "owasp",
  slug: "authentication-failures",
  title: "A07 Authentication Failures",
  short: "attackers pass as someone else: guessed, stuffed, stolen or fixed sessions",
  tagline:
    "Login is the front door. Unlimited guesses, reused passwords, sessions that never expire and tokens that are not really verified all let an attacker walk in as a real user.",
  kind: "tecnica",
  stage: "code",
  tools: ["Hydra / ffuf (on systems you own)", "Have I Been Pwned Passwords API", "jwt.io / jwt_tool", "Passkeys / WebAuthn", "OWASP ZAP", "Keycloak / Auth0 / Cognito"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Authentication failures are weaknesses in confirming a user's identity or managing the session that follows: permitting credential stuffing and brute force, accepting weak or breached passwords, exposing session ids, skipping or mis-verifying tokens, or offering a weak recovery flow.",
        "OWASP Top 10:2025 lists it as A07 under the name Authentication Failures.",
      ],
    },
    {
      heading: "How the attack works",
      bullets: [
        "Credential stuffing: lists of leaked e-mail and password pairs from other sites are replayed against your login at scale.",
        "Brute force and password spraying: a few common passwords across many accounts, below any naive lockout.",
        "Weak JWT handling: the server accepts alg: none, never checks the signature or the expiry, or uses a guessable secret.",
        "Session fixation and theft: the session id is not rotated after login, travels in the URL, or the cookie lacks HttpOnly and Secure.",
        "Account recovery bypass: reset links that never expire or security questions with public answers.",
      ],
    },
    {
      heading: "Vulnerable code",
      body: ["No throttling, a fast comparison of an unsalted hash, a session id kept across login, and a token that is decoded but never verified."],
      code: [
        {
          language: "javascript",
          filename: "login.js (Express)",
          code: "app.post(\"/login\", async (req, res) => {\n  const user = await db.user.findByEmail(req.body.email);\n  if (user && user.passwordHash === sha1(req.body.password)) {\n    req.session.userId = user.id;          // same session id as before login\n    return res.json({ ok: true });\n  }\n  res.status(401).json({ error: \"wrong email or password\" });   // unlimited attempts\n});\n\nconst claims = jwt.decode(token);          // decode() does NOT verify the signature",
        },
        {
          language: "python",
          filename: "tokens.py",
          code: "claims = jwt.decode(token, options={\"verify_signature\": False})",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Throttle by account and by IP, verify passwords with a slow hash, regenerate the session on login, and set cookie flags. Verify tokens with a pinned algorithm, a real key, and issuer, audience and expiry checks. Where you can, use passkeys or an identity provider instead of building login yourself, and add a second factor for sensitive accounts.",
      ],
      code: [
        {
          language: "javascript",
          filename: "login.js (Express)",
          code: "const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, keyGenerator: (r) => `${r.ip}:${r.body?.email}` });\n\napp.post(\"/login\", limiter, async (req, res) => {\n  const user = await db.user.findByEmail(req.body.email);\n  const ok = user && (await argon2.verify(user.passwordHash, req.body.password));\n  if (!ok) return res.status(401).json({ error: \"wrong email or password\" });   // same message for both cases\n  req.session.regenerate(() => {         // new id after login: defeats fixation\n    req.session.userId = user.id;\n    res.json({ ok: true });\n  });\n});\n\napp.use(session({ cookie: { httpOnly: true, secure: true, sameSite: \"lax\", maxAge: 3600_000 } }));",
        },
        {
          language: "python",
          filename: "tokens.py (PyJWT)",
          code: "claims = jwt.decode(\n    token,\n    key=PUBLIC_KEY,\n    algorithms=[\"RS256\"],          # pin the algorithm; never accept \"none\"\n    audience=\"api.example.com\",\n    issuer=\"https://id.example.com\",\n    options={\"require\": [\"exp\", \"iat\", \"sub\"]},\n)",
        },
        {
          language: "java",
          filename: "SecurityConfig.java (Spring Security)",
          code: "http.sessionManagement(s -> s.sessionFixation().migrateSession())\n    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()));   // verifies signature, exp, issuer via config",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "Test the behaviors an attacker relies on: the eleventh attempt is refused, the session id changes after login, and tampered or unsigned tokens are rejected.",
      ],
      code: [
        {
          language: "python",
          filename: "test_auth.py (pytest)",
          code: "def test_login_is_throttled(client):\n    codes = [client.post(\"/login\", json={\"email\": \"a@x.io\", \"password\": f\"guess{i}\"}).status_code for i in range(15)]\n    assert 429 in codes\n\ndef test_session_id_changes_after_login(client, user):\n    before = client.get(\"/\").cookies.get(\"sid\")\n    client.post(\"/login\", json=user.credentials)\n    assert client.cookies.get(\"sid\") != before\n\ndef test_unsigned_token_is_rejected(client):\n    forged = b64(b'{\"alg\":\"none\"}') + \".\" + b64(b'{\"sub\":\"admin\"}') + \".\"\n    assert client.get(\"/api/me\", headers={\"Authorization\": f\"Bearer {forged}\"}).status_code == 401\n\ndef test_cookie_flags(client, user):\n    cookie = client.post(\"/login\", json=user.credentials).headers[\"set-cookie\"]\n    assert \"HttpOnly\" in cookie and \"Secure\" in cookie",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Rate limit and monitor login by account, by IP and by device; add progressive delay or challenge, not just hard lockout (which enables denial of service).",
        "Check new passwords against a breached-password list; require length over arbitrary complexity rules.",
        "Offer multi-factor authentication, ideally phishing-resistant (passkeys, WebAuthn), and require it for admins.",
        "Rotate the session id on login and privilege change; expire it; invalidate it on logout.",
        "Verify every token: signature, algorithm, issuer, audience, expiry. Never trust decode alone.",
        "Make recovery as strong as login: single-use, short-lived links; same generic response for known and unknown e-mails.",
      ],
    },
  ],
};
