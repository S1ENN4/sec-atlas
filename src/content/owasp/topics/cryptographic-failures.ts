import type { Topic } from "@/content/types";

export const cryptographicFailures: Topic = {
  domain: "owasp",
  slug: "cryptographic-failures",
  title: "A04 Cryptographic Failures",
  short: "sensitive data exposed by weak, missing or misused cryptography",
  tagline:
    "Encryption is rarely broken; it is skipped, misconfigured or misused. Plain-text transport, fast password hashes and hard-coded keys are how data actually leaks.",
  kind: "tecnica",
  stage: "code",
  tools: ["testssl.sh / SSL Labs", "Semgrep crypto rules", "libsodium", "age / KMS envelope encryption", "Hashcat (to test your own hashes)"],
  sections: [
    {
      heading: "What it is",
      body: [
        "A cryptographic failure is anything that exposes sensitive data because cryptography was missing, weak, or used incorrectly: data sent without TLS, passwords stored with a fast hash, secrets in source, predictable \"random\" tokens, home-made algorithms, or keys that never rotate.",
        "It is A04 in OWASP Top 10:2025. The first question is always: which data is sensitive, where does it travel and rest, and who can read it there?",
      ],
    },
    {
      heading: "How the attack works",
      bullets: [
        "Network sniffing or a downgrade attack reads traffic that is not protected by modern TLS.",
        "A database leak yields passwords hashed with MD5 or SHA-1 (or unsalted); a GPU cracks most of them in hours.",
        "Tokens built from a timestamp or a non-cryptographic random generator are predicted and forged.",
        "A key committed to a repository, or one shared by every customer, decrypts everything at once.",
        "ECB mode, reused nonces or encryption without authentication let an attacker spot patterns or modify ciphertext.",
      ],
    },
    {
      heading: "Vulnerable code",
      body: ["A fast, unsalted hash for passwords and a predictable generator for a reset token."],
      code: [
        {
          language: "python",
          filename: "auth.py",
          code: "import hashlib, random\n\ndef store_password(pw):\n    return hashlib.md5(pw.encode()).hexdigest()      # fast and unsalted\n\ndef reset_token():\n    return str(random.randint(100000, 999999))         # predictable",
        },
        {
          language: "javascript",
          filename: "auth.js",
          code: "const crypto = require(\"crypto\");\n\nconst storePassword = (pw) => crypto.createHash(\"sha1\").update(pw).digest(\"hex\");\nconst resetToken = () => Math.random().toString(36).slice(2);",
        },
        {
          language: "java",
          filename: "Auth.java",
          code: "String hash = DigestUtils.md5Hex(password);\nString token = String.valueOf(new Random().nextInt(999999));",
        },
      ],
    },
    {
      heading: "The fix",
      body: [
        "Use a slow, salted, purpose-built password hash (Argon2id, scrypt or bcrypt) through a maintained library, and take tokens from the operating system's cryptographic random source. Do not invent algorithms; do not manage raw keys by hand if a library or a KMS can do it.",
      ],
      code: [
        {
          language: "python",
          filename: "auth.py",
          code: "import secrets\nfrom argon2 import PasswordHasher\n\nph = PasswordHasher()\n\ndef store_password(pw):\n    return ph.hash(pw)                    # salt and parameters are included\n\ndef verify_password(stored, pw):\n    try:\n        return ph.verify(stored, pw)\n    except Exception:\n        return False\n\ndef reset_token():\n    return secrets.token_urlsafe(32)      # 256 bits from the OS CSPRNG",
        },
        {
          language: "javascript",
          filename: "auth.js",
          code: "const crypto = require(\"crypto\");\nconst argon2 = require(\"argon2\");\n\nconst storePassword = (pw) => argon2.hash(pw, { type: argon2.argon2id });\nconst verifyPassword = (stored, pw) => argon2.verify(stored, pw);\nconst resetToken = () => crypto.randomBytes(32).toString(\"base64url\");",
        },
        {
          language: "java",
          filename: "Auth.java (Spring Security)",
          code: "PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();\nString hash = encoder.encode(password);\nboolean ok = encoder.matches(password, hash);\n\nbyte[] raw = new byte[32];\nnew SecureRandom().nextBytes(raw);\nString token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);",
        },
        {
          language: "go",
          filename: "token.go",
          code: "func ResetToken() (string, error) {\n\tb := make([]byte, 32)\n\tif _, err := rand.Read(b); err != nil { // crypto/rand\n\t\treturn \"\", err\n\t}\n\treturn base64.RawURLEncoding.EncodeToString(b), nil\n}",
        },
      ],
    },
    {
      heading: "Prove the fix",
      body: [
        "Test properties, not algorithms: two hashes of the same password differ (salted), the stored value is not a bare fast hash, tokens are long and unique, and the transport enforces modern TLS.",
      ],
      code: [
        {
          language: "python",
          filename: "test_crypto.py (pytest)",
          code: "def test_hashes_are_salted_and_slow_format():\n    a, b = store_password(\"correct horse\"), store_password(\"correct horse\")\n    assert a != b                          # random salt per hash\n    assert a.startswith(\"$argon2id$\")       # not md5/sha1 hex\n    assert verify_password(a, \"correct horse\")\n    assert not verify_password(a, \"wrong\")\n\ndef test_reset_tokens_are_long_and_unique():\n    tokens = {reset_token() for _ in range(1000)}\n    assert len(tokens) == 1000\n    assert all(len(t) >= 43 for t in tokens)   # 32 bytes, base64url",
        },
        {
          language: "bash",
          filename: "tls-check.sh",
          code: "# fail if the server still accepts legacy protocols\ntestssl.sh --protocols --quiet https://staging.example.com | tee tls.txt\n! grep -E 'TLS 1(\\.0|\\.1)? .*offered' tls.txt",
        },
      ],
    },
    {
      heading: "Checklist",
      bullets: [
        "Classify data: know what is sensitive before choosing controls.",
        "TLS everywhere, modern versions only, HSTS on; no sensitive data in URLs.",
        "Passwords: Argon2id, scrypt or bcrypt with a maintained library; never a fast hash.",
        "Randomness for security comes from the OS CSPRNG, never from Math.random or random.",
        "Use authenticated encryption (AES-GCM, ChaCha20-Poly1305); never reuse a nonce with the same key.",
        "Keys live in a KMS or secret manager, are rotated, and are never in the repository.",
        "Do not store what you do not need; delete it when you are done.",
      ],
    },
  ],
};
