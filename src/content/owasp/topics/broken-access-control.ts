import type { Topic } from "@/content/types";

export const brokenAccessControl: Topic = {
  domain: "owasp",
  slug: "broken-access-control",
  title: "A01 Broken Access Control",
  short: "users acting outside the permissions they were meant to have",
  tagline:
    "Authentication says who you are; access control says what you may do. When the server forgets to check on every request, changing an id in a URL is all an attacker needs.",
  kind: "tecnica",
  stage: "design",
  tools: ["Burp Suite (Autorize)", "OWASP ZAP", "Postman or curl with two accounts", "Semgrep", "Casbin / OPA"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Access control enforces policy so users cannot act outside their intended permissions. It breaks when the server trusts something the client controls: an id in the URL, a hidden field, a role claim, a cookie. The result is reading other people's data, changing it, or reaching admin functions.",
        "OWASP Top 10:2025 lists it as A01. The two everyday shapes are IDOR (insecure direct object reference, also called BOLA in API security): the request names an object and the server returns it without asking whether the caller owns it; and missing function-level checks: an endpoint exists for admins, but nothing stops a normal user from calling it.",
      ],
    },
    {
      heading: "How the attack works",
      body: [
        "The attacker logs in as a normal user, opens the browser's network tab, and finds a request like GET /api/invoices/1041. They change 1041 to 1042 and read someone else's invoice. If ids are sequential, a ten-line script walks the whole table.",
      ],
      bullets: [
        "Change an id in the path, query string, JSON body or a header, and see if the answer changes owner.",
        "Call an admin or internal route directly (/admin/users, DELETE /api/users/7) with a normal session.",
        "Send extra fields the form never shows (\"role\": \"admin\"): mass assignment lets the client set what it should not.",
        "Hide the button in the UI: the UI is not a control, the server is.",
      ],
    },
    {
      heading: "Vulnerable code",
      body: ["Each handler checks that the user is logged in, then loads the object by id alone. Nothing ties the invoice to the caller."],
      code: [
        {
          language: "javascript",
          filename: "invoices.js (Express + Prisma)",
          code: "app.get(\"/api/invoices/:id\", requireLogin, async (req, res) => {\n  const invoice = await db.invoice.findUnique({ where: { id: Number(req.params.id) } });\n  res.json(invoice); // any logged-in user can read any invoice\n});",
        },
        {
          language: "python",
          filename: "invoices.py (Flask + SQLAlchemy)",
          code: "@app.get(\"/api/invoices/<int:invoice_id>\")\n@login_required\ndef get_invoice(invoice_id):\n    invoice = Invoice.query.get_or_404(invoice_id)\n    return jsonify(invoice.to_dict())",
        },
        {
          language: "java",
          filename: "InvoiceController.java (Spring)",
          code: "@GetMapping(\"/api/invoices/{id}\")\npublic Invoice get(@PathVariable long id) {\n    return repo.findById(id).orElseThrow(NotFoundException::new);\n}",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Put ownership in the query itself, so a row that is not yours is simply not found. Answer the same way for \"does not exist\" and \"is not yours\" so the response does not confirm which ids are valid. The rule is the same in every language: authorize on the server, on every request, deny by default.",
      ],
      code: [
        {
          language: "javascript",
          filename: "invoices.js",
          code: "app.get(\"/api/invoices/:id\", requireLogin, async (req, res) => {\n  const invoice = await db.invoice.findFirst({\n    where: { id: Number(req.params.id), ownerId: req.user.id },\n  });\n  if (!invoice) return res.status(404).end();\n  res.json(invoice);\n});",
        },
        {
          language: "python",
          filename: "invoices.py",
          code: "@app.get(\"/api/invoices/<int:invoice_id>\")\n@login_required\ndef get_invoice(invoice_id):\n    invoice = Invoice.query.filter_by(\n        id=invoice_id, owner_id=current_user.id\n    ).first_or_404()\n    return jsonify(invoice.to_dict())",
        },
        {
          language: "java",
          filename: "InvoiceController.java",
          code: "@GetMapping(\"/api/invoices/{id}\")\npublic Invoice get(@PathVariable long id, @AuthenticationPrincipal User user) {\n    return repo.findByIdAndOwnerId(id, user.getId())\n               .orElseThrow(NotFoundException::new);\n}",
        },
        {
          language: "javascript",
          filename: "admin.js (function-level check, deny by default)",
          code: "const requireRole = (role) => (req, res, next) =>\n  req.user?.roles?.includes(role) ? next() : res.status(403).end();\n\napp.delete(\"/api/users/:id\", requireLogin, requireRole(\"admin\"), deleteUser);",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "A regression test uses two users. User A creates an invoice; user B asks for it and must get a 404 (or 403), and an anonymous call must get a 401. Run it in CI so a refactor cannot quietly remove the check. The same test shape works in any language and for any object type.",
      ],
      code: [
        {
          language: "python",
          filename: "test_invoices_access.py (pytest)",
          code: "def test_user_cannot_read_other_users_invoice(client, alice, bob):\n    invoice_id = client.post(\"/api/invoices\", json={\"total\": 10}, auth=alice).json()[\"id\"]\n\n    assert client.get(f\"/api/invoices/{invoice_id}\", auth=alice).status_code == 200\n    assert client.get(f\"/api/invoices/{invoice_id}\", auth=bob).status_code == 404\n    assert client.get(f\"/api/invoices/{invoice_id}\").status_code == 401",
        },
        {
          language: "javascript",
          filename: "invoices.test.js (supertest)",
          code: "test(\"bob cannot read alice's invoice\", async () => {\n  const { body } = await request(app).post(\"/api/invoices\").set(alice).send({ total: 10 });\n  await request(app).get(`/api/invoices/${body.id}`).set(bob).expect(404);\n  await request(app).get(`/api/invoices/${body.id}`).expect(401);\n});",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Deny by default: a route with no explicit rule is forbidden, not open.",
        "Enforce ownership in one shared place (a query helper, a policy engine), not by copy-pasting checks per handler.",
        "Do not trust ids, roles or prices that come from the client. Derive identity from the session.",
        "Use unpredictable ids where useful (UUIDs), but never as the only control: an unguessable id is not authorization.",
        "Log access-control failures and alert on bursts: someone enumerating ids is visible.",
        "Test with two accounts on every release. Automated scanners rarely understand who should see what.",
      ],
    },
  ],
};
