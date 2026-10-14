// Prose for the Atlas Maps case study and its lab (English source; pt/es are overlays).
import type { ChallengeText, NodeText } from "./text";

export const atlasNodes = {
  atlas: {
    title: "Atlas Maps Inc.",
    summary:
      "A made-up company that sells map tiles and a routing API to delivery apps: about 60 people, three engineering squads, a public website, an API, a database and a cloud account. Everything here is invented, but the mistakes are real.",
    points: [
      "Open any part of the company to see its real files, with the flaws they would really have.",
      "Each flaw links to the general idea on the other maps, and some to a hands-on lab.",
      "Start with the mission \"First week at Atlas\", or jump to \"The leaked key\" to follow one incident end to end.",
    ],
  },
  "a-site": {
    title: "Website and dashboard",
    summary: "The public marketing site and the customer dashboard where delivery companies manage their maps and API keys.",
    points: [
      "It is built with a modern JavaScript framework and served through a CDN.",
      "Customers type text into it (map names, notes), and other people read that text.",
      "The browser is the weakest point: anything shown from user input must be treated with care.",
    ],
  },
  "a-site-xss": {
    title: "Map cards",
    summary: "The dashboard shows each customer map as a card, and support agents see the same cards when they help someone.",
    points: [
      "The map title comes from the customer and is placed into the page as HTML.",
      "Anyone who can name a map can run script in the browser of whoever views the card.",
      "Try it for real in the lab, then fix it.",
    ],
  },
  "a-site-headers": {
    title: "Security headers",
    summary: "The framework adds response headers that tell browsers how strictly to treat the site.",
    points: [
      "The content security policy limits where scripts can load from.",
      "HSTS keeps visitors on HTTPS, and nosniff stops type guessing.",
      "These headers are a second line of defence, not a fix for the card above.",
    ],
  },
  "a-site-login": {
    title: "Dashboard login",
    summary: "Customers sign in with email and password, plus a one-time code, and get a session cookie.",
    points: [
      "Passwords are stored as slow hashes and attempts are rate limited.",
      "The session cookie is Secure, HttpOnly and SameSite.",
      "Support staff use single sign-on with hardware keys, never shared passwords.",
    ],
  },
  "a-api": {
    title: "Public API",
    summary: "The product itself: customers call it with an API key to fetch maps, search places and plan routes.",
    points: [
      "Every request carries an API key that identifies one customer.",
      "The API reads from the database on every call, so mistakes here touch customer data directly.",
      "Two endpoints below hide classic flaws.",
    ],
  },
  "a-api-idor": {
    title: "Fetch a map",
    summary: "GET /v1/maps/:id returns a map as JSON. The endpoint checks that the caller has a valid key.",
    points: [
      "A valid key proves who the customer is, not which maps they may read.",
      "Map ids are small sequential numbers, easy to guess.",
      "Swap the id in the lab and see whose data comes back.",
    ],
  },
  "a-api-search": {
    title: "Search maps",
    summary: "GET /v1/search?q= finds a customer's maps by name. The query is built as a string and sent to the database.",
    points: [
      "The search text is pasted into the SQL statement.",
      "A single quote in the text can change what the statement means.",
      "In the lab you will see the generated SQL and what a crafted search can pull out.",
    ],
  },
  "a-api-keys": {
    title: "API keys",
    summary: "Keys are random secrets shown once. The API stores only a hash and looks the customer up from it.",
    points: [
      "A leaked database does not leak usable keys, because only hashes are stored.",
      "Keys can be rotated by the customer at any time.",
      "A key found in public code is still a live key until it is revoked.",
    ],
  },
  "a-api-limits": {
    title: "Rate limits",
    summary: "Each key may make a limited number of requests per minute, and heavy endpoints have tighter limits.",
    points: [
      "Limits protect the service from accidents as much as from attackers.",
      "Odd spikes on one key are a useful alert signal.",
      "Customers get clear errors telling them when to retry.",
    ],
  },
  "a-data": {
    title: "Data",
    summary: "A relational database for customers, keys and maps, and object storage for the map tiles.",
    points: [
      "Customer routes can reveal where people live and work, so they count as sensitive.",
      "Tiles are public by design; everything else is not.",
      "Access to each store is granted to specific roles, not to everyone.",
    ],
  },
  "a-db": {
    title: "Database roles",
    summary: "The application connects as a role that can read and write maps but cannot change the schema.",
    points: [
      "Schema changes run as a separate migration role.",
      "The app role has no permission to drop tables or read what it does not need.",
      "A bug in the app is limited by what the role is allowed to do.",
    ],
  },
  "a-tiles": {
    title: "Tile bucket",
    summary: "Map tiles are served from object storage behind a CDN. They are meant to be readable by anyone.",
    points: [
      "Public read is the intended design for tiles.",
      "Public write or delete is never intended.",
      "Check what the policy allows, not only who it allows.",
    ],
  },
  "a-customer-data": {
    title: "Customer data",
    summary: "Routes, delivery stops and API usage belong to the customers who create them.",
    points: [
      "Keep it only as long as the contract needs, then delete it.",
      "Encrypt it at rest and limit who at Atlas can see it.",
      "Customers will ask for proof of how it is protected, which is where compliance comes in.",
    ],
  },
  "a-repo": {
    title: "GitHub repository",
    summary: "One monorepo on GitHub holds the API, the website, the infrastructure code and the pipeline definitions.",
    points: [
      "Whoever can change the repository can change what runs in production.",
      "People, bots and pipelines all commit here.",
      "Everything in it is permanent: removing a file does not remove it from history.",
    ],
  },
  "a-repo-secret": {
    title: "A pull request with secrets",
    summary: "A developer adds a local settings file to a pull request. The reviewer is busy and merges it.",
    points: [
      "The file holds a database password and a cloud access key.",
      "A public mirror of the repository copies the commit within minutes.",
      "A secrets scanner or push protection would have stopped it. Spot the risky lines.",
    ],
  },
  "a-repo-protection": {
    title: "Branch protection",
    summary: "The main branch requires a pull request, one approval and passing checks before anything merges.",
    points: [
      "That rule did not run on the day of the leak, because an administrator bypassed it.",
      "Rules that admins can skip are suggestions, not controls.",
      "Required checks include the secrets scan and the code scan.",
    ],
  },
  "a-codeowners": {
    title: "Code owners",
    summary: "The security team must approve any change to workflows, infrastructure and authentication code.",
    points: [
      "It puts the right reviewer in front of the riskiest files.",
      "Owners are teams, so reviews do not depend on one person.",
      "It works only when branch protection requires code owner review.",
    ],
  },
  "a-pipeline": {
    title: "Build and deploy pipeline",
    summary: "GitHub Actions tests the code, builds containers, pushes them to a registry and deploys to the cloud.",
    points: [
      "The pipeline holds powerful credentials, so it is a target.",
      "A change to a workflow file changes what runs with those credentials.",
      "One workflow below has several of the classic mistakes.",
    ],
  },
  "a-ci": {
    title: "The deploy workflow",
    summary: "A workflow meant to preview a pull request and deploy it. It was written quickly, and it shows.",
    points: [
      "It runs on a trigger that gives untrusted pull requests access to secrets.",
      "It checks out and runs code from the pull request, and prints its title into a shell.",
      "Find the five lines that together let an outsider reach production credentials.",
    ],
  },
  "a-supply": {
    title: "Dependencies and images",
    summary: "The API and the website pull in hundreds of open source packages and build on public base images.",
    points: [
      "A bot opens update pull requests weekly, and a scan blocks known-vulnerable packages.",
      "An SBOM is stored for every release.",
      "Images are signed, and the cluster only runs signed images.",
    ],
  },
  "a-cloud": {
    title: "Cloud account",
    summary: "Separate cloud accounts for production, staging and security tooling, managed as code.",
    points: [
      "Identity and permissions decide what a compromised workload can do.",
      "Networks are split so the database is not reachable from the internet.",
      "Audit logs from every account go to the security account.",
    ],
  },
  "a-iam": {
    title: "The API's cloud role",
    summary: "The role the API runs as. It should only read tiles, but it was given more.",
    points: [
      "Two statements use wildcards on resources and actions.",
      "A bug that reaches the cloud API through this role could read every secret in the account.",
      "Find the two statements that give far more than the API needs.",
    ],
  },
  "a-network": {
    title: "Network layout",
    summary: "A public load balancer in front, private subnets for the API, and an isolated subnet for the database.",
    points: [
      "Only the load balancer accepts traffic from the internet.",
      "The database accepts connections only from the API's security group.",
      "Administration goes through a managed session service, not open SSH.",
    ],
  },
  "a-logging": {
    title: "Logs and posture",
    summary: "Cloud audit logs, load balancer logs and application logs are collected centrally.",
    points: [
      "Logs go to a separate account that production cannot edit.",
      "A posture scanner checks accounts daily against a benchmark.",
      "This is what made the incident visible in hours instead of months.",
    ],
  },
  "a-ops": {
    title: "Security operations",
    summary: "A small team watches alerts, shares an on-call rotation with engineering and keeps runbooks for common cases.",
    points: [
      "Detection depends on collecting the right logs.",
      "Response depends on clear steps and fast decisions.",
      "Open the incident to see how the leaked key was found.",
    ],
  },
  "a-alert": {
    title: "The 3 a.m. alert",
    summary: "The SIEM flags a cloud key used from a country Atlas has never worked in.",
    points: [
      "The key belongs to the CI deploy identity, which no human should use.",
      "It was used to list the tile bucket, an action CI never does.",
      "Severity is high: a valid credential is in the hands of someone unknown.",
    ],
  },
  "a-incident": {
    title: "Incident timeline",
    summary: "Reconstructing what happened from the pull request to the revocation of the key.",
    points: [
      "The key was exposed for about 34 hours before anyone used it, and used for only a few minutes.",
      "Containment was revoking the key and rotating related secrets.",
      "The access logs showed only tile listing and downloads, so no customer data was reached.",
    ],
  },
  "a-runbook": {
    title: "Leaked credential runbook",
    summary: "Steps the on-call engineer follows when a credential may be exposed.",
    points: [
      "Revoke first, investigate second, and keep the evidence.",
      "Rotate everything the credential could reach.",
      "Review access logs for what was touched, then write it down for the review.",
    ],
  },
  "a-govern": {
    title: "Customers and compliance",
    summary: "Large customers ask Atlas to prove it protects their data: security questionnaires, audits and contracts.",
    points: [
      "Good engineering habits are what make the evidence easy to produce.",
      "Atlas also depends on suppliers, and its customers depend on Atlas.",
      "Findings from audits and tests need owners and dates.",
    ],
  },
  "a-soc2": {
    title: "SOC 2 audit",
    summary: "An independent auditor checks that Atlas follows its own security policies over several months.",
    points: [
      "Controls such as access reviews, change approval and logging produce the evidence.",
      "An exception, like the admin bypass of branch protection, becomes an audit finding.",
      "Automated checks make audits routine instead of a scramble.",
    ],
  },
  "a-vendors": {
    title: "Supplier risk",
    summary: "The CDN, the cloud, the email provider and the SIEM all hold part of Atlas's risk.",
    points: [
      "Rank suppliers by what data and access they have.",
      "Ask for their security reports and review them.",
      "Plan what happens if a supplier is breached or goes down.",
    ],
  },
  "a-pentest": {
    title: "Penetration test report",
    summary: "An outside team tested the API and the dashboard and delivered a report with prioritised findings.",
    points: [
      "It found the map ownership flaw and the injectable search.",
      "Each finding has a severity, evidence and a fix recommendation.",
      "Triage turns the report into tickets with owners and deadlines, then retests after fixes.",
    ],
  },
} satisfies Record<string, NodeText>;

export const atlasMissions = {
  "first-week": { title: "First week at Atlas", intro: "Meet every part of the company, from the website to the auditors." },
  "the-leaked-key": { title: "The leaked key", intro: "Follow one incident from a careless pull request to a revoked key." },
  "ship-the-fixes": { title: "Ship the fixes", intro: "Find the flaw in four files the pentest flagged." },
};

export const atlasChallenges = {
  "a-site-xss": {
    prompt: "Customers name their own maps. Which line lets a map title run script in someone else's browser?",
    why: "dangerouslySetInnerHTML (line 4) inserts the title as raw HTML, so a title that contains script or an image with an error handler executes for every viewer, including support agents. Render the title as text, which the framework escapes for you.",
    hint: "One line, and the property name warns you.",
  },
  "a-api-idor": {
    prompt: "A valid API key reaches this endpoint. Which line forgets to check whose map it is?",
    why: "Line 2 loads a map by id alone. The key proves which customer is calling, but nothing compares it to the map's owner, so any customer can read any map by changing the number. Load it with the owner in the filter, for example by id and customer id together.",
    hint: "The route checks the key. What does the query not ask?",
  },
  "a-api-search": {
    prompt: "Which line lets a search term change the meaning of the database query?",
    why: "Line 3 builds the SQL by pasting the search text between quotes. A quote in the text closes the string, and whatever follows becomes SQL. Use a parameter placeholder and pass the text separately, so the database always treats it as data.",
    hint: "Look for string interpolation inside the SQL.",
  },
  "a-tiles": {
    prompt: "Tiles are meant to be public to read. Which line goes too far?",
    why: "Principal * is fine for public tiles, but Action s3:* (line 11) also lets anyone upload, overwrite or delete objects and even change the bucket. Public tiles need only s3:GetObject on the objects.",
    hint: "Public read is by design. Public write is not.",
  },
  "a-repo-secret": {
    prompt: "Which added lines should never have been committed?",
    why: "Line 7 holds a database password and lines 8 and 9 hold a cloud access key and its secret. Once pushed they are in the history forever, even if the file is deleted later, so they must be revoked. The port on line 6 is harmless.",
    hint: "Three lines: one connection string and two cloud credentials.",
  },
  "a-ci": {
    prompt: "Which five lines let an outsider's pull request reach production credentials?",
    why: "pull_request_target (line 3) runs with secrets and a write token, write-all (line 5) hands every step full permissions, checking out the pull request head (line 12) runs the outsider's code, the title in the echo (line 13) is injected into a shell, and a branch reference (line 14) lets the action change under you. The long-lived keys on lines 16 and 17 should also become short-lived OIDC credentials.",
    hint: "A trigger, a permission, a checkout, an injection and an unpinned action.",
  },
  "a-iam": {
    prompt: "The API only needs to read tiles. Which statements give it far too much?",
    why: "secretsmanager:* on every resource (line 6) lets the role read every secret in the account, and iam:PassRole on every resource (line 7) lets it hand powerful roles to new workloads, a classic path to full account takeover. Keep only s3:GetObject on the tile objects.",
    hint: "Two statements with a wildcard on resources.",
  },
} satisfies Record<string, ChallengeText>;
