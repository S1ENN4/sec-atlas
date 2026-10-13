import type { Topic } from "@/content/types";

export const securityMisconfiguration: Topic = {
  domain: "owasp",
  slug: "security-misconfiguration",
  title: "A02 Security Misconfiguration",
  short: "safe software, shipped with unsafe settings",
  tagline:
    "Defaults are built for convenience, not for the internet. A debug flag, an open bucket, a verbose error or a default password turns correct code into an incident.",
  kind: "pratica",
  stage: "ship",
  tools: ["Trivy", "Checkov", "ScoutSuite / Prowler", "Mozilla Observatory", "nmap", "OpenSCAP / CIS benchmarks"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Security misconfiguration is any gap between how a system is set up and how it should be: unnecessary features enabled, default accounts left in place, debug mode in production, missing security headers, permissive cloud permissions, or stack traces shown to users.",
        "It is A02 in OWASP Top 10:2025 because it is everywhere and cheap to find: attackers scan the whole internet for the same few mistakes.",
      ],
    },
    {
      heading: "How the attack works",
      bullets: [
        "A framework left in debug mode exposes an interactive console or full stack traces with file paths and secrets.",
        "A storage bucket, database or admin panel is reachable from the internet with default or no credentials.",
        "Directory listing or a leftover /.git, /.env or backup file leaks source and keys.",
        "XML parsers with external entities enabled let a crafted document read local files.",
        "Permissive CORS (a wildcard origin with credentials) lets any website call the API as the victim.",
      ],
    },
    {
      heading: "Vulnerable configuration",
      body: ["Three common shapes: debug on, wildcard CORS with credentials, and a public container exposing a database."],
      code: [
        {
          language: "python",
          filename: "app.py (Flask)",
          code: "app = Flask(__name__)\napp.config[\"DEBUG\"] = True            # interactive debugger reachable in production\nCORS(app, origins=\"*\", supports_credentials=True)",
        },
        {
          language: "yaml",
          filename: "docker-compose.yml",
          code: "services:\n  db:\n    image: postgres:latest\n    ports:\n      - \"5432:5432\"            # published on every interface\n    environment:\n      POSTGRES_PASSWORD: postgres",
        },
        {
          language: "hcl",
          filename: "bucket.tf",
          code: "resource \"aws_s3_bucket_public_access_block\" \"assets\" {\n  bucket                  = aws_s3_bucket.assets.id\n  block_public_acls       = false\n  block_public_policy     = false\n}",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Make the secure setting the default and build it once: a hardened base image, a reviewed configuration module, and the same settings in every environment, applied from code. Remove what you do not use.",
      ],
      code: [
        {
          language: "python",
          filename: "app.py",
          code: "app = Flask(__name__)\napp.config[\"DEBUG\"] = os.environ.get(\"APP_ENV\") == \"development\"\nCORS(app, origins=[\"https://app.example.com\"], supports_credentials=True)\n\n@app.after_request\ndef set_headers(resp):\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000; includeSubDomains\"\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src 'self'\"\n    return resp",
        },
        {
          language: "yaml",
          filename: "docker-compose.yml",
          code: "services:\n  db:\n    image: postgres:16\n    expose:\n      - \"5432\"                 # reachable only by other services on the network\n    environment:\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n    secrets:\n      - db_password",
        },
        {
          language: "hcl",
          filename: "bucket.tf",
          code: "resource \"aws_s3_bucket_public_access_block\" \"assets\" {\n  bucket                  = aws_s3_bucket.assets.id\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "Misconfiguration is verified by scanning, not by reading code. Run a config scanner in CI against IaC and images, and run a small check against the deployed app. The test fails the build when a safe default regresses.",
      ],
      code: [
        {
          language: "bash",
          filename: "ci-checks.sh",
          code: "# 1. infrastructure code: fail on misconfigured resources\ncheckov -d infra/ --quiet --compact\n\n# 2. container image: fail on HIGH/CRITICAL findings\ntrivy image --exit-code 1 --severity HIGH,CRITICAL registry.example.com/app:$GIT_SHA\n\n# 3. deployed app: required headers must be present\ncurl -sI https://staging.example.com | grep -qi '^strict-transport-security:' || exit 1\ncurl -sI https://staging.example.com | grep -qi '^content-security-policy:' || exit 1",
        },
        {
          language: "python",
          filename: "test_config.py (pytest)",
          code: "def test_debug_is_off_in_production(monkeypatch):\n    monkeypatch.setenv(\"APP_ENV\", \"production\")\n    assert create_app().config[\"DEBUG\"] is False\n\ndef test_cors_does_not_allow_any_origin(client):\n    resp = client.options(\"/api/me\", headers={\"Origin\": \"https://evil.example\"})\n    assert resp.headers.get(\"Access-Control-Allow-Origin\") != \"*\"",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "One repeatable, automated hardening process for every environment; no hand-tuned servers.",
        "Remove unused features, sample apps, default accounts, and open ports.",
        "Send the security headers that apply (HSTS, CSP, X-Content-Type-Options, frame protection).",
        "Show generic errors to users; send details to logs, not to the response.",
        "Review cloud permissions and storage exposure continuously, not once.",
        "Treat configuration as code: reviewed, versioned, scanned.",
      ],
    },
  ],
};
