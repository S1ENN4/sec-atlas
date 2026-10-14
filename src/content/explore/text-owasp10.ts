// Prose for the OWASP Top 10 world (English source; pt/es are overlays).
import type { ChallengeText, NodeText } from "./text";

export const owasp10Nodes = {
  owasp10: {
    title: "OWASP Top 10, hands on",
    summary: "One challenge for each category of the OWASP Top 10 (2025). Each station shows a few lines of real-looking code: find the ones that cause the problem.",
    points: [
      "Open a station, read the code and select the lines you think are wrong.",
      "After you answer, the explanation shows what to change and links to the full topic.",
      "The same flaws appear again and again in real incidents, so it pays to recognise them on sight.",
    ],
  },
  "o-a01": {
    title: "A01 Broken access control",
    summary: "The user is logged in, but nobody checks whether they are allowed to do this particular thing.",
    points: [
      "Logging in answers who you are, not what you may do.",
      "Check the role or ownership on the server for every sensitive action.",
      "Hiding a button in the interface protects nothing.",
    ],
  },
  "o-a02": {
    title: "A02 Security misconfiguration",
    summary: "The software is fine, the settings are not: debug on, open CORS and default passwords.",
    points: [
      "Production needs its own settings, not the defaults from development.",
      "Wide-open values such as '*' are convenient and dangerous.",
      "Scan configuration automatically, because people forget.",
    ],
  },
  "o-a03": {
    title: "A03 Software supply chain failures",
    summary: "You run code you did not write: dependencies, install scripts and build tools can all be a way in.",
    points: [
      "Pin versions and use a lockfile so a surprise update cannot slip in.",
      "A private package name without a pinned source can be hijacked from the public registry.",
      "Never pipe a download straight into a shell.",
    ],
  },
  "o-a04": {
    title: "A04 Cryptographic failures",
    summary: "Weak algorithms, predictable randomness or plain HTTP expose data that was meant to be protected.",
    points: [
      "Hash passwords with a slow, salted function such as Argon2, scrypt or bcrypt.",
      "Use a cryptographically secure random source for tokens.",
      "Send everything over TLS, and nothing sensitive over plain HTTP.",
    ],
  },
  "o-a05": {
    title: "A05 Injection",
    summary: "Untrusted input is glued into a command or query, so data becomes instructions.",
    points: [
      "The same pattern appears in SQL, shell, LDAP, templates and more.",
      "Use parameterised APIs that keep data and commands apart.",
      "Validate input, but do not rely on it alone.",
    ],
  },
  "o-a06": {
    title: "A06 Insecure design",
    summary: "The code does exactly what was designed, and the design never imagined an attacker.",
    points: [
      "Ask 'how could this be abused?' before building, with threat modelling.",
      "Every guessable secret needs attempt limits and an expiry.",
      "Some flaws cannot be fixed by a patch because the design is the problem.",
    ],
  },
  "o-a07": {
    title: "A07 Authentication failures",
    summary: "The login itself is weak: it leaks which accounts exist, stores passwords badly or reuses sessions.",
    points: [
      "Return the same message whether the user or the password was wrong.",
      "Store only password hashes, and compare them safely.",
      "Start a fresh session after login and limit repeated attempts.",
    ],
  },
  "o-a08": {
    title: "A08 Software or data integrity failures",
    summary: "The app trusts data or code it never verified, such as serialized objects or downloaded scripts.",
    points: [
      "Deserializing untrusted data can run code of the attacker's choosing.",
      "Executing downloaded code without checking a signature hands over control.",
      "Prefer plain data formats and verify signatures on anything you run.",
    ],
  },
  "o-a09": {
    title: "A09 Security logging and alerting failures",
    summary: "When something goes wrong nobody knows, or the logs themselves leak what they should protect.",
    points: [
      "Log failed logins and other security events, with enough context to investigate.",
      "Never write passwords, tokens or personal data to the log.",
      "A log nobody watches is not detection: add alerts.",
    ],
  },
  "o-a10": {
    title: "A10 Mishandling of exceptional conditions",
    summary: "What the code does when something breaks: it should fail safe, not open.",
    points: [
      "On error, deny by default instead of allowing.",
      "Do not swallow exceptions silently, handle them and record them.",
      "Test the failure paths, because attackers will trigger them.",
    ],
  },
} satisfies Record<string, NodeText>;

export const owasp10Missions = {
  "owasp10-walk": { title: "The whole Top 10", intro: "Take the ten stations in order and solve one challenge for each category." },
  "owasp10-login": { title: "Break the login", intro: "Four stations that all come together around a login: the password, the token, the log and the error path." },
};

export const owasp10Challenges = {
  "o-a01": {
    prompt: "Any logged-in user can call this endpoint. Which line is the problem?",
    why: "Line 1 only requires a login. There is no check that the caller is an admin, so any user can promote themselves. Add a role check (for example requireRole('admin')) on the server.",
    hint: "Look at what protects the route.",
  },
  "o-a02": {
    prompt: "Which settings should never reach production?",
    why: "Debug mode (line 2) leaks stack traces and internals, a wildcard CORS origin (line 3) lets any site call the API from a browser, and a default admin password (line 4) is the first thing attackers try. Turn debug off, list the exact origins and use a strong, unique secret.",
    hint: "Three lines are convenient in development and dangerous in production.",
  },
  "o-a03": {
    prompt: "Which two lines put the supply chain at risk?",
    why: "An internal package with version '*' (line 4) can be replaced by a public package of the same name with a higher version, which is dependency confusion. The postinstall script (line 7) downloads and runs code from the internet on every install. Pin versions, use a private registry scope and avoid piping downloads to a shell.",
    hint: "One is a version range, the other runs a download.",
  },
  "o-a04": {
    prompt: "Which lines are cryptographic failures?",
    why: "MD5 (line 4) is fast and unsalted, so passwords are cracked quickly; use Argon2, scrypt or bcrypt. random (line 7) is predictable, so reset tokens can be guessed; use the secrets module. The http URL (line 9) sends credentials in clear text; use https.",
    hint: "A weak hash, a weak random source and a weak transport.",
  },
  "o-a05": {
    prompt: "Which line lets an attacker run their own commands?",
    why: "Line 4 builds a shell command with the host value, so input like '8.8.8.8; cat /etc/passwd' runs a second command. Call the program without a shell, passing the argument as a list, and validate that the host looks like a host.",
    hint: "Where does user input meet the shell?",
  },
  "o-a06": {
    prompt: "The code works as written. Which lines make the design weak?",
    why: "A 4-digit code (line 2) has only 10,000 possibilities, and the comparison (line 3) has no attempt limit or expiry, so an attacker can try them all. Use a longer random token, expire it quickly and lock after a few failures.",
    hint: "Think about how many guesses an attacker gets.",
  },
  "o-a07": {
    prompt: "Which lines weaken this login?",
    why: "The different messages (line 3) reveal which emails exist, comparing plain text (line 4) means passwords are stored unhashed and compared unsafely, and reusing the session (line 5) allows session fixation. Return one generic message, compare hashes and regenerate the session after login. Also add rate limiting.",
    hint: "Look at what each response gives away, and at how the password is checked.",
  },
  "o-a08": {
    prompt: "Which lines trust data or code that was never verified?",
    why: "pickle.loads on a cookie value (line 4) lets whoever controls the cookie run code on the server, and exec on a downloaded file (line 8) runs whatever the URL returns. Use a safe format such as JSON with a signed cookie, and verify signatures before running anything.",
    hint: "One deserializes data from the user, the other runs a download.",
  },
  "o-a09": {
    prompt: "Which lines are logging mistakes?",
    why: "A failed login returns without any log (line 3), so a password-guessing attack is invisible. The success log (line 4) writes the password into the log file. Record failures with the user and source, and never log secrets.",
    hint: "One thing is missing from the log, and one thing should not be there.",
  },
  "o-a10": {
    prompt: "What happens when the policy service is down? Which lines are the problem?",
    why: "The except block (line 4) catches everything and returns True (line 5), so any error grants access. Fail closed: log the error and deny. Catch only the errors you expect.",
    hint: "Read what happens inside the except.",
  },
} satisfies Record<string, ChallengeText>;
