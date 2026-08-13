import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";

const BASE_URL = "https://simpatia.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/congelador`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/simpatias/conquistar`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/simpatias/atrair`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
