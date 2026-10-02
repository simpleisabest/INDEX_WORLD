import type { NextConfig } from "next";

const isPreview = process.env.INDEX_PREVIEW === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isPreview ? "export" : undefined,
  basePath: isPreview ? "/INDEX_WORLD" : undefined,
  images: {
    unoptimized: isPreview,
  },
};

export default nextConfig;
