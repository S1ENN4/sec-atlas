// World: cloud security, who can do what and where.
import type { Mission, WorldNode } from "./world";

export const cloudWorld: WorldNode = {
  id: "cloud",
  kind: "place",
  children: [
    {
      id: "c-identity",
      kind: "place",
      topics: ["cloudsec/iam", "cloudsec/zero-trust"],
      children: [
        {
          id: "c-iam-policies",
          kind: "file",
          path: "policy.json",
          topics: ["cloudsec/iam"],
          code: {
            lang: "json",
            text: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "logs:PutLogEvents",
      "Resource": "arn:aws:logs:eu-west-1:123456789012:log-group:/app/*"
    }
  ]
}`,
          },
          risky: [6, 7],
        },
        { id: "c-roles", kind: "concept", topics: ["cloudsec/iam"] },
        { id: "c-mfa", kind: "check", topics: ["cloudsec/iam", "cloudsec/zero-trust"] },
        { id: "c-least-priv", kind: "concept", topics: ["cloudsec/iam"] },
      ],
    },
    {
      id: "c-network",
      kind: "place",
      topics: ["cloudsec/network"],
      children: [
        { id: "c-vpc", kind: "concept", topics: ["cloudsec/network", "cloudsec/zero-trust"] },
        {
          id: "c-sg",
          kind: "file",
          path: "network.tf",
          topics: ["cloudsec/network"],
          code: {
            lang: "hcl",
            text: `resource "aws_security_group" "app" {
  name   = "app"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,
          },
          risky: [9],
        },
        { id: "c-endpoints", kind: "concept", topics: ["cloudsec/network"] },
      ],
    },
    {
      id: "c-data",
      kind: "place",
      topics: ["cloudsec/kms-crypto", "cloudsec/secrets-cloud"],
      children: [
        {
          id: "c-buckets",
          kind: "file",
          path: "storage.tf",
          topics: ["cloudsec/cspm", "cloudsec/kms-crypto"],
          code: {
            lang: "hcl",
            text: `resource "aws_s3_bucket" "reports" {
  bucket = "acme-customer-reports"
}

resource "aws_s3_bucket_public_access_block" "reports" {
  bucket                  = aws_s3_bucket.reports.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_server_side_encryption_configuration" "reports" {
  bucket = aws_s3_bucket.reports.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}`,
          },
          risky: [7, 8, 9, 10],
        },
        { id: "c-encryption", kind: "concept", topics: ["cloudsec/kms-crypto"] },
        { id: "c-backups", kind: "concept", topics: ["cloudsec/kms-crypto", "response/ransomware-playbook"] },
      ],
    },
    {
      id: "c-workloads",
      kind: "place",
      topics: ["cloudsec/kubernetes", "cloudsec/containers", "cloudsec/cwpp"],
      children: [
        {
          id: "c-pod",
          kind: "file",
          path: "pod.yaml",
          topics: ["cloudsec/kubernetes", "cloudsec/containers"],
          code: {
            lang: "yaml",
            text: `apiVersion: v1
kind: Pod
metadata:
  name: api
spec:
  hostNetwork: true
  containers:
    - name: api
      image: ghcr.io/acme/api:1.4.2
      securityContext:
        privileged: true
        runAsUser: 0`,
          },
          risky: [6, 11, 12],
        },
        { id: "c-image-trust", kind: "check", topics: ["cloudsec/containers", "appsec/sbom"] },
      ],
    },
    {
      id: "c-visibility",
      kind: "place",
      topics: ["cloudsec/logging-detection", "cloudsec/cspm"],
      children: [
        {
          id: "c-cloudtrail",
          kind: "file",
          path: "audit.tf",
          topics: ["cloudsec/logging-detection"],
          code: {
            lang: "hcl",
            text: `resource "aws_cloudtrail" "org" {
  name                          = "org-trail"
  s3_bucket_name                = aws_s3_bucket.logs.id
  is_multi_region_trail         = true
  include_global_service_events = true
  enable_log_file_validation    = true
}`,
          },
        },
        { id: "c-cspm", kind: "tool", topics: ["cloudsec/cspm"] },
        { id: "c-alerts", kind: "concept", topics: ["cloudsec/logging-detection", "secops/detection-engineering"] },
      ],
    },
    {
      id: "c-guardrails",
      kind: "place",
      topics: ["seceng/policy-as-code", "cloudsec/cspm"],
      children: [
        {
          id: "c-scp",
          kind: "file",
          path: "scp-regions.json",
          topics: ["seceng/policy-as-code", "cloudsec/iam"],
          code: {
            lang: "json",
            text: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyLeavingApprovedRegions",
      "Effect": "Deny",
      "NotAction": ["iam:*", "organizations:*", "support:*"],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": { "aws:RequestedRegion": ["eu-west-1", "eu-central-1"] }
      }
    }
  ]
}`,
          },
        },
        { id: "c-iac-policy", kind: "check", topics: ["seceng/policy-as-code", "devops/infrastructure-as-code"] },
      ],
    },
  ],
};

export const cloudMissions: Mission[] = [
  { id: "lock-front-door", steps: ["c-mfa", "c-iam-policies", "c-sg", "c-buckets"] },
  { id: "see-everything", steps: ["c-cloudtrail", "c-cspm", "c-alerts", "c-scp"] },
];
