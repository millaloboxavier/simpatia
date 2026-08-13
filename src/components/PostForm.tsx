"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { showToast } from "@/lib/toast";
import type { Post } from "@/lib/blog";
import RichTextEditor from "./RichTextEditor";

export default function PostForm({
  post,
  authorId,
}: {
  post?: Post;
  authorId: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
      setError("Preencha título, resumo e o texto do post.");
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      excerpt: excerpt.trim(),
      content,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const result = post
      ? await supabase.from("posts").update(payload).eq("id", post.id)
      : await supabase.from("posts").insert({ ...payload, author_id: authorId, published: true });

    setSaving(false);

    if (result.error) {
      setError(
        result.error.message.includes("duplicate")
          ? "Já existe um post com esse link (slug). Muda um pouco o título ou o link."
          : "Não foi possível salvar. Tente novamente."
      );
      return;
    }

    showToast(post ? "Post atualizado!" : "Post publicado! 🎉");
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Ex: A simpatia que minha avó fazia pra chuva parar"
        />
      </div>

      <div>
        <label htmlFor="slug">Link (URL) do post</label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
        <div className="hint-text">simpatia.me/blog/{slug || "seu-link-aqui"}</div>
      </div>

      <div>
        <label htmlFor="excerpt">Resumo (aparece na listagem do blog)</label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={220}
          placeholder="Um resuminho de 1-2 frases sobre o post."
        />
      </div>

      <div>
        <label>Texto do post</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <fieldset className="admin-fieldset">
        <legend>SEO (opcional — se deixar em branco, usamos o título/resumo)</legend>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="seo-title">Título para o Google</label>
          <input
            id="seo-title"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={70}
            placeholder="Aparece na aba do navegador e no resultado do Google"
          />
        </div>
        <div>
          <label htmlFor="seo-description">Descrição para o Google</label>
          <textarea
            id="seo-description"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            maxLength={160}
            placeholder="O textinho que aparece embaixo do título no resultado de busca"
          />
        </div>
      </fieldset>

      <div className="modal-actions" style={{ margin: 0 }}>
        <button type="button" className="btn btn-ghost" onClick={() => router.push("/admin/posts")}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Salvando..." : post ? "Salvar alterações" : "Publicar post"}
        </button>
      </div>
    </form>
  );
}
