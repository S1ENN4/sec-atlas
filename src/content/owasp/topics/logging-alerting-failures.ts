import type { Topic } from "@/content/types";

export const loggingAlertingFailures: Topic = {
  domain: "owasp",
  slug: "logging-alerting-failures",
  title: "A09 Security Logging and Alerting Failures",
  short: "attacks that go unnoticed because nothing recorded them or nobody was told",
  tagline:
    "You cannot respond to what you cannot see. Logs without alerts are an archive; alerts without good logs are noise. Both must exist, and neither may be injectable or full of secrets.",
  kind: "pratica",
  stage: "operate",
  tools: ["OpenTelemetry", "Loki / Elastic / Splunk", "Sigma rules", "Falco", "Wazuh", "fail2ban"],
  sections: [
    {
      heading: "What it is",
      body: [
        "This category covers missing or poor security logging, monitoring and alerting: logins and access-control failures that are not recorded, logs that live only on the machine an attacker controls, events with no alert behind them, and logs that leak sensitive data or can be forged by user input.",
        "It is A09 in OWASP Top 10:2025, with the name stressing alerting: a log nobody is paged about is not a control.",
      ],
    },
    {
      heading: "How the attack works",
      bullets: [
        "A credential-stuffing run of thousands of failed logins is not logged, or is logged and never reviewed.",
        "An attacker with a foothold deletes local logs; with no central copy, the trail is gone.",
        "Log injection: a username containing a newline writes a fake \"login succeeded\" line.",
        "Logs record passwords, tokens or card numbers, turning the log store into the richest target.",
      ],
    },
    {
      heading: "Vulnerable code",
      body: ["Free-text logging with raw user input, a secret in the message, and no record of the failure that matters."],
      code: [
        {
          language: "python",
          filename: "login.py",
          code: "def login(email, password):\n    print(f\"login attempt {email} / {password}\")          # secret in the log, newline injection possible\n    user = authenticate(email, password)\n    if not user:\n        return None                                        # failure not recorded\n    return user",
        },
        {
          language: "javascript",
          filename: "login.js",
          code: "console.log(\"login failed for \" + req.body.email + \" with token \" + req.headers.authorization);",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Log security events as structured data with stable field names: who, what, where from, outcome, and a correlation id. Never log secrets; encode user input so it cannot forge lines. Ship logs off the host immediately, and attach alert rules to the events that matter (spikes in failures, privilege changes, access denied on sensitive objects).",
      ],
      code: [
        {
          language: "python",
          filename: "login.py",
          code: "import json, logging\nlog = logging.getLogger(\"security\")\n\ndef event(action, outcome, **fields):\n    log.info(json.dumps({\"action\": action, \"outcome\": outcome, **fields}))   # json.dumps escapes newlines\n\ndef login(email, password, ip, request_id):\n    user = authenticate(email, password)\n    if not user:\n        event(\"login\", \"failure\", email=email, ip=ip, request_id=request_id)   # no password, no token\n        return None\n    event(\"login\", \"success\", user_id=user.id, ip=ip, request_id=request_id)\n    return user",
        },
        {
          language: "javascript",
          filename: "login.js (pino)",
          code: "req.log.warn({ action: \"login\", outcome: \"failure\", email: req.body.email, ip: req.ip }, \"auth\");\n// pino redaction keeps secrets out even if someone logs the whole object\nconst logger = pino({ redact: [\"req.headers.authorization\", \"*.password\", \"*.token\"] });",
        },
        {
          language: "yaml",
          filename: "alert.yml (Prometheus-style rule)",
          code: "- alert: LoginFailureSpike\n  expr: sum(rate(auth_events_total{action=\"login\",outcome=\"failure\"}[5m])) > 5\n  for: 5m\n  labels: { severity: page }\n  annotations:\n    summary: \"Login failures above baseline: possible credential stuffing\"",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "Test that the event is emitted with the right fields, that no secret appears, and that input cannot forge a line. Then test the alert path itself: replay a burst and confirm someone is notified. An untested alert is a hope.",
      ],
      code: [
        {
          language: "python",
          filename: "test_logging.py (pytest)",
          code: "def test_failed_login_is_logged_without_secrets(caplog):\n    with caplog.at_level(\"INFO\", logger=\"security\"):\n        login(\"bob@x.io\\nlogin success\", \"hunter2\", \"203.0.113.9\", \"req-1\")\n    text = caplog.text\n    assert \"hunter2\" not in text                      # no secret\n    assert text.count(\"\\n\") == 1                       # the injected newline did not create a line\n    assert '\"outcome\": \"failure\"' in text\n\ndef test_alert_fires_on_burst(alert_harness):\n    for _ in range(200):\n        login(\"bob@x.io\", \"bad\", \"203.0.113.9\", \"r\")\n    assert alert_harness.fired(\"LoginFailureSpike\")",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Log: authentication, access-control failures, input-validation failures, privileged actions, and changes to security configuration.",
        "Use a consistent structured format; include time, actor, action, target, outcome, source and a correlation id.",
        "Send logs to a central, append-only store quickly; restrict who can alter or delete them.",
        "Do not log secrets, tokens or full card/ID numbers; encode untrusted input.",
        "Define alerts and an owner for each; write the response in a runbook; test the alert path.",
        "Set retention that matches legal and investigation needs.",
      ],
    },
  ],
};
