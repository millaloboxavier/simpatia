import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/blog";
import { SITE_URL as BASE_URL } from "@/lib/brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/congelador`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/simpatias/conquistar`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/simpatias/atrair`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/simpatias/vela`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("published", true);
  const posts = (data as Post[]) ?? [];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
