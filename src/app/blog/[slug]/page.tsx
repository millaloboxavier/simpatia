import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/blog";
import { SITE_URL } from "@/lib/brand";

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
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const safeContent = sanitizeHtml(post.content, {
    allowedTags: ["p", "h2", "h3", "b", "strong", "i", "em", "u", "a", "ul", "ol", "li", "br"],
    allowedAttributes: { a: ["href", "target", "rel"] },
  });

  const hasFaq = !!post.faq && post.faq.length > 0;

  return (
    <div className="view blog-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.seo_description || post.excerpt,
            image: post.cover_image_url || undefined,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: { "@type": "Organization", name: "Simpatia" },
            publisher: { "@type": "Organization", name: "Simpatia" },
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          }),
        }}
      />
      {hasFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faq!.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}
      <h1>{post.title}</h1>
      <div className="blog-meta">
        {new Date(post.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </div>
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image_url} alt="" className="blog-post-cover" />
      )}
      <div className="content" dangerouslySetInnerHTML={{ __html: safeContent }} />

      {hasFaq && (
        <div className="seo-content blog-post-faq">
          <h2>Perguntas frequentes</h2>
          {post.faq!.map((item, index) => (
            <details key={index} className="faq-item">
              <summary>
                <h3>{item.question}</h3>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
