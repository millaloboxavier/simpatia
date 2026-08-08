import Link from "next/link";
import { posts } from "@/lib/posts";

export const metadata = {
  title: "Blog — SimpatIA",
  description: "Textos sobre simpatias, rituais populares e o universo místico brasileiro.",
};

export default function BlogPage() {
  return (
    <div className="view">
      <div className="panel-header">
        <div className="eyebrow">SimpatIA Blog</div>
        <h2>Conversas sobre esse universo místico</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 560, fontSize: "15.5px" }}>
          Textos curtos sobre simpatias, rituais populares brasileiros e os porquês por trás
          deles.
        </p>
      </div>
      <div className="blog-list">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
            <div className="blog-eyebrow">{post.eyebrow}</div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
