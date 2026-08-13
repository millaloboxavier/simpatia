import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/painel",
          "/conta",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://simpatia.me/sitemap.xml",
  };
}
