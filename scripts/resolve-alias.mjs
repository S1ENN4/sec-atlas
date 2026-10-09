// Resolve hook used by `scripts/content-alias-loader.mjs`.
// Two responsibilities:
//   1. Rewrite `@/foo/bar` → `<repoRoot>/src/foo/bar(.ts)`. Mirrors the
//      `paths` mapping in `tsconfig.json` so the content layer can be
//      imported from a Node script the same way it's imported from the app.
//   2. Append `.ts` to extensionless *relative* specifiers (e.g.
//      `./topics/cicd`, `../types`) so plain Node ESM can follow them under
//      `--experimental-strip-types`. Absolute/bare specifiers and anything
//      that already has a file-like extension are passed through.
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");

const hasExt = (s) => /(\.[a-z0-9]+|\*)$/i.test(s);

// Resolve an extensionless *relative* specifier to the right .ts file,
// honouring Node's directory-as-module convention (`./foo` → `./foo/index.ts`).
function resolveRelativeTs(specifier, parentURL) {
  const parentPath = fileURLToPath(parentURL);
  const base = path.resolve(path.dirname(parentPath), specifier);
  if (fs.existsSync(base) && fs.statSync(base).isFile()) {
    return base;
  }
  if (fs.existsSync(base + ".ts")) {
    return base + ".ts";
  }
  if (fs.existsSync(path.join(base, "index.ts"))) {
    return path.join(base, "index.ts");
  }
  // Fall back to .ts; the loader will surface ERR_MODULE_NOT_FOUND with a
  // useful path if the guess is wrong.
  return base + ".ts";
}

export async function resolve(specifier, context, nextResolve) {
  // (1) @/ alias → <root>/src/<rel>
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const abs = path.join(repoRoot, "src", rel);
    let resolved;
    if (hasExt(rel)) {
      resolved = abs;
    } else if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      resolved = abs;
    } else if (fs.existsSync(abs + ".ts")) {
      resolved = abs + ".ts";
    } else if (fs.existsSync(path.join(abs, "index.ts"))) {
      resolved = path.join(abs, "index.ts");
    } else {
      resolved = abs + ".ts";
    }
    return nextResolve(pathToFileURL(resolved).href, context);
  }

  // (2) Extensionless relative specifier → append .ts (or use ./dir/index.ts)
  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !hasExt(specifier) &&
    context.parentURL
  ) {
    const resolved = resolveRelativeTs(specifier, context.parentURL);
    return nextResolve(pathToFileURL(resolved).href, context);
  }

  return nextResolve(specifier, context);
}
