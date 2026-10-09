import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 100% static: no server, no API routes, no database. Minimal attack surface.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
