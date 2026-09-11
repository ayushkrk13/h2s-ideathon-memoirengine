import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
