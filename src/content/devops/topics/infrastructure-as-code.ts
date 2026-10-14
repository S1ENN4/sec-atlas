import type { Topic } from "@/content/types";

export const infrastructureAsCode: Topic = {
  domain: "devops",
  slug: "infrastructure-as-code",
  title: "Infrastructure as code",
  short: "describe servers, networks and services in files, review them, and apply them repeatably",
  tagline:
    "When infrastructure is code, a change has a diff, a reviewer, a history and a way back. When it is clicks in a console, nobody can say what exists or why.",
  kind: "tecnica",
  stage: "provision",
  tools: ["Terraform / OpenTofu", "Pulumi", "Ansible", "CloudFormation", "Crossplane", "terraform-docs"],
  sections: [
    {
      heading: "Declarative and imperative",
      bullets: [
        "Declarative tools (Terraform, CloudFormation, Kubernetes manifests) describe the desired end state; the tool works out how to get there.",
        "Imperative tools and scripts describe the steps. They are flexible but easier to run twice with different results.",
        "Configuration management (Ansible, Chef) installs and configures software on machines; provisioning tools create the machines and cloud resources. Many teams use both, or avoid mutable servers by baking images.",
        "Prefer immutable infrastructure: replace instead of patching in place.",
      ],
    },
    {
      heading: "The plan and apply loop",
      body: [
        "Terraform compares your code with the recorded state and the real world, shows a plan of what it will create, change or destroy, and applies it on approval. The plan is the review artifact: read it, and run it in CI so that humans review diffs instead of console actions.",
      ],
      code: [
        {
          language: "hcl",
          filename: "main.tf",
          code: "terraform {\n  required_version = \">= 1.10\"\n  required_providers {\n    aws = { source = \"hashicorp/aws\", version = \"~> 6.0\" }\n  }\n  backend \"s3\" {\n    bucket         = \"example-terraform-state\"\n    key            = \"network/prod.tfstate\"\n    region         = \"us-east-1\"\n    use_lockfile   = true\n    encrypt        = true\n  }\n}\n\nresource \"aws_vpc\" \"main\" {\n  cidr_block           = var.vpc_cidr\n  enable_dns_hostnames = true\n  tags                 = merge(var.tags, { Name = \"main\" })\n}",
        },
        {
          language: "bash",
          filename: "workflow",
          code: "terraform fmt -check && terraform validate\nterraform plan -out=tfplan             # review this in the pull request\nterraform apply tfplan                 # run by the pipeline, not by a laptop",
        },
      ],
    },
    {
      heading: "Practices",
      bullets: [
        "Remote, locked, encrypted state; never commit state files (they may contain secrets).",
        "Small modules with clear inputs and outputs, versioned and reused; avoid one giant root module.",
        "Separate environments by state and by account, not by a variable you can forget to change.",
        "Detect and fix drift: schedule a plan and alert when reality differs from code.",
        "Scan the code and the plan for insecure settings before apply (see Infrastructure as code security in the Engineering domain).",
        "Keep secrets out of the code; reference a secret manager.",
      ],
    },
    {
      heading: "Pitfalls",
      bullets: [
        "Manual changes in the console that the code then overwrites or fights.",
        "A destroy hidden in a large plan: read what is being replaced, not just what is added.",
        "Provider and module versions left floating, so a plan changes without a code change.",
        "One state for everything: a small error blocks every team and the blast radius is the whole company.",
      ],
    },
  ],
};
