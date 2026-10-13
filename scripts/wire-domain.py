#!/usr/bin/env python3
"""Wire a new content domain into the app from a JSON spec.

Usage: python scripts/wire-domain.py spec.json

The domain's own files (src/content/<dir>/index.ts, topics, pipeline, relations,
graph-layout, glossary and src/content/quiz/<dir>.ts) must already exist. This
script only adds the registrations that make the domain appear everywhere:
DomainId, registry, quiz index, nav group, accent colour, icons, search route,
sources, journey levels and the English UI strings (pt/es overlays are applied
afterwards with `npm run i18n -- apply`).

Spec keys:
  id, dir, var, quizVar, route, hue, icon, group, topicIcons{slug: LucideIcon},
  sources[{label, href, note}], levels[str], ui{name,badge,title,titleAccent,
  lead,pitch,mapIntro,pipelineTitle,pipelineIntro}
"""
import json, re, sys

spec = json.load(open(sys.argv[1], encoding="utf8"))
D, DIR, VAR, QVAR = spec["id"], spec["dir"], spec["var"], spec["quizVar"]


def read(p):
    return open(p, encoding="utf8", newline="").read()


def write(p, s):
    open(p, "w", encoding="utf8", newline="").write(s)


def nl_of(s):
    return "\r\n" if "\r\n" in s else "\n"


def sub_once(path, pattern, repl, flags=0):
    s = read(path)
    nl = nl_of(s)
    new, n = re.subn(pattern, lambda m: repl(m, nl), s, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f"{path}: pattern not found: {pattern[:60]}")
    write(path, new)


def add_import_after_last(path, line):
    s = read(path)
    nl = nl_of(s)
    if line in s:
        return
    lines = s.split(nl)
    idx = max(i for i, l in enumerate(lines) if re.match(r'import .* from "\./', l))
    lines.insert(idx + 1, line)
    write(path, nl.join(lines))


# 1. DomainId union
sub_once("src/content/types.ts", r'(export type DomainId = [^;]+);', lambda m, nl: f'{m.group(1)} | "{D}";')

# 2. registry
add_import_after_last("src/content/registry.ts", f'import {{ {VAR} }} from "./{DIR}";')
sub_once(
    "src/content/registry.ts",
    r'(export const domains: Record<DomainId, Domain> = \{.*?)(\r?\n\};)',
    lambda m, nl: f'{m.group(1)}{nl}  "{D}": {VAR},{m.group(2)}' if "-" in D else f'{m.group(1)}{nl}  {VAR},{m.group(2)}',
    re.S,
)

# 3. quiz index
add_import_after_last("src/content/quiz/index.ts", f'import {{ {QVAR} }} from "./{DIR}";')
sub_once(
    "src/content/quiz/index.ts",
    r'(export const quizzes: Record<DomainId, QuizBank> = \{.*?)(\r?\n\};)',
    lambda m, nl: f'{m.group(1)}{nl}  {D}: {QVAR},{m.group(2)}',
    re.S,
)

# 4. nav group
sub_once(
    "src/content/nav.ts",
    r'(\{ id: "%s", domains: \[[^\]]*)\]' % spec["group"],
    lambda m, nl: f'{m.group(1)}, "{D}"]',
)

# 5. accent colour
hue = spec["hue"]
css = (
    f'[data-domain="{D}"] {{\n  --primary: oklch(0.8 0.17 {hue});\n  --primary-foreground: oklch(0.18 0.05 {hue});\n'
    f'  --ring: oklch(0.8 0.17 {hue} / 0.55);\n}}\n\n'
)
s = read("src/app/globals.css")
nl = nl_of(s)
anchor = '[data-domain="ai-agents"] {'
assert anchor in s
write("src/app/globals.css", s.replace(anchor, css.replace("\n", nl) + anchor, 1))

# 6. domain icon
icon = spec["icon"]
s = read("src/components/domain-icon.tsx")
if not re.search(r"\b%s\b" % icon, s.split("\n")[0]):
    s = re.sub(r'^import \{ ', f'import {{ {icon}, ', s, count=1)
nl = nl_of(s)
s = re.sub(r'(const icons: Record<DomainId, LucideIcon> = \{.*?)(\r?\n\};)', lambda m: f'{m.group(1)}{nl}  "{D}": {icon},{m.group(2)}', s, count=1, flags=re.S)
write("src/components/domain-icon.tsx", s)

# 7. search palette (type union + route)
sub_once("src/components/search-palette.tsx", r'(d: "appsec"[^;]*?) \| "";', lambda m, nl: f'{m.group(1)} | "{D}" | "";')
sub_once(
    "src/components/search-palette.tsx",
    r'(const DOMAIN_ROUTE: Record<string, string> = \{.*?)(\r?\n\};)',
    lambda m, nl: f'{m.group(1)}{nl}  "{D}": "{spec["route"]}",{m.group(2)}',
    re.S,
)

# 8. path card union
sub_once("src/components/path-card.tsx", r'(domain: "appsec"[^;]*?);', lambda m, nl: f'{m.group(1)} | "{D}";')

# 9. mcp smoke
sub_once("scripts/mcp-smoke.mjs", r'(\["appsec", "cloudsec"[^\]]*?)\]', lambda m, nl: f'{m.group(1)}, "{D}"]')

# 10. topic icons
s = read("src/components/topic-icon.tsx")
nl = nl_of(s)
imp = re.search(r'import \{(.*?)\} from "lucide-react";', s, re.S)
have = set(re.findall(r"\b([A-Z][A-Za-z0-9]+)\b", imp.group(1)))
need = [i for i in dict.fromkeys(spec["topicIcons"].values()) if i not in have]
if need:
    block = imp.group(0)
    new_block = block.replace("  type LucideIcon,", "".join(f"  {i},{nl}" for i in need) + "  type LucideIcon,")
    s = s.replace(block, new_block, 1)
rows = "".join(f'  "{slug}": {ic},{nl}' for slug, ic in spec["topicIcons"].items())
marker = "  // ai-agents" + nl
assert marker in s
s = s.replace(marker, f"  // {D}{nl}{rows}{marker}", 1)
write("src/components/topic-icon.tsx", s)

# 11. sources
if spec.get("sources"):
    s = read("src/content/sources.ts")
    nl = nl_of(s)
    rows = "".join(
        f'    {{ label: {json.dumps(x["label"], ensure_ascii=False)}, href: {json.dumps(x["href"])}, note: {json.dumps(x["note"], ensure_ascii=False)} }},{nl}'
        for x in spec["sources"]
    )
    key = f'"{D}"' if "-" in D else D
    marker = "  seceng: ["
    assert marker in s
    s = s.replace(marker, f"  {key}: [{nl}{rows}  ],{nl}{marker}", 1)
    write("src/content/sources.ts", s)

# 12. levels
s = read("src/content/levels.ts")
nl = nl_of(s)
body = nl.join(spec["levels"])
i = s.rindex("};")
write("src/content/levels.ts", s[:i].rstrip() + nl + nl + f"  // --- {spec['title']} " + "-" * 40 + nl + body + nl + s[i:])

# 13. UI dictionary (English source)
ui = spec["ui"]
s = read("src/i18n/ui-source.ts")
nl = nl_of(s)
key = f'"{D}"' if "-" in D else D
fields = "".join(f"      {k}: {json.dumps(ui[k], ensure_ascii=False)},{nl}" for k in ["name", "badge", "title", "titleAccent", "lead", "pitch", "mapIntro", "pipelineTitle", "pipelineIntro"])
entry = f'    {key}: {{{nl}{fields}      loop: "",{nl}    }},{nl}'
tail = f'  }},{nl}}} as const;'
assert tail in s
s = s.replace(tail, entry + tail, 1)
write("src/i18n/ui-source.ts", s)
print("wired", D)
