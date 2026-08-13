import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/blog";

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data as Post | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.seo_title || `${post.title} — Simpatia`,
    description: post.seo_description || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const safeContent = DOMPurify.sanitize(post.content);

  return (
    <div className="view blog-post">
      <h1>{post.title}</h1>
      <div className="blog-meta">
        {new Date(post.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: safeContent }} />
    </div>
  );
}
