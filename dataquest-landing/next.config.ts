import type { NextConfig } from "next";

// Static export: the site is served by GitHub Pages (custom domain, so no basePath).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
