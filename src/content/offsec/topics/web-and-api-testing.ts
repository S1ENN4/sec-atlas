import type { Topic } from "@/content/types";

export const webAndApiTesting: Topic = {
  domain: "offsec",
  slug: "web-and-api-testing",
  title: "Web and API security testing",
  short: "a method for testing authentication, authorization and input handling, with two accounts and an intercepting proxy",
  tagline:
    "Most serious web findings come from a short list of questions: who can see what, who can change what, and what happens to input that is not what the developer expected. A proxy and two accounts answer most of them.",
  kind: "tecnica",
  stage: "discover",
  tools: ["Burp Suite", "OWASP ZAP", "ffuf (authorized content discovery)", "Postman", "curl", "Nuclei (authorized targets)"],
  sections: [
    {
      heading: "Set up",
      bullets: [
        "Route your browser through an intercepting proxy (Burp, ZAP) so you can see, replay and modify every request.",
        "Create at least two test accounts at the same privilege level, and one at a higher level if scope allows. Authorization bugs are found by comparing accounts.",
        "Map the application: pages, API routes, parameters, roles, file uploads, integrations. The API schema (OpenAPI) is a gift when it exists.",
        "Note which requests are authenticated and how: cookie, bearer token, API key.",
      ],
    },
    {
      heading: "A testing checklist",
      body: ["Work through the categories of the OWASP Top 10 and the Web Security Testing Guide. The domain on this site for the OWASP Top 10 shows the fix for each; here is how to look for it."],
      bullets: [
        "Access control: replay account A's requests with account B's token; change ids; call admin routes as a normal user; try methods the UI never uses.",
        "Authentication and session: rate limiting on login and reset, session expiry and rotation, cookie flags, token validation.",
        "Injection: send unexpected characters and types to every parameter, headers and JSON fields, and watch for errors or changed behavior.",
        "Business logic: skip steps, repeat steps, change quantities and prices, race two requests at once.",
        "Misconfiguration: verbose errors, debug endpoints, directory listing, permissive CORS, missing headers.",
        "File handling: type and size checks, path handling, where uploads are stored and served.",
      ],
    },
    {
      heading: "Example: an authorization check with two accounts",
      body: ["Automate the repetitive comparison, and keep the test read-only. This script, for an authorized target, checks whether account B can read objects created by account A."],
      code: [
        {
          language: "python",
          filename: "bola_check.py (authorized targets only)",
          code: "import requests\n\nBASE = \"https://api.example.com/v2\"\nA = {\"Authorization\": \"Bearer <token for tester-a>\"}\nB = {\"Authorization\": \"Bearer <token for tester-b>\"}\n\n# objects that account A owns (listed with A's own token)\nids = [o[\"id\"] for o in requests.get(f\"{BASE}/invoices\", headers=A, timeout=10).json()]\n\nfor oid in ids:\n    r = requests.get(f\"{BASE}/invoices/{oid}\", headers=B, timeout=10)\n    verdict = \"VULNERABLE\" if r.status_code == 200 else \"ok\"\n    print(f\"{oid}: B -> {r.status_code} {verdict}\")",
        },
        {
          language: "bash",
          filename: "content discovery at a polite rate (authorized targets only)",
          code: "ffuf -u https://app.example.com/FUZZ -w common-paths.txt -rate 10 -mc 200,204,301,302,401,403 -o ffuf.json",
        },
      ],
    },
    {
      heading: "Test APIs deliberately",
      bullets: [
        "Object-level authorization (BOLA) and function-level authorization are the most common API findings.",
        "Mass assignment: send extra fields (role, isAdmin, price) that the client never sends.",
        "Excessive data exposure: the API returns whole objects and the UI hides fields; read the raw response.",
        "Rate limits and resource limits on expensive operations.",
        "Version drift: old API versions and undocumented routes that lack the controls of the new ones.",
        "Stay within the rules of engagement: test with test data, avoid destructive calls, and keep your request rate low.",
      ],
    },
  ],
};
