"use client";

import Link from "next/link";
import { useAuthor } from "@/lib/useAuthor";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  const { userId, isAuthor, loading } = useAuthor();

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
          <Link href="/login?next=/admin/posts/new" className="btn btn-dark" style={{ display: "inline-flex", marginTop: 8 }}>
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

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h2>Novo post</h2>
      </div>
      <PostForm authorId={userId} />
    </div>
  );
}
