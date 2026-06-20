import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/private/"], // Safe practices: prevent indexing confidential routes
    },
    sitemap: "https://food-net-opal.vercel.app/sitemap.xml",
  };
}
