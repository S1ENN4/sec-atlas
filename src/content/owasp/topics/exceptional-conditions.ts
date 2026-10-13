import type { Topic } from "@/content/types";

export const exceptionalConditions: Topic = {
  domain: "owasp",
  slug: "exceptional-conditions",
  title: "A10 Mishandling of Exceptional Conditions",
  short: "errors, timeouts and odd inputs that leave the system open or leaking",
  tagline:
    "Security often depends on what happens when something goes wrong. If an error means \"allow\", a stack trace means \"here is my code\", or a half-finished operation means \"corrupted state\", the failure path is the vulnerability.",
  kind: "tecnica",
  stage: "operate",
  tools: ["Chaos engineering (fault injection)", "Fuzzers (AFL++, Atheris, go-fuzz)", "Semgrep (empty catch, swallowed errors)", "Hypothesis / property-based testing", "Toxiproxy"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Mishandling of exceptional conditions is improper preparation for, detection of, and response to unusual situations: failed dependencies, timeouts, malformed input, resource exhaustion, partial writes, and unexpected states. The typical mistakes are failing open, leaking details in error messages, swallowing exceptions, and leaving transactions half done.",
        "It is a new category in OWASP Top 10:2025 (A10), and it ties together several older weaknesses around error handling.",
      ],
    },
    {
      heading: "How the attack works",
      bullets: [
        "Fail open: an authorization service times out and the code treats the exception as \"no restriction\".",
        "Information leak: a database error is returned to the client with the table name, query and driver version.",
        "Swallowed errors: an empty catch hides a failed signature check and processing continues.",
        "Partial state: a payment is charged but the order write fails; retrying duplicates the charge.",
        "Resource exhaustion: an unbounded input or an unhandled exception in a loop lets one request take the service down.",
      ],
    },
    {
      heading: "Vulnerable code",
      body: ["The check fails open, the error leaks internals, and the multi-step update is not atomic."],
      code: [
        {
          language: "python",
          filename: "access.py",
          code: "def can_access(user, doc):\n    try:\n        return policy_service.allowed(user.id, doc.id)\n    except Exception:\n        return True                    # service is down, so let them in\n\n@app.errorhandler(Exception)\ndef on_error(e):\n    return str(e), 500                 # leaks internals to the client",
        },
        {
          language: "javascript",
          filename: "transfer.js",
          code: "await accounts.debit(from, amount);\nawait accounts.credit(to, amount);   // if this throws, the money has vanished",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Fail closed: on any doubt about a security decision, deny. Return a generic message with a correlation id to the client and keep the details in the logs. Make multi-step changes atomic with a transaction, and bound everything: time, size, retries, memory.",
      ],
      code: [
        {
          language: "python",
          filename: "access.py",
          code: "def can_access(user, doc):\n    try:\n        return policy_service.allowed(user.id, doc.id, timeout=0.5)\n    except Exception:\n        log.exception(\"policy check failed\", extra={\"user\": user.id, \"doc\": doc.id})\n        return False                   # fail closed\n\n@app.errorhandler(Exception)\ndef on_error(e):\n    rid = uuid4().hex\n    log.exception(\"unhandled error\", extra={\"request_id\": rid})\n    return {\"error\": \"internal error\", \"request_id\": rid}, 500",
        },
        {
          language: "javascript",
          filename: "transfer.js",
          code: "await db.transaction(async (trx) => {\n  await accounts.debit(from, amount, trx);\n  await accounts.credit(to, amount, trx);   // both happen or neither does\n});",
        },
        {
          language: "go",
          filename: "client.go",
          code: "ctx, cancel := context.WithTimeout(r.Context(), 800*time.Millisecond)\ndefer cancel()\n\nresp, err := policy.Check(ctx, user, doc)\nif err != nil {\n\tlog.Error(\"policy check failed\", \"err\", err)\n\thttp.Error(w, \"forbidden\", http.StatusForbidden) // fail closed\n\treturn\n}",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "Inject the failure on purpose. Make the dependency time out and assert that access is denied; make the second step throw and assert that nothing changed; trigger an error and assert that the response carries no internals. Fuzzing adds odd inputs you did not think of.",
      ],
      code: [
        {
          language: "python",
          filename: "test_failures.py (pytest)",
          code: "def test_denies_when_policy_service_is_down(monkeypatch, user, doc):\n    monkeypatch.setattr(policy_service, \"allowed\", lambda *a, **k: (_ for _ in ()).throw(TimeoutError()))\n    assert can_access(user, doc) is False\n\ndef test_error_response_has_no_internals(client, monkeypatch):\n    monkeypatch.setattr(db, \"query\", lambda *a, **k: (_ for _ in ()).throw(RuntimeError(\"relation users_secret does not exist\")))\n    body = client.get(\"/api/things\").get_json()\n    assert \"users_secret\" not in str(body) and \"request_id\" in body\n\n@given(st.text())\ndef test_parser_never_crashes_on_any_text(s):      # Hypothesis\n    parse_input(s)       # may reject (ValueError) but must not raise anything else",
        },
        {
          language: "javascript",
          filename: "transfer.test.js",
          code: "test(\"a failed credit rolls back the debit\", async () => {\n  jest.spyOn(accounts, \"credit\").mockRejectedValue(new Error(\"boom\"));\n  const before = await accounts.balance(from);\n  await expect(transfer(from, to, 50)).rejects.toThrow();\n  expect(await accounts.balance(from)).toBe(before);\n});",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Decide the failure behavior of every security check up front: it should deny.",
        "Catch narrowly; never leave an empty catch; log with context and re-raise or return a safe error.",
        "Return generic errors with a correlation id; keep stack traces and queries in logs only.",
        "Use transactions and idempotency keys for multi-step operations, so retries are safe.",
        "Set timeouts, size limits, rate limits and retry budgets on every external call and input.",
        "Practice failure: fault injection, fuzzing and game days reveal fail-open paths before attackers do.",
      ],
    },
  ],
};
