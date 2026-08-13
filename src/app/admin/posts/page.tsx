"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthor } from "@/lib/useAuthor";
import { showToast } from "@/lib/toast";
import type { Post } from "@/lib/blog";

export default function AdminPostsPage() {
  const { supabase, userId, isAuthor, loading } = useAuthor();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    if (loading || !isAuthor) return;
    supabase
      .from("posts")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data as Post[]) ?? []);
        setLoadingPosts(false);
      });
  }, [supabase, userId, isAuthor, loading]);

  async function handleDelete(post: Post) {
    if (!window.confirm(`Apagar o post "${post.title}"? Isso não pode ser desfeito.`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      showToast("Não foi possível apagar o post.");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    showToast("Post apagado.");
  }

  if (loading) {
    return (
      <div className="admin-wrap">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Área de autoras</h2>
          <p className="sub">Faça login com sua conta de autora para escrever no blog.</p>
          <Link href="/login?next=/admin/posts" className="btn btn-dark" style={{ display: "inline-flex", marginTop: 8 }}>
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Essa conta não é de autora</h2>
          <p className="sub">
            Pra escrever no blog, sua conta precisa ser cadastrada como autora. Fale com quem
            cuida do site pra liberar seu acesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h2>Meus posts</h2>
        <Link href="/admin/posts/new" className="btn btn-primary">
          + Novo post
        </Link>
      </div>

      {loadingPosts ? (
        <p>Carregando...</p>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhum post ainda</h3>
          <p>Clique em &ldquo;Novo post&rdquo; pra escrever o primeiro.</p>
        </div>
      ) : (
        <div className="admin-list">
          {posts.map((post) => (
            <div key={post.id} className="admin-post-row">
              <div>
                <div className="t">{post.title}</div>
                <div className="s">
                  {new Date(post.created_at).toLocaleDateString("pt-BR")} · /blog/{post.slug}
                </div>
              </div>
              <div className="actions">
                <Link href={`/blog/${post.slug}`} target="_blank">
                  Ver
                </Link>
                <Link href={`/admin/posts/${post.id}/edit`}>Editar</Link>
                <button className="danger" onClick={() => handleDelete(post)}>
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
