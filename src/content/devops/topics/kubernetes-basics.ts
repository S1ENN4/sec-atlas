import type { Topic } from "@/content/types";

export const kubernetesBasics: Topic = {
  domain: "devops",
  slug: "kubernetes-basics",
  title: "Kubernetes fundamentals",
  short: "pods, deployments, services, configuration, probes and resource limits",
  tagline:
    "Kubernetes runs containers across a cluster and keeps them in the state you declared. Learn the few objects that matter and the settings that stop one bad pod from taking everything down.",
  kind: "tecnica",
  stage: "provision",
  tools: ["kubectl", "Helm / Kustomize", "k9s", "kind / minikube", "Kyverno / OPA Gatekeeper", "Argo CD"],
  sections: [
    {
      heading: "The core objects",
      bullets: [
        "Pod: one or more containers that run together and share a network identity. The smallest unit you deploy, and disposable.",
        "Deployment: declares how many replicas of a pod to run and how to roll out changes. A ReplicaSet underneath keeps the count.",
        "Service: a stable name and address that load-balances to the matching pods, which come and go.",
        "Ingress or Gateway: routes outside traffic by host and path to services.",
        "ConfigMap and Secret: configuration and sensitive values injected as environment variables or files. A Secret is encoded, not encrypted by default; protect it with encryption at rest and tight access.",
        "Namespace: a scope for names, quotas and access rules, used to separate teams or environments.",
        "The control loop: you declare desired state; controllers continuously make the actual state match.",
      ],
    },
    {
      heading: "A deployment worth running",
      body: ["Set resource requests and limits, health probes, a rollout strategy and a restricted security context. These are the difference between a pod that behaves and one that surprises you."],
      code: [
        {
          language: "yaml",
          filename: "deployment.yaml",
          code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: api }\n  strategy:\n    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }\n  template:\n    metadata:\n      labels: { app: api }\n    spec:\n      securityContext:\n        runAsNonRoot: true\n        seccompProfile: { type: RuntimeDefault }\n      containers:\n        - name: api\n          image: registry.example.com/api@sha256:<digest>\n          ports: [{ containerPort: 8080 }]\n          resources:\n            requests: { cpu: 100m, memory: 128Mi }\n            limits: { memory: 256Mi }\n          readinessProbe:\n            httpGet: { path: /ready, port: 8080 }\n          livenessProbe:\n            httpGet: { path: /health, port: 8080 }\n          securityContext:\n            allowPrivilegeEscalation: false\n            readOnlyRootFilesystem: true\n            capabilities: { drop: [\"ALL\"] }",
        },
      ],
    },
    {
      heading: "Everyday commands",
      code: [
        {
          language: "bash",
          filename: "kubectl",
          code: "kubectl get pods -n prod -o wide\nkubectl describe pod api-7c9d -n prod           # events explain most failures\nkubectl logs deploy/api -n prod --tail=100 -f\nkubectl rollout status deploy/api -n prod\nkubectl rollout undo deploy/api -n prod          # roll back to the previous revision\nkubectl top pods -n prod",
        },
      ],
      body: ["Prefer to change the cluster through version control and a GitOps controller, and keep kubectl for reading and emergencies."],
    },
    {
      heading: "Common mistakes",
      bullets: [
        "No resource limits: one pod starves its neighbors.",
        "Liveness probes that depend on external services, restarting healthy pods during an outage.",
        "Using latest tags or mutable tags so a pod restart changes the version.",
        "Everything in the default namespace, with cluster-wide permissions for every workload.",
        "Treating the cluster as the thing you operate, instead of the platform your teams use.",
      ],
    },
  ],
};
