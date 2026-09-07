"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { daysFrozen as computeDaysSealed } from "@/lib/pedidos";
import { trackEvent } from "@/lib/analytics";

type Pedido = {
  id: string;
  text: string;
  status: "ativo" | "finalizado";
  color: string;
  rotation: number;
  created_at: string;
  finalized_at: string | null;
};

const COLORS = ["color-amber", "color-coral"];

const NOTE_PLACEHOLDERS = [
  "Ex: aquele crush que sumiu...",
  "Ex: fulano do trabalho...",
  "Ex: aquela pessoa que só aparece no story...",
];

function daysSealed(p: Pedido) {
  return computeDaysSealed(p.created_at, p.finalized_at, p.status);
}

export default function ConquistarPage() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [notePlaceholder, setNotePlaceholder] = useState(NOTE_PLACEHOLDERS[0]);
  const [noteInput, setNoteInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<{ text: string; days: number } | null>(null);
  const [shakeAuth, setShakeAuth] = useState(false);

  function triggerAuthShake() {
    setShakeAuth(true);
    setTimeout(() => setShakeAuth(false), 500);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase]);

  useEffect(() => {
    trackEvent("ritual_view", { ritual_type: "mel_pimenta" });
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("ritual_type", "mel_pimenta")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (!error && data) setPedidos(data as Pedido[]);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, userId]);

  const ativos = pedidos.filter((p) => p.status === "ativo");
  const finalizados = pedidos.filter((p) => p.status === "finalizado");
  const detail = pedidos.find((p) => p.id === detailId) ?? null;

  async function handleAdd() {
    const text = noteInput.trim();
    if (!text) {
      showToast("Escreva algo antes de selar.");
      return;
    }
    if (!userId) return;
    setSaving(true);
    trackEvent("ritual_submit", { ritual_type: "mel_pimenta" });
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        text,
        ritual_type: "mel_pimenta",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Number((Math.random() * 6 - 3).toFixed(1)),
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      showToast("Não foi possível selar. Tenta de novo.");
      return;
    }
    setPedidos((prev) => [data as Pedido, ...prev]);
    setShowAdd(false);
    setNoteInput("");
    showToast("Pote selado 🍯");
    trackEvent("ritual_complete", { ritual_type: "mel_pimenta" });
  }

  async function handleFinalize() {
    if (!detail) return;
    const finalizedAt = new Date().toISOString();
    const { error } = await supabase
      .from("pedidos")
      .update({ status: "finalizado", finalized_at: finalizedAt })
      .eq("id", detail.id);
    if (error) {
      showToast("Não foi possível finalizar agora.");
      return;
    }
    const updated: Pedido = { ...detail, status: "finalizado", finalized_at: finalizedAt };
    setPedidos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setDetailId(null);
    setCelebrate({ text: updated.text, days: daysSealed(updated) });
    trackEvent("ritual_unfreeze", { ritual_type: "mel_pimenta" });
  }

  function shareMessage(text: string, days: number) {
    return `Abri um pote de mel e pimenta no Simpatia.me: "${text}" — depois de ${days} dia${days === 1 ? "" : "s"} selado! 🍯`;
  }

  return (
    <div className="view">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "A simpatia do mel e pimenta funciona?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Simpatias fazem parte da cultura popular e não têm resultado garantido. O ritual pode funcionar como um gesto simbólico de intenção e aproximação, sem prometer controlar a vontade de outra pessoa.",
                },
              },
              {
                "@type": "Question",
                name: "Preciso escrever o nome completo da pessoa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não. Você pode escrever um primeiro nome, apelido, iniciais ou até descrever a situação, como 'aquele crush do trabalho' ou 'a pessoa do story'. Use o que representar melhor sua intenção.",
                },
              },
              {
                "@type": "Question",
                name: "Posso abrir o pote antes da hora?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pode. Não existe prazo mínimo — você pode abrir o pote e finalizar a simpatia sempre que sentir que faz sentido.",
                },
              },
            ],
          }),
        }}
      />
      <div className="ritual-top-grid">
        <div>
          <div className="freezer-header">
            <h1>Simpatia do mel e pimenta: para conquistar quem você quer por perto</h1>
            <p>
              Uma simpatia para adoçar uma aproximação e colocar um tempero na atenção de alguém —
              selada num pote virtual, com mel e pimenta.
            </p>
          </div>
        </div>

        <div className="freezer-layout">
          <div className="freezer-unit theme-mel">
            <div className="freezer-top">
              <div className="label">🍯 Pote de mel e pimenta — selados</div>
              <button
                className="add-note-btn"
                onClick={() => {
                  if (!userId) {
                    triggerAuthShake();
                    return;
                  }
                  setNoteInput("");
                  setNotePlaceholder(NOTE_PLACEHOLDERS[Math.floor(Math.random() * NOTE_PLACEHOLDERS.length)]);
                  setShowAdd(true);
                  trackEvent("ritual_start", { ritual_type: "mel_pimenta" });
                }}
              >
                + Selar novo pote
              </button>
            </div>

            <div className="shelf" style={{ minHeight: 230 }}>
              <span className="shelf-label">Prateleira do pote</span>
              {loading ? (
                <div className="empty-shelf">Carregando...</div>
              ) : userId === null ? (
                <div className="note color-amber note-example" style={{ "--r": "-2deg" } as React.CSSProperties}>
                  <div className="pin"></div>
                  <span className="note-example-tag">Exemplo</span>
                  <div className="txt">aquele crush que sumiu...</div>
                </div>
              ) : ativos.length === 0 ? (
                <div className="empty-shelf">Vazio por enquanto. Sele o primeiro pote pra começar.</div>
              ) : (
                ativos.map((p) => {
                  const days = daysSealed(p);
                  return (
                    <div
                      key={p.id}
                      className={`note ${p.color}`}
                      style={{ "--r": `${p.rotation}deg` } as React.CSSProperties}
                      onClick={() => {
                        setDetailId(p.id);
                        trackEvent("ritual_open_saved", { ritual_type: "mel_pimenta" });
                      }}
                    >
                      <div className="pin"></div>
                      <div className="txt">{p.text}</div>
                      <div className="days-tag">
                        {days} dia{days === 1 ? "" : "s"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {userId === null && (
              <div className={`auth-error auth-error-inset ${shakeAuth ? "shake" : ""}`}>
                <span>Crie sua conta pra guardar seus pedidos com segurança — seu conteúdo é pessoal.</span>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <Link href="/login?next=/simpatias/conquistar" className="btn btn-ghost" style={{ whiteSpace: "nowrap" }}>
                    Entrar
                  </Link>
                  <Link href="/signup?next=/simpatias/conquistar" className="btn btn-dark" style={{ whiteSpace: "nowrap" }}>
                    Criar conta
                  </Link>
                </div>
              </div>
            )}

            <div className="freezer-foot">
              <span className="hint">Toque num pote para ver os detalhes ou abrir.</span>
            </div>
          </div>
        </div>
      </div>

      {userId !== null && (
        <div className="freezer-stats-row">
          <div className="stat-card-compact">
            <div className="num">{ativos.length}</div>
            <div className="lbl">potes selados agora</div>
          </div>
          <div className="stat-card-compact">
            <div className="num">{finalizados.length}</div>
            <div className="lbl">potes já abertos</div>
          </div>
        </div>
      )}

      <div className="seo-content">
        <p>
          Tem alguém que você queria ter mais por perto — um crush que sumiu, uma pessoa que você
          queria que reparasse mais em você, ou só uma aproximação que você gostaria de adoçar? A
          simpatia do mel e pimenta é um ritual popular de conquista, usado por quem deseja atrair
          atenção e afeto de um jeito simbólico. No Simpatia.me, você faz esse gesto de forma
          virtual, privada, sem precisar explicar pra ninguém por que tem um pote de mel e
          pimenta escondido no armário.
        </p>

        <h2>O que é a simpatia do mel e pimenta?</h2>
        <p>
          A simpatia do mel e pimenta combina dois ingredientes com significados opostos e
          complementares: o mel representa doçura, aproximação e atração; a pimenta representa
          calor, intensidade e movimento. Tradicionalmente, a pessoa escreve o nome de quem deseja
          se aproximar num papel, coloca dentro de um pote com mel e pimenta, e sela — muitas
          vezes amarrando com uma fita vermelha.
        </p>
        <p>
          A intenção não é forçar sentimentos alheios, mas simbolizar um desejo de aproximação —
          um pequeno gesto de intenção e esperança em relação a alguém que você gostaria de ter
          mais por perto.
        </p>

        <h2>Como funciona a simpatia do mel e pimenta virtual?</h2>
        <p>
          Aqui, o ritual acontece na tela — sem potes de vidro escondidos no armário. Para fazer
          sua simpatia virtual:
        </p>
        <ul>
          <li>Escreva o nome ou situação da pessoa que você quer se aproximar.</li>
          <li>Coloque sua intenção no pote virtual.</li>
          <li>Sele o pote com mel e pimenta.</li>
          <li>Deixe o universo processar enquanto o pote fica guardado na sua conta.</li>
        </ul>
        <p>
          Você pode abrir o pote quando quiser — não existe prazo mínimo nem regra rígida. A
          experiência é simbólica e feita pra trazer um pequeno momento de intenção, humor e
          esperança em meio aos dramas do coração.
        </p>

        <h2>Dúvidas sobre a simpatia do mel e pimenta</h2>

        <details className="faq-item">
          <summary>
            <h3>A simpatia do mel e pimenta funciona?</h3>
          </summary>
          <p>
            Simpatias fazem parte da cultura popular e não têm resultado garantido. O ritual pode
            funcionar como um gesto simbólico de intenção e aproximação, sem prometer controlar a
            vontade de outra pessoa. O universo aqui só recebe o pedido — o resto é com ele.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Preciso escrever o nome completo da pessoa?</h3>
          </summary>
          <p>
            Não. Você pode escrever um primeiro nome, apelido, iniciais ou até descrever a
            situação, como &ldquo;aquele crush do trabalho&rdquo; ou &ldquo;a pessoa do
            story&rdquo;. Use o que representar melhor sua intenção.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Posso abrir o pote antes da hora?</h3>
          </summary>
          <p>
            Pode. Não existe prazo mínimo — você pode abrir o pote e finalizar a simpatia sempre
            que sentir que faz sentido, seja porque deu certo, seja porque mudou de ideia.
          </p>
        </details>

        <p className="seo-disclaimer">
          O Simpatia.me oferece experiências simbólicas para entretenimento e reflexão. Não fazemos
          promessas de resultado — nem o universo assinou esse SLA.
        </p>
      </div>

      {/* Modal: adicionar pedido */}
      <div className={`overlay ${showAdd ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
        <div className="modal">
          <button className="modal-close" onClick={() => setShowAdd(false)}>
            ✕
          </button>
          <h3>Novo pote de mel e pimenta</h3>
          <p className="desc">
            Escreva com suas palavras o nome ou situação da pessoa que você quer aproximar.
          </p>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder={notePlaceholder}
            maxLength={140}
          />
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" disabled={saving} onClick={handleAdd}>
              Selar 🍯
            </button>
          </div>
        </div>
      </div>

      {/* Modal: detalhe */}
      <div className={`overlay ${detail ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setDetailId(null)}>
        {detail && (
          <div className="modal">
            <button className="modal-close" onClick={() => setDetailId(null)}>
              ✕
            </button>
            <h3>Seu pote</h3>
            <div className={`detail-note-preview ${detail.color}`}>{detail.text}</div>
            <div className="detail-days">
              {detail.status === "finalizado" ? (
                <>
                  Ficou selado por <b>{daysSealed(detail)} dia{daysSealed(detail) === 1 ? "" : "s"}</b> antes de
                  abrir. ✅
                </>
              ) : (
                <>
                  Selado há <b>{daysSealed(detail)} dia{daysSealed(detail) === 1 ? "" : "s"}</b>.
                </>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDetailId(null)}>
                Deixar selado
              </button>
              {detail.status !== "finalizado" && (
                <button className="btn btn-dark" onClick={handleFinalize}>
                  Abrir o pote ✨
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: celebração */}
      <div className={`overlay ${celebrate ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setCelebrate(null)}>
        {celebrate && (
          <div className="modal">
            <button className="modal-close" onClick={() => setCelebrate(null)}>
              ✕
            </button>
            <div className="celebrate-icon">🎉</div>
            <h3 style={{ textAlign: "center" }}>Abriu o pote!</h3>
            <p className="desc" style={{ textAlign: "center" }}>
              Sua simpatia foi finalizada. Que o universo tenha feito a parte dele.
            </p>
            <div className="share-card">
              <div className="sc-eyebrow">Simpatia do Mel e Pimenta</div>
              <div className="sc-txt">&quot;{celebrate.text}&quot;</div>
              <div className="sc-days">
                Aberto depois de {celebrate.days} dia{celebrate.days === 1 ? "" : "s"} selado.
              </div>
            </div>
            <div className="share-row">
              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/?text=" + encodeURIComponent(shareMessage(celebrate.text, celebrate.days)),
                    "_blank"
                  )
                }
              >
                Compartilhar no WhatsApp
              </button>
              <button
                onClick={() =>
                  navigator.clipboard
                    ?.writeText(shareMessage(celebrate.text, celebrate.days))
                    .then(() => showToast("Resultado copiado!"))
                    .catch(() => showToast("Não foi possível copiar."))
                }
              >
                Copiar resultado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
