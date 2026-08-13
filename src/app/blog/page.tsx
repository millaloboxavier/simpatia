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
        <div className="eyebrow">Simpatia Blog</div>
        <h2>Conversas sobre esse universo místico</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 560, fontSize: "15.5px" }}>
          Textos curtos sobre simpatias, rituais populares brasileiros e os porquês por trás
          deles.
        </p>
      </div>
      <div className="blog-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum post ainda</h3>
            <p>Volte em breve.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
              {post.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover_image_url} alt="" className="blog-card-cover" />
              )}
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
