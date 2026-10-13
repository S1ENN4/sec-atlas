import type { Topic } from "@/content/types";

export const integrityFailures: Topic = {
  domain: "owasp",
  slug: "integrity-failures",
  title: "A08 Software or Data Integrity Failures",
  short: "trusting code or data that could have been tampered with",
  tagline:
    "If the program accepts updates, plugins, serialized objects or pipeline output without proving where they came from, whoever can alter them can run code as you.",
  kind: "tecnica",
  stage: "ship",
  tools: ["Sigstore cosign", "SLSA provenance", "Subresource Integrity (SRI)", "ysoserial (to understand the risk, on your own lab)", "Semgrep", "in-toto"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Integrity failures happen when code or data is trusted without verification: auto-updates that are not signed, scripts loaded from a CDN with no integrity check, deserialization of untrusted bytes, and CI/CD pipelines where one compromised step can alter what ships.",
        "OWASP Top 10:2025 keeps this category as A08. It is close to A03 (supply chain) but focuses on the verification step: can you prove that what you run is what was meant to run?",
      ],
    },
    {
      heading: "How the attack works",
      bullets: [
        "Insecure deserialization: the application rebuilds objects from attacker-supplied bytes (Java serialization, Python pickle, unsafe YAML), and the stream triggers code execution.",
        "Tampered update or plugin: a download over an unsigned channel is replaced in transit or on the mirror.",
        "Unchecked third-party script: a compromised CDN serves modified JavaScript to every visitor.",
        "Client-controlled state: a cookie or hidden field that carries a role, price or object is edited and accepted.",
      ],
    },
    {
      heading: "Vulnerable code",
      body: ["Deserializing untrusted bytes with pickle, trusting a user-editable cookie, and loading a script with no integrity attribute."],
      code: [
        {
          language: "python",
          filename: "session.py",
          code: "import pickle, base64\n\ndef load_prefs(cookie):\n    return pickle.loads(base64.b64decode(cookie))   # attacker-controlled bytes run code",
        },
        {
          language: "javascript",
          filename: "cart.js",
          code: "const cart = JSON.parse(Buffer.from(req.cookies.cart, \"base64\").toString());\ntotal = cart.total;          // the client wrote this number",
        },
        {
          language: "html",
          filename: "index.html",
          code: "<script src=\"https://cdn.example.com/lib/chart.min.js\"></script>",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Use data-only formats (JSON) with schema validation, never native object serialization for untrusted input. If state must round-trip through the client, sign it (HMAC or a signed token) and verify before use, or better, keep it on the server. Pin third-party scripts with Subresource Integrity, and verify signatures on anything you install or update.",
      ],
      code: [
        {
          language: "python",
          filename: "session.py",
          code: "import hmac, hashlib, json, base64\n\nSECRET = load_secret(\"PREFS_HMAC_KEY\")\n\ndef dump_prefs(prefs: dict) -> str:\n    body = base64.urlsafe_b64encode(json.dumps(prefs).encode())\n    mac = hmac.new(SECRET, body, hashlib.sha256).hexdigest().encode()\n    return (body + b\".\" + mac).decode()\n\ndef load_prefs(cookie: str) -> dict:\n    body, _, mac = cookie.encode().partition(b\".\")\n    expected = hmac.new(SECRET, body, hashlib.sha256).hexdigest().encode()\n    if not hmac.compare_digest(mac, expected):\n        raise ValueError(\"tampered\")\n    return json.loads(base64.urlsafe_b64decode(body))      # data only, validated after",
        },
        {
          language: "javascript",
          filename: "cart.js",
          code: "// state lives on the server; the cookie only carries an opaque id\nconst cart = await carts.get(req.session.cartId);\nconst total = cart.items.reduce((s, i) => s + catalog.price(i.sku) * i.qty, 0);",
        },
        {
          language: "html",
          filename: "index.html",
          code: "<script src=\"https://cdn.example.com/lib/chart-4.4.1.min.js\"\n        integrity=\"sha384-<hash of the exact file>\"\n        crossorigin=\"anonymous\"></script>",
        },
        {
          language: "bash",
          filename: "verify before you run",
          code: "# the artifact must be signed by the expected pipeline identity\ncosign verify-blob --certificate-identity 'https://github.com/example/app/.github/workflows/release.yml@refs/heads/main' \\\n  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\\n  --signature app.tgz.sig --certificate app.tgz.pem app.tgz",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "Feed the code exactly what an attacker would: a modified cookie, a payload from a deserialization gadget, and a changed script file. The correct outcome is rejection, with no code executed.",
      ],
      code: [
        {
          language: "python",
          filename: "test_integrity.py (pytest)",
          code: "def test_tampered_cookie_is_rejected():\n    cookie = dump_prefs({\"theme\": \"dark\"})\n    body, mac = cookie.split(\".\")\n    forged = base64.urlsafe_b64encode(b'{\"theme\":\"dark\",\"role\":\"admin\"}').decode() + \".\" + mac\n    with pytest.raises(ValueError):\n        load_prefs(forged)\n\ndef test_pickle_payload_is_not_executed(tmp_path):\n    marker = tmp_path / \"pwned\"\n    class Evil:\n        def __reduce__(self):\n            return (open, (str(marker), \"w\"))\n    payload = base64.b64encode(pickle.dumps(Evil())).decode()\n    with pytest.raises(Exception):\n        load_prefs(payload)\n    assert not marker.exists()",
        },
        {
          language: "bash",
          filename: "sri-check.sh",
          code: "# every external <script> and <link rel=stylesheet> must carry an integrity attribute\n! grep -RInE '<script[^>]+src=\"https?://' dist/ | grep -v 'integrity='",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Never deserialize untrusted data with a format that can instantiate objects; prefer JSON plus schema validation.",
        "Sign anything that must cross a trust boundary (cookies, update files, messages) and verify before use.",
        "Use Subresource Integrity for third-party scripts and styles, or self-host them.",
        "Sign build artifacts and container images; verify the signature at deploy time.",
        "Protect the pipeline: reviewed changes, separate build and deploy permissions, no unreviewed code in release steps.",
        "Prefer server-side state for prices, roles and permissions.",
      ],
    },
  ],
};
