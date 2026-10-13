import type { Topic } from "@/content/types";

export const observability: Topic = {
  domain: "devops",
  slug: "observability",
  title: "Observability: metrics, logs and traces",
  short: "knowing what your system is doing from the outside, and alerting on what matters",
  tagline:
    "Monitoring tells you something is wrong; observability lets you ask why. Three signals, a few golden metrics and alerts on symptoms cover most needs.",
  kind: "tecnica",
  stage: "operate",
  tools: ["Prometheus + Grafana", "OpenTelemetry", "Loki / Elasticsearch", "Tempo / Jaeger", "Alertmanager", "Sentry"],
  sections: [
    {
      heading: "The three signals",
      bullets: [
        "Metrics: numbers over time (request rate, error rate, latency, CPU). Cheap to store and ideal for dashboards and alerts.",
        "Logs: timestamped records of events. Rich detail for debugging; use structured (JSON) logs with a request id.",
        "Traces: the path of one request across services, with the time spent in each. The tool for \"where is it slow?\"",
        "Connect them: a trace id in the logs and a link from a metric spike to example traces turns three tools into one investigation.",
      ],
    },
    {
      heading: "What to measure",
      body: ["The four golden signals fit almost any service: latency, traffic, errors and saturation. For user-facing requests, track rate, errors and duration (the RED method); for resources, track utilization, saturation and errors (the USE method)."],
      code: [
        {
          language: "promql",
          filename: "Prometheus queries",
          code: "# error ratio over 5 minutes\nsum(rate(http_requests_total{status=~\"5..\"}[5m]))\n  / sum(rate(http_requests_total[5m]))\n\n# 95th percentile latency\nhistogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))",
        },
      ],
    },
    {
      heading: "Alerting that people trust",
      bullets: [
        "Alert on symptoms users feel (errors, latency, availability), not on every cause (one pod's CPU).",
        "Every alert needs an owner, a severity and a runbook link that says what to check first.",
        "Page only for things that need a human right now; send the rest to a ticket queue.",
        "Alert fatigue is a reliability problem: delete or fix noisy alerts.",
        "Alert on SLO burn rate rather than raw thresholds (see the SRE topic).",
      ],
      code: [
        {
          language: "yaml",
          filename: "alert-rule.yml",
          code: "groups:\n  - name: api\n    rules:\n      - alert: HighErrorRatio\n        expr: |\n          sum(rate(http_requests_total{job=\"api\",status=~\"5..\"}[5m]))\n            / sum(rate(http_requests_total{job=\"api\"}[5m])) > 0.02\n        for: 10m\n        labels: { severity: page }\n        annotations:\n          summary: \"API error ratio above 2% for 10 minutes\"\n          runbook: \"https://wiki.example.com/runbooks/api-errors\"",
        },
      ],
    },
    {
      heading: "Habits",
      bullets: [
        "Instrument with a standard (OpenTelemetry) instead of a vendor-specific library.",
        "Control cardinality: a label with unbounded values (user id) can make a metrics system fall over.",
        "Do not log secrets or personal data.",
        "Review dashboards after every incident: what would have shown this earlier?",
      ],
    },
  ],
};
