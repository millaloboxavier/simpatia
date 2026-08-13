import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/blog";

export const metadata = {
  title: "Blog — Simpatia",
  description: "Textos sobre simpatias, rituais populares e o universo místico brasileiro.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  const posts = (data as Post[]) ?? [];

  return (
    <div className="view">
      <div className="panel-header">
        <h1>Blog</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 560, fontSize: "15.5px" }}>
          Conversas sobre esse universo místico
        </p>
      </div>
      <div className="blog-teaser-grid" style={{ marginTop: 20 }}>
        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum post ainda</h3>
            <p>Volte em breve.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-teaser-card">
              {post.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover_image_url} alt="" className="blog-teaser-card-cover" />
              )}
              <div>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
