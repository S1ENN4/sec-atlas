// Self-registering custom loader used by the content-integrity validator.
// Maps the `@/…` alias used by the content layer to `<repo>/src/…` and
// appends `.ts` to extensionless relative/aliased specifiers so plain Node
// can import the TypeScript content modules under `--experimental-strip-types`.
//
// Wiring (see package.json `prebuild`):
//   node --import ./scripts/content-alias-loader.mjs scripts/validate-content.mjs
//
// The loader file itself is the *entry point*; it delegates to
// `./resolve-alias.mjs` (the actual `resolve` hook) via `module.register()`.

import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const resolverUrl = pathToFileURL(path.join(here, "resolve-alias.mjs")).href;
const parentUrl = pathToFileURL(here).href;

register(resolverUrl, parentUrl);
