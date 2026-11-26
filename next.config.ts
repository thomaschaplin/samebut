import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't let `next dev` write AGENTS.md (Next.js notes for AI coding tools).
  agentRules: false,
};

export default nextConfig;
