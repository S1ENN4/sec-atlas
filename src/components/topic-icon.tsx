import {
  FileJson,
  GitBranch,
  KeyRound,
  MoveLeft,
  PackageSearch,
  Radar,
  ScanSearch,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  cicd: Workflow,
  sast: ScanSearch,
  dast: Radar,
  sca: PackageSearch,
  secrets: KeyRound,
  sbom: FileJson,
  "shift-left": MoveLeft,
  devsecops: ShieldCheck,
};

export function TopicIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? GitBranch;
  return <Icon className={className} aria-hidden />;
}
