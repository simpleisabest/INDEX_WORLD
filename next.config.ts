import type { NextConfig } from "next";

const isPreview = process.env.INDEX_PREVIEW === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS: "true",
    NEXT_PUBLIC_SITE_ORIGIN: "https://indexworld.app",
    NEXT_PUBLIC_BASE_PATH: isPreview ? "/preview" : "",
  },
  experimental: {
    // The compiler API avoids a Node 24 child-process output race in the
    // TypeScript CLI runner while preserving Next.js' full type check.
    useTypeScriptCli: false,
  },
  output: "export",
  basePath: isPreview ? "/preview" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
