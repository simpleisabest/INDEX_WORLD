import type { NextConfig } from "next";

const isPreview = process.env.INDEX_PREVIEW === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isPreview ? "/INDEX_WORLD" : "",
  },
  experimental: {
    // The compiler API avoids a Node 24 child-process output race in the
    // TypeScript CLI runner while preserving Next.js' full type check.
    useTypeScriptCli: false,
  },
  output: isPreview ? "export" : undefined,
  basePath: isPreview ? "/INDEX_WORLD" : undefined,
  images: {
    unoptimized: isPreview,
  },
};

export default nextConfig;
