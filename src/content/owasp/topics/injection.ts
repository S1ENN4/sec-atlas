import type { Topic } from "@/content/types";

export const injection: Topic = {
  domain: "owasp",
  slug: "injection",
  title: "A05 Injection",
  short: "untrusted input interpreted as code or commands",
  tagline:
    "When data and instructions travel in the same string, whoever controls the data controls the instruction. The cure is to keep them apart, in every language.",
  kind: "tecnica",
  stage: "code",
  tools: ["sqlmap (on systems you own)", "Semgrep", "CodeQL", "OWASP ZAP", "Burp Suite", "ORM / query builders"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Injection happens when an application builds a command or query by concatenating untrusted input, and an interpreter (a SQL engine, a shell, an LDAP server, a template engine, a browser) cannot tell where the data ends and the instruction begins.",
        "A05 in OWASP Top 10:2025 covers SQL, NoSQL, OS command, LDAP and template injection, and cross-site scripting (XSS), which is injection into the browser's HTML and JavaScript interpreter.",
      ],
    },
    {
      heading: "How the attack works",
      body: [
        "A login query is built as \"SELECT * FROM users WHERE name = '\" + name + \"' AND pass = '\" + pass + \"'\". Entering admin' -- as the name turns the rest of the query into a comment and the password check disappears. With a UNION the attacker reads other tables; with stacked queries, writes them.",
      ],
      bullets: [
        "SQL injection: read, modify or delete data; sometimes reach the operating system.",
        "OS command injection: input reaches a shell (; cat /etc/passwd, $(...), backticks).",
        "XSS: input reaches the page unescaped and runs script in another user's session.",
        "NoSQL and template injection follow the same pattern with different syntax.",
      ],
    },
    {
      heading: "Vulnerable code",
      body: ["String concatenation into SQL and into a shell command."],
      code: [
        {
          language: "python",
          filename: "users.py",
          code: "def find_user(db, name):\n    query = \"SELECT id, email FROM users WHERE name = '\" + name + \"'\"\n    return db.execute(query).fetchall()\n\ndef ping(host):\n    return os.popen(\"ping -c 1 \" + host).read()      # host = \"x; cat /etc/passwd\"",
        },
        {
          language: "javascript",
          filename: "users.js",
          code: "const rows = await db.query(`SELECT id, email FROM users WHERE name = '${req.query.name}'`);\nexec(`ping -c 1 ${req.query.host}`, cb);",
        },
        {
          language: "java",
          filename: "UserDao.java",
          code: "String sql = \"SELECT id, email FROM users WHERE name = '\" + name + \"'\";\nStatement st = conn.createStatement();\nResultSet rs = st.executeQuery(sql);",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Parameterize: send the query and the values separately, so the database never parses the value as SQL. For commands, avoid the shell entirely and pass an argument array. For HTML, rely on a templating engine that escapes by default. Validation (allow-lists of shape and length) is a second layer, not the fix.",
      ],
      code: [
        {
          language: "python",
          filename: "users.py",
          code: "def find_user(db, name):\n    return db.execute(\"SELECT id, email FROM users WHERE name = ?\", (name,)).fetchall()\n\nHOST_RE = re.compile(r\"^[A-Za-z0-9.-]{1,253}$\")\n\ndef ping(host):\n    if not HOST_RE.fullmatch(host):\n        raise ValueError(\"invalid host\")\n    return subprocess.run([\"ping\", \"-c\", \"1\", host], capture_output=True, text=True).stdout",
        },
        {
          language: "javascript",
          filename: "users.js",
          code: "const { rows } = await db.query(\"SELECT id, email FROM users WHERE name = $1\", [req.query.name]);\n\n// no shell: arguments are passed as an array\nexecFile(\"ping\", [\"-c\", \"1\", host], cb);",
        },
        {
          language: "java",
          filename: "UserDao.java",
          code: "String sql = \"SELECT id, email FROM users WHERE name = ?\";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n    ps.setString(1, name);\n    ResultSet rs = ps.executeQuery();\n}",
        },
        {
          language: "go",
          filename: "users.go",
          code: "rows, err := db.QueryContext(ctx, \"SELECT id, email FROM users WHERE name = $1\", name)",
        },
        {
          language: "html",
          filename: "XSS: escape on output (Jinja2 autoescape is on; never mark user input safe)",
          code: "<p>Hello, {{ user_name }}</p>        {# escaped #}\n<p>Hello, {{ user_name | safe }}</p>  {# DANGEROUS: do not do this with user input #}",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "Write the attack as a test. Send the classic payloads and assert that they are treated as plain data: the query returns nothing instead of everything, the shell is never invoked, and script characters come back escaped. Keep these tests forever; they document the threat.",
      ],
      code: [
        {
          language: "python",
          filename: "test_injection.py (pytest)",
          code: "PAYLOADS = [\"' OR '1'='1\", \"admin' --\", \"'; DROP TABLE users; --\", \"x' UNION SELECT password,1 FROM users --\"]\n\n@pytest.mark.parametrize(\"payload\", PAYLOADS)\ndef test_sql_payloads_are_just_data(db, payload):\n    assert find_user(db, payload) == []          # no row has that literal name\n    assert db.execute(\"SELECT count(*) FROM users\").fetchone()[0] > 0   # table still exists\n\ndef test_ping_rejects_shell_metacharacters():\n    with pytest.raises(ValueError):\n        ping(\"example.com; cat /etc/passwd\")\n\ndef test_html_is_escaped(client):\n    body = client.get(\"/hello?name=<script>alert(1)</script>\").text\n    assert \"<script>\" not in body and \"&lt;script&gt;\" in body",
        },
        {
          language: "bash",
          filename: "static-check.sh",
          code: "# catch concatenated SQL and shell=True at review time, in any commit\nsemgrep --config p/owasp-top-ten --error src/",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Parameterized queries or a vetted ORM for every database call; no string-built SQL.",
        "Never pass input to a shell. If you must run a program, use an argument array and an allow-list.",
        "Escape by context on output (HTML, attribute, URL, JavaScript); keep auto-escaping on; add a Content-Security-Policy.",
        "Validate input by allow-list (type, length, format) as defense in depth.",
        "Run the database account with least privilege: no DROP, no file access, no admin.",
        "Scan in CI (SAST for the pattern, DAST for the runtime behavior) and keep the attack payloads as regression tests.",
      ],
    },
  ],
};
