"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { showToast } from "@/lib/toast";
import type { Post, FaqItem } from "@/lib/blog";
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
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [faq, setFaq] = useState<FaqItem[]>(post?.faq ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFaqItem() {
    setFaq((prev) => [...prev, { question: "", answer: "" }]);
  }

  function updateFaqItem(index: number, field: "question" | "answer", value: string) {
    setFaq((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function removeFaqItem(index: number) {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  }

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

    const cleanFaq = faq
      .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
      .filter((item) => item.question && item.answer);

    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      excerpt: excerpt.trim(),
      content,
      cover_image_url: coverImageUrl.trim() || null,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      faq: cleanFaq.length > 0 ? cleanFaq : null,
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
        <label htmlFor="cover">Imagem de capa (link)</label>
        <input
          id="cover"
          type="text"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://..."
        />
        <div className="hint-text">
          Cole o link de uma imagem já publicada (ex: no Supabase Storage). Opcional.
        </div>
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImageUrl} alt="" style={{ marginTop: 10, maxWidth: 240, borderRadius: 12 }} />
        )}
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

      <fieldset className="admin-fieldset">
        <legend>FAQ do artigo (opcional)</legend>
        <div className="hint-text" style={{ marginBottom: 14 }}>
          Perguntas e respostas que aparecem no fim do post e ajudam no Google. Deixe vazio se
          esse artigo não precisar de FAQ.
        </div>
        {faq.map((item, index) => (
          <div key={index} className="admin-faq-item">
            <div style={{ marginBottom: 8 }}>
              <label htmlFor={`faq-q-${index}`}>Pergunta {index + 1}</label>
              <input
                id={`faq-q-${index}`}
                type="text"
                value={item.question}
                onChange={(e) => updateFaqItem(index, "question", e.target.value)}
                placeholder="Ex: Simpatia realmente funciona?"
              />
            </div>
            <div>
              <label htmlFor={`faq-a-${index}`}>Resposta {index + 1}</label>
              <textarea
                id={`faq-a-${index}`}
                value={item.answer}
                onChange={(e) => updateFaqItem(index, "answer", e.target.value)}
                placeholder="Escreva a resposta"
              />
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 8 }}
              onClick={() => removeFaqItem(index)}
            >
              Remover pergunta
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost" onClick={addFaqItem}>
          + Adicionar pergunta
        </button>
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
