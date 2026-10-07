import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  const preview = (process.env.NEXT_PUBLIC_BASE_PATH ?? "") === "/preview";
  return preview
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/", disallow: ["/embed/"] }, sitemap: "https://indexworld.app/sitemap.xml", host: "https://indexworld.app" };
}
