"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";

type Pedido = {
  id: string;
  text: string;
  status: "ativo" | "finalizado";
  color: string;
  rotation: number;
  created_at: string;
  finalized_at: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const COLORS = ["color-amber", "color-mint", "color-coral"];

function daysFrozen(p: Pedido) {
  const end = p.status === "finalizado" && p.finalized_at ? new Date(p.finalized_at).getTime() : Date.now();
  return Math.max(0, Math.floor((end - new Date(p.created_at).getTime()) / DAY_MS));
}

function frostOpacity(days: number) {
  return Math.min(0.62, days * 0.045);
}

export default function CongeladorPage() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<{ text: string; days: number } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase]);

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
      showToast("Escreva algo antes de congelar.");
      return;
    }
    if (!userId) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        text,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Number((Math.random() * 6 - 3).toFixed(1)),
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      showToast("Não foi possível congelar. Tenta de novo.");
      return;
    }
    setPedidos((prev) => [data as Pedido, ...prev]);
    setShowAdd(false);
    setNoteInput("");
    showToast("Pedido congelado ❄️");
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
    setCelebrate({ text: updated.text, days: daysFrozen(updated) });
  }

  async function advanceDay() {
    if (ativos.length === 0) {
      showToast("Nenhum pedido ativo pra congelar ainda.");
      return;
    }
    const updates = ativos.map((p) => ({
      id: p.id,
      created_at: new Date(new Date(p.created_at).getTime() - DAY_MS).toISOString(),
    }));
    for (const u of updates) {
      await supabase.from("pedidos").update({ created_at: u.created_at }).eq("id", u.id);
    }
    setPedidos((prev) =>
      prev.map((p) => {
        const u = updates.find((x) => x.id === p.id);
        return u ? { ...p, created_at: u.created_at } : p;
      })
    );
    showToast("Mais um dia passou no congelador ❄️");
  }

  function shareMessage(text: string, days: number) {
    return `Descongelei uma simpatia no SimpatIA: "${text}" — resolvido depois de ${days} dia${days === 1 ? "" : "s"}! 🎉`;
  }

  return (
    <div className="view">
      <div className="freezer-header">
        <div className="eyebrow">Simpatia do Congelador</div>
        <h2>O que você quer congelar hoje?</h2>
        <p>
          Escreva num post-it o que precisa esfriar — uma pessoa, uma situação, uma vontade
          ruinzinha. A cada dia que passa, seu pedido acumula mais gelo. Quando sentir que já
          resolveu, é só descongelar e comemorar.
        </p>
      </div>

      {userId === null && (
        <div
          className="auth-error"
          style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}
        >
          <span>Faça login para criar e guardar seus pedidos com segurança — seu conteúdo é pessoal.</span>
          <Link href="/login?next=/congelador" className="btn btn-dark" style={{ whiteSpace: "nowrap" }}>
            Entrar
          </Link>
        </div>
      )}

      <div className="freezer-layout">
        <div className="freezer-unit">
          <div className="freezer-top">
            <div className="label">🧊 Congelador — ativos</div>
            <button
              className="add-note-btn"
              disabled={!userId}
              onClick={() => {
                setNoteInput("");
                setShowAdd(true);
              }}
            >
              + Adicionar pedido
            </button>
          </div>

          <div className="shelf" style={{ minHeight: 230 }}>
            <span className="shelf-label">Prateleira de cima</span>
            {loading ? (
              <div className="empty-shelf">Carregando...</div>
            ) : ativos.length === 0 ? (
              <div className="empty-shelf">
                {userId
                  ? "Vazio por enquanto. Adicione o primeiro pedido pra começar a congelar."
                  : "Faça login para ver seus pedidos congelados."}
              </div>
            ) : (
              ativos.map((p) => {
                const days = daysFrozen(p);
                return (
                  <div
                    key={p.id}
                    className={`note ${p.color}`}
                    style={{ "--r": `${p.rotation}deg` } as React.CSSProperties}
                    onClick={() => setDetailId(p.id)}
                  >
                    <div className="pin"></div>
                    <div className="frost-overlay" style={{ "--frost": frostOpacity(days) } as React.CSSProperties}></div>
                    <div className="txt">{p.text}</div>
                    <div className="days-tag">
                      {days} dia{days === 1 ? "" : "s"}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="freezer-foot">
            <span className="hint">Toque num post-it para ver os detalhes ou descongelar.</span>
          </div>
        </div>

        <div className="side-panel">
          <div className="stat-card">
            <div className="num">{ativos.length}</div>
            <div className="lbl">pedidos congelados agora</div>
          </div>
          <div className="stat-card">
            <div className="num">{finalizados.length}</div>
            <div className="lbl">simpatias já descongeladas</div>
          </div>
          <div className="demo-dial">
            <div className="dial-label">Modo demonstração</div>
            <div
              className="dial-knob"
              role="button"
              tabIndex={0}
              aria-label="Avançar um dia, para fins de demonstração"
              onClick={advanceDay}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  advanceDay();
                }
              }}
            ></div>
            <div className="dial-note">
              Toque para simular a passagem de 1 dia e ver o gelo se formar. Na versão real, isso
              acontece sozinho, dia após dia.
            </div>
          </div>
        </div>
      </div>

      {/* Modal: adicionar pedido */}
      <div className={`overlay ${showAdd ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
        <div className="modal">
          <button className="modal-close" onClick={() => setShowAdd(false)}>
            ✕
          </button>
          <h3>Novo pedido pro congelador</h3>
          <p className="desc">
            Escreva com suas palavras o que você quer congelar. Pode ser uma pessoa, uma situação
            ou um sentimento.
          </p>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Ex: a ansiedade que não me deixa dormir..."
            maxLength={140}
          />
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" disabled={saving} onClick={handleAdd}>
              Congelar 🧊
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
            <h3>Seu pedido</h3>
            <div className={`detail-note-preview ${detail.color}`}>{detail.text}</div>
            <div className="detail-days">
              {detail.status === "finalizado" ? (
                <>
                  Ficou congelado por <b>{daysFrozen(detail)} dia{daysFrozen(detail) === 1 ? "" : "s"}</b> antes de ser
                  resolvido. ✅
                </>
              ) : (
                <>
                  Congelado há <b>{daysFrozen(detail)} dia{daysFrozen(detail) === 1 ? "" : "s"}</b>.
                </>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDetailId(null)}>
                Deixar congelado
              </button>
              {detail.status !== "finalizado" && (
                <button className="btn btn-dark" onClick={handleFinalize}>
                  Descongelar e finalizar ✨
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
            <h3 style={{ textAlign: "center" }}>Descongelou!</h3>
            <p className="desc" style={{ textAlign: "center" }}>
              Sua simpatia foi finalizada. Que bom que resolveu.
            </p>
            <div className="share-card">
              <div className="sc-eyebrow">SimpatIA · Simpatia do Congelador</div>
              <div className="sc-txt">&quot;{celebrate.text}&quot;</div>
              <div className="sc-days">
                Resolvido depois de {celebrate.days} dia{celebrate.days === 1 ? "" : "s"} no congelador.
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
