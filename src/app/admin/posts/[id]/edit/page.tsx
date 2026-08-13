"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuthor } from "@/lib/useAuthor";
import PostForm from "@/components/PostForm";
import type { Post } from "@/lib/blog";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { supabase, userId, isAuthor, loading } = useAuthor();
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (loading || !isAuthor || !userId) return;
    supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("author_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setNotFound(true);
        } else {
          setPost(data as Post);
        }
        setLoadingPost(false);
      });
  }, [supabase, id, userId, isAuthor, loading]);

  if (loading || (isAuthor && loadingPost)) {
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
          <p className="sub">Faça login com sua conta de autora para editar posts.</p>
          <Link href="/login" className="btn btn-dark" style={{ display: "inline-flex", marginTop: 8 }}>
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
          <p className="sub">Fale com quem cuida do site pra liberar seu acesso.</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="admin-wrap">
        <div className="empty-state">
          <h3>Post não encontrado</h3>
          <p>Ou ele não existe, ou não pertence à sua conta.</p>
          <Link href="/admin/posts" className="btn btn-dark" style={{ marginTop: 16, display: "inline-flex" }}>
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h2>Editar post</h2>
      </div>
      <PostForm post={post} authorId={userId} />
    </div>
  );
}
