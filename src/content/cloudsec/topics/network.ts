import type { Topic } from "@/content/types";

export const network: Topic = {
  domain: "cloudsec",
  slug: "network",
  title: "Network — segmentação e zero-trust",
  short: "segmentação, microsegmentação e policies de rede",
  tagline:
    "A rede cloud é programável: VPCs, subnets, security groups e firewalls de aplicação escrevem o perímetro aplicação por aplicação.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["AWS VPC", "Cloudflare", "Palo Alto Networks", "Calico"],
  sections: [],
};
