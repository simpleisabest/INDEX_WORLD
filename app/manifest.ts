import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.INDEX_PREVIEW === "true" ? "/INDEX_WORLD" : "";

  return {
    name: "INDEX WORLD™",
    short_name: "INDEX WORLD",
    description: "세상을 숫자로 보다. 세계 각국의 데이터를 탐색하는 글로벌 데이터 플랫폼.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#f4f3ee",
    theme_color: "#f4f3ee",
    lang: "ko",
    icons: [
      {
        src: `${basePath}/icons/icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icons/icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icons/icon-maskable-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
