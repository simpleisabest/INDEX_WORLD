import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if ((process.env.NEXT_PUBLIC_BASE_PATH ?? "") === "/preview") return [];
  const lastModified = new Date("2026-10-07");
  return [
    { url: "https://indexworld.app/", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: "https://indexworld.app/about/", lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://indexworld.app/methodology/", lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://indexworld.app/privacy/", lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://indexworld.app/terms/", lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
