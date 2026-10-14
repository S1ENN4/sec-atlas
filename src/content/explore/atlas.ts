// World: Atlas Maps Inc., a made-up company used as a case study. Every file
// below is invented, but each mistake in it is a real, common one.
import type { Mission, WorldNode } from "./world";

export const atlasWorld: WorldNode = {
  id: "atlas",
  kind: "place",
  children: [
    {
      id: "a-site",
      kind: "place",
      topics: ["owasp/injection", "owasp/security-misconfiguration"],
      children: [
        {
          id: "a-site-xss",
          kind: "file",
          path: "web/src/MapCard.jsx",
          topics: ["owasp/injection"],
          see: ["w-xss"],
          lab: "xss",
          code: {
            lang: "js",
            text: `export function MapCard({ map }) {
  return (
    <article className="card">
      <h3 dangerouslySetInnerHTML={{ __html: map.title }} />
      <p>{map.routes.length} routes</p>
    </article>
  );
}`,
          },
          risky: [4],
        },
        {
          id: "a-site-headers",
          kind: "file",
          path: "web/next.config.js",
          topics: ["owasp/security-misconfiguration"],
          see: ["w-headers"],
          code: {
            lang: "js",
            text: `module.exports = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: "default-src 'self'; frame-ancestors 'none'" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    }];
  },
};`,
          },
        },
        { id: "a-site-login", kind: "concept", topics: ["owasp/authentication-failures"], see: ["w-session", "w-passwords"] },
      ],
    },
    {
      id: "a-api",
      kind: "place",
      topics: ["owasp/broken-access-control", "owasp/injection"],
      children: [
        {
          id: "a-api-idor",
          kind: "file",
          path: "api/routes/maps.js",
          topics: ["owasp/broken-access-control"],
          see: ["w-idor"],
          lab: "idor",
          code: {
            lang: "js",
            text: `router.get("/v1/maps/:id", requireApiKey, async (req, res) => {
  const map = await db.maps.findById(req.params.id);
  if (!map) return res.sendStatus(404);
  res.json(map);
});`,
          },
          risky: [2],
        },
        {
          id: "a-api-search",
          kind: "file",
          path: "api/routes/search.js",
          topics: ["owasp/injection"],
          see: ["w-sqli"],
          lab: "sqli",
          code: {
            lang: "js",
            text: `router.get("/v1/search", requireApiKey, async (req, res) => {
  const q = req.query.q;
  const sql = \`SELECT id, title FROM maps WHERE owner = \${req.customer.id} AND title ILIKE '%\${q}%'\`;
  const rows = await db.raw(sql);
  res.json(rows);
});`,
          },
          risky: [3],
        },
        {
          id: "a-api-keys",
          kind: "file",
          path: "api/middleware/auth.js",
          topics: ["owasp/authentication-failures", "appsec/secrets"],
          see: ["w-secrets"],
          code: {
            lang: "js",
            text: `export async function requireApiKey(req, res, next) {
  const raw = req.get("x-api-key") ?? "";
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const customer = await db.customers.findByKeyHash(hash);
  if (!customer) return res.sendStatus(401);
  req.customer = customer;
  next();
}`,
          },
        },
        { id: "a-api-limits", kind: "check", topics: ["secops/rate-limiting"], see: ["w-ratelimit"] },
      ],
    },
    {
      id: "a-data",
      kind: "place",
      topics: ["cloudsec/kms-crypto", "cloudsec/secrets-cloud"],
      children: [
        {
          id: "a-db",
          kind: "file",
          path: "infra/db/roles.sql",
          topics: ["cloudsec/iam"],
          see: ["c-least-priv"],
          code: {
            lang: "sql",
            text: `CREATE ROLE atlas_app LOGIN;
GRANT SELECT, INSERT, UPDATE ON maps, routes TO atlas_app;
GRANT SELECT ON customers TO atlas_app;
-- migrations run as a different role
CREATE ROLE atlas_migrate LOGIN;
GRANT ALL ON ALL TABLES IN SCHEMA public TO atlas_migrate;`,
          },
        },
        {
          id: "a-tiles",
          kind: "file",
          path: "infra/storage.tf",
          topics: ["cloudsec/cspm", "cloudsec/iam"],
          see: ["c-buckets"],
          code: {
            lang: "hcl",
            text: `resource "aws_s3_bucket" "tiles" {
  bucket = "atlas-tiles-prod"
}

resource "aws_s3_bucket_policy" "tiles" {
  bucket = aws_s3_bucket.tiles.id
  policy = jsonencode({
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:*"
      Resource  = ["\${aws_s3_bucket.tiles.arn}", "\${aws_s3_bucket.tiles.arn}/*"]
    }]
  })
}`,
          },
          risky: [11],
        },
        { id: "a-customer-data", kind: "concept", topics: ["grc/compliance-in-practice", "cloudsec/kms-crypto"], see: ["c-encryption"] },
      ],
    },
    {
      id: "a-repo",
      kind: "place",
      topics: ["devops/git-workflows", "appsec/secrets"],
      children: [
        {
          id: "a-repo-secret",
          kind: "file",
          path: "pull request diff",
          topics: ["appsec/secrets"],
          see: ["secrets-scan", "precommit", "secret-push"],
          code: {
            lang: "diff",
            text: `diff --git a/api/.env b/api/.env
new file mode 100644
--- /dev/null
+++ b/api/.env
@@ -0,0 +1,4 @@
+PORT=8080
+DATABASE_URL=postgres://atlas_app:S3cr3t-Pass@db.internal:5432/atlas
+AWS_ACCESS_KEY_ID=AKIAEXAMPLEEXAMPLE1
+AWS_SECRET_ACCESS_KEY=exampleSecretKeyDoNotUse1234567890abcd`,
          },
          risky: [7, 8, 9],
        },
        { id: "a-repo-protection", kind: "check", topics: ["devops/git-workflows", "seceng/cicd-hardening"], see: ["branch-protection"] },
        {
          id: "a-codeowners",
          kind: "file",
          path: ".github/CODEOWNERS",
          topics: ["seceng/cicd-hardening"],
          see: ["codeowners"],
          code: {
            lang: "text",
            text: `/.github/workflows/   @atlas-maps/platform-security
/infra/               @atlas-maps/platform-security @atlas-maps/sre
/api/middleware/      @atlas-maps/platform-security
/web/                 @atlas-maps/web-squad`,
          },
        },
      ],
    },
    {
      id: "a-pipeline",
      kind: "place",
      topics: ["devops/ci-pipelines", "seceng/cicd-hardening"],
      children: [
        {
          id: "a-ci",
          kind: "file",
          path: ".github/workflows/deploy.yml",
          topics: ["seceng/cicd-hardening"],
          see: ["ci-trigger", "ci-permissions", "ci-pinning", "ci-injection"],
          code: {
            lang: "yaml",
            text: `name: deploy
on:
  pull_request_target:
    types: [opened, synchronize]
permissions: write-all
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
      - run: echo "Deploying \${{ github.event.pull_request.title }}"
      - uses: aws-actions/configure-aws-credentials@main
        with:
          aws-access-key-id: \${{ secrets.AWS_KEY }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET }}`,
          },
          risky: [3, 5, 12, 13, 14],
        },
        { id: "a-supply", kind: "concept", topics: ["appsec/sca", "appsec/sbom", "owasp/supply-chain-failures"], see: ["sca", "sbom", "dependabot"] },
      ],
    },
    {
      id: "a-cloud",
      kind: "place",
      topics: ["cloudsec/iam", "cloudsec/network"],
      children: [
        {
          id: "a-iam",
          kind: "file",
          path: "infra/iam.tf",
          topics: ["cloudsec/iam"],
          see: ["c-iam-policies", "c-least-priv"],
          code: {
            lang: "hcl",
            text: `resource "aws_iam_role_policy" "api" {
  role = aws_iam_role.api.id
  policy = jsonencode({
    Statement = [
      { Effect = "Allow", Action = ["s3:GetObject"], Resource = "\${aws_s3_bucket.tiles.arn}/*" },
      { Effect = "Allow", Action = "secretsmanager:*", Resource = "*" },
      { Effect = "Allow", Action = "iam:PassRole", Resource = "*" }
    ]
  })
}`,
          },
          risky: [6, 7],
        },
        { id: "a-network", kind: "concept", topics: ["cloudsec/network"], see: ["c-sg", "c-vpc"] },
        { id: "a-logging", kind: "concept", topics: ["cloudsec/logging-detection"], see: ["c-cloudtrail", "c-cspm"] },
      ],
    },
    {
      id: "a-ops",
      kind: "place",
      topics: ["secops/detection-engineering", "response/ir-lifecycle"],
      children: [
        {
          id: "a-alert",
          kind: "file",
          path: "alert from the SIEM",
          topics: ["secops/detection-engineering", "response/triage-and-containment"],
          see: ["c-alerts", "s-severity", "s-context"],
          code: {
            lang: "json",
            text: `{
  "rule": "AWS access key used from a new country",
  "time": "2026-10-14T03:12:08Z",
  "principal": "ci-deploy (AKIAEXAMPLEEXAMPLE1)",
  "source_ip": "198.51.100.77",
  "country": "unusual",
  "action": "s3:ListBucket",
  "resource": "atlas-tiles-prod",
  "severity": "high"
}`,
          },
        },
        {
          id: "a-incident",
          kind: "file",
          path: "incident timeline",
          topics: ["response/log-and-timeline-analysis", "response/ir-lifecycle"],
          see: ["s-timeline", "s-creds", "s-isolate"],
          code: {
            lang: "text",
            text: `Oct 12  17:40  PR #214 adds api/.env with a cloud key (merged without review)
Oct 12  17:42  Public repository mirror syncs the commit
Oct 13  22:05  Key first seen in a public leak scanner
Oct 14  03:12  Key used from a new country: alert fires
Oct 14  03:25  On-call revokes the key and rotates secrets
Oct 14  09:00  Review of bucket access logs: listing and downloads of tiles only`,
          },
        },
        { id: "a-runbook", kind: "concept", topics: ["secops/runbooks-e-hardening", "response/triage-and-containment"], see: ["s-runbooks", "s-contain"] },
      ],
    },
    {
      id: "a-govern",
      kind: "place",
      topics: ["grc/compliance-in-practice", "grc/third-party-risk"],
      children: [
        { id: "a-soc2", kind: "concept", topics: ["grc/compliance-in-practice", "grc/security-frameworks"], see: ["c-guardrails"] },
        { id: "a-vendors", kind: "concept", topics: ["grc/third-party-risk"] },
        { id: "a-pentest", kind: "concept", topics: ["offsec/reporting-and-remediation", "offsec/pentest-methodology"] },
      ],
    },
  ],
};

export const atlasMissions: Mission[] = [
  { id: "first-week", steps: ["a-site", "a-api", "a-data", "a-repo", "a-pipeline", "a-cloud", "a-ops", "a-govern"] },
  { id: "the-leaked-key", steps: ["a-repo-secret", "a-iam", "a-tiles", "a-alert", "a-incident"] },
  { id: "ship-the-fixes", steps: ["a-site-xss", "a-api-idor", "a-api-search", "a-ci"] },
];
