import type { Topic } from "@/content/types";

export const insecureDesign: Topic = {
  domain: "owasp",
  slug: "insecure-design",
  title: "A06 Insecure Design",
  short: "a flaw in the idea itself, which no amount of clean code fixes",
  tagline:
    "A perfect implementation of a bad design is still a vulnerability. Security has to be asked for before the first line of code, as a requirement, not found afterwards as a bug.",
  kind: "conceito",
  stage: "design",
  tools: ["OWASP Threat Dragon", "Microsoft Threat Modeling Tool", "STRIDE", "OWASP ASVS", "OWASP SAMM", "abuse-case workshops"],
  sections: [
    {
      heading: "What it is",
      body: [
        "Insecure design is a weakness in how a feature is conceived: a missing control, a trust assumption that does not hold, or a business flow that can be abused as written. It differs from an implementation bug. A bug is code that does not do what the design says; an insecure design is code that does exactly what the design says, and the design is the problem.",
        "OWASP Top 10:2025 keeps it as A06. The fix is a practice more than a patch: threat model early, write abuse cases next to use cases, and reuse secure design patterns.",
      ],
    },
    {
      heading: "How the attack works",
      bullets: [
        "A password reset that asks \"what was your first pet?\" lets anyone who can research you take over the account.",
        "A coupon endpoint with no limit per customer lets a script drain the promotion in minutes.",
        "A ticketing flow that holds seats without expiry lets a bot lock the whole venue.",
        "A multi-step checkout that trusts the price sent in the final step lets users pay what they like.",
        "A \"forgot username\" form that reveals whether an e-mail is registered enables account enumeration.",
      ],
    },
    {
      heading: "Vulnerable design, in code",
      body: ["The code below is clean and bug-free. The design lets an attacker try unlimited promo codes and trusts a client-supplied price."],
      code: [
        {
          language: "python",
          filename: "checkout.py",
          code: "@app.post(\"/api/checkout\")\n@login_required\ndef checkout():\n    data = request.get_json()\n    total = data[\"total\"]                       # price decided by the client\n    code = data.get(\"promo\")\n    if code and Promo.query.filter_by(code=code).first():\n        total = total * 0.5                     # unlimited attempts, unlimited reuse\n    return charge(current_user, total)",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Design controls into the flow: the server computes the price from trusted data, a promo code is single-use per account and attempts are rate limited, and the limits are business rules written down before coding. The abuse case \"enumerate promo codes\" produced the requirement.",
      ],
      code: [
        {
          language: "python",
          filename: "checkout.py",
          code: "@app.post(\"/api/checkout\")\n@login_required\n@rate_limit(\"10/minute\", key=lambda: current_user.id)\ndef checkout():\n    cart = Cart.for_user(current_user)           # server-side source of truth\n    total = cart.total()                         # prices come from the catalog\n    code = request.get_json().get(\"promo\")\n    if code:\n        promo = Promo.redeem(code, user=current_user)   # single use per user, atomic\n        if promo is None:\n            abort(400, \"invalid promo\")\n        total = promo.apply(total)\n    return charge(current_user, total)",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "A design control needs a test written from the abuse case, not from the happy path. Each abuse case you listed becomes an automated test: the client cannot set the price, a code cannot be reused, and a burst of attempts is throttled.",
      ],
      code: [
        {
          language: "python",
          filename: "test_checkout_abuse.py (pytest)",
          code: "def test_client_cannot_choose_the_price(client, alice, cart_of_100):\n    r = client.post(\"/api/checkout\", json={\"total\": 1}, auth=alice)\n    assert charged_amount(r) == 100\n\ndef test_promo_is_single_use(client, alice, promo_half_off):\n    assert client.post(\"/api/checkout\", json={\"promo\": promo_half_off}, auth=alice).status_code == 200\n    assert client.post(\"/api/checkout\", json={\"promo\": promo_half_off}, auth=alice).status_code == 400\n\ndef test_promo_guessing_is_throttled(client, alice):\n    codes = [client.post(\"/api/checkout\", json={\"promo\": f\"TRY{i}\"}, auth=alice).status_code for i in range(30)]\n    assert 429 in codes",
        },
        {
          language: "markdown",
          filename: "abuse-cases.md (lives next to the user stories)",
          code: "As an attacker I want to guess promo codes so that I get discounts I should not.\n  -> control: rate limit per account and per IP, codes are long and random, single use\n  -> test: test_promo_guessing_is_throttled\n\nAs a customer I want to change the price in the request so that I pay less.\n  -> control: price is computed on the server from the catalog\n  -> test: test_client_cannot_choose_the_price",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Threat model new features before building: what are we protecting, who attacks it, what stops them (STRIDE is a fine start).",
        "Write abuse cases next to use cases and turn each into a requirement and a test.",
        "Reuse vetted patterns (authentication, rate limiting, secure session handling) instead of inventing them.",
        "Separate tenants and trust levels by design; limit resource use per user.",
        "Use a standard such as OWASP ASVS to turn \"be secure\" into checkable requirements.",
        "Revisit the model when the design changes, not once per year.",
      ],
    },
  ],
};
