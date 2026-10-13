import type { Topic } from "@/content/types";

export const containerImages: Topic = {
  domain: "devops",
  slug: "container-images",
  title: "Containers and images",
  short: "images, layers, registries and a Dockerfile that is small, reproducible and safe to run",
  tagline:
    "A container packages an application with its dependencies and runs it isolated from the host. A good image is small, deterministic and runs as a non-root user.",
  kind: "tecnica",
  stage: "foundations",
  tools: ["Docker / Podman", "BuildKit", "Trivy", "Hadolint", "Dive", "container registries"],
  sections: [
    {
      heading: "How containers work",
      bullets: [
        "A container is a normal Linux process with its own view of the filesystem, network and process table (namespaces) and limited resources (cgroups). It shares the host kernel, unlike a virtual machine.",
        "An image is a stack of read-only layers plus metadata. A container adds a thin writable layer on top.",
        "A registry stores images by name and tag; a digest (sha256) identifies exact content and never changes.",
        "Containers are meant to be disposable: state lives in volumes, databases or object storage, not inside the container.",
      ],
    },
    {
      heading: "A weak Dockerfile",
      code: [
        {
          language: "dockerfile",
          filename: "Dockerfile (before)",
          code: "FROM node:latest\nCOPY . .\nRUN npm install\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]",
        },
      ],
      body: ["Problems: a floating tag changes without notice, the whole directory (including .git and .env) is copied, dev dependencies and build tools ship to production, no layer caching, and the process runs as root."],
    },
    {
      heading: "A better one",
      body: ["Use a pinned base, a multi-stage build, a lockfile install, a non-root user and an ignore file."],
      code: [
        {
          language: "dockerfile",
          filename: "Dockerfile (after)",
          code: "# build stage: has the compilers and dev dependencies\nFROM node:22-slim@sha256:<digest-you-reviewed> AS build\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build && npm prune --omit=dev\n\n# runtime stage: only what the app needs\nFROM node:22-slim@sha256:<digest-you-reviewed>\nENV NODE_ENV=production\nWORKDIR /app\nCOPY --from=build --chown=node:node /app/dist ./dist\nCOPY --from=build --chown=node:node /app/node_modules ./node_modules\nUSER node\nEXPOSE 3000\nHEALTHCHECK CMD node -e \"fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\"\nCMD [\"node\", \"dist/server.js\"]",
        },
        {
          language: "text",
          filename: ".dockerignore",
          code: ".git\nnode_modules\n.env\n*.log\ncoverage",
        },
      ],
    },
    {
      heading: "Habits",
      bullets: [
        "Rebuild and redeploy regularly: images do not patch themselves.",
        "Scan images in CI and fail on serious findings you can fix.",
        "One process per container, logs to stdout, configuration through the environment or mounted files.",
        "Tag with the commit and deploy by digest so a rollback is exact.",
        "Keep images small: fewer packages, fewer vulnerabilities, faster pulls.",
      ],
    },
  ],
};
