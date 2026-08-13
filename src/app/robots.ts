import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/painel", "/login", "/signup", "/forgot-password", "/reset-password", "/auth/"],
      },
    ],
    sitemap: "https://simpatia.me/sitemap.xml",
  };
}
