import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = "";
if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");
}
const basePath = repo ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  // Reduce memory usage and speed up compilation
  experimental: {
    optimizePackageImports: ['three', 'gsap', 'framer-motion'],
  },
  // Disable telemetry
  typescript: { ignoreBuildErrors: false },
  // Compress output
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
