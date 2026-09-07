"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { daysFrozen as computeDaysBlown } from "@/lib/pedidos";
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

const COLORS = ["color-amber", "color-mint"];

const NOTE_PLACEHOLDERS = [
  "Ex: uma grana extra esse mês...",
  "Ex: aquela vaga de emprego...",
  "Ex: oportunidades chegando sem eu correr atrás...",
];

function daysBlown(p: Pedido) {
  return computeDaysBlown(p.created_at, p.finalized_at, p.status);
}

export default function AtrairPage() {
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
    trackEvent("ritual_view", { ritual_type: "canela" });
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
        .eq("ritual_type", "canela")
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
      showToast("Escreva algo antes de soprar.");
      return;
    }
    if (!userId) return;
    setSaving(true);
    trackEvent("ritual_submit", { ritual_type: "canela" });
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        text,
        ritual_type: "canela",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Number((Math.random() * 6 - 3).toFixed(1)),
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      showToast("Não foi possível soprar. Tenta de novo.");
      return;
    }
    setPedidos((prev) => [data as Pedido, ...prev]);
    setShowAdd(false);
    setNoteInput("");
    showToast("Canela soprada ✨");
    trackEvent("ritual_complete", { ritual_type: "canela" });
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
    setCelebrate({ text: updated.text, days: daysBlown(updated) });
    trackEvent("ritual_unfreeze", { ritual_type: "canela" });
  }

  function shareMessage(text: string, days: number) {
    return `Fiz a simpatia da canela no Simpatia.me: "${text}" — atraído depois de ${days} dia${days === 1 ? "" : "s"}! ✨`;
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
                name: "A simpatia da canela funciona?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Simpatias fazem parte da cultura popular e não têm resultado garantido. O ritual pode funcionar como um gesto simbólico de intenção, foco e abertura para oportunidades — não uma garantia de dinheiro ou sorte.",
                },
              },
              {
                "@type": "Question",
                name: "Preciso escrever um valor ou pedido específico?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não. Você pode escrever algo específico, como 'uma vaga de emprego', ou algo mais amplo, como 'abundância' ou 'as coisas fluindo esse mês'. Use o que representar melhor sua intenção.",
                },
              },
              {
                "@type": "Question",
                name: "Posso fazer mais de uma simpatia da canela?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pode. Não existe limite — você pode soprar quantas canelas quiser, para intenções diferentes, sempre que sentir vontade.",
                },
              },
            ],
          }),
        }}
      />
      <div className="ritual-top-grid">
        <div>
          <div className="freezer-header">
            <h1>Simpatia da canela: para atrair dinheiro e prosperidade</h1>
            <p>
              Uma simpatia para soprar sua intenção ao Universo e atrair dinheiro, oportunidades e
              abundância — com uma canela virtual, sem sujar a casa de verdade.
            </p>
          </div>
        </div>

        <div className="freezer-layout">
          <div className="freezer-unit theme-canela">
            <div className="freezer-top">
              <div className="label">✨ Canelas sopradas — ativas</div>
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
                  trackEvent("ritual_start", { ritual_type: "canela" });
                }}
              >
                + Soprar canela
              </button>
            </div>

            <div className="shelf" style={{ minHeight: 230 }}>
              <span className="shelf-label">Intenções sopradas</span>
              {loading ? (
                <div className="empty-shelf">Carregando...</div>
              ) : userId === null ? (
                <div className="note color-amber note-example" style={{ "--r": "-2deg" } as React.CSSProperties}>
                  <div className="pin"></div>
                  <span className="note-example-tag">Exemplo</span>
                  <div className="txt">uma grana extra esse mês...</div>
                </div>
              ) : ativos.length === 0 ? (
                <div className="empty-shelf">Vazio por enquanto. Sopre a primeira canela pra começar.</div>
              ) : (
                ativos.map((p) => {
                  const days = daysBlown(p);
                  return (
                    <div
                      key={p.id}
                      className={`note ${p.color}`}
                      style={{ "--r": `${p.rotation}deg` } as React.CSSProperties}
                      onClick={() => {
                        setDetailId(p.id);
                        trackEvent("ritual_open_saved", { ritual_type: "canela" });
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
                  <Link href="/login?next=/simpatias/atrair" className="btn btn-ghost" style={{ whiteSpace: "nowrap" }}>
                    Entrar
                  </Link>
                  <Link href="/signup?next=/simpatias/atrair" className="btn btn-dark" style={{ whiteSpace: "nowrap" }}>
                    Criar conta
                  </Link>
                </div>
              </div>
            )}

            <div className="freezer-foot">
              <span className="hint">Toque numa intenção para ver os detalhes ou finalizar.</span>
            </div>
          </div>
        </div>
      </div>

      {userId !== null && (
        <div className="freezer-stats-row">
          <div className="stat-card-compact">
            <div className="num">{ativos.length}</div>
            <div className="lbl">intenções ativas agora</div>
          </div>
          <div className="stat-card-compact">
            <div className="num">{finalizados.length}</div>
            <div className="lbl">simpatias já finalizadas</div>
          </div>
        </div>
      )}

      <div className="seo-content">
        <p>
          Aquele emprego que não sai do papel, a conta que nunca fecha no verde, a sensação de que
          as oportunidades sempre passam longe? A simpatia da canela é um ritual popular de
          prosperidade, usado por quem deseja abrir caminhos, atrair dinheiro e chamar sorte pra
          perto. No Simpatia.me, você faz esse gesto de forma virtual, sem precisar sair
          soprando canela pela casa de verdade.
        </p>

        <h2>O que é a simpatia da canela?</h2>
        <p>
          A canela é um ingrediente tradicionalmente associado à prosperidade, ao dinheiro e à
          sorte nas simpatias populares brasileiras. Uma das versões mais conhecidas consiste em
          segurar um pouco de canela em pó na mão, fazer um pedido em silêncio e soprar em
          direção à porta de entrada de casa, deixando a intenção seguir pelo ar.
        </p>
        <p>
          A ideia não é garantir um resultado específico, mas simbolizar abertura: um gesto de
          intenção para que dinheiro, oportunidades e coisas boas encontrem espaço pra entrar na
          sua vida.
        </p>

        <h2>Como funciona a simpatia da canela virtual?</h2>
        <p>
          Aqui, o ritual acontece na tela — sem pó de canela espalhado pelo chão. Para fazer sua
          simpatia virtual:
        </p>
        <ul>
          <li>Escreva a intenção que você quer atrair — dinheiro, uma oportunidade, sorte.</li>
          <li>Coloque sua intenção na canela virtual.</li>
          <li>Sopre a canela em direção ao Universo.</li>
          <li>Deixe sua intenção guardada na sua conta enquanto o Universo processa.</li>
        </ul>
        <p>
          Você pode finalizar quando quiser — não existe prazo mínimo. A experiência é simbólica
          e feita pra trazer um pequeno momento de intenção, foco e esperança em meio aos dramas
          financeiros do dia a dia.
        </p>

        <h2>Dúvidas sobre a simpatia da canela</h2>

        <details className="faq-item">
          <summary>
            <h3>A simpatia da canela funciona?</h3>
          </summary>
          <p>
            Simpatias fazem parte da cultura popular e não têm resultado garantido. O ritual pode
            funcionar como um gesto simbólico de intenção, foco e abertura para oportunidades —
            não uma garantia de dinheiro ou sorte. O universo, infelizmente, ainda não fornece
            protocolo de atendimento.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Preciso escrever um valor ou pedido específico?</h3>
          </summary>
          <p>
            Não. Você pode escrever algo específico, como &ldquo;uma vaga de emprego&rdquo;, ou
            algo mais amplo, como &ldquo;abundância&rdquo; ou &ldquo;as coisas fluindo esse
            mês&rdquo;. Use o que representar melhor sua intenção.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Posso fazer mais de uma simpatia da canela?</h3>
          </summary>
          <p>
            Pode. Não existe limite — você pode soprar quantas canelas quiser, para intenções
            diferentes, sempre que sentir vontade.
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
          <h3>Nova canela soprada</h3>
          <p className="desc">
            Escreva com suas palavras o que você quer atrair — dinheiro, uma oportunidade, sorte.
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
              Soprar ✨
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
            <h3>Sua intenção</h3>
            <div className={`detail-note-preview ${detail.color}`}>{detail.text}</div>
            <div className="detail-days">
              {detail.status === "finalizado" ? (
                <>
                  Ficou soprada por <b>{daysBlown(detail)} dia{daysBlown(detail) === 1 ? "" : "s"}</b> antes de
                  finalizar. ✅
                </>
              ) : (
                <>
                  Soprada há <b>{daysBlown(detail)} dia{daysBlown(detail) === 1 ? "" : "s"}</b>.
                </>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDetailId(null)}>
                Deixar soprando
              </button>
              {detail.status !== "finalizado" && (
                <button className="btn btn-dark" onClick={handleFinalize}>
                  Finalizar ✨
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
            <h3 style={{ textAlign: "center" }}>Finalizou!</h3>
            <p className="desc" style={{ textAlign: "center" }}>
              Sua simpatia foi finalizada. Que o universo tenha feito a parte dele.
            </p>
            <div className="share-card">
              <div className="sc-eyebrow">Simpatia da Canela</div>
              <div className="sc-txt">&quot;{celebrate.text}&quot;</div>
              <div className="sc-days">
                Finalizado depois de {celebrate.days} dia{celebrate.days === 1 ? "" : "s"} soprando.
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
